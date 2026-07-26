import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
}

export function Chip({ label, selected, style, ...props }: ChipProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
          borderRadius: theme.borderRadius.full,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
        style
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          { color: selected ? '#FFFFFF' : theme.colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  }
});
