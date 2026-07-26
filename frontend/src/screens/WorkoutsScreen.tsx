import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';

const workouts = [
  { title: 'Upper Body Strength', detail: '3 rounds • 45 min • dumbbells + bench' },
  { title: 'Core Flow', detail: 'Mobility + stability • 20 min' },
  { title: 'Recovery Stretch', detail: 'Low impact • 15 min' },
];

export const WorkoutsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Workouts" subtitle="Train with structure and variety">
      {workouts.map((item) => (
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
