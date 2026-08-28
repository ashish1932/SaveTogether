import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateUpdateSettingsDto, SettingCategory } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// All Settings operations require Admin Authentication
router.use(adminJwtGuard);

// GET /api/v1/admin/settings (Step 35.22 All Active Settings)
router.get('/', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const summary = await SettingsService.getAllSettings();
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/settings/:category (Step 35.22 Domain Category Settings)
router.get('/:category', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const category = req.params.category.toUpperCase() as SettingCategory;
    const setting = await SettingsService.getSettingsByCategory(category);
    res.json(setting);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/settings/:category/versions (Step 35.7 Version History)
router.get('/:category/versions', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const category = req.params.category.toUpperCase() as SettingCategory;
    const versions = await SettingsService.getCategoryVersions(category);
    res.json(versions);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/settings/:category (Step 35.22 Update Category Settings)
router.patch('/:category', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const adminUserId = req.adminUser!.id;
    const adminName = req.adminUser!.name || 'Admin';
    const category = req.params.category.toUpperCase() as SettingCategory;

    const val = validateUpdateSettingsDto({ ...req.body, category });

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await SettingsService.updateCategorySettings(adminUserId, adminName, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
