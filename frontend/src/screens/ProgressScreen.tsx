import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';
import { getWorkoutSummary } from '../api/workouts.api';

export const ProgressScreen: React.FC = () => {
  const { theme } = useTheme();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      try {
        const data = await getWorkoutSummary();
        setSummary(data);
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load progress data');
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  return (
    <AppShell title="Progress" subtitle="Review your wins and trends">
      {loading ? (
        <ActivityIndicator color={theme.colors.brand.primary} style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={[theme.typography.body, { color: theme.colors.feedback.error, marginTop: 24 }]}>{error}</Text>
      ) : (
        <>
          <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
            <Text style={[theme.typography.h3, { color: theme.colors.brand.primary }]}>Weekly snapshot</Text>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>{summary?.totalWorkouts ?? 0} workouts completed</Text>
            <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>
              Total volume: {summary?.totalVolume ?? 0} kg
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
            <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Recent performance</Text>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>
              Best estimated 1RM: {summary?.bestEstimatedOneRepMax ?? 0} kg
            </Text>
            <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>Workout streak: {summary?.totalWorkouts ? Math.min(summary.totalWorkouts, 7) : 0} days</Text>
          </View>
        </>
      )}
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
