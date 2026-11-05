import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Sparkles,
  ShieldCheck,
  Briefcase,
  Code2,
  FileText,
  MessagesSquare,
  ArrowRight,
  UserCheck,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { PrimaryButton } from '@/components';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();
  const { continueAsGuest } = useAuthStore();

  const handleGuest = () => {
    continueAsGuest();
    router.replace('/(tabs)');
  };

  const features = [
    {
      icon: <Briefcase size={20} color="#38BDF8" />,
      title: 'Placement Pipeline',
      desc: 'Track campus drives, hiring rounds, package CTC & offers.',
    },
    {
      icon: <Code2 size={20} color="#10B981" />,
      title: 'DSA Mastery',
      desc: 'Blind 75 & NeetCode tracking, spaced revisions & patterns.',
    },
    {
      icon: <FileText size={20} color="#818CF8" />,
      title: 'ATS Resume Builder',
      desc: 'Role-tailored single-page resumes with instant exports.',
    },
    {
      icon: <MessagesSquare size={20} color="#EC4899" />,
      title: 'Interview Preparation',
      desc: 'Technical questions, behavioral STAR responses & mock sessions.',
    },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right', 'bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View
            style={[
              styles.logoBadge,
              {
                backgroundColor: colors.primaryMuted,
                borderColor: colors.primary,
                borderRadius: borderRadius.xl,
              },
            ]}
          >
            <Sparkles size={36} color={colors.primary} />
          </View>

          <Text
            style={[
              styles.appName,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.display,
                fontWeight: typography.fontWeights.extraBold,
                marginTop: spacing.md,
              },
            ]}
          >
            ALLVANCE
          </Text>

          <Text
            style={[
              styles.tagline,
              {
                color: colors.primary,
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.semiBold,
                letterSpacing: 1.2,
                marginTop: spacing.xxs,
              },
            ]}
          >
            YOUR PERSONAL GROWTH ECOSYSTEM
          </Text>

          <View style={[styles.offlinePill, { backgroundColor: colors.surfaceRaised, borderRadius: borderRadius.round, marginTop: spacing.sm }]}>
            <ShieldCheck size={14} color={colors.success} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs, fontWeight: typography.fontWeights.medium }}>
              100% Offline-First Architecture
            </Text>
          </View>
        </View>

        {/* Feature Highlights Grid */}
        <View style={[styles.featuresSection, { marginVertical: spacing.xl }]}>
          {features.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                },
              ]}
            >
              <View style={styles.featureIcon}>{item.icon}</View>
              <View style={styles.featureTextCol}>
                <Text
                  style={[
                    styles.featureTitle,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.sm,
                      fontWeight: typography.fontWeights.bold,
                    },
                  ]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.featureDesc,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.fontSizes.xs,
                      marginTop: 2,
                    },
                  ]}
                >
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <PrimaryButton
            title="Create Free Account"
            onPress={() => router.push('/(auth)/signup' as any)}
            variant="primary"
            size="lg"
            fullWidth
            icon={<ArrowRight size={18} color={isDark ? '#090D16' : '#FFFFFF'} />}
            iconPosition="right"
            style={{ marginBottom: spacing.sm }}
          />

          <PrimaryButton
            title="Sign In with Email"
            onPress={() => router.push('/(auth)/login' as any)}
            variant="secondary"
            size="lg"
            fullWidth
            style={{ marginBottom: spacing.md }}
          />

          {/* Continue as Guest */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleGuest}
            style={[
              styles.guestButton,
              {
                paddingVertical: spacing.sm + 2,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <UserCheck size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <Text
              style={[
                styles.guestText,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.sm,
                  fontWeight: typography.fontWeights.medium,
                },
              ]}
            >
              Continue as Guest (Offline Only)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    letterSpacing: 1.5,
  },
  tagline: {},
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  featuresSection: {},
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {},
  featureDesc: {
    lineHeight: 16,
  },
  actionsSection: {
    marginTop: 'auto',
    paddingTop: 8,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestText: {},
});
