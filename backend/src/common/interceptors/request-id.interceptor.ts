import { Request, Response, NextFunction } from 'express';

export interface RequestWithId extends Request {
  requestId?: string;
}

function generateRequestId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'REQ-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const requestIdMiddleware = (req: RequestWithId, res: Response, next: NextFunction) => {
  const incomingId = req.header('x-request-id');
  const requestId = incomingId && /^REQ-[A-Z0-9]{6,12}$/i.test(incomingId)
    ? incomingId
    : generateRequestId();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
