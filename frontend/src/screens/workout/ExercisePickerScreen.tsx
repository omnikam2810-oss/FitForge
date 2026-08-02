import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useDispatch } from 'react-redux';
import { addExercise } from '../../store/slices/workoutSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data since we need immediate results
const MOCK_EXERCISES = [
  { id: '1', name: 'Bench Press (Barbell)', muscle: 'Chest', equipment: 'Barbell' },
  { id: '2', name: 'Squat (Barbell)', muscle: 'Legs', equipment: 'Barbell' },
  { id: '3', name: 'Deadlift (Barbell)', muscle: 'Back', equipment: 'Barbell' },
  { id: '4', name: 'Pull Up', muscle: 'Back', equipment: 'Bodyweight' },
  { id: '5', name: 'Dumbbell Curl', muscle: 'Arms', equipment: 'Dumbbell' },
];

const MUSCLE_FILTERS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio'];

export function ExercisePickerScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [activeMuscle, setActiveMuscle] = useState('All');

  const filtered = MOCK_EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = activeMuscle === 'All' || ex.muscle === activeMuscle;
    return matchesSearch && matchesMuscle;
  });

  const handleSelect = (ex: any) => {
    dispatch(addExercise({
      id: Date.now().toString(),
      exerciseId: ex.id,
      name: ex.name,
      restSeconds: 90,
      sets: [{ id: Date.now().toString(), reps: 0, weight: 0, completed: false, type: 'normal' }]
    }));
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    header: { padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border.default },
    searchBox: { flexDirection: 'row', backgroundColor: theme.colors.surface.card, padding: theme.spacing.sm, borderRadius: theme.borderRadius.md, alignItems: 'center' },
    input: { flex: 1, color: theme.colors.text.primary, marginLeft: theme.spacing.sm },
    filters: { paddingVertical: theme.spacing.sm },
    chip: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, borderRadius: 20, backgroundColor: theme.colors.surface.card, marginRight: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border.default },
    chipActive: { backgroundColor: theme.colors.brand.primary, borderColor: theme.colors.brand.primary },
    chipText: { color: theme.colors.text.primary },
    chipTextActive: { color: theme.colors.text.inverse, fontWeight: 'bold' },
    exRow: { padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.surface.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    exName: { color: theme.colors.text.primary, fontSize: 16, fontWeight: 'bold' },
    exTags: { color: theme.colors.text.secondary, fontSize: 12, marginTop: 4 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={theme.colors.text.muted} />
          <TextInput 
            style={styles.input} 
            placeholder="Search exercises..." 
            placeholderTextColor={theme.colors.text.muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.filters}>
          <FlatList 
            horizontal 
            showsHorizontalScrollIndicator={false}
            data={MUSCLE_FILTERS}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity 
                style={[styles.chip, activeMuscle === item && styles.chipActive]} 
                onPress={() => setActiveMuscle(item)}
              >
                <Text style={[styles.chipText, activeMuscle === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <FlatList 
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.exRow} onPress={() => handleSelect(item)}>
            <View>
              <Text style={styles.exName}>{item.name}</Text>
              <Text style={styles.exTags}>{item.muscle} • {item.equipment}</Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color={theme.colors.brand.primary} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
