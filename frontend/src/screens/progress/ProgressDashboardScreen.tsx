import React from 'react';
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
});