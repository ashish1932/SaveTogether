import { Router, Request, Response } from 'express';
import { validateSendOtpDto } from './dto/send-otp.dto';
import { validateVerifyOtpDto } from './dto/verify-otp.dto';
import { validateRefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { jwtAuthGuard, AuthRequest } from './guards/jwt-auth.guard';
import { otpSendRateLimiter, otpVerifyRateLimiter } from '../common/guards/rate-limiter.guard';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// POST /api/v1/auth/send-otp
router.post('/send-otp', otpSendRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const val = validateSendOtpDto(req.body);
    if (!val.isValid || !val.mobile) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const result = await AuthService.sendOtp(val.mobile);
    if (!result.success) {
      return res.status(429).json({
        success: false,
        message: result.error,
        code: result.code || ErrorCode.RATE_LIMIT_EXCEEDED,
      });
    }

    res.json({
      expiresIn: result.expiresIn,
      resendAfter: result.resendAfter,
      ...(result.debugOtp ? { debugOtp: result.debugOtp } : {}),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/verify-otp
router.post('/verify-otp', otpVerifyRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const val = validateVerifyOtpDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const result = await AuthService.verifyOtp(val.data);
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.error,
        code: result.code || ErrorCode.AUTH_INVALID_OTP,
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/refresh
router.post('/refresh', async (req: Request, res: Response, next) => {
  try {
    const val = validateRefreshTokenDto(req.body);
    if (!val.isValid || !val.refreshToken) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const result = await AuthService.refreshToken(val.refreshToken);
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.error,
        code: result.code || ErrorCode.AUTH_UNAUTHORIZED,
      });
    }

    res.json(result.tokens);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/logout
router.post('/logout', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    if (req.user?.sessionId) {
      await AuthService.logout(req.user.sessionId);
    }
    res.json(null);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/logout-all
router.post('/logout-all', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    if (req.user?.id) {
      await AuthService.logoutAll(req.user.id);
    }
    res.json(null);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/auth/me
router.get('/me', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        code: ErrorCode.AUTH_UNAUTHORIZED,
      });
    }

    const profile = await AuthService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

export default router;
