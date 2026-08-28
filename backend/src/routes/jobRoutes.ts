import { Router } from 'express';
import jobsController from '../jobs/jobs.controller';

const router = Router();

// Mount Background Jobs Router specifically under /admin/jobs
router.use('/admin/jobs', jobsController);

export default router;
