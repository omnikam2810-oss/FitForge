import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoginScreen({ navigation }: NativeStackScreenProps<any>) {
  const { theme } = useTheme();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // Navigation is handled by auth state observer
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
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
      alignItems: 'center',
      marginBottom: theme.spacing['4xl'],
    },
    title: {
      fontFamily: theme.typography.h1.fontFamily,
      fontSize: theme.typography.h1.fontSize,
      color: theme.colors.text.primary,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontFamily: theme.typography.body.fontFamily,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text.secondary,
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
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    passwordInput: {
      flex: 1,
    },
    toggleButton: {
      padding: theme.spacing.md,
    },
    toggleText: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.caption.fontFamily,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: theme.spacing.xs,
    },
    forgotPasswordText: {
      color: theme.colors.brand.primary,
      fontFamily: theme.typography.bodySmall.fontFamily,
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
    errorText: {
      color: theme.colors.status.error,
      fontFamily: theme.typography.caption.fontFamily,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing['4xl'],
    },
    footerText: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.body.fontFamily,
    },
    footerLink: {
      color: theme.colors.brand.primary,
      fontFamily: theme.typography.body.fontFamily,
      fontWeight: 'bold',
      marginLeft: theme.spacing.xs,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing['2xl'],
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border.default,
    },
    dividerText: {
      marginHorizontal: theme.spacing.md,
      color: theme.colors.text.muted,
      fontFamily: theme.typography.caption.fontFamily,
    },
    socialButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    socialButton: {
      flex: 1,
      backgroundColor: theme.colors.surface.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    socialButtonText: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.button.fontFamily,
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
            <Text style={styles.title}>FitForge</Text>
            <Text style={styles.subtitle}>Forge Your Strongest Self</Text>
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

            <View style={[styles.inputContainer, styles.passwordContainer]}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                placeholderTextColor={theme.colors.text.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.toggleButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity 
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.text.inverse} />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
