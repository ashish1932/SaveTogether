import { Router, Request, Response } from 'express';
import { HealthService } from './health.service';

const router = Router();

// GET /health (Step 42.20 Basic Health Check)
router.get('/health', async (req: Request, res: Response) => {
  const health = await HealthService.getBasicHealth();
  res.json(health);
});

// GET /readiness (Step 42.21 Deep Readiness Probe)
router.get('/readiness', async (req: Request, res: Response) => {
  const readiness = await HealthService.getReadinessCheck();
  const statusCode = readiness.status === 'HEALTHY' ? 200 : 503;
  res.status(statusCode).json(readiness);
});

export default router;
