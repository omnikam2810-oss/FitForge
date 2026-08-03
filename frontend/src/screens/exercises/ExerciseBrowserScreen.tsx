import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';
import { getExercises } from '../../api/exercises.api';

export const ExerciseBrowserScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getExercises();
        if (isActive) {
          setExercises(data);
        }
      } catch (err) {
        if (isActive) {
          setError('Unable to load exercises right now.');
          setExercises([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadExercises();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredExercises = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return exercises;

    return exercises.filter((item) => {
      const haystack = [
        item.name,
        item.category,
        item.primaryMuscles?.join(' '),
        item.secondaryMuscles?.join(' '),
        item.equipment?.join(' '),
        item.instructions?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [exercises, search]);

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={[styles.row, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}
      onPress={() => navigation.navigate('ExerciseDetail', { id: item.id })}
    >
      <View style={styles.infoContainer}>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>{item.name}</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.text.secondary, marginTop: 4 }]}> 
          {item.primaryMuscles?.[0] ?? 'General'} • {item.equipment?.[0] ?? 'No equipment'}
        </Text>
      </View>
      <View style={styles.badges}>
        <Text style={[theme.typography.caption, styles.badge, { backgroundColor: theme.colors.brand.primary, color: theme.colors.text.inverse }]}>{item.primaryMuscles?.[0] ?? 'General'}</Text>
        <Text style={[theme.typography.caption, styles.badge, { backgroundColor: theme.colors.surface.elevated, color: theme.colors.text.primary }]}>{item.equipment?.[0] ?? 'Bodyweight'}</Text>
      </View>
    </Pressable>
  );

  return (
    <AppShell title="Exercises">
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface.card }]}> 
        <TextInput
          placeholder="Search exercises..."
          placeholderTextColor={theme.colors.text.muted}
          style={[styles.searchInput, theme.typography.body, { color: theme.colors.text.primary }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {loading ? (
        <ActivityIndicator color={theme.colors.brand.primary} style={{ marginTop: theme.spacing.xl }} />
      ) : error ? (
        <Text style={[theme.typography.body, { color: theme.colors.text.secondary, textAlign: 'center', marginTop: theme.spacing.xl }]}>{error}</Text>
      ) : filteredExercises.length === 0 ? (
        <Text style={[theme.typography.body, { color: theme.colors.text.secondary, textAlign: 'center', marginTop: theme.spacing.xl }]}>No results found.</Text>
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ gap: theme.spacing.md }}
        />
      )}
    </AppShell>
  );
};

const styles = StyleSheet.create({
  searchContainer: { padding: 12, borderRadius: 12, marginBottom: 16 },
  searchInput: { padding: 0 },
  row: { padding: 16, borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoContainer: { flex: 1, marginRight: 12 },
  badges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden' }
});