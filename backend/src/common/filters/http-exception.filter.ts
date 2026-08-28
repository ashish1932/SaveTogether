import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../types/error-codes.enum';
import { RequestWithId } from '../interceptors/request-id.interceptor';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface CustomApiException extends Error {
  statusCode?: number;
  code?: ErrorCode | string;
  errors?: ValidationErrorDetail[];
}

export const globalExceptionFilter = (
  err: CustomApiException,
  req: RequestWithId,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';
  const code = err.code || (statusCode === 404 ? ErrorCode.BOOKING_NOT_FOUND : ErrorCode.INTERNAL_SERVER_ERROR);

  console.error(`[ERROR] [${req.requestId || 'REQ-UNKNOWN'}] ${req.method} ${req.url} ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(err.errors && err.errors.length > 0 ? { errors: err.errors } : {}),
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
};
