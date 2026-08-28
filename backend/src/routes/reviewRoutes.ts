import { Router } from 'express';
import reviewsController from '../reviews/reviews.controller';

const router = Router();

// Mount Review & Rating Engine Router
router.use('/', reviewsController);

export default router;
