import { Router } from 'express';
import complaintsController from '../complaints/complaints.controller';

const router = Router();

// Mount Complaint Router
router.use('/', complaintsController);

export default router;
