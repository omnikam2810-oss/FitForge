import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';
import { startWorkout, finishWorkout } from '../store/slices/workoutSlice';
import { RootState } from '../store/store';

export const WorkoutFlowScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const currentWorkout = useSelector((state: RootState) => state.workout.currentWorkout);
  const [selectedExercise, setSelectedExercise] = useState('Squat');

  const workout = {
    id: 'demo-workout',
    name: 'Upper Body Strength',
    date: new Date().toISOString(),
    exercises: [
      { id: '1', exerciseId: 'squat', sets: [{ id: 's1', reps: 8, weight: 60, completed: false }] },
      { id: '2', exerciseId: 'bench', sets: [{ id: 'b1', reps: 10, weight: 40, completed: false }] },
    ],
    durationMinutes: 35,
    completed: false,
  };

  const handleStart = () => {
    dispatch(startWorkout(workout));
  };

  const handleComplete = () => {
    dispatch(finishWorkout());
  };

  const exercises = ['Squat', 'Bench Press', 'Row'];

  return (
    <AppShell title="Workout" subtitle="Log your first session">
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Today’s plan</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}> {currentWorkout ? currentWorkout.name : 'No session started yet'} </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Choose an exercise</Text>
        {exercises.map((exercise) => (
          <Pressable key={exercise} onPress={() => setSelectedExercise(exercise)} style={[styles.option, selectedExercise === exercise && styles.optionActive]}> 
            <Text style={[theme.typography.body, { color: selectedExercise === exercise ? theme.colors.brand.primary : theme.colors.text.primary }]}>{exercise}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={handleStart} style={[styles.primaryButton, { backgroundColor: theme.colors.brand.primary }]}> 
        <Text style={[theme.typography.button, { color: theme.colors.text.inverse }]}>Start workout</Text>
      </Pressable>
      <Pressable onPress={handleComplete} style={[styles.secondaryButton, { backgroundColor: theme.colors.surface.elevated }]}> 
        <Text style={[theme.typography.button, { color: theme.colors.text.primary }]}>Complete workout</Text>
      </Pressable>
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
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: 'rgba(108,92,231,0.08)',
  },
  optionActive: {
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
});
