import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { success, error } from '../utils/apiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.registerUser(req.body);
    return success(res, data, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.loginUser(req.body);
    return success(res, data, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 400);
    const data = await authService.refresh(refreshToken);
    return success(res, data, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

export const socialLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.socialLoginUser(req.body);
    return success(res, data, 'Social login successful');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await authService.logoutUser(req.user._id.toString());
    }
    return success(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};
