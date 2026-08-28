import { Router } from 'express';
import referralsController from '../referrals/referrals.controller';

const router = Router();

// Mount Referral Engine Router
router.use('/', referralsController);

export default router;
