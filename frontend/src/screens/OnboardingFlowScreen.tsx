import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';
import { setUserProfile } from '../store/slices/userSlice';

const goalOptions = ['Strength', 'Fat loss', 'Endurance', 'General fitness'];
const frequencyOptions = ['2x/week', '3x/week', '4x/week', '5x/week'];

export const OnboardingFlowScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('Strength');
  const [frequency, setFrequency] = useState('3x/week');

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  const handleContinue = () => {
    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }

    dispatch(
      setUserProfile({
        id: 'local-user',
        email: 'demo@fitforge.app',
        firstName: 'Demo',
        lastName: 'Athlete',
        onboardingCompleted: true,
      })
    );
  };

  return (
    <AppShell title="Onboarding" subtitle="Build a plan that fits your goals">
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary }]}>Step {step + 1} of 3</Text>
        <Text style={[theme.typography.h3, { color: theme.colors.brand.primary, marginTop: 6 }]}>Progress {Math.round(progress)}%</Text>
      </View>

      {step === 0 && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Choose your goal</Text>
          {goalOptions.map((option) => (
            <Pressable key={option} onPress={() => setGoal(option)} style={[styles.option, goal === option && styles.optionActive]}>
              <Text style={[theme.typography.body, { color: goal === option ? theme.colors.brand.primary : theme.colors.text.primary }]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {step === 1 && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Workout frequency</Text>
          {frequencyOptions.map((option) => (
            <Pressable key={option} onPress={() => setFrequency(option)} style={[styles.option, frequency === option && styles.optionActive]}>
              <Text style={[theme.typography.body, { color: frequency === option ? theme.colors.brand.primary : theme.colors.text.primary }]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {step === 2 && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Your starter plan</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>We’ll recommend a {goal.toLowerCase()} plan for {frequency}.</Text>
          <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>This is the first MVP step toward adaptive programming.</Text>
        </View>
      )}

      <Pressable onPress={handleContinue} style={[styles.primaryButton, { backgroundColor: theme.colors.brand.primary }]}> 
        <Text style={[theme.typography.button, { color: theme.colors.text.inverse }]}> {step < 2 ? 'Continue' : 'Finish onboarding'} </Text>
      </Pressable>
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
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: 'rgba(108,92,231,0.08)',
  },
  optionActive: {
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
});
