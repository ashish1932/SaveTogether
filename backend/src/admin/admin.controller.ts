import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { AdminService } from './admin.service';
import adminAuthController from '../admin-auth/admin-auth.controller';

const router = Router();

// Mount Unauthenticated Admin Auth Controller under /admin/auth/*
router.use('/auth', adminAuthController);

// All subsequent Admin endpoints strictly require Admin JWT authentication & RBAC
router.use(adminJwtGuard);

// GET /api/v1/admin/analytics/summary (Step 33.1 Dashboard Metrics)
router.get('/analytics/summary', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const summary = await AdminService.getDashboardMetrics();
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/audit-logs (Audit Trail History)
router.get('/audit-logs', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const logs = await AdminService.listAuditLogs();
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
