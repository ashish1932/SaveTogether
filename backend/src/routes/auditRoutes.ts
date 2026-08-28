import { Router } from 'express';
import auditController from '../audit/audit.controller';

const router = Router();

// Mount Audit Router under /admin/audit-logs
router.use('/admin/audit-logs', auditController);

export default router;
