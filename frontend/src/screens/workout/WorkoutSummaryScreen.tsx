import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export function WorkoutSummaryScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg },
    content: { padding: theme.spacing.xl, alignItems: 'center' },
    title: { fontFamily: theme.typography.h1.fontFamily, fontSize: 28, color: theme.colors.brand.primary, fontWeight: 'bold', marginTop: theme.spacing.xl, marginBottom: theme.spacing.lg },
    statsRow: { flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.xl, width: '100%', justifyContent: 'space-around' },
    statBox: { alignItems: 'center' },
    statVal: { color: theme.colors.text.primary, fontSize: 24, fontWeight: 'bold' },
    statLabel: { color: theme.colors.text.secondary, fontSize: 12 },
    primaryBtn: { backgroundColor: theme.colors.brand.primary, padding: theme.spacing.lg, borderRadius: theme.borderRadius.md, width: '100%', alignItems: 'center', marginBottom: theme.spacing.md },
    primaryBtnText: { color: theme.colors.text.inverse, fontWeight: 'bold', fontSize: 16 },
    discardText: { color: theme.colors.status.error, padding: theme.spacing.md },
    prBadge: { backgroundColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 10 },
    prText: { color: 'white', fontWeight: 'bold', fontSize: 12 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Ionicons name="trophy" size={80} color={theme.colors.brand.primary} />
        <Text style={styles.title}>Workout Complete!</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>45</Text>
            <Text style={styles.statLabel}>MINUTES</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>3200</Text>
            <Text style={styles.statLabel}>KG VOLUME</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>12</Text>
            <Text style={styles.statLabel}>SETS</Text>
          </View>
        </View>

        <View style={styles.prBadge}>
          <Text style={styles.prText}>★ 1 NEW PERSONAL RECORD</Text>
        </View>

        <View style={{ flex: 1, width: '100%', marginTop: theme.spacing.xl }} />

        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('WorkoutHome')}>
          <Text style={styles.primaryBtnText}>Save Workout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('WorkoutHome')}>
          <Text style={styles.discardText}>Discard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
