import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateCreateComplaintDto } from './dto/create-complaint.dto';
import { validateAddComplaintMessageDto } from './dto/add-message.dto';
import { validateResolveComplaintDto } from './dto/resolve-complaint.dto';
import { ComplaintsService } from './complaints.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CUSTOMER COMPLAINT & SUPPORT APIS
// ==========================================

// POST /api/v1/complaints (Step 30.12)
router.post('/complaints', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateCreateComplaintDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const complaint = await ComplaintsService.createComplaint(userId, val.data);
    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/complaints (Step 30.15 My Complaints)
router.get('/complaints', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const filterStatus = (req.query.status as string) || undefined;
    const list = await ComplaintsService.getUserComplaints(userId, filterStatus);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/complaints/:id (Step 30.16 Complaint Details)
router.get('/complaints/:id', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const complaint = await ComplaintsService.getComplaintDetails(req.params.id, userId, false);
    res.json(complaint);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/complaints/:id/messages (Step 30.17 Add Message)
router.post('/complaints/:id/messages', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateAddComplaintMessageDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await ComplaintsService.addCustomerMessage(req.params.id, userId, val.data);
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/complaints/:id/reopen (Step 30.18 Reopen Ticket)
router.post('/complaints/:id/reopen', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const reopened = await ComplaintsService.reopenComplaint(req.params.id, userId);
    res.json(reopened);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN COMPLAINT MANAGEMENT APIS
// ==========================================

// GET /api/v1/admin/complaints (Step 30.19)
router.get('/admin/complaints', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const filterStatus = (req.query.status as string) || undefined;
    const list = await ComplaintsService.listAdminComplaints(filterStatus);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/complaints/:id (Step 30.19)
router.get('/admin/complaints/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const complaint = await ComplaintsService.getComplaintDetails(req.params.id, undefined, true);
    res.json(complaint);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/complaints/:id/assign (Step 30.21)
router.post('/admin/complaints/:id/assign', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const adminName = req.adminUser!.name || 'Support Admin';
    const assigned = await ComplaintsService.assignAdmin(req.params.id, adminUserId, adminName);
    res.json(assigned);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/complaints/:id/messages (Step 30.19 Admin Reply / Internal Note)
router.post('/admin/complaints/:id/messages', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const adminName = req.adminUser!.name || 'Support Admin';
    const val = validateAddComplaintMessageDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await ComplaintsService.addAdminMessage(req.params.id, adminUserId, adminName, val.data);
    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/complaints/:id/resolve (Step 30.25)
router.post('/admin/complaints/:id/resolve', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const adminName = req.adminUser!.name || 'Support Admin';
    const val = validateResolveComplaintDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const resolved = await ComplaintsService.resolveComplaint(req.params.id, adminUserId, adminName, val.data);
    res.json(resolved);
  } catch (err) {
    next(err);
  }
});

export default router;
