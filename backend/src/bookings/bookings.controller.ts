import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateCreateBookingDto } from './dto/create-booking.dto';
import { validateCancelBookingDto } from './dto/cancel-booking.dto';
import { validateRescheduleBookingDto } from './dto/reschedule-booking.dto';
import { BookingsService } from './bookings.service';
import { BookingHistoryRepository } from './state-machine/booking-history.repository';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// ADMIN OPERATIONAL STATE TRANSITION APIS
// ==========================================

// POST /api/v1/admin/bookings/:id/process
router.post('/admin/bookings/:id/process', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const result = await BookingsService.adminProcessBooking(req.params.id, adminUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/bookings/:id/assign-vendor
router.post('/admin/bookings/:id/assign-vendor', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const vendorId = (req.body.vendorId as string) || 'vnd_001';
    const result = await BookingsService.adminAssignVendor(req.params.id, vendorId, adminUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/bookings/:id/schedule
router.post('/admin/bookings/:id/schedule', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const result = await BookingsService.adminScheduleBooking(req.params.id, adminUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/bookings/:id/complete
router.post('/admin/bookings/:id/complete', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const result = await BookingsService.adminCompleteBooking(req.params.id, adminUserId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// AUTHENTICATED CUSTOMER BOOKING APIS
// ==========================================

// POST /api/v1/bookings
router.post('/bookings', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const idempotencyKey = (req.headers['idempotency-key'] as string) || (req.headers['x-idempotency-key'] as string);

    const val = validateCreateBookingDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const booking = await BookingsService.createBooking(userId, val.data, idempotencyKey);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/bookings
router.get('/bookings', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const filterStatus = (req.query.status as string) || (req.query.filter as string);
    const list = await BookingsService.getUserBookings(userId, filterStatus);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/bookings/:id/history
router.get('/bookings/:id/history', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const history = await BookingHistoryRepository.getHistoryByBookingId(req.params.id);
    res.json(history);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/bookings/:id
router.get('/bookings/:id', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const booking = await BookingsService.getUserBookingById(userId, req.params.id);
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/bookings/:id/cancel
router.post('/bookings/:id/cancel', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateCancelBookingDto(req.body);
    const updated = await BookingsService.cancelBooking(userId, req.params.id, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/bookings/:id/reschedule
router.post('/bookings/:id/reschedule', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateRescheduleBookingDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await BookingsService.rescheduleBooking(userId, req.params.id, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
