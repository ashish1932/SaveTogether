import { Router } from 'express';
import settingsController from '../settings/settings.controller';

const router = Router();

// Mount Settings Router under /admin/settings
router.use('/admin/settings', settingsController);

export default router;
