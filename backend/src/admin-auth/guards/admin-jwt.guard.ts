import { Request, Response, NextFunction } from 'express';
import { AdminSessionService } from '../services/admin-session.service';
import { ErrorCode } from '../../common/types/error-codes.enum';

export interface AdminAuthRequest extends Request {
  adminUser?: {
    id: string;
    email: string;
    name: string;
    roleType: string;
    sessionId: string;
  };
}

export const adminJwtGuard = (req: AdminAuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Admin authentication token is required',
      code: ErrorCode.AUTH_UNAUTHORIZED,
      timestamp: new Date().toISOString(),
    });
  }

  const token = authHeader.split(' ')[1];
  const verification = AdminSessionService.verifyAdminSignedJwt(token, false);

  if (!verification.isValid || !verification.payload) {
    return res.status(401).json({
      success: false,
      message: verification.error || 'Invalid or expired admin authentication token',
      code: ErrorCode.AUTH_UNAUTHORIZED,
      timestamp: new Date().toISOString(),
    });
  }

  const { sub: adminUserId, sessionId } = verification.payload;

  // Check Active Session
  const session = AdminSessionService.getSession(sessionId);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Admin session revoked or expired. Please log in again.',
      code: ErrorCode.AUTH_UNAUTHORIZED,
      timestamp: new Date().toISOString(),
    });
  }

  // Populate Admin user context
  req.adminUser = {
    id: adminUserId,
    email: 'ashish.admin@savetogether.in',
    name: 'Ashish Admin',
    roleType: 'SUPER_ADMIN',
    sessionId: session.id,
  };

  next();
};
