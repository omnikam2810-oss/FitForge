import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export function WorkoutDetailScreen({ route, navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const { id } = route.params as { id: string };
  const workout = useSelector((state: RootState) => state.workout.history.find(w => w.id === id));

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    header: { padding: theme.spacing.lg, flexDirection: 'row', alignItems: 'center' },
    title: { color: theme.colors.text.primary, fontSize: 24, fontWeight: 'bold', marginLeft: theme.spacing.md },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: theme.spacing.md, backgroundColor: theme.colors.surface.card, marginHorizontal: theme.spacing.lg, borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.lg },
    statBox: { alignItems: 'center' },
    statVal: { color: theme.colors.text.primary, fontWeight: 'bold', fontSize: 16 },
    statLabel: { color: theme.colors.text.secondary, fontSize: 12 },
    exerciseBlock: { marginHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg },
    exName: { color: theme.colors.brand.primary, fontSize: 16, fontWeight: 'bold', marginBottom: theme.spacing.sm },
    setRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.xs, borderBottomWidth: 1, borderBottomColor: theme.colors.surface.card },
    setText: { color: theme.colors.text.primary }
  });

  if (!workout) return <SafeAreaView style={styles.container}><Text style={{ color: 'white' }}>Workout not found</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{workout.name}</Text>
      </View>
      <ScrollView>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{workout.durationMinutes}m</Text>
            <Text style={styles.statLabel}>DURATION</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{new Date(workout.date).toLocaleDateString()}</Text>
            <Text style={styles.statLabel}>DATE</Text>
          </View>
        </View>

        {workout.exercises.map((ex, i) => (
          <View key={i} style={styles.exerciseBlock}>
            <Text style={styles.exName}>{ex.name}</Text>
            {ex.sets.map((set, si) => (
              <View key={si} style={styles.setRow}>
                <Text style={styles.setText}>Set {si + 1}</Text>
                <Text style={styles.setText}>{set.weight}kg x {set.reps}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
