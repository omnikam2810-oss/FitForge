import { Platform } from 'react-native';

const getDefaultApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1';
};

export const API_URL = getDefaultApiUrl();

export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Legs',
  'Arms',
  'Shoulders',
  'Core',
  'Full Body',
];

export const EQUIPMENT_LIST = [
  'Barbell',
  'Dumbbell',
  'Kettlebell',
  'Machine',
  'Cable',
  'Bodyweight',
  'Bands',
  'None',
];

export const APP_NAME = 'Health App';

export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_PROFILE: '@user_profile',
  OFFLINE_WORKOUTS: '@offline_workouts',
};
