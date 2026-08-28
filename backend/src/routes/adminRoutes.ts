import { Router } from 'express';
import adminController from '../admin/admin.controller';

const router = Router();

// Mount Admin API Layer Router under /admin
router.use('/admin', adminController);

export default router;
