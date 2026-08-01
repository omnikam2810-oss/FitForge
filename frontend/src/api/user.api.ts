import { apiClient } from './client';

const unwrap = <T>(response: any): T => response.data.data ?? response.data;

export const submitOnboarding = async (payload: any): Promise<any> => {
  const response = await apiClient.put('/users/onboarding', payload);
  return unwrap(response);
};
