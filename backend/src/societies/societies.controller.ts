import { Router, Request, Response } from 'express';
import { SocietiesService } from './societies.service';
import { validateCreateSocietyDto } from './dto/create-society.dto';
import { validateUpdateSocietyDto } from './dto/update-society.dto';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CUSTOMER APIS
// ==========================================

// GET /api/v1/societies
router.get('/societies', async (req: Request, res: Response, next) => {
  try {
    const result = await SocietiesService.listSocieties(req.query, false);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/societies/:id
router.get('/societies/:id', async (req: Request, res: Response, next) => {
  try {
    const result = await SocietiesService.getSocietyById(req.params.id, false);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN APIS
// ==========================================

// GET /api/v1/admin/societies
router.get('/admin/societies', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const result = await SocietiesService.listSocieties(req.query, true);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/societies
router.post('/admin/societies', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateCreateSocietyDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const created = await SocietiesService.createSociety(val.data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/societies/:id
router.get('/admin/societies/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const result = await SocietiesService.getSocietyById(req.params.id, true);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/societies/:id
router.patch('/admin/societies/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateUpdateSocietyDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await SocietiesService.updateSociety(req.params.id, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/admin/societies/:id (Soft delete / Deactivation)
router.delete('/admin/societies/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    await SocietiesService.softDeleteSociety(req.params.id);
    res.json({ message: 'Society deactivated successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
