import { apiClient } from './client';
import { Program } from '../store/slices/programSlice';

export const getPrograms = async (): Promise<Program[]> => {
  const response = await apiClient.get('/programs');
  return response.data;
};

export const getProgramById = async (id: string): Promise<Program> => {
  const response = await apiClient.get(`/programs/${id}`);
  return response.data;
};

export const enrollInProgram = async (programId: string): Promise<void> => {
  await apiClient.post(`/programs/${programId}/enroll`);
};
