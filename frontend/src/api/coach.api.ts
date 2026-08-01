import { apiClient } from './client';

const unwrap = <T>(response: any): T => response.data.data ?? response.data;

export interface Coach {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  imageUrl?: string;
}

export const getCoaches = async (): Promise<Coach[]> => {
  const response = await apiClient.get('/coach/coaches');
  return unwrap(response);
};

export const bookSession = async (coachId: string, date: string): Promise<void> => {
  await apiClient.post(`/coach/coaches/${coachId}/book`, { date });
};
