import { Response } from 'express';

export const success = (res: Response, data: any, message: string = 'Success', statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const error = (res: Response, message: string = 'Error', statusCode: number = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};
