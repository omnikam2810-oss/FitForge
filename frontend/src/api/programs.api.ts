import { apiClient } from './client';
import { Program } from '../store/slices/programSlice';

const unwrap = <T>(response: any): T => response.data.data ?? response.data;

export const getPrograms = async (): Promise<Program[]> => {
  const response = await apiClient.get('/programs');
  return unwrap(response);
};

export const getProgramById = async (id: string): Promise<Program> => {
  const response = await apiClient.get(`/programs/${id}`);
  return unwrap(response);
};

export const enrollInProgram = async (programId: string): Promise<void> => {
  await apiClient.post(`/programs/${programId}/enroll`);
};
