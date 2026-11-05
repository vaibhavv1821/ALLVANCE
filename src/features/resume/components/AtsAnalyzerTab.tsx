import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Layers,
  FileCheck,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ResumeDetailed } from '@/database/repositories/ResumeRepository';
import { analyzeResumeATS, AtsCategoryScore } from '../services/atsAnalyzer';
import { ProgressBar } from '@/components';

interface AtsAnalyzerTabProps {
  resume: ResumeDetailed;
}

export const AtsAnalyzerTab: React.FC<AtsAnalyzerTabProps> = ({ resume }) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const analysis = useMemo(() => {
    return analyzeResumeATS(resume);
  }, [resume]);

  const scoreColor =
    analysis.overallScore >= 85
      ? colors.success
      : analysis.overallScore >= 70
      ? colors.accent
      : analysis.overallScore >= 50
      ? colors.warning
      : colors.danger;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { padding: spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Main ATS Score Hero Card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            marginBottom: spacing.md,
          },
        ]}
      >
        <View style={styles.heroRow}>
          <View style={styles.scoreCircleWrapper}>
            <View
              style={[
                styles.scoreCircle,
                {
                  borderColor: scoreColor,
                  backgroundColor: `${scoreColor}15`,
                },
              ]}
            >
              <Text style={[styles.scoreValue, { color: scoreColor }]}>
                {analysis.overallScore}
              </Text>
              <Text style={[styles.scoreScale, { color: colors.textMuted }]}>
                / 100
              </Text>
            </View>
          </View>

          <View style={styles.heroTextWrap}>
            <View style={styles.gradeBadgeRow}>
              <View
                style={[
                  styles.gradeBadge,
                  { backgroundColor: `${scoreColor}25`, borderRadius: borderRadius.xs },
                ]}
              >
                <Text style={[styles.gradeText, { color: scoreColor }]}>
                  GRADE {analysis.grade}
                </Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs }}>
                ~{analysis.wordCount} words
              </Text>
            </View>

            <Text
              style={[
                styles.heroTitle,
                {
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.md,
                  fontWeight: '700',
                  marginTop: 4,
                },
              ]}
            >
              {analysis.overallScore >= 85
                ? 'High ATS Compatibility'
                : analysis.overallScore >= 70
                ? 'Competitive ATS Readiness'
                : 'Needs Content Optimization'}
            </Text>

            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSizes.xs,
                marginTop: 2,
                lineHeight: 16,
              }}
            >
              Offline rule-based scanner parsing contact completeness, action verbs, metrics, and section depth.
            </Text>
          </View>
        </View>

        {/* Disclaimer banner inside hero card */}
        <View
          style={[
            styles.disclaimerBox,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.borderSubtle,
              borderRadius: borderRadius.sm,
              marginTop: spacing.md,
            },
          ]}
        >
          <Info size={13} color={colors.textMuted} />
          <Text style={[styles.disclaimerText, { color: colors.textMuted, fontSize: typography.fontSizes.xxs }]}>
            {analysis.disclaimer}
          </Text>
        </View>
      </View>

      {/* 2. Missing Sections Alert (if any) */}
      {analysis.missingSections.length > 0 && (
        <View
          style={[
            styles.missingBanner,
            {
              backgroundColor: `${colors.warning}15`,
              borderColor: `${colors.warning}40`,
              borderRadius: borderRadius.md,
              padding: spacing.md,
              marginBottom: spacing.md,
            },
          ]}
        >
          <AlertTriangle size={18} color={colors.warning} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={{ color: colors.warning, fontSize: typography.fontSizes.xs, fontWeight: '700' }}>
              Missing Recommended Sections
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 }}>
              Your resume does not currently contain:{' '}
              <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>
                {analysis.missingSections.join(', ')}
              </Text>
            </Text>
          </View>
        </View>
      )}

      {/* 3. Category Score Breakdown */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        <Text
          style={[
            styles.cardHeaderTitle,
            {
              color: colors.textPrimary,
              fontSize: typography.fontSizes.sm,
              fontWeight: '700',
              marginBottom: spacing.sm,
            },
          ]}
        >
          CATEGORY-WISE BREAKDOWN
        </Text>

        {Object.values(analysis.breakdown).map((cat, idx) => (
          <CategoryScoreRow key={idx} category={cat} />
        ))}
      </View>

      {/* 4. Action Verbs & Metrics Found */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.xs }}>
          <Zap size={16} color={colors.accent} />
          <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: '700' }}>
            Detected Action Verbs ({analysis.actionVerbsFound.length})
          </Text>
        </View>
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginBottom: spacing.sm }}>
          High-impact engineering verbs detected in your bullet points:
        </Text>

        <View style={styles.tagsCloud}>
          {analysis.actionVerbsFound.length === 0 ? (
            <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xs, fontStyle: 'italic' }}>
              No prominent action verbs detected yet.
            </Text>
          ) : (
            analysis.actionVerbsFound.map((v, i) => (
              <View
                key={i}
                style={[
                  styles.tagChip,
                  { backgroundColor: `${colors.accent}18`, borderRadius: borderRadius.xs },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.accent, fontSize: typography.fontSizes.xxs }]}>
                  {v}
                </Text>
              </View>
            ))
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: spacing.md,
            marginBottom: spacing.xs,
          }}
        >
          <Target size={16} color={colors.success} />
          <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: '700' }}>
            Quantifiable Metrics & Percentages ({analysis.metricsFound.length})
          </Text>
        </View>
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginBottom: spacing.sm }}>
          Measurable achievements with numbers or units:
        </Text>

        <View style={styles.tagsCloud}>
          {analysis.metricsFound.length === 0 ? (
            <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xs, fontStyle: 'italic' }}>
              No quantifiable metrics detected. Add percentages or measurable outcomes.
            </Text>
          ) : (
            analysis.metricsFound.map((m, i) => (
              <View
                key={i}
                style={[
                  styles.tagChip,
                  { backgroundColor: `${colors.success}18`, borderRadius: borderRadius.xs },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.success, fontSize: typography.fontSizes.xxs }]}>
                  {m}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* 5. Improvement Suggestions */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        <Text
          style={[
            styles.cardHeaderTitle,
            {
              color: colors.textPrimary,
              fontSize: typography.fontSizes.sm,
              fontWeight: '700',
              marginBottom: spacing.sm,
            },
          ]}
        >
          ACTIONABLE SUGGESTIONS ({analysis.suggestions.length})
        </Text>

        {analysis.suggestions.map((sug, i) => {
          const isCritical = sug.type === 'critical';
          const isStrength = sug.type === 'strength';
          const badgeColor = isCritical ? colors.danger : isStrength ? colors.success : colors.warning;

          return (
            <View
              key={i}
              style={[
                styles.suggestionItem,
                {
                  borderLeftColor: badgeColor,
                  borderLeftWidth: 3,
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: borderRadius.sm,
                  marginBottom: spacing.xs,
                  padding: spacing.sm,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.xs, fontWeight: '700' }}>
                  {sug.title}
                </Text>
                <Text
                  style={{
                    color: badgeColor,
                    fontSize: typography.fontSizes.xxs - 1,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                  }}
                >
                  {sug.type}
                </Text>
              </View>
              <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs, marginTop: 2 }}>
                {sug.description}
              </Text>
            </View>
          );
        })}
      </View>

      {/* 6. Keywords Coverage */}
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
        <Text
          style={[
            styles.cardHeaderTitle,
            {
              color: colors.textPrimary,
              fontSize: typography.fontSizes.sm,
              fontWeight: '700',
              marginBottom: spacing.xs,
            },
          ]}
        >
          INDUSTRY KEYWORDS COVERAGE
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginBottom: spacing.sm }}>
          Standard technology terms detected across your resume:
        </Text>

        <View style={styles.tagsCloud}>
          {analysis.keywordCoverage.detected.map((kw, i) => (
            <View
              key={i}
              style={[
                styles.tagChip,
                { backgroundColor: `${colors.accent}15`, borderRadius: borderRadius.xs },
              ]}
            >
              <Text style={[styles.tagText, { color: colors.textPrimary, fontSize: typography.fontSizes.xxs }]}>
                ✓ {kw}
              </Text>
            </View>
          ))}
        </View>

        {analysis.keywordCoverage.suggested.length > 0 && (
          <View style={{ marginTop: spacing.md }}>
            <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs, fontWeight: '700', marginBottom: 4 }}>
              CONSIDER ADDING IF RELEVANT:
            </Text>
            <View style={styles.tagsCloud}>
              {analysis.keywordCoverage.suggested.map((kw, i) => (
                <View
                  key={i}
                  style={[
                    styles.tagChip,
                    { backgroundColor: colors.surfaceRaised, borderRadius: borderRadius.xs },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.textSecondary, fontSize: typography.fontSizes.xxs }]}>
                    + {kw}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const CategoryScoreRow: React.FC<{ category: AtsCategoryScore }> = ({ category }) => {
  const { colors, typography, spacing } = useAppTheme();

  return (
    <View style={{ marginBottom: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
        <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.xs, fontWeight: '600' }}>
          {category.name}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs }}>
          <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>{category.score}</Text>/{category.maxScore} ({category.percentage}%)
        </Text>
      </View>

      <ProgressBar
        progress={category.percentage / 100}
        color={category.percentage >= 80 ? colors.success : category.percentage >= 50 ? colors.accent : colors.warning}
        height={5}
      />

      <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs, marginTop: 2 }}>
        {category.feedback}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  heroCard: {
    borderWidth: 1,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 28,
  },
  scoreScale: {
    fontSize: 10,
    fontWeight: '600',
  },
  heroTextWrap: {
    flex: 1,
  },
  gradeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gradeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gradeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {},
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderWidth: 1,
  },
  disclaimerText: {
    flex: 1,
    lineHeight: 13,
  },
  missingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  card: {
    borderWidth: 1,
  },
  cardHeaderTitle: {
    letterSpacing: 0.5,
  },
  tagsCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  tagText: {
    fontWeight: '600',
  },
  suggestionItem: {},
});
