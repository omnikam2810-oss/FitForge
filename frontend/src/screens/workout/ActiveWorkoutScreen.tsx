import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { completeWorkout, clearWorkout, updateSet, addSet, updateExerciseNotes, updateExerciseRestSeconds } from '../../store/slices/workoutSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRestTimer } from '../../hooks/useRestTimer';
import { LogNumericKeypad } from '../../components/workout/LogNumericKeypad';

type ActiveField = {
  exerciseIndex: number;
  setIndex: number;
  field: 'weight' | 'reps';
  value: string;
};

export function ActiveWorkoutScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { currentWorkout, history } = useSelector((state: RootState) => state.workout);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeField, setActiveField] = useState<ActiveField | null>(null);
  const { isActive, timeRemaining, startTimer, stopTimer } = useRestTimer();

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const previousPerformance = useMemo(() => {
    const map: Record<string, { weight: number; reps: number }> = {};
    for (let i = history.length - 1; i >= 0; i -= 1) {
      const workout = history[i];
      workout.exercises.forEach((exercise) => {
        const key = exercise.exerciseId || exercise.name;
        if (!map[key] && exercise.sets.length > 0) {
          const lastSet = exercise.sets[exercise.sets.length - 1];
          map[key] = { weight: lastSet.weight, reps: lastSet.reps };
        }
      });
    }
    return map;
  }, [history]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFinish = () => {
    if (!currentWorkout?.exercises?.length) {
      Alert.alert('No exercises added', 'Please add at least one exercise before finishing your workout.');
      return;
    }

    const hasCompletedSet = currentWorkout.exercises.some((exercise) =>
      exercise.sets.some((set) => set.completed)
    );

    if (!hasCompletedSet) {
      Alert.alert('No completed sets', 'Mark at least one set as completed before finishing this workout.');
      return;
    }

    dispatch(completeWorkout({ id: currentWorkout.id, workoutData: { ...currentWorkout, completed: true } }))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          navigation.navigate('WorkoutSummary');
        }
      });
  };

  const handleCancel = () => {
    Alert.alert('Cancel Workout?', 'Are you sure you want to cancel? This action cannot be undone.', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => {
        dispatch(clearWorkout());
        navigation.navigate('WorkoutHome');
      }}
    ]);
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number, completed: boolean) => {
    dispatch(updateSet({ exerciseIndex, setIndex, updates: { completed: !completed } }));
    if (!completed) {
      startTimer(90);
    }
  };

  const openFieldEditor = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', currentValue: number) => {
    setActiveField({ exerciseIndex, setIndex, field, value: currentValue > 0 ? String(currentValue) : '' });
  };

  const handleKeyPress = (key: string) => {
    if (!activeField) return;
    const nextValue = activeField.value === '0' ? key : `${activeField.value}${key}`;
    setActiveField({ ...activeField, value: nextValue });
  };

  const handleDelete = () => {
    if (!activeField) return;
    const nextValue = activeField.value.slice(0, -1);
    setActiveField({ ...activeField, value: nextValue });
  };

  const handleKeypadDone = () => {
    if (!activeField) return;
    const parsed = Number(activeField.value || '0');
    dispatch(updateSet({ exerciseIndex: activeField.exerciseIndex, setIndex: activeField.setIndex, updates: { [activeField.field]: parsed } }));
    setActiveField(null);
  };

  const handleCalculator = () => {
    if (activeField) {
      navigation.navigate('PlateCalculator');
    }
  };

  const handleToggleRest = (exerciseIndex: number, currentSeconds: number) => {
    const nextSeconds = currentSeconds === 0 ? 40 : 0;
    dispatch(updateExerciseRestSeconds({ exerciseIndex, restSeconds: nextSeconds }));
    if (nextSeconds > 0) {
      startTimer(nextSeconds);
    } else {
      stopTimer();
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.surface.card, borderBottomWidth: 1, borderBottomColor: theme.colors.border.default },
    headerTitle: { color: theme.colors.text.primary, fontFamily: theme.typography.h3.fontFamily, fontWeight: 'bold' },
    timer: { color: theme.colors.brand.primary, fontFamily: theme.typography.body.fontFamily, fontWeight: 'bold' },
    finishBtn: { backgroundColor: theme.colors.brand.primary, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.sm },
    finishBtnText: { color: theme.colors.text.inverse, fontWeight: 'bold' },
    exerciseCard: { backgroundColor: theme.colors.surface.card, marginVertical: theme.spacing.sm, paddingBottom: theme.spacing.md, borderRadius: theme.borderRadius.lg, marginHorizontal: theme.spacing.md, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
    exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md, marginBottom: theme.spacing.sm },
    exerciseName: { color: theme.colors.brand.primary, fontFamily: theme.typography.h3.fontFamily, fontWeight: 'bold', fontSize: 18, flexShrink: 1 },
    notesInput: { backgroundColor: theme.colors.surface.bg, borderWidth: 1, borderColor: theme.colors.border.default, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm, marginHorizontal: theme.spacing.md, color: theme.colors.text.primary, minHeight: 58, textAlignVertical: 'top' },
    notesLabel: { color: theme.colors.text.secondary, marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.xs, fontSize: 13 },
    restRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.sm },
    restText: { color: theme.colors.text.secondary, fontFamily: theme.typography.body.fontFamily },
    restToggleText: { color: theme.colors.brand.primary, fontFamily: theme.typography.body.fontFamily, fontWeight: 'bold' },
    setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md },
    setColHeader: { color: theme.colors.text.muted, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
    setNum: { width: 30, textAlign: 'center', color: theme.colors.text.secondary, backgroundColor: theme.colors.surface.bg, borderRadius: 4, padding: 2 },
    prevCol: { flex: 1, textAlign: 'center', color: theme.colors.text.secondary, fontSize: 12 },
    fieldCell: { width: 60, height: 38, backgroundColor: theme.colors.surface.bg, borderRadius: theme.borderRadius.sm, borderWidth: 1, borderColor: theme.colors.border.default, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
    fieldText: { color: theme.colors.text.primary, fontSize: 15, fontWeight: '600' },
    checkBtn: { width: 40, height: 35, borderRadius: 6, backgroundColor: theme.colors.surface.bg, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
    checkBtnCompleted: { backgroundColor: theme.colors.status.success },
    completedRow: { backgroundColor: `${theme.colors.status.success}20` },
    addSetBtn: { padding: theme.spacing.sm, alignItems: 'center', marginTop: theme.spacing.sm },
    addSetText: { color: theme.colors.text.secondary, fontWeight: 'bold' },
    addExerciseBtn: { backgroundColor: theme.colors.surface.card, margin: theme.spacing.md, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.brand.primary },
    addExerciseText: { color: theme.colors.brand.primary, fontWeight: 'bold', fontSize: 16 },
    emptyState: { padding: theme.spacing.lg, alignItems: 'center' },
    emptyText: { color: theme.colors.text.secondary, textAlign: 'center' },
    tableHeader: { borderBottomWidth: 1, borderBottomColor: theme.colors.surface.bg, paddingBottom: theme.spacing.sm },
    exerciseNameIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: `${theme.colors.brand.primary}20`, justifyContent: 'center', alignItems: 'center' },
    restTimerOverlay: { position: 'absolute', left: theme.spacing.md, right: theme.spacing.md, bottom: theme.spacing.lg, backgroundColor: theme.colors.surface.card, borderRadius: theme.borderRadius.lg, padding: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 6 },
    restTimerText: { color: theme.colors.text.primary, fontWeight: 'bold' },
  });

  if (!currentWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: theme.colors.text.primary, margin: theme.spacing.lg }}>No active workout.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Log Workout</Text>
          <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
        </View>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishBtnText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: activeField ? 320 : 120 }}>
        {currentWorkout.exercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[theme.typography.body, styles.emptyText]}>No exercises have been added yet. Use the button below to add one.</Text>
          </View>
        ) : currentWorkout.exercises.map((exercise, exIndex) => {
          const previous = previousPerformance[exercise.exerciseId || exercise.name];
          const previousLabel = previous ? `${previous.weight}kg x ${previous.reps}` : '-';

          return (
            <View key={exercise.id || String(exIndex)} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.exerciseNameIcon}>
                    <Ionicons name="barbell" size={18} color={theme.colors.brand.primary} />
                  </View>
                  <Text style={[styles.exerciseName, { marginLeft: theme.spacing.sm }]}>{exercise.name}</Text>
                </View>
                <TouchableOpacity onPress={() => {}}>
                  <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.notesLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={exercise.notes ?? ''}
                onChangeText={(text) => dispatch(updateExerciseNotes({ exerciseIndex: exIndex, notes: text }))}
                placeholder="Add notes here..."
                placeholderTextColor={theme.colors.text.muted}
                multiline
              />

              <View style={styles.restRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="time-outline" size={18} color={theme.colors.brand.primary} />
                  <Text style={[styles.restText, { marginLeft: theme.spacing.xs }]}>Rest Timer: {exercise.restSeconds ? `${exercise.restSeconds}s` : 'OFF'}</Text>
                </View>
                <TouchableOpacity onPress={() => handleToggleRest(exIndex, exercise.restSeconds)}>
                  <Text style={styles.restToggleText}>{exercise.restSeconds ? 'Turn OFF' : 'Turn ON'}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.setRow, styles.tableHeader]}> 
                <Text style={[styles.setColHeader, { width: 30 }]}>SET</Text>
                <Text style={[styles.setColHeader, { flex: 1 }]}>PREVIOUS</Text>
                <Text style={[styles.setColHeader, { width: 60 }]}>KG</Text>
                <Text style={[styles.setColHeader, { width: 60 }]}>REPS</Text>
                <Text style={[styles.setColHeader, { width: 40, marginLeft: 10 }]}>✓</Text>
              </View>

              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={[styles.setRow, set.completed && styles.completedRow]}>
                  <Text style={styles.setNum}>{setIndex + 1}</Text>
                  <Text style={styles.prevCol}>{previousLabel}</Text>
                  <TouchableOpacity style={styles.fieldCell} onPress={() => openFieldEditor(exIndex, setIndex, 'weight', set.weight)}>
                    <Text style={styles.fieldText}>{set.weight || '-'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.fieldCell} onPress={() => openFieldEditor(exIndex, setIndex, 'reps', set.reps)}>
                    <Text style={styles.fieldText}>{set.reps || '-'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.checkBtn, set.completed && styles.checkBtnCompleted]}
                    onPress={() => toggleSetComplete(exIndex, setIndex, set.completed)}
                  >
                    <Ionicons name="checkmark" size={20} color={set.completed ? theme.colors.text.inverse : theme.colors.text.muted} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addSetBtn}
                onPress={() => dispatch(addSet({ exerciseIndex: exIndex, set: { id: Date.now().toString(), reps: 0, weight: 0, completed: false, type: 'normal' } }))}
              >
                <Text style={styles.addSetText}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <TouchableOpacity style={styles.addExerciseBtn} onPress={() => navigation.navigate('ExercisePicker')}>
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      <LogNumericKeypad
        visible={Boolean(activeField)}
        label={activeField ? `${activeField.field.toUpperCase()} entry` : ''}
        value={activeField?.value ?? ''}
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        onDone={handleKeypadDone}
        onCalculator={handleCalculator}
      />

      {isActive && (
        <View style={styles.restTimerOverlay}>
          <Text style={styles.restTimerText}>Rest: {formatTime(timeRemaining)}</Text>
          <TouchableOpacity onPress={stopTimer}>
            <Ionicons name="pause" size={24} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

