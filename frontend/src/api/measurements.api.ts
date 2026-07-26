import { apiClient } from './client';
import { Measurement } from '../store/slices/progressSlice';

export const getMeasurements = async (): Promise<Measurement[]> => {
  const response = await apiClient.get('/measurements');
  return response.data;
};

export const addMeasurement = async (data: Omit<Measurement, 'id'>): Promise<Measurement> => {
  const response = await apiClient.post('/measurements', data);
  return response.data;
};
