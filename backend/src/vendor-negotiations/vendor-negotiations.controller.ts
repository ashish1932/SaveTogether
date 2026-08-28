import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateCreateNegotiationSessionDto } from './dto/create-negotiation.dto';
import { validateAddNegotiationOfferDto } from './dto/add-offer.dto';
import { VendorNegotiationsService } from './vendor-negotiations.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// All Negotiation operations are strictly guarded for Admin (VENDOR_NEGOTIATE permission)
router.use(adminJwtGuard);

// POST /api/v1/admin/demand-campaigns/:campaignId/negotiations (Step 25.6 & 25.30)
router.post('/demand-campaigns/:campaignId/negotiations', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const val = validateCreateNegotiationSessionDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const session = await VendorNegotiationsService.startNegotiation(req.params.campaignId, val.data, adminUserId);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/demand-campaigns/:campaignId/negotiations (Step 25.7)
router.get('/demand-campaigns/:campaignId/negotiations', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const list = await VendorNegotiationsService.getCampaignNegotiations(req.params.campaignId);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/negotiations/:id (Step 25.30)
router.get('/negotiations/:id', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const negotiation = await VendorNegotiationsService.getNegotiationById(req.params.id);
    res.json(negotiation);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/negotiations/:id/offers (Step 25.8 & 25.30)
router.post('/negotiations/:id/offers', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const val = validateAddNegotiationOfferDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await VendorNegotiationsService.addOffer(req.params.id, val.data, adminUserId);
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/negotiations/:id/accept (Step 25.14)
router.post('/negotiations/:id/accept', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const offerId = req.body.offerId as string;
    const accepted = await VendorNegotiationsService.acceptNegotiation(req.params.id, offerId, adminUserId);
    res.json(accepted);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/negotiations/:id/reject (Step 25.30)
router.post('/negotiations/:id/reject', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const rejected = await VendorNegotiationsService.rejectNegotiation(req.params.id);
    res.json(rejected);
  } catch (err) {
    next(err);
  }
});

export default router;
