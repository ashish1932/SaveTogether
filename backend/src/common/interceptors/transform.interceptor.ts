import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const responseTransformMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function (body: any) {
    if (body && typeof body === 'object' && ('success' in body || 'error' in body || 'statusCode' in body)) {
      return originalJson.call(this, body);
    }
    const formattedResponse: ApiResponse<any> = {
      success: true,
      message: 'Request successful',
      data: body,
      timestamp: new Date().toISOString(),
    };
    return originalJson.call(this, formattedResponse);
  };
  next();
};
