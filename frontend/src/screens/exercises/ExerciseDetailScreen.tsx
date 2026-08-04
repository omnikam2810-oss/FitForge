import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';
import { getExerciseById } from '../../api/exercises.api';

export const ExerciseDetailScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const { id } = route.params || {};
  const [exercise, setExercise] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isActive = true;
    const loadExercise = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getExerciseById(id);
        if (isActive) {
          setExercise(data);
        }
      } catch (err) {
        if (isActive) {
          setError('Unable to load this exercise.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadExercise();
    return () => {
      isActive = false;
    };
  }, [id]);

  return (
    <AppShell title="Exercise Details" showBack>
      {loading ? (
        <ActivityIndicator color={theme.colors.brand.primary} style={{ marginTop: theme.spacing.xl }} />
      ) : error ? (
        <Text style={[theme.typography.body, { color: theme.colors.text.secondary, marginTop: theme.spacing.xl }]}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
          <Text style={[theme.typography.h1, { color: theme.colors.text.primary }]}>{exercise?.name ?? 'Exercise'}</Text>

          <View style={styles.chipRow}>
            <Text style={[styles.chip, { backgroundColor: theme.colors.brand.primary, color: theme.colors.text.inverse }]}>{exercise?.category ?? 'General'}</Text>
            <Text style={[styles.chip, { backgroundColor: theme.colors.surface.elevated, color: theme.colors.text.primary }]}>{exercise?.difficulty ?? 'Intermediate'}</Text>
            <Text style={[styles.chip, { backgroundColor: theme.colors.surface.elevated, color: theme.colors.text.primary }]}>{exercise?.equipment?.[0] ?? 'Bodyweight'}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
            <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Primary muscles</Text>
            <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>{exercise?.primaryMuscles?.join(', ') ?? 'No primary muscles listed.'}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
            <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Instructions</Text>
            {exercise?.instructions?.length ? exercise.instructions.map((step: string, index: number) => (
              <Text key={`${step}-${index}`} style={[theme.typography.body, { color: theme.colors.text.secondary, marginBottom: 8 }]}> 
                {index + 1}. {step}
              </Text>
            )) : <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>Instructions coming soon.</Text>}
          </View>
        </ScrollView>
      )}
    </AppShell>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, overflow: 'hidden' },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 }
});