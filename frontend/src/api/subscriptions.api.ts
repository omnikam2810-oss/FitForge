import { apiClient } from './client';
import { Subscription } from '../store/slices/subscriptionSlice';

const unwrap = <T>(response: any): T => response.data.data ?? response.data;

export const getSubscriptionStatus = async (): Promise<Subscription> => {
  const response = await apiClient.get('/subscriptions/status');
  return unwrap(response);
};

export const createCheckoutSession = async (priceId: string): Promise<{ url: string }> => {
  const response = await apiClient.post('/subscriptions/create-checkout-session', { priceId });
  return unwrap(response);
};

export const cancelSubscription = async (): Promise<Subscription> => {
  const response = await apiClient.post('/subscriptions/cancel');
  return unwrap(response);
};

export const restoreSubscription = async (): Promise<Subscription> => {
  const response = await apiClient.post('/subscriptions/restore');
  return unwrap(response);
};

export const changeSubscriptionPlan = async (priceId: string): Promise<Subscription> => {
  const response = await apiClient.post('/subscriptions/change-plan', { priceId });
  return unwrap(response);
};
