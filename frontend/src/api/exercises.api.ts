import { apiClient } from './client';
import { Exercise } from '../store/slices/exerciseSlice';

const unwrap = <T>(response: any): T => response.data.data ?? response.data;

export const getExercises = async (params?: {
  q?: string;
  category?: string;
  difficulty?: string;
  equipment?: string[];
  muscle?: string[];
  premium?: boolean;
}): Promise<Exercise[]> => {
  const response = await apiClient.get('/exercises', {
    params: {
      ...params,
      equipment: params?.equipment?.join(','),
      muscle: params?.muscle?.join(','),
    },
  });
  return unwrap(response);
};

export const getExerciseById = async (id: string): Promise<Exercise> => {
  const response = await apiClient.get(`/exercises/${id}`);
  return unwrap(response);
};
