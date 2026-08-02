import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const RoutineListScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <AppShell title="Routines">
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View>
          <Text style={[theme.typography.h2, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>My Routines</Text>
          <Pressable style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Push Day</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.text.secondary }]}>6 exercises • Last used: 2d ago</Text>
          </Pressable>
        </View>

        <View>
          <Text style={[theme.typography.h2, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Templates</Text>
          <Pressable style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Full Body Beginner</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.brand.primary }]}>Beginner</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Pressable 
        style={[styles.fab, { backgroundColor: theme.colors.brand.primary }]}
        onPress={() => navigation.navigate('RoutineBuilder')}
      >
        <Text style={[theme.typography.button, { color: theme.colors.text.inverse }]}>+ New Routine</Text>
      </Pressable>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 4 },
  fab: { position: 'absolute', bottom: 24, right: 24, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, elevation: 4 }
});