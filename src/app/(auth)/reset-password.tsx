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
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { authService } from '@/services/supabase/authService';
import { PrimaryButton } from '@/components';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async () => {
    setErrorMsg(null);

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await authService.updatePassword(password);
    setIsLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.replace('/(auth)/login' as any);
      }, 2000);
    }
  };

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
          <View style={[styles.headerSection, { marginTop: spacing.xl, marginBottom: spacing.xl }]}>
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor: colors.primaryMuted,
                  borderColor: colors.primary,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.md,
                },
              ]}
            >
              <KeyRound size={24} color={colors.primary} />
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
              Create New Password
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.sm,
                  marginTop: spacing.xs,
                  lineHeight: 20,
                },
              ]}
            >
              Please enter your new password below to secure your ALLVANCE account.
            </Text>
          </View>

          {/* Error Banner */}
          {errorMsg && (
            <View
              style={[
                styles.banner,
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
              <Text style={[styles.bannerText, { color: colors.danger, fontSize: typography.fontSizes.xs }]}>
                {errorMsg}
              </Text>
            </View>
          )}

          {/* Success Banner */}
          {success && (
            <View
              style={[
                styles.banner,
                {
                  backgroundColor: colors.successMuted,
                  borderColor: colors.success,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              <CheckCircle2 size={18} color={colors.success} style={{ marginRight: 8 }} />
              <Text style={[styles.bannerText, { color: colors.success, fontSize: typography.fontSizes.xs }]}>
                Password updated successfully! Redirecting to login...
              </Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.formSection}>
            {/* New Password */}
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
                NEW PASSWORD
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

            {/* Confirm New Password */}
            <View style={{ marginBottom: spacing.xl }}>
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
                CONFIRM NEW PASSWORD
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
                  placeholder="Re-enter new password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showConfirmPassword}
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

            <PrimaryButton
              title="Update Password"
              onPress={handleUpdatePassword}
              loading={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginBottom: spacing.md }}
            />
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
  iconBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: {},
  subtitle: {},
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  bannerText: {
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
});
