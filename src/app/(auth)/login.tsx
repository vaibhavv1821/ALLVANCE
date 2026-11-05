import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { PrimaryButton } from '@/components';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();
  const { signIn, continueAsGuest, isLoading, authError, clearAuthError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    clearAuthError();

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    const res = await signIn(email.trim(), password);
    if (res.success) {
      router.replace('/(tabs)');
    } else {
      setLocalError(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    router.replace('/(tabs)');
  };

  const errorMessage = localError || authError;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              style={[
                styles.backBtn,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <ArrowLeft size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Heading */}
          <View style={[styles.headerSection, { marginTop: spacing.lg, marginBottom: spacing.xl }]}>
            <View
              style={[
                styles.logoSmall,
                {
                  backgroundColor: colors.primaryMuted,
                  borderColor: colors.primary,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <Sparkles size={22} color={colors.primary} />
            </View>

            <Text
              style={[
                styles.title,
                {
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.xxl,
                  fontWeight: typography.fontWeights.bold,
                },
              ]}
            >
              Welcome Back
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.sm,
                  marginTop: spacing.xs,
                },
              ]}
            >
              Sign in to sync cloud backups across your devices.
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <View
              style={[
                styles.errorBanner,
                {
                  backgroundColor: colors.dangerMuted,
                  borderColor: colors.danger,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              <AlertCircle size={18} color={colors.danger} style={{ marginRight: 8 }} />
              <Text style={[styles.errorText, { color: colors.danger, fontSize: typography.fontSizes.xs }]}>
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formSection}>
            {/* Email Field */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                    fontWeight: typography.fontWeights.semiBold,
                    marginBottom: spacing.xs,
                  },
                ]}
              >
                EMAIL ADDRESS
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    paddingHorizontal: spacing.md,
                  },
                ]}
              >
                <Mail size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[
                    styles.input,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.sm,
                      paddingVertical: spacing.md,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={{ marginBottom: spacing.sm }}>
              <View style={styles.passwordLabelRow}>
                <Text
                  style={[
                    styles.fieldLabel,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.fontSizes.xs,
                      fontWeight: typography.fontWeights.semiBold,
                    },
                  ]}
                >
                  PASSWORD
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/forgot-password' as any)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.forgotLink,
                      {
                        color: colors.primary,
                        fontSize: typography.fontSizes.xs,
                        fontWeight: typography.fontWeights.medium,
                      },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    paddingHorizontal: spacing.md,
                    marginTop: spacing.xs,
                  },
                ]}
              >
                <Lock size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.sm,
                      paddingVertical: spacing.md,
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={colors.textSecondary} />
                  ) : (
                    <Eye size={18} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me Checkbox */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setRememberMe(!rememberMe)}
              style={[styles.rememberRow, { marginVertical: spacing.md }]}
            >
              {rememberMe ? (
                <CheckSquare size={18} color={colors.primary} style={{ marginRight: 8 }} />
              ) : (
                <Square size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
              )}
              <Text
                style={[
                  styles.rememberText,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                  },
                ]}
              >
                Stay signed in on this device
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <PrimaryButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}
            />
          </View>

          {/* Footer Links */}
          <View style={styles.footerSection}>
            <View style={styles.switchAuthRow}>
              <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.sm }}>
                Don&apos;t have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: typography.fontSizes.sm,
                    fontWeight: typography.fontWeights.bold,
                  }}
                >
                  Create one
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleGuest}
              style={{ marginTop: spacing.lg, padding: spacing.xs }}
            >
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: typography.fontSizes.xs,
                  textAlign: 'center',
                }}
              >
                Skip and continue as Guest
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerSection: {},
  logoSmall: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {},
  subtitle: {
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
  },
  formSection: {},
  fieldLabel: {
    letterSpacing: 0.8,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {},
  footerSection: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 16,
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
