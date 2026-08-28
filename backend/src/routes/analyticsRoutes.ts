import { Router } from 'express';
import adminAnalyticsController from '../analytics/admin-analytics.controller';

const router = Router();

// Mount Analytics Router under /admin
router.use('/admin', adminAnalyticsController);

export default router;
