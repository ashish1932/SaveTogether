import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../types/error-codes.enum';

interface RateLimitStore {
  [key: string]: { count: number; expiresAt: number };
}

const rateLimitStore: RateLimitStore = {};

export const createRateLimiter = (options: { windowMs: number; max: number; keyPrefix?: string }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${options.keyPrefix || 'rl'}:${ip}:${req.path}`;
    const now = Date.now();

    if (!rateLimitStore[key] || rateLimitStore[key].expiresAt < now) {
      rateLimitStore[key] = {
        count: 1,
        expiresAt: now + options.windowMs,
      };
      return next();
    }

    rateLimitStore[key].count += 1;

    if (rateLimitStore[key].count > options.max) {
      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded. Please try again later.',
        code: ErrorCode.RATE_LIMIT_EXCEEDED,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

export const otpSendRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Max 3 OTP requests per min
  keyPrefix: 'otp-send',
});

export const otpVerifyRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 5, // Max 5 verification attempts per min
  keyPrefix: 'otp-verify',
});

export const generalApiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100, // Max 100 requests per min
  keyPrefix: 'gen-api',
});
