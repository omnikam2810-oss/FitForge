import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { RootState, AppDispatch } from '../store/store';
import { setAuthSuccess, setAuthLoading, setAuthError, logout as clearAuth } from '../store/slices/authSlice';
import { setUserProfile, clearUserProfile } from '../store/slices/userSlice';
import { setShowOnboarding } from '../store/slices/uiSlice';
import * as authApi from '../api/auth.api';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user.profile);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch(setAuthLoading(true));
      const result = await authApi.login(email, password);
      dispatch(setAuthSuccess(result.token));
      dispatch(setUserProfile(result.user));
      if (!result.user.onboardingCompleted) {
        dispatch(setShowOnboarding(true));
      } else {
        dispatch(setShowOnboarding(false));
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      dispatch(setAuthError(message));
      throw err;
    }
  }, [dispatch]);

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      dispatch(setAuthLoading(true));
      const result = await authApi.register(data);
      dispatch(setAuthSuccess(result.token));
      dispatch(setUserProfile(result.user));
      dispatch(setShowOnboarding(true));
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      dispatch(setAuthError(message));
      throw err;
    }
  }, [dispatch]);

  const logoutUser = useCallback(async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('refresh_token');
    dispatch(clearAuth());
    dispatch(clearUserProfile());
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        dispatch(setAuthLoading(true));
        const user = await authApi.fetchCurrentUser();
        dispatch(setAuthSuccess(token));
        dispatch(setUserProfile(user));
        dispatch(setShowOnboarding(!user.onboardingCompleted));
      }
    } catch {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      dispatch(clearAuth());
    }
  }, [dispatch]);

  return { isAuthenticated, loading, error, user, login, register, logout: logoutUser, checkAuth };
}
