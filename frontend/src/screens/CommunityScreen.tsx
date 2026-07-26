import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';

export const CommunityScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Community" subtitle="Stay motivated with others">
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.primary }]}>Coach chat</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>Your coach shared a recovery tip.</Text>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>Stay engaged and keep the momentum going.</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Community pulse</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>12 members are on a streak this week.</Text>
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
