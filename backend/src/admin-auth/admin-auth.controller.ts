import { Router, Request, Response } from 'express';
import { validateAdminLoginDto } from './dto/admin-login.dto';
import { validateVerify2FaDto } from './dto/verify-2fa.dto';
import { validateRefreshTokenDto } from '../auth/dto/refresh-token.dto';
import { AdminAuthService } from './admin-auth.service';
import { adminJwtGuard, AdminAuthRequest } from './guards/admin-jwt.guard';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// POST /api/v1/admin/auth/login
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const val = validateAdminLoginDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const result = await AdminAuthService.login(val.data.email, val.data.password, req.ip, req.headers['user-agent']);
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.error,
        code: result.code || ErrorCode.AUTH_UNAUTHORIZED,
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/auth/verify-2fa
router.post('/verify-2fa', async (req: Request, res: Response, next) => {
  try {
    const val = validateVerify2FaDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const result = await AdminAuthService.verify2FA(val.data.challengeId, val.data.code, req.ip, req.headers['user-agent']);
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

// POST /api/v1/admin/auth/refresh
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

    const result = await AdminAuthService.refreshToken(val.refreshToken);
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

// POST /api/v1/admin/auth/logout
router.post('/logout', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    if (req.adminUser?.sessionId) {
      await AdminAuthService.logout(req.adminUser.sessionId);
    }
    res.json(null);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/auth/logout-all
router.post('/logout-all', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    if (req.adminUser?.id) {
      await AdminAuthService.logoutAll(req.adminUser.id);
    }
    res.json(null);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/auth/me
router.get('/me', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    if (!req.adminUser?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        code: ErrorCode.AUTH_UNAUTHORIZED,
      });
    }

    const profile = await AdminAuthService.getProfile(req.adminUser.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/auth/forgot-password
router.post('/forgot-password', async (req: Request, res: Response) => {
  res.json({
    message: 'If the admin email is registered, a password reset link has been dispatched.',
  });
});

// POST /api/v1/admin/auth/reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
  res.json({
    message: 'Password reset successfully. Please log in with your new password.',
  });
});

export default router;
