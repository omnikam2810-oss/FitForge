import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrlFromConfig = () => {
  const expoExtra = (Constants.expoConfig?.extra || (Constants.manifest as any)?.extra) as Record<string, any> | undefined;
  const apiUrl = expoExtra?.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL;
  if (apiUrl) {
    return apiUrl;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }

  return 'http://localhost:5000/api/v1';
};

export const API_URL = getApiUrlFromConfig();
