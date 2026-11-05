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
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  CheckSquare,
  Square,
  CheckCircle2,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { PrimaryButton, ConfirmationDialog } from '@/components';

export default function SignUpScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();
  const { signUp, continueAsGuest, isLoading, authError, clearAuthError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Email verification dialog
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);

  const handleSignUp = async () => {
    setLocalError(null);
    clearAuthError();

    if (!fullName.trim() || fullName.trim().length < 2) {
      setLocalError('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!acceptTerms) {
      setLocalError('Please accept the privacy terms to continue.');
      return;
    }

    const res = await signUp(email.trim(), password, fullName.trim());

    if (res.success) {
      if (res.needsVerification) {
        setVerificationModalVisible(true);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setLocalError(res.error || 'Failed to create account.');
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
          <View style={[styles.headerSection, { marginTop: spacing.md, marginBottom: spacing.lg }]}>
            <View
              style={[
                styles.logoSmall,
                {
                  backgroundColor: colors.primaryMuted,
                  borderColor: colors.primary,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.sm,
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
              Create Account
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.sm,
                  marginTop: spacing.xxs,
                },
              ]}
            >
              Join ALLVANCE to unlock encrypted cloud backups.
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
                  marginBottom: spacing.md,
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
            {/* Full Name */}
            <View style={{ marginBottom: spacing.sm + 4 }}>
              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                    fontWeight: typography.fontWeights.semiBold,
                    marginBottom: 4,
                  },
                ]}
              >
                FULL NAME
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
                <User size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Vaibhav Sharma"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="words"
                  style={[
                    styles.input,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.sm,
                      paddingVertical: spacing.sm + 4,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={{ marginBottom: spacing.sm + 4 }}>
              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                    fontWeight: typography.fontWeights.semiBold,
                    marginBottom: 4,
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
                      paddingVertical: spacing.sm + 4,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Password */}
            <View style={{ marginBottom: spacing.sm + 4 }}>
              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                    fontWeight: typography.fontWeights.semiBold,
                    marginBottom: 4,
                  },
                ]}
              >
                PASSWORD
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
                <Lock size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.sm,
                      paddingVertical: spacing.sm + 4,
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

            {/* Confirm Password */}
            <View style={{ marginBottom: spacing.md }}>
              <Text
                style={[
                  styles.fieldLabel,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                    fontWeight: typography.fontWeights.semiBold,
                    marginBottom: 4,
                  },
                ]}
              >
                CONFIRM PASSWORD
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
                <Lock size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.sm,
                      paddingVertical: spacing.sm + 4,
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} color={colors.textSecondary} />
                  ) : (
                    <Eye size={18} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Privacy Checkbox */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setAcceptTerms(!acceptTerms)}
              style={[styles.termsRow, { marginBottom: spacing.lg }]}
            >
              {acceptTerms ? (
                <CheckSquare size={18} color={colors.primary} style={{ marginRight: 8 }} />
              ) : (
                <Square size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
              )}
              <Text
                style={[
                  styles.termsText,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                    flex: 1,
                    lineHeight: 16,
                  },
                ]}
              >
                I agree to private offline-first usage and encrypting my backups in Supabase.
              </Text>
            </TouchableOpacity>

            {/* Create Account Button */}
            <PrimaryButton
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginBottom: spacing.md }}
            />
          </View>

          {/* Footer Links */}
          <View style={styles.footerSection}>
            <View style={styles.switchAuthRow}>
              <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.sm }}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: typography.fontSizes.sm,
                    fontWeight: typography.fontWeights.bold,
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleGuest}
              style={{ marginTop: spacing.md, padding: spacing.xs }}
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

      {/* Email Verification Dialog */}
      <ConfirmationDialog
        visible={verificationModalVisible}
        title="Check Your Email"
        message={`We've sent a verification link to ${email}. Please check your inbox and confirm your email address to complete registration.`}
        confirmText="Go to Sign In"
        cancelText="Close"
        onConfirm={() => {
          setVerificationModalVisible(false);
          router.replace('/(auth)/login' as any);
        }}
        onCancel={() => {
          setVerificationModalVisible(false);
          router.replace('/(auth)/login' as any);
        }}
      />
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
  subtitle: {},
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termsText: {},
  footerSection: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchAuthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
