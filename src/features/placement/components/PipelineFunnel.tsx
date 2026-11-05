import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PipelineStageCount } from '@/database/repositories/PlacementDashboardRepository';
import { ChevronRight } from 'lucide-react-native';

interface PipelineFunnelProps {
  stages: PipelineStageCount[];
  totalApplications: number;
  onSelectStage?: (stage: string) => void;
}

export const PipelineFunnel: React.FC<PipelineFunnelProps> = ({
  stages,
  totalApplications,
  onSelectStage,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary, fontSize: typography.fontSizes.md },
            ]}
          >
            Application Pipeline Funnel
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
            ]}
          >
            {totalApplications} Total Application{totalApplications === 1 ? '' : 's'} across stages
          </Text>
        </View>
      </View>

      {/* Visual Funnel Bar */}
      <View
        style={[
          styles.funnelBarContainer,
          {
            backgroundColor: colors.surfaceRaised,
            borderRadius: borderRadius.full,
            marginVertical: spacing.md,
          },
        ]}
      >
        {totalApplications > 0 ? (
          stages.map((stage, idx) => {
            const widthPct = Math.max(stage.percentage, stage.count > 0 ? 6 : 0);
            if (stage.count === 0) return null;
            return (
              <View
                key={stage.stage}
                style={[
                  styles.barSegment,
                  {
                    backgroundColor: stage.color,
                    flex: widthPct,
                  },
                  idx === 0 && {
                    borderTopLeftRadius: borderRadius.full,
                    borderBottomLeftRadius: borderRadius.full,
                  },
                  idx === stages.length - 1 && {
                    borderTopRightRadius: borderRadius.full,
                    borderBottomRightRadius: borderRadius.full,
                  },
                ]}
              />
            );
          })
        ) : (
          <View
            style={[
              styles.emptyBar,
              { backgroundColor: colors.border, borderRadius: borderRadius.full },
            ]}
          />
        )}
      </View>

      {/* Stages Grid */}
      <View style={styles.stagesGrid}>
        {stages.map((stage) => (
          <TouchableOpacity
            key={stage.stage}
            activeOpacity={0.7}
            onPress={() => onSelectStage && onSelectStage(stage.stage)}
            style={[
              styles.stageCard,
              {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.borderSubtle,
                borderRadius: borderRadius.md,
                padding: spacing.sm,
              },
            ]}
          >
            <View style={styles.stageTop}>
              <View
                style={[styles.stageDot, { backgroundColor: stage.color }]}
              />
              <Text
                style={[
                  styles.stageLabel,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xxs,
                  },
                ]}
                numberOfLines={1}
              >
                {stage.label}
              </Text>
            </View>
            <View style={styles.stageBottom}>
              <Text
                style={[
                  styles.stageCount,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.fontSizes.lg,
                  },
                ]}
              >
                {stage.count}
              </Text>
              <Text
                style={[
                  styles.stagePct,
                  {
                    color: stage.color,
                    fontSize: typography.fontSizes.xxs,
                  },
                ]}
              >
                {stage.percentage}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
  },
  funnelBarContainer: {
    height: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  barSegment: {
    height: '100%',
  },
  emptyBar: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  stageCard: {
    flex: 1,
    minWidth: '30%',
    borderWidth: 1,
  },
  stageTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageLabel: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  stageBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  stageCount: {
    fontWeight: '800',
  },
  stagePct: {
    fontWeight: '700',
  },
});
