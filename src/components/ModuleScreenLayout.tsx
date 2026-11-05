import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppHeader } from './AppHeader';
import { EmptyState } from './EmptyState';
import { ConfirmationDialog } from './ConfirmationDialog';
import { getModuleIcon } from '@/utils/iconMap';

interface FeatureHighlight {
  title: string;
  desc: string;
}

interface ModuleScreenLayoutProps {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string;
  accentColor?: string;
  description: string;
  highlights?: FeatureHighlight[];
  showBack?: boolean;
}

export const ModuleScreenLayout: React.FC<ModuleScreenLayoutProps> = ({
  id,
  title,
  subtitle,
  iconName,
  accentColor,
  description,
  highlights = [],
  showBack = true,
}) => {
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();
  const [dialogVisible, setDialogVisible] = useState(false);
  const themeAccent = accentColor || colors.primary;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppHeader
        title={title}
        subtitle={subtitle || 'ALLVANCE Growth Module'}
        showBack={showBack}
        showThemeToggle
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing.lg, paddingBottom: spacing.huge + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Module Empty State */}
        <EmptyState
          icon={getModuleIcon(iconName, themeAccent, 32)}
          title={`Welcome to ${title}`}
          description={description}
          actionLabel="Quick Action"
          onAction={() => setDialogVisible(true)}
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        />

        {/* Planned Capabilities Highlights */}
        {highlights.length > 0 && (
          <View style={[styles.highlightsContainer, { marginTop: spacing.lg }]}>
            <Text
              style={[
                styles.highlightsHeading,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.xs,
                  fontWeight: typography.fontWeights.semiBold,
                  marginBottom: spacing.sm,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                },
              ]}
            >
              Planned Module Capabilities
            </Text>

            {highlights.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.highlightCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.highlightTitle,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.sm,
                      fontWeight: typography.fontWeights.semiBold,
                    },
                  ]}
                >
                  • {item.title}
                </Text>
                <Text
                  style={[
                    styles.highlightDesc,
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
            ))}
          </View>
        )}

        {/* Phase Status Banner */}
        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: colors.textMuted,
                fontSize: typography.fontSizes.xs,
                textAlign: 'center',
              },
            ]}
          >
            Phase 0 Foundation Ready. Database schema and navigation links connected.
          </Text>
        </View>
      </ScrollView>

      {/* Demo Action Dialog */}
      <ConfirmationDialog
        visible={dialogVisible}
        title={`${title} Module`}
        message="This module foundation is ready and fully wired into the navigation. Feature-specific logic will be implemented in subsequent phases."
        confirmText="Understood"
        cancelText="Close"
        onConfirm={() => setDialogVisible(false)}
        onCancel={() => setDialogVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  highlightsContainer: {},
  highlightsHeading: {},
  highlightCard: {
    borderWidth: 1,
  },
  highlightTitle: {},
  highlightDesc: {
    paddingLeft: 12,
  },
  statusBanner: {
    borderWidth: 1,
  },
  statusText: {},
});
