import { Router, Response } from 'express';
import { adminJwtGuard, AdminAuthRequest } from '../admin-auth/guards/admin-jwt.guard';
import { validateAuditQueryDto } from './dto/audit-query.dto';
import { AuditService } from './audit.service';

const router = Router();

// All Audit Log endpoints require Admin Authentication (Read-only, Step 36.26)
router.use(adminJwtGuard);

// GET /api/v1/admin/audit-logs (Step 36.27 Query Audit History)
router.get('/', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const query = validateAuditQueryDto(req.query);
    const result = await AuditService.listAuditLogs(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/admin/audit-logs/:id (Step 36.29 Audit Entry Details)
router.get('/:id', async (req: AdminAuthRequest, res: Response, next) => {
  try {
    const log = await AuditService.getAuditById(req.params.id);
    res.json(log);
  } catch (err) {
    next(err);
  }
});

export default router;
