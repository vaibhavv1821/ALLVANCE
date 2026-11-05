import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface ModuleCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  accentColor?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  badge,
  badgeColor,
  accentColor,
  onPress,
  style,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const cardAccent = accentColor || colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
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
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: `${cardAccent}18`,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          {icon}
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.md,
                  fontWeight: typography.fontWeights.semiBold,
                },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {badge ? (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: badgeColor || `${cardAccent}20`,
                    borderRadius: borderRadius.xs,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: badgeColor ? '#FFFFFF' : cardAccent,
                      fontSize: typography.fontSizes.xxs,
                      fontWeight: typography.fontWeights.medium,
                    },
                  ]}
                >
                  {badge}
                </Text>
              </View>
            ) : null}
          </View>
          {description ? (
            <Text
              style={[
                styles.description,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.xs,
                  marginTop: spacing.xxs,
                },
              ]}
              numberOfLines={2}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexShrink: 1,
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {},
  description: {},
});
