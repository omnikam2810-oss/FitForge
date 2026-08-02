import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

export function PlateCalculatorScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const [targetWeight, setTargetWeight] = useState('');
  const [barWeight, setBarWeight] = useState(20);
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface.bg, padding: theme.spacing.lg },
    title: { color: theme.colors.text.primary, fontSize: 24, fontWeight: 'bold', marginBottom: theme.spacing.lg },
    inputCard: { backgroundColor: theme.colors.surface.card, padding: theme.spacing.xl, borderRadius: theme.borderRadius.md, alignItems: 'center', marginBottom: theme.spacing.xl },
    label: { color: theme.colors.text.secondary, marginBottom: theme.spacing.sm },
    input: { color: theme.colors.text.primary, fontSize: 40, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: theme.colors.brand.primary, minWidth: 100, textAlign: 'center' },
    barSelector: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.xl, justifyContent: 'center' },
    barBtn: { padding: theme.spacing.md, borderRadius: theme.borderRadius.sm, borderWidth: 1, borderColor: theme.colors.border.default },
    barBtnActive: { backgroundColor: theme.colors.brand.primary, borderColor: theme.colors.brand.primary },
    barText: { color: theme.colors.text.primary },
    resultBox: { alignItems: 'center', marginTop: theme.spacing.xl },
    resultText: { color: theme.colors.text.primary, fontSize: 18 }
  });

  const calculatePlates = () => {
    const target = parseFloat(targetWeight);
    if (isNaN(target) || target <= barWeight) return null;
    const perSide = (target - barWeight) / 2;
    return perSide;
  };

  const perSide = calculatePlates();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Plate Calculator</Text>
      <View style={styles.inputCard}>
        <Text style={styles.label}>TARGET WEIGHT (KG)</Text>
        <TextInput 
          style={styles.input}
          keyboardType="numeric"
          value={targetWeight}
          onChangeText={setTargetWeight}
          placeholder="0"
          placeholderTextColor={theme.colors.text.muted}
        />
      </View>
      <Text style={[styles.label, { textAlign: 'center' }]}>BAR WEIGHT</Text>
      <View style={styles.barSelector}>
        {[10, 15, 20].map(w => (
          <TouchableOpacity 
            key={w} 
            style={[styles.barBtn, barWeight === w && styles.barBtnActive]} 
            onPress={() => setBarWeight(w)}
          >
            <Text style={styles.barText}>{w}kg</Text>
          </TouchableOpacity>
        ))}
      </View>
      {perSide && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Weight per side: {perSide}kg</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
