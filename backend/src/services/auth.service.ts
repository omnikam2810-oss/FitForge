import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new AppError('Email already in use', 400);

  const user = await User.create({
    ...data,
    passwordHash: data.passwordHash ?? data.password,
    authProvider: 'email',
  });
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

export const socialLoginUser = async (data: any) => {
  const { provider, socialId, email, displayName, avatarUrl } = data;
  if (!['google', 'apple'].includes(provider)) throw new AppError('Unsupported auth provider', 400);
  if (!socialId || !email) throw new AppError('Social id and email are required', 400);

  let user = await User.findOne({ authProvider: provider, socialId });
  if (!user) {
    user = await User.findOne({ email });
  }

  if (!user) {
    user = await User.create({
      email,
      displayName: displayName ?? email.split('@')[0],
      avatarUrl,
      authProvider: provider,
      socialId,
    });
  } else {
    user.authProvider = provider;
    user.socialId = socialId;
    if (displayName) user.displayName = displayName;
    if (avatarUrl) user.avatarUrl = avatarUrl;
  }

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
