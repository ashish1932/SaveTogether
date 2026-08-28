import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateReportQueryDto } from './dto/report-query.dto';
import { AnalyticsService } from './analytics.service';

const router = Router();

// All Analytics & Report Endpoints require Admin Authentication
router.use(adminJwtGuard);

// GET /api/v1/admin/analytics/overview (Step 34.5 Overview KPIs)
router.get('/analytics/overview', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const overview = await AnalyticsService.getOverview();
    res.json(overview);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/reports/revenue (Step 34.9)
router.get('/reports/revenue', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateReportQueryDto(req.query);
    const report = await AnalyticsService.getRevenueReport(query);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/reports/bookings (Step 34.12)
router.get('/reports/bookings', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateReportQueryDto(req.query);
    const report = await AnalyticsService.getBookingReport(query);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/reports/services (Step 34.14)
router.get('/reports/services', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateReportQueryDto(req.query);
    const report = await AnalyticsService.getServiceReport(query);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/reports/societies (Step 34.16)
router.get('/reports/societies', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateReportQueryDto(req.query);
    const report = await AnalyticsService.getSocietyReport(query);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/reports/vendors (Step 34.18)
router.get('/reports/vendors', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateReportQueryDto(req.query);
    const report = await AnalyticsService.getVendorReport(query);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/reports/savings (Step 34.20)
router.get('/reports/savings', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateReportQueryDto(req.query);
    const report = await AnalyticsService.getSavingsReport(query);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/reports/referrals (Step 34.22)
router.get('/reports/referrals', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateReportQueryDto(req.query);
    const report = await AnalyticsService.getReferralReport(query);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/reports/cancellations (Step 34.24)
router.get('/reports/cancellations', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateReportQueryDto(req.query);
    const report = await AnalyticsService.getCancellationReport(query);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

export default router;
