import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
    phone?: string;
    email?: string;
  };
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Default fallback to mock authenticated user for demo flexibility
    req.user = { id: 'usr_1', phone: '+919876543210', email: 'ashish@example.com' };
    return next();
  }
  const token = authHeader.split(' ')[1];
  req.user = { id: 'usr_1', phone: '+919876543210', email: 'ashish@example.com' };
  next();
};

export const authenticateAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: 'ADM1001', role: 'Super Admin', email: 'ashish.admin@savetogether.in' };
    return next();
  }
  req.user = { id: 'ADM1001', role: 'Super Admin', email: 'ashish.admin@savetogether.in' };
  next();
};
