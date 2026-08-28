import { Router } from 'express';
import refundsController from '../refunds/refunds.controller';

const router = Router();

// Mount Refunds Engine Router
router.use('/', refundsController);

export default router;
