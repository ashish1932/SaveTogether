import { Router } from 'express';
import demandController from '../demand/demand.controller';
import demandCampaignController from '../demand-campaign/demand-campaign.controller';

const router = Router();

// Mount Demand Aggregation Engine Router
router.use('/', demandController);

// Mount Demand Campaign Lifecycle Engine Router
router.use('/', demandCampaignController);

export default router;
