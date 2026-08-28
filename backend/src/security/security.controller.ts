import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateRevokeSessionDto } from './dto/security-session.dto';
import { SecurityService } from './security.service';

const router = Router();

// ==========================================
// CUSTOMER AUTHENTICATED SESSION APIS
// ==========================================

// GET /api/v1/auth/sessions (Step 37.6 List Active Sessions)
router.get('/auth/sessions', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const currentSessionId = (req.user as any)?.sessionId;
    const sessions = await SecurityService.getUserSessions(userId, currentSessionId);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/logout (Step 37.7 Revoke Current Session)
router.post('/auth/logout', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const currentSessionId = (req.user as any)?.sessionId;

    if (currentSessionId) {
      await SecurityService.revokeSession(userId, currentSessionId);
    } else {
      await SecurityService.revokeAllSessions(userId);
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/logout-all (Step 37.7 Global Logout Across Devices)
router.post('/auth/logout-all', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const result = await SecurityService.revokeAllSessions(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/auth/sessions/:sessionId (Step 37.7 Revoke Specific Session)
router.delete('/auth/sessions/:sessionId', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const result = await SecurityService.revokeSession(userId, req.params.sessionId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN SECURITY AUDIT API
// ==========================================

// GET /api/v1/admin/security/status (Step 37.0 Security Hardening Metrics)
router.get('/admin/security/status', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const status = await SecurityService.getSecurityStatus();
    res.json(status);
  } catch (err) {
    next(err);
  }
});

export default router;
