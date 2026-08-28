import { Router } from 'express';
import rewardsController from '../rewards/rewards.controller';

const router = Router();

// Mount Reward Ledger Router
router.use('/', rewardsController);

export default router;
