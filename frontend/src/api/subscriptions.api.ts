import { apiClient } from './client';
import { Subscription } from '../store/slices/subscriptionSlice';

export const getSubscriptionStatus = async (): Promise<Subscription> => {
  const response = await apiClient.get('/subscriptions/status');
  return response.data;
};

export const createCheckoutSession = async (priceId: string): Promise<{ url: string }> => {
  const response = await apiClient.post('/subscriptions/create-checkout-session', { priceId });
  return response.data;
};
