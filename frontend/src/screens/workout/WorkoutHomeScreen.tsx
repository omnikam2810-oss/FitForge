import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchWorkouts, fetchRepeatLast, startWorkout } from '../../store/slices/workoutSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export function WorkoutHomeScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { currentWorkout, history, loading } = useSelector((state: RootState) => state.workout);
  const [showMyRoutines, setShowMyRoutines] = useState(true);
  const [savedRoutines] = useState([
    // Keep this empty by default; real routines should come from persisted state or backend.
    // Example routine data can be added here once routine management is wired.
  ]);

  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  const handleStartEmpty = () => {
    dispatch(startWorkout({
      id: Date.now().toString(),
      name: 'Evening Workout',
      date: new Date().toISOString(),
      exercises: [],
      durationMinutes: 0,
      completed: false
    }));
    navigation.navigate('ActiveWorkout');
  };

  const handleStartRoutine = (routine: any) => {
    dispatch(startWorkout({
      id: Date.now().toString(),
      name: routine.name,
      date: new Date().toISOString(),
      exercises: routine.exercises.map((exercise: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        exerciseId: exercise.id,
        name: exercise.name,
        notes: '',
        restSeconds: 0,
        sets: [{ id: `${Date.now()}-${index}-0`, reps: 0, weight: 0, completed: false, type: 'normal' }]
      })),
      durationMinutes: 0,
      completed: false
    }));
    navigation.navigate('ActiveWorkout');
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    header: { padding: theme.spacing.lg },
    title: { fontFamily: theme.typography.h1.fontFamily, fontSize: theme.typography.h1.fontSize, color: theme.colors.text.primary, fontWeight: 'bold' },
    content: { paddingHorizontal: theme.spacing.lg },
    sectionTitle: { fontFamily: theme.typography.h3.fontFamily, fontSize: theme.typography.h3.fontSize, color: theme.colors.text.primary, fontWeight: 'bold', marginVertical: theme.spacing.md },
    startButton: { backgroundColor: theme.colors.surface.card, borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border.default, paddingVertical: theme.spacing.lg, alignItems: 'center', marginBottom: theme.spacing.lg },
    startButtonText: { color: theme.colors.brand.primary, fontFamily: theme.typography.button.fontFamily, fontSize: theme.typography.button.fontSize, fontWeight: 'bold' },
    routinesRow: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.xl },
    routineActionCard: { flex: 1, backgroundColor: theme.colors.surface.card, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border.default, alignItems: 'center', justifyContent: 'center' },
    routineActionLabel: { color: theme.colors.text.primary, marginTop: theme.spacing.sm, fontFamily: theme.typography.body.fontFamily, textAlign: 'center' },
    routineSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md },
    routineSectionTitle: { fontFamily: theme.typography.h4.fontFamily, fontSize: theme.typography.h4.fontSize, color: theme.colors.text.primary, fontWeight: 'bold' },
    routineCard: { backgroundColor: theme.colors.surface.card, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border.default, marginBottom: theme.spacing.md },
    routineCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.sm },
    routineCardTitle: { color: theme.colors.text.primary, fontFamily: theme.typography.body.fontFamily, fontWeight: 'bold', fontSize: 16, flex: 1 },
    routinePreview: { color: theme.colors.text.secondary, marginTop: theme.spacing.xs, fontFamily: theme.typography.caption.fontFamily },
    routineStartButton: { marginTop: theme.spacing.md, backgroundColor: theme.colors.brand.primary, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.sm, alignItems: 'center' },
    routineStartButtonText: { color: theme.colors.text.inverse, fontFamily: theme.typography.button.fontFamily, fontWeight: 'bold' },
    historyCard: { backgroundColor: theme.colors.surface.card, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border.default },
    historyTitle: { color: theme.colors.text.primary, fontFamily: theme.typography.body.fontFamily, fontWeight: 'bold', fontSize: 16 },
    historyDate: { color: theme.colors.text.secondary, fontFamily: theme.typography.caption.fontFamily },
    historyStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.sm },
    historyStatText: { color: theme.colors.text.muted, fontFamily: theme.typography.caption.fontFamily },
    resumeCard: { backgroundColor: theme.colors.brand.primary, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md },
    resumeTitle: { color: theme.colors.text.inverse, fontFamily: theme.typography.h3.fontFamily, fontWeight: 'bold' },
    resumeText: { color: theme.colors.text.inverse, fontFamily: theme.typography.body.fontFamily, opacity: 0.9 },
  });

  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.historyCard} onPress={() => navigation.navigate('WorkoutDetail', { id: item.id })}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.historyTitle}>{item.name}</Text>
        <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.historyStats}>
        <Text style={styles.historyStatText}>{item.exercises?.length || 0} exercises</Text>
        <Text style={styles.historyStatText}>{item.durationMinutes || 0} mins</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRoutine = (routine: any) => (
    <View key={routine.id} style={styles.routineCard}>
      <View style={styles.routineCardHeader}>
        <Text style={styles.routineCardTitle}>{routine.name}</Text>
        <TouchableOpacity onPress={() => { /* overflow menu placeholder */ }}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>
      <Text numberOfLines={1} style={styles.routinePreview}>{routine.exercises.map((ex: any) => ex.name).join(', ')}</Text>
      <TouchableOpacity style={styles.routineStartButton} onPress={() => handleStartRoutine(routine)}>
        <Text style={styles.routineStartButtonText}>Start Routine</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={history.slice(0, 5)}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => dispatch(fetchWorkouts())} tintColor={theme.colors.brand.primary} />}
        ListHeaderComponent={() => (
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Workout</Text>
            </View>

            {currentWorkout && (
              <TouchableOpacity style={styles.resumeCard} onPress={() => navigation.navigate('ActiveWorkout')}>
                <Text style={styles.resumeTitle}>Resume Workout</Text>
                <Text style={styles.resumeText}>{currentWorkout.name}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.startButton} onPress={handleStartEmpty}>
              <Text style={styles.startButtonText}>+ Start Empty Workout</Text>
            </TouchableOpacity>

            {savedRoutines.length > 0 && (
              <View style={styles.routineSectionHeader}>
                <Text style={styles.routineSectionTitle}>My Routines</Text>
                <TouchableOpacity onPress={() => setShowMyRoutines((prev) => !prev)}>
                  <Ionicons name={showMyRoutines ? 'chevron-up' : 'chevron-down'} size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.sectionTitle}>Routines</Text>
            <View style={styles.routinesRow}>
              <TouchableOpacity style={styles.routineActionCard} onPress={() => navigation.navigate('RoutineBuilder')}>
                <Ionicons name="clipboard" size={28} color={theme.colors.brand.primary} />
                <Text style={styles.routineActionLabel}>New Routine</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.routineActionCard} onPress={() => navigation.navigate('RoutineList')}>
                <Ionicons name="search" size={28} color={theme.colors.brand.primary} />
                <Text style={styles.routineActionLabel}>Explore Routines</Text>
              </TouchableOpacity>
            </View>

            {showMyRoutines && savedRoutines.length > 0 && (
              <View>{savedRoutines.map(renderRoutine)}</View>
            )}

            <Text style={styles.sectionTitle}>Recent Workouts</Text>
          </View>
        )}
        renderItem={renderHistoryItem}
        ListEmptyComponent={
          !loading ? <Text style={{ color: theme.colors.text.muted, textAlign: 'center', marginTop: theme.spacing.xl }}>No recent workouts found.</Text> : null
        }
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      />
    </SafeAreaView>
  );
}
