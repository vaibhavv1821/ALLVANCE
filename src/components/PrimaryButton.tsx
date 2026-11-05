import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();

  // Size configurations
  const sizeStyles: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
    sm: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md, fontSize: typography.fontSizes.sm },
    md: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg, fontSize: typography.fontSizes.md },
    lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, fontSize: typography.fontSizes.lg },
  };

  // Variant configurations
  let bg = colors.primary;
  let textCol = '#FFFFFF';
  let borderCol = 'transparent';
  let borderWidth = 0;

  switch (variant) {
    case 'secondary':
      bg = colors.surfaceRaised;
      textCol = colors.textPrimary;
      borderCol = colors.border;
      borderWidth = 1;
      break;
    case 'outline':
      bg = 'transparent';
      textCol = colors.primary;
      borderCol = colors.primary;
      borderWidth = 1.5;
      break;
    case 'ghost':
      bg = 'transparent';
      textCol = colors.textSecondary;
      break;
    case 'danger':
      bg = colors.danger;
      textCol = '#FFFFFF';
      break;
    case 'primary':
    default:
      bg = colors.primary;
      textCol = isDark ? '#090D16' : '#FFFFFF';
      break;
  }

  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderColor: borderCol,
          borderWidth,
          borderRadius: borderRadius.md,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textCol} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.leftIcon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: textCol,
                fontSize: currentSize.fontSize,
                fontWeight: typography.fontWeights.semiBold,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.rightIcon}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  text: {
    textAlign: 'center',
  },
});
