import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateAssignVendorDto } from './dto/assign-vendor.dto';
import { VendorAssignmentService } from './vendor-assignment.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// All Vendor Assignment operations are strictly guarded for Admin
router.use(adminJwtGuard);

// GET /api/v1/admin/demand-campaigns/:campaignId/vendor-options (Step 24.7)
router.get('/demand-campaigns/:campaignId/vendor-options', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const options = await VendorAssignmentService.getVendorOptions(req.params.campaignId);
    res.json(options);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/demand-campaigns/:campaignId/assign-vendor (Step 24.13 & 24.37)
router.post('/demand-campaigns/:campaignId/assign-vendor', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const val = validateAssignVendorDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const assignment = await VendorAssignmentService.assignVendorToCampaign(req.params.campaignId, val.data, adminUserId);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/vendor-assignments/:id/confirm (Step 24.20)
router.post('/vendor-assignments/:id/confirm', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const confirmed = await VendorAssignmentService.confirmAssignment(req.params.id, adminUserId);
    res.json(confirmed);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/vendor-assignments/:id (Step 24.31)
router.get('/vendor-assignments/:id', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const assignment = await VendorAssignmentService.getAssignmentById(req.params.id);
    res.json(assignment);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/vendor-assignments (Step 24.31)
router.get('/vendor-assignments', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const list = await VendorAssignmentService.listAssignments();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

export default router;
