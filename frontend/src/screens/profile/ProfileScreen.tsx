import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/ThemeProvider';
import { AppShell } from '../../components/ui/AppShell';

export const ProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <AppShell title="Profile">
      <ScrollView contentContainerStyle={{ gap: theme.spacing.lg }}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.brand.primary }]} />
          <Text style={[theme.typography.h2, { color: theme.colors.text.primary, marginTop: 16 }]}>My Profile</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}>
          <Text style={[theme.typography.h3, { color: theme.colors.text.primary, marginBottom: theme.spacing.md }]}>Account</Text>
          
          <Pressable style={styles.row} onPress={() => navigation.navigate('AITrainer')}>
            <Text style={[theme.typography.body, { color: theme.colors.brand.primary }]}>AI Trainer ✦</Text>
          </Pressable>
          
          <Pressable style={styles.row} onPress={() => navigation.navigate('DataExport')}>
            <Text style={[theme.typography.body, { color: theme.colors.text.primary }]}>Export Data</Text>
          </Pressable>
        </View>

        <Pressable style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]} onPress={() => {}}>
          <Text style={[theme.typography.body, { color: theme.colors.status.error, textAlign: 'center' }]}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingVertical: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#242836' }
});