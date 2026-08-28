import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { MetricsService } from './metrics.service';

const router = Router();

// All Monitoring & Alerting endpoints require Admin Authentication (Step 44.26)
router.use(adminJwtGuard);

// GET /api/v1/admin/monitoring/metrics (Step 44.42 & 44.45)
router.get('/metrics', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const technical = await MetricsService.getTechnicalMetrics();
    const business = await MetricsService.getBusinessMetrics();
    res.json({ technical, business });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/monitoring/alerts (Step 44.38 System Alerting Engine)
router.get('/alerts', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const alerts = await MetricsService.getActiveSystemAlerts();
    res.json(alerts);
  } catch (err) {
    next(err);
  }
});

export default router;
