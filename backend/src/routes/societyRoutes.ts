import { Router } from 'express';
import societiesController from '../societies/societies.controller';

const router = Router();

// Mount Customer & Admin Society endpoints
router.use('/', societiesController);

export default router;
