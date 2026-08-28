import { Router, Response } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { validateCreateAddressDto } from './dto/create-address.dto';
import { validateUpdateAddressDto } from './dto/update-address.dto';
import { AddressesService } from './addresses.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// All Address endpoints require JWT Authentication
router.use(jwtAuthGuard);

// GET /api/v1/addresses
router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const list = await AddressesService.getUserAddresses(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/addresses
router.post('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateCreateAddressDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const created = await AddressesService.createAddress(userId, val.data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/addresses/:id
router.get('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const address = await AddressesService.getUserAddressById(userId, req.params.id);
    res.json(address);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/addresses/:id
router.patch('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validateUpdateAddressDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const updated = await AddressesService.updateAddress(userId, req.params.id, val.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/addresses/:id/default (Step 12.20)
router.patch('/:id/default', async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const updated = await AddressesService.setDefaultAddress(userId, req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/addresses/:id (Step 12.25)
router.delete('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    await AddressesService.deleteAddress(userId, req.params.id);
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
