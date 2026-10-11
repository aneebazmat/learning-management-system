import { Request, Response, NextFunction } from 'express';
import userModel, { IUser } from '../models/userModel';
import ErrorHandler from '../utils/ErrorHandler';
import catchAsyncError from '../middleware/catchAsyncError';
import jwt, { Secret } from 'jsonwebtoken';
import sendEmail from '../utils/sendMail';
import { sendTokens } from '../utils/jwt';

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
       res.status(200).json({ success: true, message: 'Logged out successfully' });
   } catch (error: any) {
       return next(new ErrorHandler(error.message, 500));
   }
});
