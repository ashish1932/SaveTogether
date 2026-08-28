import { Router } from 'express';
import bookingsController from '../bookings/bookings.controller';

const router = Router();

// Mount Bookings Router under /api/v1/*
router.use('/', bookingsController);

export default router;
