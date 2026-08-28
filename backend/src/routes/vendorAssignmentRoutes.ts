import { Router } from 'express';
import vendorAssignmentController from '../vendor-assignment/vendor-assignment.controller';

const router = Router();

// Mount specific admin subroutes for vendor assignments
router.use('/admin', vendorAssignmentController);

export default router;
