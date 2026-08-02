import React from 'react';
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
});