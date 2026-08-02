import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const LeaderboardScreen = () => {
  const { theme } = useTheme();

  return (
    <AppShell title="Leaderboard">
      <ScrollView contentContainerStyle={{ gap: theme.spacing.md }}>
        <View style={styles.tabs}>
          <Text style={[theme.typography.body, { color: theme.colors.brand.primary }]}>Friends</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.secondary }]}>Global</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <View style={styles.row}>
            <Text style={[theme.typography.h3, { color: theme.colors.status.warning }]}>1</Text>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary, flex: 1, marginLeft: 16 }]}>Alex F.</Text>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>15k kg</Text>
          </View>
        </View>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#242836' },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' }
});