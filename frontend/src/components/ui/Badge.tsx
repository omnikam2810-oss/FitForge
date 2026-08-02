import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Badge({ label, variant = 'default', style, ...props }: BadgeProps) {
  const { theme } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'success': return { bg: theme.colors.success, text: '#FFF' };
      case 'warning': return { bg: theme.colors.warning, text: '#000' };
      case 'error': return { bg: theme.colors.error, text: '#FFF' };
      default: return { bg: theme.colors.primary, text: '#FFF' };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderRadius: theme.borderRadius.full },
        style
      ]}
      {...props}
    >
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  }
});
