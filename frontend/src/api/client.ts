import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config/api';

let _store: any = null;
export const injectStore = (store: any) => { _store = store; };

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from SecureStore', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!refreshToken) throw new Error('Missing refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const tokens = response.data.data ?? response.data;
        await SecureStore.setItemAsync('auth_token', tokens.accessToken);
        await SecureStore.setItemAsync('refresh_token', tokens.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
        if (_store) {
          const { logout } = require('../store/slices/authSlice');
          _store.dispatch(logout());
        }
      }
    }

    return Promise.reject(error);
  }
);
