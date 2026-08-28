import { Router } from 'express';
import docsController from '../docs/docs.controller';

const router = Router();

// Mount Docs Router directly under root /api
router.use('/', docsController);

export default router;
