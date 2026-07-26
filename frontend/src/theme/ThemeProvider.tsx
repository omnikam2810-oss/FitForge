import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorTheme } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { borderRadius } from './borderRadius';
import { animations } from './animations';

export type ThemeType = 'light' | 'dark' | 'system';

export interface Theme {
  colors: ColorTheme;
  typography: typeof typography;
  spacing: typeof spacing;
  shadows: typeof shadows;
  borderRadius: typeof borderRadius;
  animations: typeof animations;
  isDark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setThemeType: (type: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  const [isDark, setIsDark] = useState<boolean>(systemColorScheme === 'dark');

  useEffect(() => {
    if (themeType === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeType === 'dark');
    }
  }, [themeType, systemColorScheme]);

  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    shadows,
    borderRadius,
    animations,
    isDark,
  };

  return (
    <ThemeContext.Provider value={{ theme, themeType, setThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
