import { apiClient } from './client';
import * as SecureStore from 'expo-secure-store';

const unwrap = <T>(response: any): T => response.data.data ?? response.data;

const persistTokens = async (payload: any) => {
  if (payload.accessToken) await SecureStore.setItemAsync('auth_token', payload.accessToken);
  if (payload.refreshToken) await SecureStore.setItemAsync('refresh_token', payload.refreshToken);
};

export const login = async (email: string, password: string): Promise<{ token: string; user: any }> => {
  const response = await apiClient.post('/auth/login', { email, password });
  const payload: any = unwrap(response);
  await persistTokens(payload);
  return { token: payload.accessToken, user: payload.user };
};

export const register = async (data: any): Promise<{ token: string; user: any }> => {
  const response = await apiClient.post('/auth/register', data);
  const payload: any = unwrap(response);
  await persistTokens(payload);
  return { token: payload.accessToken, user: payload.user };
};

export const socialLogin = async (data: {
  provider: 'google' | 'apple';
  socialId: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}): Promise<{ token: string; user: any }> => {
  const response = await apiClient.post('/auth/social-login', data);
  const payload: any = unwrap(response);
  await persistTokens(payload);
  return { token: payload.accessToken, user: payload.user };
};

export const fetchCurrentUser = async (): Promise<any> => {
  const response = await apiClient.get('/users/profile');
  return unwrap(response);
};
