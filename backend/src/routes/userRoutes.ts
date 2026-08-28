import { Router } from 'express';
import usersController from '../users/users.controller';

const router = Router();

// Mount User Controller routes at /api/v1/users/*
router.use('/users', usersController);

export default router;
