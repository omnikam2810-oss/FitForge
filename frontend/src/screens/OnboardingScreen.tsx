import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';

export const OnboardingScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Onboarding" subtitle="Set up your personal fitness profile">
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.primary }]}>Welcome</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>Track your measurements, goals, and preferences.</Text>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>A strong start makes every week easier.</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Suggested next steps</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>{'• Add your goal\n• Log measurements\n• Choose preferred workout style'}</Text>
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
});
