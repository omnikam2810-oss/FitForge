import { useColorScheme } from 'react-native';
import { useMemo } from 'react';

export const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#3C3C43',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  }
};

export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FFD60A',
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
};

export type Theme = typeof lightTheme;

export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme === 'dark' ? darkTheme : lightTheme, [colorScheme]);
  return theme;
}
