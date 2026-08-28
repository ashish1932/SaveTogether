import { Router } from 'express';
import filesController from '../files/files.controller';

const router = Router();

// Mount File Storage Router
router.use('/', filesController);

export default router;
