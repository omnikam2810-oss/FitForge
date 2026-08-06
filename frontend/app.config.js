import { readFileSync } from 'fs';
import { resolve } from 'path';

const loadEnv = () => {
  const envPath = resolve(__dirname, '.env');
  try {
    const envContents = readFileSync(envPath, 'utf8');
    const values = {};
    envContents.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) return;
      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim();
      values[key] = value;
    });
    return values;
  } catch {
    return {};
  }
};

const env = loadEnv();
const apiUrl = process.env.EXPO_PUBLIC_API_URL || env.EXPO_PUBLIC_API_URL;

export default ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra || {}),
    EXPO_PUBLIC_API_URL: apiUrl,
  },
});
