import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new AppError('Email already in use', 400);

  const user = await User.create(data);
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  
  user.refreshToken = refreshToken;
  await user.save();
  
  return { user, accessToken, refreshToken };
};

export const loginUser = async (data: any) => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const isValid = await user.comparePassword(data.password);
  if (!isValid) throw new AppError('Invalid credentials', 401);

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refresh = async (token: string) => {
  try {
    const decoded: any = verifyToken(token, true);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());
    
    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};

export const logoutUser = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
