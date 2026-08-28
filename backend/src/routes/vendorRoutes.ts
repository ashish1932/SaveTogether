import { Router } from 'express';
import vendorsController from '../vendors/vendors.controller';

const router = Router();

// Mount Vendor Operations Router under /admin/vendors
router.use('/admin/vendors', vendorsController);

export default router;
