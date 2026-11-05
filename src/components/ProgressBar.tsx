import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface ProgressBarProps {
  progress: number; // 0 to 1 or 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color,
  backgroundColor,
  height = 8,
  style,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  // Normalize progress to 0..100
  const normalizedProgress = Math.min(
    100,
    Math.max(0, progress <= 1 && progress > 0 ? progress * 100 : progress)
  );
  const roundedPercentage = Math.round(normalizedProgress);

  const activeColor = color || colors.primary;
  const trackColor = backgroundColor || colors.surfaceRaised;

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={[styles.headerRow, { marginBottom: spacing.xs }]}>
          {label ? (
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              {label}
            </Text>
          ) : <View />}
          {showPercentage && (
            <Text
              style={[
                styles.percentage,
                {
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.xs,
                  fontWeight: typography.fontWeights.semiBold,
                },
              ]}
            >
              {roundedPercentage}%
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            backgroundColor: trackColor,
            height,
            borderRadius: borderRadius.round,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              backgroundColor: activeColor,
              width: `${normalizedProgress}%`,
              borderRadius: borderRadius.round,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {},
  percentage: {},
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
