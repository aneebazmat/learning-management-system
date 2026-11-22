import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import catchAsyncError from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import User, { IUser } from "../models/userModel";

require("dotenv").config();

// Authenticated user check
export const isAuthenticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  let accessToken = "";

  if (req.headers.authorization?.startsWith("Bearer ")) {
    accessToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  if (!accessToken) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as Secret
      ) as JwtPayload;
    } catch (err) {
      if (req.cookies?.accessToken && accessToken !== req.cookies.accessToken) {
        decoded = jwt.verify(
          req.cookies.accessToken,
          process.env.ACCESS_TOKEN_SECRET as Secret
        ) as JwtPayload;
      } else {
        throw err;
      }
    }

    if (!decoded || !decoded.id) {
      return next(new ErrorHandler("Invalid access token", 401));
    }

    // Try session cache first, fallback to database
    let user: IUser | null = null;
    try {
      const userSession = await redis.get(decoded.id);
      if (userSession) {
        user = JSON.parse(userSession);
      }
    } catch (_) {}

    // Fallback to database
    if (!user) {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error: any) {
    return next(new ErrorHandler("Access token is expired or invalid", 401));
  }
});

// Role authorization
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role (${req.user?.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
