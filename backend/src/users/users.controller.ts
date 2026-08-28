import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { validateUpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UsersService } from './users.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// GET /api/v1/users/me
router.get('/me', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const profile = await UsersService.getMe(userId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/users/me
router.patch('/me', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateUpdateUserProfileDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await UsersService.updateMe(userId, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/users/me/profile-image
router.post('/me/profile-image', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { imageBase64, mimeType } = req.body || {};

    const mime = mimeType || 'image/jpeg';
    const base64 = imageBase64 || 'data:image/jpeg;base64,mockdata';

    const result = await UsersService.uploadProfileImage(userId, base64, mime);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/users/me/profile-image
router.delete('/me/profile-image', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const result = await UsersService.deleteProfileImage(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
