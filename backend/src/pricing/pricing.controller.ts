import { Router, Request, Response } from 'express';
import { validatePricingQuoteDto } from './dto/pricing-quote.dto';
import { validateCreatePricingTierDto } from './dto/create-pricing-tier.dto';
import { PricingService } from './pricing.service';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CUSTOMER PRICING QUOTE API
// ==========================================

// GET /api/v1/pricing/quote
router.get('/pricing/quote', async (req: Request, res: Response, next) => {
  try {
    const val = validatePricingQuoteDto(req.query);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const quote = await PricingService.getPricingQuote(val.data);
    res.json(quote);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN PRICING MANAGEMENT APIS
// ==========================================

// GET /api/v1/admin/pricing/tiers
router.get('/admin/pricing/tiers', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const serviceId = (req.query.serviceId as string) || 'srv_ac';
    const tiers = await PricingService.getAdminTiers(serviceId);
    res.json(tiers);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/pricing/tiers
router.post('/admin/pricing/tiers', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateCreatePricingTierDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const created = await PricingService.createAdminTier(val.data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export default router;
