import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/session.service';
import { ErrorCode } from '../../common/types/error-codes.enum';
import { usersData } from '../../data/mockDatabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    mobile: string;
    name?: string;
    sessionId: string;
  };
}

export const jwtAuthGuard = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication token is required',
      code: ErrorCode.AUTH_UNAUTHORIZED,
      timestamp: new Date().toISOString(),
    });
  }

  const token = authHeader.split(' ')[1];
  const verification = SessionService.verifySignedJwt(token, false);

  if (!verification.isValid || !verification.payload) {
    return res.status(401).json({
      success: false,
      message: verification.error || 'Invalid or expired authentication token',
      code: ErrorCode.AUTH_UNAUTHORIZED,
      timestamp: new Date().toISOString(),
    });
  }

  const { sub: userId, sessionId } = verification.payload;

  // Verify Session Active Status
  const session = SessionService.getSession(sessionId);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Session revoked or expired. Please login again.',
      code: ErrorCode.AUTH_UNAUTHORIZED,
      timestamp: new Date().toISOString(),
    });
  }

  // Step 07.34: Check User Account Status on every request
  const user = usersData.find((u) => u.id === userId) || { id: userId, phone: '+919000000001', name: 'Ashish Kumar', status: 'ACTIVE' };

  if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
    return res.status(403).json({
      success: false,
      message: 'Your account is currently unavailable',
      code: ErrorCode.USER_BLOCKED,
      timestamp: new Date().toISOString(),
    });
  }

  req.user = {
    id: user.id,
    mobile: user.phone,
    name: user.name || undefined,
    sessionId: session.id,
  };

  next();
};
