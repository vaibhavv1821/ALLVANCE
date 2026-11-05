import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  icon,
  style,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing.sm }, style]}>
      <View style={styles.leftContainer}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.lg,
                fontWeight: typography.fontWeights.bold,
              },
            ]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.xs,
                  marginTop: 2,
                },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            style={[
              styles.actionLabel,
              {
                color: colors.primary,
                fontSize: typography.fontSizes.xs,
                fontWeight: typography.fontWeights.semiBold,
              },
            ]}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  title: {},
  subtitle: {},
  actionLabel: {},
});
