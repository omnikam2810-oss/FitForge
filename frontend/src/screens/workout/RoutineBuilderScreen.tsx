import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const RoutineBuilderScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState('');

  return (
    <AppShell title="New Routine" showBack>
      <ScrollView contentContainerStyle={{ gap: theme.spacing.md }}>
        <TextInput
          placeholder="Routine Name"
          placeholderTextColor={theme.colors.text.muted}
          style={[styles.input, theme.typography.body, { backgroundColor: theme.colors.surface.card, color: theme.colors.text.primary, borderColor: theme.colors.border.default }]}
          value={name}
          onChangeText={setName}
        />
        
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary }]}>Exercises (0)</Text>
        
        <Pressable style={[styles.addButton, { borderColor: theme.colors.brand.primary }]}>
          <Text style={[theme.typography.button, { color: theme.colors.brand.primary }]}>+ Add Exercise</Text>
        </Pressable>
      </ScrollView>
      
      <Pressable style={[styles.saveButton, { backgroundColor: theme.colors.brand.primary }]} onPress={() => navigation.goBack()}>
        <Text style={[theme.typography.button, { color: theme.colors.text.inverse, textAlign: 'center' }]}>Save Routine</Text>
      </Pressable>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  input: { padding: 16, borderRadius: 12, borderWidth: 1 },
  addButton: { padding: 16, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center' },
  saveButton: { padding: 16, borderRadius: 12, marginTop: 16 }
});