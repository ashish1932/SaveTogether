import { Router } from 'express';
import adminMonitoringController from '../monitoring/admin-monitoring.controller';

const router = Router();

// Mount Monitoring Router under /admin/monitoring
router.use('/admin/monitoring', adminMonitoringController);

export default router;
