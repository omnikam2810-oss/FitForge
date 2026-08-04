import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { finishWorkout, clearWorkout, updateSet, addSet, removeSet } from '../../store/slices/workoutSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRestTimer } from '../../hooks/useRestTimer';

export function ActiveWorkoutScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { currentWorkout } = useSelector((state: RootState) => state.workout);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { isActive, timeRemaining, startTimer, stopTimer } = useRestTimer();

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

    dispatch(finishWorkout());
    navigation.navigate('WorkoutSummary');
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
      startTimer(90); // default 90s rest
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.md, backgroundColor: theme.colors.surface.card, borderBottomWidth: 1, borderBottomColor: theme.colors.border.default },
    headerTitle: { color: theme.colors.text.primary, fontFamily: theme.typography.h3.fontFamily, fontWeight: 'bold' },
    timer: { color: theme.colors.brand.primary, fontFamily: theme.typography.body.fontFamily, fontWeight: 'bold' },
    finishBtn: { backgroundColor: theme.colors.brand.primary, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.sm },
    finishBtnText: { color: theme.colors.text.inverse, fontWeight: 'bold' },
    exerciseCard: { backgroundColor: theme.colors.surface.card, marginVertical: theme.spacing.sm, paddingVertical: theme.spacing.md },
    exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
    exerciseName: { color: theme.colors.brand.primary, fontFamily: theme.typography.h3.fontFamily, fontWeight: 'bold', fontSize: 18 },
    setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md },
    setColHeader: { color: theme.colors.text.muted, fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
    setNum: { width: 30, textAlign: 'center', color: theme.colors.text.secondary, backgroundColor: theme.colors.surface.bg, borderRadius: 4, padding: 2 },
    prevCol: { flex: 1, textAlign: 'center', color: theme.colors.text.muted, fontSize: 12 },
    input: { width: 60, height: 35, backgroundColor: theme.colors.surface.bg, borderRadius: 6, color: theme.colors.text.primary, textAlign: 'center', marginHorizontal: 5, borderWidth: 1, borderColor: theme.colors.border.default },
    checkBtn: { width: 40, height: 35, borderRadius: 6, backgroundColor: theme.colors.surface.bg, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
    checkBtnCompleted: { backgroundColor: theme.colors.status.success },
    addSetBtn: { padding: theme.spacing.sm, alignItems: 'center', marginTop: theme.spacing.sm },
    addSetText: { color: theme.colors.text.secondary, fontWeight: 'bold' },
    addExerciseBtn: { backgroundColor: theme.colors.surface.card, margin: theme.spacing.md, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.brand.primary },
    addExerciseText: { color: theme.colors.brand.primary, fontWeight: 'bold', fontSize: 16 },
    restTimerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.brand.primary, padding: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    restTimerText: { color: theme.colors.text.inverse, fontWeight: 'bold', fontSize: 18 }
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
          <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{currentWorkout.name}</Text>
          <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
        </View>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishBtnText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {currentWorkout.exercises.length === 0 ? (
          <View style={{ padding: theme.spacing.lg, alignItems: 'center' }}>
            <Text style={[theme.typography.body, { color: theme.colors.text.secondary, textAlign: 'center' }]}>No exercises have been added yet. Tap below to choose exercises for this workout.</Text>
          </View>
        ) : currentWorkout.exercises.map((exercise, exIndex) => (
          <View key={exIndex} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text.secondary} />
            </View>
            <View style={[styles.setRow, { borderBottomWidth: 1, borderBottomColor: theme.colors.surface.bg }]}>
              <Text style={[styles.setColHeader, { width: 30 }]}>SET</Text>
              <Text style={[styles.setColHeader, { flex: 1 }]}>PREVIOUS</Text>
              <Text style={[styles.setColHeader, { width: 60 }]}>KG</Text>
              <Text style={[styles.setColHeader, { width: 60 }]}>REPS</Text>
              <Text style={[styles.setColHeader, { width: 40, marginLeft: 10 }]}>✓</Text>
            </View>
            
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={[styles.setRow, set.completed && { backgroundColor: theme.colors.surface.bg }]}>
                <Text style={styles.setNum}>{setIndex + 1}</Text>
                <Text style={styles.prevCol}>-</Text>
                <TextInput 
                  style={styles.input} 
                  value={set.weight.toString()} 
                  keyboardType="numeric"
                  onChangeText={(val) => dispatch(updateSet({ exerciseIndex: exIndex, setIndex, updates: { weight: Number(val) } }))}
                />
                <TextInput 
                  style={styles.input} 
                  value={set.reps.toString()} 
                  keyboardType="numeric"
                  onChangeText={(val) => dispatch(updateSet({ exerciseIndex: exIndex, setIndex, updates: { reps: Number(val) } }))}
                />
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
        ))}

        <TouchableOpacity style={styles.addExerciseBtn} onPress={() => navigation.navigate('ExercisePicker')}>
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      {isActive && (
        <View style={styles.restTimerOverlay}>
          <Text style={styles.restTimerText}>Rest: {formatTime(timeRemaining)}</Text>
          <TouchableOpacity onPress={stopTimer}>
            <Ionicons name="play-skip-forward" size={24} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
