import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { JobsService } from './jobs.service';
import { JobName } from './job.types';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// All Background Job operations are strictly guarded for Admin
router.use(adminJwtGuard);

// GET /api/v1/admin/jobs (Step 29.34 Observability)
router.get('/', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const jobs = await JobsService.listJobs();
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/jobs/queues (Step 29.34 Queue Metrics)
router.get('/queues', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const metrics = await JobsService.getQueueMetrics();
    res.json(metrics);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/jobs/sweep (Manual Worker Trigger)
router.post('/sweep', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const jobName = (req.body.name as JobName) || 'analytics.aggregate';
    const validNames: JobName[] = [
      'otp.cleanup',
      'notification.send',
      'notification.scheduled',
      'campaign.expire',
      'booking.expire',
      'referral.qualify',
      'reward.process',
      'refund.reconcile',
      'analytics.aggregate',
      'outbox.publish',
    ];

    if (!validNames.includes(jobName)) {
      return res.status(400).json({
        success: false,
        message: `Invalid job name. Must be one of: ${validNames.join(', ')}`,
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const result = await JobsService.triggerSweep(jobName);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
