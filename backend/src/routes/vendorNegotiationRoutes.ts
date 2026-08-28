import { Router } from 'express';
import vendorNegotiationsController from '../vendor-negotiations/vendor-negotiations.controller';

const router = Router();

// Mount Vendor Negotiations Router under /admin
router.use('/admin', vendorNegotiationsController);

export default router;
