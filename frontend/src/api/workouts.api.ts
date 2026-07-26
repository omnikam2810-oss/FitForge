import { apiClient } from './client';
import { Workout } from '../store/slices/workoutSlice';

export const getWorkouts = async (): Promise<Workout[]> => {
  const response = await apiClient.get('/workouts');
  return response.data;
};

export const createWorkout = async (workoutData: Partial<Workout>): Promise<Workout> => {
  const response = await apiClient.post('/workouts', workoutData);
  return response.data;
};

export const getWorkoutById = async (id: string): Promise<Workout> => {
  const response = await apiClient.get(`/workouts/${id}`);
  return response.data;
};

export const updateWorkout = async (id: string, workoutData: Partial<Workout>): Promise<Workout> => {
  const response = await apiClient.put(`/workouts/${id}`, workoutData);
  return response.data;
};
