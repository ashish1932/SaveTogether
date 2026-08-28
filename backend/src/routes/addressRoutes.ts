import { Router } from 'express';
import addressesController from '../addresses/addresses.controller';

const router = Router();

// Mount Addresses Router under /api/v1/addresses/*
router.use('/addresses', addressesController);

export default router;
