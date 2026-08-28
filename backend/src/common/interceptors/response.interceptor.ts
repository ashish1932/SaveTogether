import { Request, Response, NextFunction } from 'express';
import { RequestWithId } from './request-id.interceptor';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface StandardApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  requestId?: string;
  timestamp: string;
}

export const responseInterceptor = (req: RequestWithId, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (body: any) {
    if (body && typeof body === 'object' && ('success' in body || 'code' in body || 'statusCode' in body)) {
      return originalJson.call(this, body);
    }

    let meta: PaginationMeta | undefined;
    let dataPayload = body;

    if (body && typeof body === 'object' && 'items' in body && 'total' in body) {
      dataPayload = body.items;
      meta = {
        page: body.page || 1,
        limit: body.limit || 20,
        total: body.total,
        totalPages: Math.ceil(body.total / (body.limit || 20)),
      };
    }

    const formatted: StandardApiResponse<any> = {
      success: true,
      message: res.locals.customMessage || 'Request processed successfully',
      data: dataPayload,
      ...(meta ? { meta } : {}),
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    };

    return originalJson.call(this, formatted);
  };

  next();
};
