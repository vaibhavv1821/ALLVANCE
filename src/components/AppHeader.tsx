import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Moon, Sun } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showThemeToggle?: boolean;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  showThemeToggle = false,
  style,
}) => {
  const router = useRouter();
  const { colors, typography, spacing, isDark, toggleTheme } = useAppTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        },
        style,
      ]}
    >
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.backButton, { marginRight: spacing.sm }]}
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.lg,
                fontWeight: typography.fontWeights.bold,
              },
            ]}
            numberOfLines={1}
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
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightRow}>
        {showThemeToggle && (
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={[
              styles.iconBtn,
              {
                backgroundColor: colors.surfaceRaised,
                borderRadius: 8,
                padding: 8,
                marginRight: rightAction ? 8 : 0,
              },
            ]}
          >
            {isDark ? (
              <Sun size={18} color={colors.warning} />
            ) : (
              <Moon size={18} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {},
  subtitle: {},
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
