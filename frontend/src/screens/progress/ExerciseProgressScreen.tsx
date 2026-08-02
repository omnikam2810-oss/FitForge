import React from 'react';
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
});