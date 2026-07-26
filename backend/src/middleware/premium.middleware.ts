import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/apiResponse';

export const premiumMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.subscriptionTier !== 'premium') {
    return error(res, 'Premium subscription required', 403);
  }
  next();
};
