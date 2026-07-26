import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { error as sendError } from '../utils/apiResponse';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }
  
  return sendError(res, 'Internal Server Error', 500);
};
