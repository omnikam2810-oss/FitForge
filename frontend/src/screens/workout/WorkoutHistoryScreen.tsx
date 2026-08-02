import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

export function WorkoutHistoryScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const { history } = useSelector((state: RootState) => state.workout);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    header: { padding: theme.spacing.lg },
    title: { fontFamily: theme.typography.h1.fontFamily, fontSize: 24, color: theme.colors.text.primary, fontWeight: 'bold' },
    card: { backgroundColor: theme.colors.surface.card, marginHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.md, padding: theme.spacing.md },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
    name: { color: theme.colors.text.primary, fontSize: 18, fontWeight: 'bold' },
    date: { color: theme.colors.text.secondary, fontSize: 12 },
    stats: { color: theme.colors.text.muted, fontSize: 14, marginBottom: theme.spacing.sm },
    empty: { color: theme.colors.text.muted, textAlign: 'center', marginTop: 40 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>
      <FlatList 
        data={history}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WorkoutDetail', { id: item.id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.stats}>{item.durationMinutes}m • {item.exercises?.length || 0} exercises</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No workouts yet.</Text>}
      />
    </SafeAreaView>
  );
}
