import React from 'react';
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
});