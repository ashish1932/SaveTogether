import { Router, Request, Response } from 'express';
import { DemandCampaignService } from './demand-campaign.service';
import { validateCampaignActionDto } from './dto/campaign-action.dto';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CUSTOMER CAMPAIGN APIS
// ==========================================

// GET /api/v1/demand/campaigns
router.get('/demand/campaigns', async (req: Request, res: Response, next) => {
  try {
    const list = await DemandCampaignService.listCampaigns(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/demand/campaigns/:id
router.get('/demand/campaigns/:id', async (req: Request, res: Response, next) => {
  try {
    const details = await DemandCampaignService.getCampaignDetails(req.params.id);
    res.json(details);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN CAMPAIGN MANAGEMENT APIS
// ==========================================

// GET /api/v1/admin/demand/campaigns
router.get('/admin/demand/campaigns', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const list = await DemandCampaignService.listCampaigns(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/demand/campaigns/:id
router.get('/admin/demand/campaigns/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const details = await DemandCampaignService.getCampaignDetails(req.params.id);
    res.json(details);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/demand/campaigns/:id/process (Step 16.31)
router.post('/admin/demand/campaigns/:id/process', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const result = await DemandCampaignService.processCampaign(req.params.id, adminUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/demand/campaigns/:id/cancel (Step 16.31)
router.post('/admin/demand/campaigns/:id/cancel', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const val = validateCampaignActionDto(req.body);
    const result = await DemandCampaignService.cancelCampaign(req.params.id, val.data?.reason, adminUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
