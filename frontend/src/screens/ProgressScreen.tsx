import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';

export const ProgressScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Progress" subtitle="Review your wins and trends">
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.primary }]}>Weekly snapshot</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>3 workouts completed</Text>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>Consistency score: 87%</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Recent metrics</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>Bench: +5 lb</Text>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>Sleep: 7.4 hrs • Water: 2.8 L</Text>
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
});
