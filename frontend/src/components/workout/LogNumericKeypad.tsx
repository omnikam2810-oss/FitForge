import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

interface LogNumericKeypadProps {
  visible: boolean;
  value: string;
  label: string;
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onDone: () => void;
  onCalculator: () => void;
}

export const LogNumericKeypad: React.FC<LogNumericKeypadProps> = ({
  visible,
  value,
  label,
  onKeyPress,
  onDelete,
  onDone,
  onCalculator,
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', 'back'],
  ];

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface.card,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.default,
      paddingBottom: 24,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 12,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    labelText: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.body.fontFamily,
    },
    valueText: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.h2.fontFamily,
      fontSize: 28,
      fontWeight: 'bold',
    },
    controlRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    calculatorBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    calculatorText: {
      color: theme.colors.text.primary,
      marginLeft: theme.spacing.xs,
    },
    doneBtn: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.brand.primary,
      borderRadius: theme.borderRadius.md,
    },
    doneText: {
      color: theme.colors.text.inverse,
      fontFamily: theme.typography.button.fontFamily,
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    key: {
      width: '30%',
      aspectRatio: 1,
      backgroundColor: theme.colors.surface.bg,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    keyText: {
      color: theme.colors.text.primary,
      fontSize: 24,
      fontWeight: '700',
    },
    backIcon: {
      color: theme.colors.text.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.labelText}>{label}</Text>
          <Text style={styles.valueText}>{value || '0'}</Text>
        </View>
        <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.calculatorBtn} onPress={onCalculator}>
          <Ionicons name="calculator-outline" size={20} color={theme.colors.text.primary} />
          <Text style={styles.calculatorText}>Calculator</Text>
        </TouchableOpacity>
      </View>

      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.key}
              onPress={() => item === 'back' ? onDelete() : onKeyPress(item)}
            >
              {item === 'back' ? (
                <Ionicons name="backspace-outline" size={24} style={styles.backIcon} />
              ) : (
                <Text style={styles.keyText}>{item}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};
