import { Router, Request, Response } from 'express';
import { ServiceCatalogService } from './service-catalog.service';
import { validateCreateCategoryDto } from './dto/create-category.dto';
import { validateUpdateCategoryDto } from './dto/update-category.dto';
import { validateCreateServiceDto } from './dto/create-service.dto';
import { validateUpdateServiceDto } from './dto/update-service.dto';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CUSTOMER APIS
// ==========================================

// GET /api/v1/service-categories
router.get('/service-categories', async (req: Request, res: Response, next) => {
  try {
    const categories = await ServiceCatalogService.listCategories(false);
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/service-categories/:id
router.get('/service-categories/:id', async (req: Request, res: Response, next) => {
  try {
    const category = await ServiceCatalogService.getCategoryById(req.params.id, false);
    res.json(category);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/services
router.get('/services', async (req: Request, res: Response, next) => {
  try {
    const result = await ServiceCatalogService.listServices(req.query, false);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/services/:id
router.get('/services/:id', async (req: Request, res: Response, next) => {
  try {
    const service = await ServiceCatalogService.getServiceById(req.params.id, false);
    res.json(service);
  } catch (err) {
    next(err);
  }
});

// ==========================================
// ADMIN APIS
// ==========================================

// GET /api/v1/admin/service-categories
router.get('/admin/service-categories', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const categories = await ServiceCatalogService.listCategories(true);
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/service-categories
router.post('/admin/service-categories', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateCreateCategoryDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const created = await ServiceCatalogService.createCategory(val.data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/service-categories/:id
router.patch('/admin/service-categories/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateUpdateCategoryDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await ServiceCatalogService.updateCategory(req.params.id, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/services
router.get('/admin/services', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const result = await ServiceCatalogService.listServices(req.query, true);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/services
router.post('/admin/services', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateCreateServiceDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const created = await ServiceCatalogService.createService(val.data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/services/:id
router.get('/admin/services/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const service = await ServiceCatalogService.getServiceById(req.params.id, true);
    res.json(service);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/services/:id
router.patch('/admin/services/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const val = validateUpdateServiceDto(req.body);
    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await ServiceCatalogService.updateService(req.params.id, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/admin/services/:id (Soft delete / Deactivation)
router.delete('/admin/services/:id', adminJwtGuard, async (req: AdminAuthRequest, res: Response, next) => {
  try {
    await ServiceCatalogService.softDeleteService(req.params.id);
    res.json({ message: 'Service deactivated successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
