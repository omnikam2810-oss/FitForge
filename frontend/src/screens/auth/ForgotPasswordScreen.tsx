import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ForgotPasswordScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    if (!email) return;
    setSuccess(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface.bg,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: theme.spacing['3xl'],
      justifyContent: 'center',
    },
    header: {
      marginBottom: theme.spacing['4xl'],
    },
    title: {
      fontFamily: theme.typography.h2.fontFamily,
      fontSize: theme.typography.h2.fontSize,
      color: theme.colors.text.primary,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    form: {
      gap: theme.spacing.lg,
    },
    inputContainer: {
      backgroundColor: theme.colors.surface.card,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      overflow: 'hidden',
    },
    input: {
      padding: theme.spacing.lg,
      color: theme.colors.text.primary,
      fontFamily: theme.typography.body.fontFamily,
      fontSize: theme.typography.body.fontSize,
    },
    button: {
      backgroundColor: theme.colors.brand.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.xl,
    },
    buttonText: {
      color: theme.colors.text.inverse,
      fontFamily: theme.typography.button.fontFamily,
      fontSize: theme.typography.button.fontSize,
      fontWeight: 'bold',
    },
    successText: {
      color: theme.colors.status.success,
      fontFamily: theme.typography.body.fontFamily,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
    },
    footer: {
      alignItems: 'center',
      marginTop: theme.spacing['4xl'],
    },
    footerLink: {
      color: theme.colors.brand.primary,
      fontFamily: theme.typography.body.fontFamily,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.text.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {success && <Text style={styles.successText}>Check your email for reset instructions</Text>}

            <TouchableOpacity 
              style={styles.button}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Back to Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
