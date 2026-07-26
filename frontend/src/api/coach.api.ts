import { apiClient } from './client';

export interface Coach {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  imageUrl?: string;
}

export const getCoaches = async (): Promise<Coach[]> => {
  const response = await apiClient.get('/coaches');
  return response.data;
};

export const bookSession = async (coachId: string, date: string): Promise<void> => {
  await apiClient.post(`/coaches/${coachId}/book`, { date });
};
