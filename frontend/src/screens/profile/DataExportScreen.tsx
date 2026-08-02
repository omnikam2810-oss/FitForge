import React from 'react';
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
});