import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { validateRegisterDeviceDto } from './dto/register-device.dto';
import { validateUpdatePreferenceDto } from './dto/update-preference.dto';
import { NotificationsService } from './notifications.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// AUTHENTICATED CUSTOMER NOTIFICATION APIS
// ==========================================

// GET /api/v1/notifications (Step 28.20 & 28.21)
router.get('/notifications', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const result = await NotificationsService.getUserNotifications(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/notifications/preferences (Step 28.29)
router.get('/notifications/preferences', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const pref = await NotificationsService.getPreferences(userId);
    res.json(pref);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/notifications/preferences (Step 28.29)
router.patch('/notifications/preferences', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateUpdatePreferenceDto(req.body);
    const updated = await NotificationsService.updatePreferences(userId, val.data || {});
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/notifications/read-all (Step 28.20)
router.patch('/notifications/read-all', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const result = await NotificationsService.markAllAsRead(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/notifications/:id (Step 28.20)
router.get('/notifications/:id', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const item = await NotificationsService.getNotificationById(req.params.id, userId);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/notifications/:id/read (Step 28.20)
router.patch('/notifications/:id/read', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const updated = await NotificationsService.markAsRead(req.params.id, userId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/devices (Step 28.8 Device Registration)
router.post('/devices', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateRegisterDeviceDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const device = await NotificationsService.registerDevice(userId, val.data);
    res.status(201).json(device);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/devices/:deviceId (Step 28.9 Remove Device)
router.delete('/devices/:deviceId', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const result = await NotificationsService.removeDevice(userId, req.params.deviceId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
