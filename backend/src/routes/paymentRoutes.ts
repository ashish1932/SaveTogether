import { Router } from 'express';
import paymentsController from '../payments/payments.controller';

const router = Router();

// Mount Payments Engine Router
router.use('/', paymentsController);

export default router;
