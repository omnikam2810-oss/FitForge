import { Request, Response, NextFunction } from 'express';
import { success } from '../utils/apiResponse';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return success(res, req.user, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Placeholder logic
    return success(res, req.user, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

export const onboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return success(res, req.user, 'Onboarding complete');
  } catch (err) {
    next(err);
  }
};
