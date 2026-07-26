import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';
import { useAppStatus } from '../hooks/useAppStatus';

export const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { status, message } = useAppStatus();

  return (
    <AppShell title="FitForge" subtitle="Your premium fitness command center">
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.primary }]}>Today’s focus</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>Strength + mobility + recovery</Text>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>Plan your day, track your progress, and stay consistent.</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Live status</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>Status: {status}</Text>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>{message}</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Quick access</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>{'• Workouts\n• Programs\n• Progress\n• Community'}</Text>
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
