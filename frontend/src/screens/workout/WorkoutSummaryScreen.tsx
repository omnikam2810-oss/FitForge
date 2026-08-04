import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export function WorkoutSummaryScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const lastWorkout = useSelector((state: RootState) => state.workout.lastCompletedWorkout);

  const stats = lastWorkout ? {
    totalMinutes: lastWorkout.durationMinutes ?? 0,
    totalVolume: lastWorkout.exercises.reduce(
      (sum, ex) =>
        sum +
        ex.sets.reduce(
          (setSum, set) =>
            setSum +
            ((set.completed && set.weight && set.reps) ? set.weight * set.reps : 0),
          0
        ),
      0
    ),
    totalSets: lastWorkout.exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((set) => set.completed).length,
      0
    ),
  } : { totalMinutes: 0, totalVolume: 0, totalSets: 0 };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    content: { padding: theme.spacing.xl, alignItems: 'center' },
    title: { fontFamily: theme.typography.h1.fontFamily, fontSize: 28, color: theme.colors.brand.primary, fontWeight: 'bold', marginTop: theme.spacing.xl, marginBottom: theme.spacing.lg },
    statsRow: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.xl, width: '100%', justifyContent: 'space-around' },
    statBox: { alignItems: 'center' },
    statVal: { color: theme.colors.text.primary, fontSize: 24, fontWeight: 'bold' },
    statLabel: { color: theme.colors.text.secondary, fontSize: 12 },
    primaryBtn: { backgroundColor: theme.colors.brand.primary, padding: theme.spacing.lg, borderRadius: theme.borderRadius.md, width: '100%', alignItems: 'center', marginBottom: theme.spacing.md },
    primaryBtnText: { color: theme.colors.text.inverse, fontWeight: 'bold', fontSize: 16 },
    discardText: { color: theme.colors.status.error, padding: theme.spacing.md },
    prBadge: { backgroundColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 10 },
    prText: { color: 'white', fontWeight: 'bold', fontSize: 12 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Ionicons name="trophy" size={80} color={theme.colors.brand.primary} />
        <Text style={styles.title}>{lastWorkout ? 'Workout Complete!' : 'No Workout Summary'}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{stats.totalMinutes}</Text>
            <Text style={styles.statLabel}>MINUTES</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{stats.totalVolume}</Text>
            <Text style={styles.statLabel}>KG VOLUME</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{stats.totalSets}</Text>
            <Text style={styles.statLabel}>SETS</Text>
          </View>
        </View>

        {lastWorkout && (
          <View style={styles.prBadge}>
            <Text style={styles.prText}>★ {stats.totalSets > 0 ? 'Keep up the progress!' : 'No completed sets yet.'}</Text>
          </View>
        )}

        <View style={{ flex: 1, width: '100%', marginTop: theme.spacing.xl }} />

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('WorkoutHome')}>
          <Text style={styles.primaryBtnText}>{lastWorkout ? 'Save Workout' : 'Back to Home'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('WorkoutHome')}>
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
