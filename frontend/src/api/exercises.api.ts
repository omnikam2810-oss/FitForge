import { apiClient } from './client';
import { Exercise } from '../store/slices/exerciseSlice';

const normalizeExercise = (exercise: any) => ({
  ...exercise,
  id: exercise?.id ?? exercise?._id ?? '',
  _id: exercise?._id ?? exercise?.id ?? '',
});

const unwrap = <T>(response: any): T => {
  const payload = response.data.data ?? response.data;

  if (Array.isArray(payload)) {
    return payload.map(normalizeExercise) as T;
  }

  return normalizeExercise(payload) as T;
};

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
