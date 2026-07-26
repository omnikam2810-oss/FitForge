import { apiClient } from './client';
import { AuthState } from '../store/slices/authSlice';

export const login = async (email: string, password: string): Promise<{ token: string; user: any }> => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (data: any): Promise<{ token: string; user: any }> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const fetchCurrentUser = async (): Promise<any> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
