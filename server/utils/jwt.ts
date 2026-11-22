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

    // Cache user session
    try {
        await redis.set(user._id.toString(), JSON.stringify(user));
    } catch (_) {}

    // parse environment variables to integrate with fallback values (in days)
    const accessTokenExpireDays = parseInt(process.env.ACCESS_TOKEN_EXPIRES || '7', 10);
    const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRES || '30', 10);

    const accessTokenMaxAge = accessTokenExpireDays * 24 * 60 * 60 * 1000;
    const refreshTokenMaxAge = refreshTokenExpireDays * 24 * 60 * 60 * 1000;

    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenMaxAge),
        maxAge: accessTokenMaxAge,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenMaxAge),
        maxAge: refreshTokenMaxAge,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    };

    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
        refreshToken
    });
}

