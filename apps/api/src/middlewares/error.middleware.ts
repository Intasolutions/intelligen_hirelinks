import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { ApiError } from '../shared/errors';
import { sendResponse } from '../shared/response';
import { logger } from '../shared/logger';
import { env } from '../config/env';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    details = err.format();
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Image is too large. Please upload a file under 10MB.'
      : err.message;
  } else if (err.message === 'Only image files are allowed!') {
    // Thrown by upload.middleware.ts's fileFilter for a non-image upload.
    statusCode = 400;
    message = err.message;
  }

  // Log error
  if (statusCode === 500) {
    logger.error(`[${req.id}] ${err.stack || err.message}`);
  } else {
    logger.warn(`[${req.id}] ${statusCode} - ${message}`);
  }

  const errorPayload = {
    code: statusCode,
    message,
    ...(details && { details }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  };

  sendResponse(res, statusCode, false, null, errorPayload);
};
