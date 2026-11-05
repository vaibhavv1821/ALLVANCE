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
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { authService } from '@/services/supabase/authService';
import { PrimaryButton } from '@/components';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleResetRequest = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const res = await authService.resetPasswordForEmail(email.trim());
    setIsLoading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg(`We've sent a password reset link to ${email.trim()}. Please check your email inbox.`);
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
              Reset Password
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
              Enter the email address associated with your account and we will send you a password recovery link.
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
          {successMsg && (
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
                {successMsg}
              </Text>
            </View>
          )}

          {/* Input Form */}
          <View style={styles.formSection}>
            <View style={{ marginBottom: spacing.lg }}>
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
                ACCOUNT EMAIL
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

            <PrimaryButton
              title="Send Recovery Link"
              onPress={handleResetRequest}
              loading={isLoading}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginBottom: spacing.md }}
            />

            <PrimaryButton
              title="Back to Sign In"
              onPress={() => router.back()}
              variant="ghost"
              size="md"
              fullWidth
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
    lineHeight: 18,
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
