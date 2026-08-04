import { Response } from 'express';

interface StandardResponse<T> {
  success: boolean;
  data: T | null;
  error: any | null;
  meta?: any;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  data: T | null,
  error: any | null = null,
  meta?: any
) => {
  const payload: StandardResponse<T> = {
    success,
    data,
    error,
    ...(meta && { meta })
  };
  
  res.status(statusCode).json(payload);
};
