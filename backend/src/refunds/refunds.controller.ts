import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateRefundQueryDto } from './dto/refund-query.dto';
import { RefundsService } from './refunds.service';

const router = Router();

// ==========================================
// CUSTOMER REFUND APIS
// ==========================================

// GET /api/v1/refunds/:id (Step 21.32)
router.get('/refunds/:id', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const refund = await RefundsService.getRefundById(userId, req.params.id);
    res.json(refund);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN REFUND MANAGEMENT APIS
// ==========================================

// GET /api/v1/admin/refunds (Step 21.33)
router.get('/admin/refunds', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateRefundQueryDto(req.query);
    const list = await RefundsService.listAdminRefunds(val.data);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/refunds/:id
router.get('/admin/refunds/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const list = await RefundsService.listAdminRefunds({ id: req.params.id });
    res.json(list[0] || null);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/refunds/:id/retry (Step 21.22)
router.post('/admin/refunds/:id/retry', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const result = await RefundsService.retryAdminRefund(req.params.id, adminUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
