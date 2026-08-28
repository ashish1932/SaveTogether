import { Router, Request, Response } from 'express';
import { validateDemandQueryDto } from './dto/demand-query.dto';
import { validateDemandAdjustmentDto } from './dto/demand-adjustment.dto';
import { DemandService } from './demand.service';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CUSTOMER DEMAND APIS
// ==========================================

// GET /api/v1/demand/campaign?societyId=...&serviceId=...
router.get('/demand/campaign', async (req: Request, res: Response, next) => {
  try {
    const val = validateDemandQueryDto(req.query);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const campaign = await DemandService.getActiveCampaign(val.data);
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/demand/campaign/:id
router.get('/demand/campaign/:id', async (req: Request, res: Response, next) => {
  try {
    const campaign = await DemandService.getCampaignById(req.params.id);
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN DEMAND APIS
// ==========================================

// GET /api/v1/admin/demand
router.get('/admin/demand', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const list = await DemandService.listAllCampaigns(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/demand/:id
router.get('/admin/demand/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const campaign = await DemandService.getCampaignById(req.params.id);
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/demand/:id/adjustment (Step 15.60 & 15.61)
router.post('/admin/demand/:id/adjustment', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const val = validateDemandAdjustmentDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await DemandService.adjustCampaignDemand(req.params.id, val.data, adminUserId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
