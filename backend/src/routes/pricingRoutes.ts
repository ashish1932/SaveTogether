import { Router } from 'express';
import pricingController from '../pricing/pricing.controller';

const router = Router();

// Mount Pricing Engine Router
router.use('/', pricingController);

export default router;
