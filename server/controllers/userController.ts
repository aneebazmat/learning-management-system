import { Request, Response, NextFunction } from 'express';
import userModel, { IUser } from '../models/userModel';
import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncError from '../middleware/catchAsyncError';
import jwt, { Secret } from 'jsonwebtoken';
import sendEmail from '../utils/sendMail';
import { sendTokens } from '../utils/jwt';
import { redis } from '../utils/redis';

require('dotenv').config();

// Register a new user
interface IRegisterationBody {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}

export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, avatar }: IRegisterationBody = req.body;

        const isUserExists = await userModel.findOne({ email });

        if (isUserExists) {
            return next(new ErrorHandler('User already exists', 400));
        }

        const user = await userModel.create({ name, email, password, avatar });
        const activationToken = createActivationToken(user);
        const data = {
            user: { name: user.name, email: user.email },
            activationCode: activationToken.activationCode
        };

        await sendEmail({
            email: user.email,
            subject: 'Activate your account',
            template: 'activationMail.ejs',
            data
        });

        res.status(201).json({
            success: true,
            message: `User registered successfully. Please check your email ${user.email} to activate your account.`,
            activationToken: activationToken.token
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Create an activation token for the user
interface IActivationToken{
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: IUser): IActivationToken => {
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({
        userId: user._id.toString(),
        activationCode
    }, process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: '5m'
    });

    return {
        token,
        activationCode
    };
};

interface IActivationPayload {
    userId: string;
    activationCode: string;
}

export const activateUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { activationToken, activationCode } = req.body as {
        activationToken?: string;
        activationCode?: string;
    };

    if (!activationToken || !activationCode) {
        return next(new ErrorHandler('Activation token and activation code are required', 400));
    }

    try {
        const payload = jwt.verify(
            activationToken,
            process.env.ACTIVATION_SECRET as Secret
        ) as IActivationPayload;

        if (payload.activationCode !== activationCode) {
            return next(new ErrorHandler('Invalid activation code', 400));
        }

        const user = await userModel.findByIdAndUpdate(
            payload.userId,
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({ success: true, message: 'Account activated successfully' });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

interface ILoginBody {
    email: string;
    password: string;
}

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: ILoginBody = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    if (!user.isVerified) {
        return next(new ErrorHandler('Please verify your email before logging in', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

  sendTokens(user,200,res);
});

// Logout user and clear cookies
export const logoutUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
   try {
       res.clearCookie('accessToken');
       res.clearCookie('refreshToken');
       if (req.user?._id) {
           try {
               await redis.del(req.user._id.toString());
           } catch (_) {}
       }
       res.status(200).json({ success: true, message: 'Logged out successfully' });
   } catch (error: any) {
       return next(new ErrorHandler(error.message, 500));
   }
});

// Get user info (session hydration)
export const getUserInfo = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    let user: any = null;
    try {
      const userSession = await redis.get(userId?.toString() || "");
      if (userSession) {
        user = JSON.parse(userSession);
      }
    } catch (_) {}
    if (!user && userId) {
      user = await userModel.findById(userId);
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update user info (name, email)
export const updateUserInfo = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (name && user) {
      user.name = name;
    }
    if (email && user) {
      user.email = email;
    }
    if (user) {
      await user.save();
      try {
        await redis.set(userId?.toString() || "", JSON.stringify(user));
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update password
export const updatePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Please enter old and new password", 400));
    }
    const user = await userModel.findById(req.user?._id).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid old password", 400));
    }
    user.password = newPassword;
    await user.save();
    try {
      if (req.user?._id) {
        await redis.set(req.user._id.toString(), JSON.stringify(user));
      }
    } catch (_) {}

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update profile picture / avatar
export const updateProfilePicture = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (avatar && user) {
      user.avatar = {
        public_id: avatar.public_id || "avatar_" + Date.now(),
        url: avatar.url || (typeof avatar === "string" ? avatar : ""),
      };
      await user.save();
      try {
        if (userId) {
          await redis.set(userId.toString(), JSON.stringify(user));
        }
      } catch (_) {}
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

