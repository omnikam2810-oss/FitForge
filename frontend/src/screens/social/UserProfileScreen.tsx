import React from 'react';
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
});