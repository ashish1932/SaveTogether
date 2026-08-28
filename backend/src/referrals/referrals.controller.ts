import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateValidateReferralDto } from './dto/validate-referral.dto';
import { validateAttributeReferralDto } from './dto/attribute-referral.dto';
import { ReferralsService } from './referrals.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CUSTOMER REFERRAL APIS
// ==========================================

// GET /api/v1/referrals (Step 26.22 Summary)
router.get('/referrals', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const summary = await ReferralsService.getSummary(userId);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/referrals/history (Step 26.21)
router.get('/referrals/history', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const history = await ReferralsService.getHistory(userId);
    res.json(history);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/referrals/validate (Step 26.6)
router.post('/referrals/validate', async (req: AuthRequest, res: Response, next) => {
  try {
    const currentUserId = req.user?.id;
    const val = validateValidateReferralDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const result = await ReferralsService.validateReferralCode(val.data.code, currentUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/referrals/attribute (Step 26.8 Onboarding Attribution)
router.post('/referrals/attribute', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const referredUserId = req.user!.id;
    const val = validateAttributeReferralDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const created = await ReferralsService.attributeReferral(referredUserId, val.data.referralCode);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN REFERRAL MANAGEMENT APIS
// ==========================================

// GET /api/v1/admin/referrals (Step 26.28)
router.get('/admin/referrals', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const list = await ReferralsService.listAdminReferrals();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/referrals/:id/fraud-review (Step 26.28)
router.post('/admin/referrals/:id/fraud-review', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const updated = await ReferralsService.setFraudReview(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
