import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDefaultApiUrl = () => {
  const expoExtra = (Constants.expoConfig?.extra || (Constants.manifest as any)?.extra) as any;
  const extraApiUrl = expoExtra?.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL;
  if (extraApiUrl) {
    return extraApiUrl;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }

  return 'http://localhost:5000/api/v1';
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
