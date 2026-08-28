import { Router } from 'express';
import securityController from '../security/security.controller';

const router = Router();

// Mount Security Router
router.use('/', securityController);

export default router;
