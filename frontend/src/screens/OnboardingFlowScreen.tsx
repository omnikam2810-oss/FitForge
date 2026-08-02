import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';
import { setUserProfile } from '../store/slices/userSlice';
import { submitOnboarding } from '../api/user.api';

import { setShowOnboarding } from '../store/slices/uiSlice';

const goalOptions = [
  { label: 'Strength', value: 'strength' },
  { label: 'Fat loss', value: 'fat_loss' },
  { label: 'Endurance', value: 'endurance' },
  { label: 'General fitness', value: 'general_fitness' },
];
const experienceOptions = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];
const frequencyOptions = ['2', '3', '4', '5'];
const equipmentOptions = ['Dumbbells', 'Barbell', 'Bodyweight', 'Machine'];

export const OnboardingFlowScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('strength');
  const [experience, setExperience] = useState('beginner');
  const [frequency, setFrequency] = useState('3');
  const [equipment, setEquipment] = useState<string[]>(['Dumbbells']);
  const [loading, setLoading] = useState(false);

  const progress = useMemo(() => ((step + 1) / 4) * 100, [step]);

  const toggleEquipment = (item: string) => {
    setEquipment((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item]
    );
  };

  const handleContinue = async () => {
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    setLoading(true);
    try {
      const response = await submitOnboarding({
        goals: [goal],
        experienceLevel: experience,
        availableEquipment: equipment,
        injuries: [],
        weeklyFrequency: parseInt(frequency, 10),
      });

      dispatch(
        setUserProfile({
          id: response.user._id ?? response.user.id ?? 'me',
          email: response.user.email,
          firstName: response.user.displayName ?? '',
          lastName: '',
          onboardingCompleted: true,
        })
      );

      dispatch(setShowOnboarding(false));
    } catch (err: any) {
      Alert.alert('Onboarding failed', err?.message ?? 'Unable to complete onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Onboarding" subtitle="Build a plan that fits your goals">
      <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
        <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary }]}>Step {step + 1} of 4</Text>
        <Text style={[theme.typography.h3, { color: theme.colors.brand.primary, marginTop: 6 }]}>Progress {Math.round(progress)}%</Text>
      </View>

      {step === 0 && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Choose your goal</Text>
          {goalOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setGoal(option.value)}
              style={[styles.option, goal === option.value && styles.optionActive]}
            >
              <Text style={[theme.typography.body, { color: goal === option.value ? theme.colors.brand.primary : theme.colors.text.primary }]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {step === 1 && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Experience level</Text>
          {experienceOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setExperience(option.value)}
              style={[styles.option, experience === option.value && styles.optionActive]}
            >
              <Text style={[theme.typography.body, { color: experience === option.value ? theme.colors.brand.primary : theme.colors.text.primary }]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {step === 2 && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Weekly frequency</Text>
          {frequencyOptions.map((option) => (
            <Pressable
              key={option}
              onPress={() => setFrequency(option)}
              style={[styles.option, frequency === option && styles.optionActive]}
            >
              <Text style={[theme.typography.body, { color: frequency === option ? theme.colors.brand.primary : theme.colors.text.primary }]}>{option}x/week</Text>
            </Pressable>
          ))}
        </View>
      )}

      {step === 3 && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>Available equipment</Text>
          {equipmentOptions.map((option) => (
            <Pressable
              key={option}
              onPress={() => toggleEquipment(option)}
              style={[styles.option, equipment.includes(option) && styles.optionActive]}
            >
              <Text style={[theme.typography.body, { color: equipment.includes(option) ? theme.colors.brand.primary : theme.colors.text.primary }]}>{option}</Text>
            </Pressable>
          ))}
          <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 12 }]}>We use this to recommend plans that fit your setup.</Text>
        </View>
      )}

      <Pressable onPress={handleContinue} style={[styles.primaryButton, { backgroundColor: theme.colors.brand.primary }]}> 
        {loading ? (
          <ActivityIndicator color={theme.colors.text.inverse} />
        ) : (
          <Text style={[theme.typography.button, { color: theme.colors.text.inverse }]}> {step < 3 ? 'Continue' : 'Finish onboarding'} </Text>
        )}
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
