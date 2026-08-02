import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const ExerciseBrowserScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    // Mock load
    setTimeout(() => {
      setExercises([
        { id: '1', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell' },
        { id: '2', name: 'Squat', muscle: 'Legs', equipment: 'Barbell' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={[styles.row, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}
      onPress={() => navigation.navigate('ExerciseDetail', { id: item.id })}
    >
      <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>{item.name}</Text>
      <View style={styles.badges}>
        <Text style={[theme.typography.caption, styles.badge, { backgroundColor: theme.colors.brand.primary, color: theme.colors.text.inverse }]}>{item.muscle}</Text>
        <Text style={[theme.typography.caption, styles.badge, { backgroundColor: theme.colors.surface.elevated, color: theme.colors.text.primary }]}>{item.equipment}</Text>
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
      ) : exercises.length === 0 ? (
        <Text style={[theme.typography.body, { color: theme.colors.text.secondary, textAlign: 'center', marginTop: theme.spacing.xl }]}>No results found.</Text>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={item => item.id}
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
  badges: { flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden' }
});