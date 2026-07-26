export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

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
