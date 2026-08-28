import { Router } from 'express';
import healthController from '../staging/health.controller';

const router = Router();

// Mount Health & Readiness Probes under root /
router.use('/', healthController);

export default router;
