import fs from 'fs';
import path from 'path';

const outDir = 'c:/Users/Omkar/OneDrive/Desktop/Health/frontend/src';

const files = [
  {
    path: 'screens/exercises/ExerciseBrowserScreen.tsx',
    content: `import React, { useState, useEffect } from 'react';
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
});`
  },
  {
    path: 'screens/exercises/ExerciseDetailScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const ExerciseDetailScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const { id } = route.params || {};

  return (
    <AppShell title="Exercise Details" showBack>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <Text style={[theme.typography.h1, { color: theme.colors.text.primary }]}>Bench Press</Text>
        
        <View style={styles.chipRow}>
          <Text style={[styles.chip, { backgroundColor: theme.colors.brand.primary, color: theme.colors.text.inverse }]}>Chest</Text>
          <Text style={[styles.chip, { backgroundColor: theme.colors.surface.elevated, color: theme.colors.text.primary }]}>Barbell</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Instructions</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>Lie on a flat bench, grip the barbell slightly wider than shoulder-width...</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>History</Text>
          <View style={{ height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface.bg, borderRadius: theme.borderRadius.sm }}>
            <Text style={{ color: theme.colors.text.muted }}>[Chart Placeholder]</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Personal Records</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Best 1RM: 100 kg</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Best Volume: 3,000 kg</Text>
        </View>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, overflow: 'hidden' },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 }
});`
  },
  {
    path: 'screens/workout/RoutineListScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const RoutineListScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <AppShell title="Routines">
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View>
          <Text style={[theme.typography.h2, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>My Routines</Text>
          <Pressable style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Push Day</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>6 exercises • Last used: 2d ago</Text>
          </Pressable>
        </View>

        <View>
          <Text style={[theme.typography.h2, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Templates</Text>
          <Pressable style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Full Body Beginner</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.brand.primary }]}>Beginner</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Pressable 
        style={[styles.fab, { backgroundColor: theme.colors.brand.primary }]}
        onPress={() => navigation.navigate('RoutineBuilder')}
      >
        <Text style={[theme.typography.button, { color: theme.colors.text.inverse }]}>+ New Routine</Text>
      </Pressable>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 4 },
  fab: { position: 'absolute', bottom: 24, right: 24, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, elevation: 4 }
});`
  },
  {
    path: 'screens/workout/RoutineBuilderScreen.tsx',
    content: `import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const RoutineBuilderScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState('');

  return (
    <AppShell title="New Routine" showBack>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.md }}>
        <TextInput
          placeholder="Routine Name"
          placeholderTextColor={theme.colors.text.muted}
          style={[styles.input, theme.typography.body, { backgroundColor: theme.colors.surface.card, color: theme.colors.text.primary, borderColor: theme.colors.border.default }]}
          value={name}
          onChangeText={setName}
        />
        
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary }]}>Exercises (0)</Text>
        
        <Pressable style={[styles.addButton, { borderColor: theme.colors.brand.primary }]}>
          <Text style={[theme.typography.button, { color: theme.colors.brand.primary }]}>+ Add Exercise</Text>
        </Pressable>
      </ScrollView>
      
      <Pressable style={[styles.saveButton, { backgroundColor: theme.colors.brand.primary }]} onPress={() => navigation.goBack()}>
        <Text style={[theme.typography.button, { color: theme.colors.text.inverse, textAlign: 'center' }]}>Save Routine</Text>
      </Pressable>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  input: { padding: 16, borderRadius: 12, borderWidth: 1 },
  addButton: { padding: 16, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center' },
  saveButton: { padding: 16, borderRadius: 12, marginTop: 16 }
});`
  },
  {
    path: 'screens/progress/ProgressDashboardScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const ProgressDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <AppShell title="Progress">
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>Total Workouts</Text>
            <Text style={[theme.typography.h2, { color: theme.colors.text.primary }]}>42</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>Total Volume</Text>
            <Text style={[theme.typography.h2, { color: theme.colors.text.primary }]}>12.4k kg</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Volume Over Time</Text>
          <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.text.muted }}>[Chart Placeholder]</Text>
          </View>
        </View>

        <Pressable 
          style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}
          onPress={() => navigation.navigate('Measurements')}
        >
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary }]}>Body Stats</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.secondary, marginTop: 4 }]}>Latest Weight: 75kg</Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 }
});`
  },
  {
    path: 'screens/progress/ExerciseProgressScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const ExerciseProgressScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const { name = 'Exercise' } = route.params || {};

  return (
    <AppShell title={name} showBack>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Weight Progression</Text>
          <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.text.muted }}>[Line Chart Placeholder]</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Stats Summary</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Best Weight: 100 kg</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Total Sets Logged: 150</Text>
        </View>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1 }
});`
  },
  {
    path: 'screens/progress/MeasurementsScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const MeasurementsScreen = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Body Stats" showBack>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Weight Over Time</Text>
          <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.text.muted }}>[Line Chart Placeholder]</Text>
          </View>
        </View>

        <Pressable style={[styles.button, { backgroundColor: theme.colors.brand.primary }]}>
          <Text style={[theme.typography.button, { color: theme.colors.text.inverse }]}>Log Measurement</Text>
        </Pressable>

        <View>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Recent Measurements</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>75.0 kg</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>Today</Text>
          </View>
        </View>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' }
});`
  },
  {
    path: 'screens/social/ActivityFeedScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const ActivityFeedScreen = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Activity">
      <ScrollView contentContainerStyle={{ gap: theme.spacing.md }}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <View style={styles.header}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Alex F.</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>2h ago</Text>
          </View>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginTop: 8 }]}>Morning Push Day</Text>
          <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 4 }]}>5 exercises • 15 sets • 4,500 kg • 45m</Text>
        </View>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between' }
});`
  },
  {
    path: 'screens/social/LeaderboardScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const LeaderboardScreen = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Leaderboard">
      <ScrollView contentContainerStyle={{ gap: theme.spacing.md }}>
        <View style={styles.tabs}>
          <Text style={[theme.typography.body, { color: theme.colors.brand.primary }]}>Friends</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>Global</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <View style={styles.row}>
            <Text style={[theme.typography.h3, { color: theme.colors.status.warning }]}>1</Text>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary, flex: 1, marginLeft: 16 }]}>Alex F.</Text>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>15k kg</Text>
          </View>
        </View>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#242836' },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' }
});`
  },
  {
    path: 'screens/social/UserProfileScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const UserProfileScreen = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Profile" showBack>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.brand.primary }]} />
          <Text style={[theme.typography.h1, { color: theme.colors.text.primary, marginTop: 16 }]}>Alex F.</Text>
          <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary }]}>Member since 2024</Text>
        </View>

        <Pressable style={[styles.button, { backgroundColor: theme.colors.surface.elevated }]}>
          <Text style={[theme.typography.button, { color: theme.colors.text.primary }]}>Follow</Text>
        </Pressable>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Stats</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Total Workouts: 120</Text>
        </View>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  button: { padding: 12, borderRadius: 12, alignItems: 'center' },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 }
});`
  },
  {
    path: 'screens/profile/ProfileScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const ProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <AppShell title="Profile">
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.brand.primary }]} />
          <Text style={[theme.typography.h2, { color: theme.colors.text.primary, marginTop: 16 }]}>My Profile</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Account</Text>
          
          <Pressable style={styles.row} onPress={() => navigation.navigate('AITrainer')}>
            <Text style={[theme.typography.body, { color: theme.colors.brand.primary }]}>AI Trainer ✦</Text>
          </Pressable>
          
          <Pressable style={styles.row} onPress={() => navigation.navigate('DataExport')}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Export Data</Text>
          </Pressable>
        </View>

        <Pressable style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]} onPress={() => {}}>
          <Text style={[theme.typography.body, { color: theme.colors.status.error, textAlign: 'center' }]}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingVertical: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#242836' }
});`
  },
  {
    path: 'screens/profile/AITrainerScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const AITrainerScreen = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="AI Trainer" showBack>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h2, { color: theme.colors.brand.primary, marginBottom: 8 }]}>Generate Your Plan</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>Let AI build the perfect workout plan tailored to your goals and equipment.</Text>
        </View>

        <Pressable style={[styles.button, { backgroundColor: theme.colors.brand.primary }]}>
          <Text style={[theme.typography.button, { color: theme.colors.text.inverse }]}>Generate Plan</Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center', textAlign: 'center' },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' }
});`
  },
  {
    path: 'screens/profile/DataExportScreen.tsx',
    content: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const DataExportScreen = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Export Data" showBack>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>Download all your workout history, PRs, and measurements.</Text>

        <Pressable style={[styles.button, { backgroundColor: theme.colors.surface.elevated }]}>
          <Text style={[theme.typography.button, { color: theme.colors.text.primary }]}>Download Workout Data (CSV)</Text>
        </Pressable>

        <Pressable style={[styles.button, { backgroundColor: theme.colors.surface.elevated }]}>
          <Text style={[theme.typography.button, { color: theme.colors.text.primary }]}>Download Measurements (JSON)</Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  button: { padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#242836' }
});`
  }
];

files.forEach(f => {
  const fullPath = path.join(outDir, f.path);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, f.content);
});
