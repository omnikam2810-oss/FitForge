import { apiClient } from './client';
import { Measurement } from '../store/slices/progressSlice';

const unwrap = <T>(response: any): T => response.data.data ?? response.data;

export const getMeasurements = async (): Promise<Measurement[]> => {
  const response = await apiClient.get('/measurements');
  return unwrap(response);
};

export const addMeasurement = async (data: Omit<Measurement, 'id'>): Promise<Measurement> => {
  const response = await apiClient.post('/measurements', data);
  return unwrap(response);
};
