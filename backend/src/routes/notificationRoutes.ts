import { Router } from 'express';
import notificationsController from '../notifications/notifications.controller';

const router = Router();

// Mount Notification Engine Router
router.use('/', notificationsController);

export default router;
