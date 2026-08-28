import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateCreateReviewDto } from './dto/create-review.dto';
import { validateUpdateReviewStatusDto } from './dto/update-review-status.dto';
import { ReviewsService } from './reviews.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CUSTOMER RATING & REVIEW APIS
// ==========================================

// GET /api/v1/bookings/:id/review-eligibility (Step 31.7)
router.get('/bookings/:id/review-eligibility', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const result = await ReviewsService.checkEligibility(req.params.id, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/bookings/:id/review (Step 31.9)
router.post('/bookings/:id/review', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateCreateReviewDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const review = await ReviewsService.createReview(req.params.id, userId, val.data);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/reviews (Step 31.6 Resident Review History)
router.get('/reviews', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const list = await ReviewsService.getUserReviews(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/reviews/:id (Step 31.6 Review Details)
router.get('/reviews/:id', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const review = await ReviewsService.getReviewById(req.params.id, userId);
    res.json(review);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN REVIEW MODERATION APIS
// ==========================================

// GET /api/v1/admin/reviews (Step 31.17)
router.get('/admin/reviews', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const statusFilter = (req.query.status as string) || undefined;
    const list = await ReviewsService.listAdminReviews(statusFilter);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/reviews/:id/status (Step 31.17 Moderation Update)
router.patch('/admin/reviews/:id/status', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateUpdateReviewStatusDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await ReviewsService.updateAdminReviewStatus(req.params.id, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
