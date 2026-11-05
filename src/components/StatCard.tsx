import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  accentColor,
  onPress,
  style,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const themeAccent = accentColor || colors.primary;

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
        },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {icon && (
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: `${themeAccent}1A`,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            {icon}
          </View>
        )}
      </View>

      <Text
        style={[
          styles.value,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSizes.xxl,
            fontWeight: typography.fontWeights.bold,
            marginTop: spacing.xs,
          },
        ]}
      >
        {value}
      </Text>

      {subtext ? (
        <Text
          style={[
            styles.subtext,
            {
              color: colors.textMuted,
              fontSize: typography.fontSizes.xxs + 1,
              marginTop: spacing.xxs,
            },
          ]}
          numberOfLines={1}
        >
          {subtext}
        </Text>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    minWidth: 130,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
    flex: 1,
    marginRight: 6,
  },
  iconWrapper: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {},
  subtext: {},
});
