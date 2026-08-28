import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateCreateRedemptionDto } from './dto/redemption.dto';
import { validateAdminAdjustmentDto } from './dto/admin-adjustment.dto';
import { RewardsService } from './rewards.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// AUTHENTICATED CUSTOMER REWARD APIS
// ==========================================

// GET /api/v1/rewards/wallet (Step 27.22)
router.get('/rewards/wallet', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const summary = await RewardsService.getWalletSummary(userId);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/rewards/transactions (Step 27.23)
router.get('/rewards/transactions', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const list = await RewardsService.getUserTransactions(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/rewards/redemptions (Step 27.8 Controlled Redemption)
router.post('/rewards/redemptions', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateCreateRedemptionDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const tx = await RewardsService.redeemRewards(userId, val.data);
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN REWARD AUDIT & ADJUSTMENT APIS
// ==========================================

// GET /api/v1/admin/reward-transactions (Step 27.35)
router.get('/admin/reward-transactions', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const list = await RewardsService.listAdminTransactions();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/reward-adjustments (Step 27.19 & 27.20)
router.post('/admin/reward-adjustments', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const val = validateAdminAdjustmentDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const tx = await RewardsService.adminAdjustment(val.data, adminUserId);
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
});

export default router;
