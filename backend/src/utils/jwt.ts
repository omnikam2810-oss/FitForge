import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string, isRefresh = false) => {
  const secret = isRefresh ? env.JWT_REFRESH_SECRET : env.JWT_SECRET;
  return jwt.verify(token, secret);
};
