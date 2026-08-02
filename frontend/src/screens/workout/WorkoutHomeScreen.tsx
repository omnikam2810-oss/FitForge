import React, { useEffect } from 'react';
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

  const handleRepeatLast = () => {
    dispatch(fetchRepeatLast()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigation.navigate('ActiveWorkout');
      }
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    header: { padding: theme.spacing.lg },
    title: { fontFamily: theme.typography.h1.fontFamily, fontSize: theme.typography.h1.fontSize, color: theme.colors.text.primary, fontWeight: 'bold' },
    content: { paddingHorizontal: theme.spacing.lg },
    sectionTitle: { fontFamily: theme.typography.h3.fontFamily, fontSize: theme.typography.h3.fontSize, color: theme.colors.text.primary, fontWeight: 'bold', marginVertical: theme.spacing.md },
    primaryBtn: { backgroundColor: theme.colors.brand.primary, padding: theme.spacing.lg, borderRadius: theme.borderRadius.md, alignItems: 'center', marginVertical: theme.spacing.lg },
    primaryBtnText: { color: theme.colors.text.inverse, fontFamily: theme.typography.button.fontFamily, fontSize: theme.typography.button.fontSize, fontWeight: 'bold' },
    quickStartRow: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.xl },
    quickStartCard: { flex: 1, backgroundColor: theme.colors.surface.card, padding: theme.spacing.md, borderRadius: theme.borderRadius.md, borderWidth: 1, borderColor: theme.colors.border.default, alignItems: 'center' },
    quickStartText: { color: theme.colors.text.primary, fontFamily: theme.typography.body.fontFamily, marginTop: theme.spacing.xs, textAlign: 'center' },
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

            <TouchableOpacity style={styles.primaryBtn} onPress={handleStartEmpty}>
              <Text style={styles.primaryBtnText}>Start Empty Workout</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Quick Start</Text>
            <View style={styles.quickStartRow}>
              <TouchableOpacity style={styles.quickStartCard} onPress={handleRepeatLast}>
                <Ionicons name="repeat" size={24} color={theme.colors.brand.primary} />
                <Text style={styles.quickStartText}>Repeat Last Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickStartCard} onPress={() => navigation.navigate('RoutineList')}>
                <Ionicons name="list" size={24} color={theme.colors.brand.primary} />
                <Text style={styles.quickStartText}>Start from Routine</Text>
              </TouchableOpacity>
            </View>

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
