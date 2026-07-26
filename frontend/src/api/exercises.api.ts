import { apiClient } from './client';
import { Exercise } from '../store/slices/exerciseSlice';

export const getExercises = async (): Promise<Exercise[]> => {
  const response = await apiClient.get('/exercises');
  return response.data;
};

export const getExerciseById = async (id: string): Promise<Exercise> => {
  const response = await apiClient.get(`/exercises/${id}`);
  return response.data;
};
