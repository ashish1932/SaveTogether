import { Router, Response, Request } from 'express';
import { jwtAuthGuard, AuthRequest } from '../auth/guards/jwt-auth.guard';
import { validatePresignFileDto } from './dto/presign-file.dto';
import { FilesService } from './files.service';
import { ErrorCode } from '../common/types/error-codes.enum';

const router = Router();

// ==========================================
// CENTRAL FILE STORAGE APIS
// ==========================================

// POST /api/v1/files/presign (Step 32.8 Request Upload URL)
router.post('/files/presign', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const val = validatePresignFileDto(req.body);

    if (!val.isValid || !val.data) {
      return res.status(400).json({
        success: false,
        message: val.error || 'Validation failed',
        code: ErrorCode.VALIDATION_ERROR,
      });
    }

    const presigned = await FilesService.generatePresignedUpload(userId, val.data);
    res.status(201).json(presigned);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/files/:id/complete (Step 32.9 Confirm Upload)
router.post('/files/:id/complete', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const file = await FilesService.completeUpload(req.params.id, userId, false);
    res.json(file);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/files/:id (Step 32.18 Get Signed Download URL)
router.get('/files/:id', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const fileAccess = await FilesService.getFileAccess(req.params.id, userId, false);
    res.json(fileAccess);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/files/:id (Step 32.34 Remove File Reference)
router.delete('/files/:id', jwtAuthGuard, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const result = await FilesService.deleteFile(req.params.id, userId, false);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// SIMULATED S3 STORAGE UPLOAD & DOWNLOAD UTILITY ENDPOINTS
router.put('/files/upload-simulated/:id', async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Simulated S3 binary object upload successful' });
});

router.get('/files/download-simulated/:id', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'image/jpeg');
  res.send(Buffer.from('SIMULATED_FILE_BINARY_CONTENT'));
});

export default router;
