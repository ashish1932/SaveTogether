import { Router } from 'express';
import serviceCatalogController from '../service-catalog/service-catalog.controller';

const router = Router();

// Mount Customer & Admin Service Catalog Endpoints
router.use('/', serviceCatalogController);

export default router;
