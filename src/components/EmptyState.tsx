import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.xl,
        },
        style,
      ]}
    >
      {icon && (
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: colors.primaryMuted,
              borderRadius: borderRadius.round,
              marginBottom: spacing.md,
            },
          ]}
        >
          {icon}
        </View>
      )}

      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSizes.lg,
            fontWeight: typography.fontWeights.semiBold,
          },
        ]}
      >
        {title}
      </Text>

      {description ? (
        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
              fontSize: typography.fontSizes.sm,
              marginTop: spacing.xs,
              marginBottom: actionLabel ? spacing.lg : 0,
            },
          ]}
        >
          {description}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          size="sm"
          variant="primary"
          style={styles.actionButton}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: 1,
    marginVertical: 12,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  actionButton: {
    marginTop: 8,
  },
});
