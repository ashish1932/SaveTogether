import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateCreateVendorDto } from './dto/create-vendor.dto';
import { validateUpdateVendorDto } from './dto/update-vendor.dto';
import { validateVendorPricingDto } from './dto/vendor-pricing.dto';
import { validateVendorSlotQueryDto } from './dto/vendor-slot-query.dto';
import { validateUpdateCapacityDto } from './dto/update-capacity.dto';
import { VendorsService } from './vendors.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// All Vendor Operations are strictly guarded for Admin (Vendors have NO login in V1!)
router.use(adminJwtGuard);

// POST /api/v1/admin/vendors/availability/eligible (Step 23.11 & 23.30 Candidate Pipeline)
router.post('/availability/eligible', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const serviceId = (req.body.serviceId as string) || 'srv_ac';
    const date = (req.body.date as string) || '2026-09-06';
    const timeSlotId = (req.body.timeSlotId as string) || 'MORNING';
    const quantity = Number(req.body.quantity || 1);

    const candidates = await VendorsService.findEligibleVendors(serviceId, date, timeSlotId, quantity);
    res.json(candidates);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/vendors (Step 22.2 & 22.24)
router.get('/', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const list = await VendorsService.listVendors(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/vendors (Step 22.27)
router.post('/', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateCreateVendorDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const created = await VendorsService.createVendor(val.data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/vendors/:id/availability (Step 23.9)
router.get('/:id/availability', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const serviceId = req.query.serviceId as string;
    const slots = await VendorsService.getVendorAvailability(req.params.id, date, serviceId);
    res.json({
      vendorId: req.params.id,
      date,
      slots,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/vendors/:id/availability/block (Step 23.16)
router.post('/:id/availability/block', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const serviceId = (req.body.serviceId as string) || 'srv_ac';
    const date = (req.body.date as string) || '2026-09-06';
    const timeSlotId = (req.body.timeSlotId as string) || 'MORNING';

    const blocked = await VendorsService.blockVendorSlot(req.params.id, serviceId, date, timeSlotId);
    res.json(blocked);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/vendors/:id/availability/unblock (Step 23.16)
router.post('/:id/availability/unblock', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const serviceId = (req.body.serviceId as string) || 'srv_ac';
    const date = (req.body.date as string) || '2026-09-06';
    const timeSlotId = (req.body.timeSlotId as string) || 'MORNING';

    const unblocked = await VendorsService.unblockVendorSlot(req.params.id, serviceId, date, timeSlotId);
    res.json(unblocked);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/vendors/:id/capacity (Step 23.17 & 23.18)
router.patch('/:id/capacity', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateUpdateCapacityDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const date = (req.body.date as string) || '2026-09-06';
    const timeSlotId = (req.body.timeSlotId as string) || 'MORNING';

    const updated = await VendorsService.updateVendorCapacity(
      req.params.id,
      val.data.serviceId,
      date,
      timeSlotId,
      val.data.maxQuantityPerDay
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/vendors/:id (Step 22.26)
router.get('/:id', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const details = await VendorsService.getVendorDetails(req.params.id);
    res.json(details);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/vendors/:id (Step 22.28)
router.patch('/:id', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateUpdateVendorDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await VendorsService.updateVendor(req.params.id, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/vendors/:id/services (Step 22.7)
router.post('/:id/services', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const serviceId = req.body.serviceId as string;
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: 'serviceId is required',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await VendorsService.addVendorService(req.params.id, serviceId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/vendors/:id/pricing (Step 22.9 & 22.10)
router.post('/:id/pricing', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const val = validateVendorPricingDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await VendorsService.setVendorPricing(req.params.id, val.data, adminUserId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/vendors/:id/price-history (Step 22.12 & 22.33)
router.get('/:id/price-history', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const history = await VendorsService.getPriceHistory(req.params.id);
    res.json(history);
  } catch (err) {
    next(err);
  }
});

export default router;
