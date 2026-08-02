import React from 'react';
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
});