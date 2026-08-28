import { Router } from 'express';
import authController from '../auth/auth.controller';

const router = Router();

// Forward /api/v1/auth/* requests to Auth Controller
router.use('/auth', authController);

export default router;
