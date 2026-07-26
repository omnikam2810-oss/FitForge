import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';

const programs = [
  { title: 'Muscle Gain Phase 2', detail: '4-week progression • 5 training days • recovery focus' },
  { title: 'Fat Loss Reset', detail: '3-week calorie-conscious plan • cardio + strength' },
];

export const ProgramsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Programs" subtitle="Follow a guided path to your goal">
      {programs.map((item) => (
        <View key={item.title} style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.primary }]}>{item.title}</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>{item.detail}</Text>
        </View>
      ))}
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
