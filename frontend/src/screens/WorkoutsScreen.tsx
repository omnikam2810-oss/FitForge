import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';
import { getWorkouts } from '../api/workouts.api';

export const WorkoutsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      setLoading(true);
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load workouts');
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  return (
    <AppShell title="Workouts" subtitle="Train with structure and variety">
      {loading ? (
        <ActivityIndicator color={theme.colors.brand.primary} style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={[theme.typography.body, { color: theme.colors.feedback.error, marginTop: 24 }]}>{error}</Text>
      ) : workouts.length ? (
        workouts.map((item) => (
          <View key={item._id ?? item.id} style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
            <Text style={[theme.typography.h3, { color: theme.colors.brand.primary }]}>{item.name ?? item.title}</Text>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>{item.detail ?? `${item.exercises?.length ?? 0} exercises • ${item.durationMinutes ?? 0} min`}</Text>
          </View>
        ))
      ) : (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>No workouts yet</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>Start your first session to see workout history here.</Text>
        </View>
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
