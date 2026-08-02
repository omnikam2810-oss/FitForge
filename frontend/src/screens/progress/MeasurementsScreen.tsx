import React from 'react';
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
});