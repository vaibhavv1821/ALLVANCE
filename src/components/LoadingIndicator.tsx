import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  fullscreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message,
  size = 'small',
  color,
  style,
  fullscreen = false,
}) => {
  const { colors, typography, spacing } = useAppTheme();
  const indicatorColor = color || colors.primary;

  return (
    <View
      style={[
        styles.container,
        fullscreen && [styles.fullscreen, { backgroundColor: colors.background }],
        style,
      ]}
    >
      <ActivityIndicator size={size} color={indicatorColor} />
      {message ? (
        <Text
          style={[
            styles.message,
            {
              color: colors.textSecondary,
              fontSize: typography.fontSizes.sm,
              marginTop: spacing.sm,
            },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreen: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
  },
  message: {
    textAlign: 'center',
  },
});
