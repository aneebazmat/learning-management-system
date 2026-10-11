require('dotenv').config();
import jwt, { Secret } from 'jsonwebtoken';
import { IUser } from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import { redis } from '../utils/redis';

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    secure: boolean;
}

export const sendTokens = async (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // upload session to redis
    await redis.set(user._id.toString(), JSON.stringify(user));

    // parse environment variables to integrate with fallback values
    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + parseInt(process.env.ACCESS_TOKEN_EXPIRES || '15') * 60 * 1000), // Default to 15 minutes
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES || '15') * 60, // Default to 15 minutes
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRES || '7') * 24 * 60 * 60 * 1000), // Default to 7 days
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES || '7') * 24 * 60 * 60, // Default to 7 days
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    };

    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        accessToken,
        refreshToken
    });
}

