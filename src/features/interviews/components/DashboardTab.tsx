import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Flame,
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Building2,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ProgressBar } from '@/components';
import { InterviewDashboardMetrics } from '@/database/repositories/InterviewPrepRepository';
import { InterviewTabType } from '../types';

interface DashboardTabProps {
  metrics: InterviewDashboardMetrics | null;
  onNavigateTab: (tab: InterviewTabType, categoryId?: string) => void;
  onOpenDailyGoalModal: () => void;
  onContinueLearning: () => void;
  onQuickPractice: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  metrics,
  onNavigateTab,
  onOpenDailyGoalModal,
  onContinueLearning,
  onQuickPractice,
}) => {
  const { colors, typography, spacing, isDark } = useAppTheme();

  const total = metrics?.totalQuestions || 0;
  const completed = metrics?.completedQuestions || 0;
  const remaining = metrics?.remainingQuestions || 0;
  const percent = metrics?.overallPercentage || 0;
  const streak = metrics?.currentStreak || 0;
  const todayTarget = metrics?.todayTarget || 5;
  const todayCompleted = metrics?.todayCompleted || 0;
  const todayPercent = Math.min(100, Math.round((todayCompleted / todayTarget) * 100));

  const maxWeeklyCount = Math.max(
    5,
    ...(metrics?.weeklyActivity.map((d) => d.count) || [5])
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { padding: spacing.lg, paddingBottom: spacing.huge + 30 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Overall Progress Hero Card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.heroTopRow}>
          <View>
            <Text style={[styles.heroSubtitle, { color: '#818CF8' }]}>PREPARATION STATUS</Text>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
              {percent}% Ready
            </Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: '#F59E0B20', borderColor: '#F59E0B40' }]}>
            <Flame size={18} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.streakText}>{streak} Day Streak</Text>
          </View>
        </View>

        <View style={{ marginVertical: 14 }}>
          <ProgressBar
            progress={percent / 100}
            color="#818CF8"
            height={8}
            backgroundColor={isDark ? '#1E293B' : '#E2E8F0'}
          />
        </View>

        <View style={styles.statsSummaryRow}>
          <View style={styles.statMiniCol}>
            <Text style={[styles.statMiniNum, { color: '#10B981' }]}>{completed}</Text>
            <Text style={[styles.statMiniLabel, { color: colors.textMuted }]}>Completed</Text>
          </View>
          <View style={[styles.dividerVertical, { backgroundColor: colors.border }]} />
          <View style={styles.statMiniCol}>
            <Text style={[styles.statMiniNum, { color: '#38BDF8' }]}>{remaining}</Text>
            <Text style={[styles.statMiniLabel, { color: colors.textMuted }]}>Remaining</Text>
          </View>
          <View style={[styles.dividerVertical, { backgroundColor: colors.border }]} />
          <View style={styles.statMiniCol}>
            <Text style={[styles.statMiniNum, { color: colors.textPrimary }]}>{total}</Text>
            <Text style={[styles.statMiniLabel, { color: colors.textMuted }]}>Total Bank</Text>
          </View>
        </View>
      </View>

      {/* 2. Today's Target Card */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <Target size={18} color="#818CF8" />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Today&apos;s Target</Text>
          </View>
          <TouchableOpacity onPress={onOpenDailyGoalModal} style={styles.editTargetBtn}>
            <Text style={{ color: '#818CF8', fontSize: 12, fontWeight: '700' }}>Edit Target</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.targetProgressRow}>
          <Text style={[styles.targetCountBig, { color: colors.textPrimary }]}>
            {todayCompleted} / {todayTarget}
          </Text>
          <Text style={[styles.targetStatusText, { color: todayPercent >= 100 ? '#10B981' : colors.textMuted }]}>
            {todayPercent >= 100 ? 'Goal Achieved! 🎉' : `${todayTarget - todayCompleted} more to hit target`}
          </Text>
        </View>

        <ProgressBar
          progress={todayPercent / 100}
          color={todayPercent >= 100 ? '#10B981' : '#818CF8'}
          height={6}
          backgroundColor={isDark ? '#1E293B' : '#E2E8F0'}
        />
      </View>

      {/* 3. Primary Action Buttons */}
      <View style={styles.actionGrid}>
        <TouchableOpacity
          onPress={onContinueLearning}
          activeOpacity={0.85}
          style={[styles.primaryActionBtn, { backgroundColor: '#818CF8' }]}
        >
          <View style={styles.actionBtnIconCircle}>
            <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.primaryActionTitle}>Continue Learning</Text>
            <Text style={styles.primaryActionSubtitle}>Pick up where you left off</Text>
          </View>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.secondaryActionRow}>
          <TouchableOpacity
            onPress={onQuickPractice}
            style={[styles.secondaryActionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Sparkles size={18} color="#38BDF8" />
            <Text style={[styles.secondaryActionText, { color: colors.textPrimary }]}>Quick Drill</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigateTab('mock')}
            style={[styles.secondaryActionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Clock size={18} color="#F59E0B" />
            <Text style={[styles.secondaryActionText, { color: colors.textPrimary }]}>Mock Interview</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigateTab('revision')}
            style={[styles.secondaryActionBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <RotateCcw size={18} color="#EF4444" />
            <Text style={[styles.secondaryActionText, { color: colors.textPrimary }]}>Revision Queue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Weekly Activity Bar Chart */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardHeaderLeft}>
            <TrendingUp size={18} color="#10B981" />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Weekly Study Activity</Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>Last 7 Days</Text>
        </View>

        <View style={styles.chartContainer}>
          {metrics?.weeklyActivity.map((day, idx) => {
            const barHeight = Math.max(6, Math.round((day.count / maxWeeklyCount) * 70));
            const isToday = idx === (metrics.weeklyActivity.length - 1);
            return (
              <View key={day.dateStr} style={styles.chartCol}>
                <Text style={[styles.barCount, { color: day.count > 0 ? colors.textPrimary : 'transparent' }]}>
                  {day.count}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: barHeight,
                        backgroundColor: isToday ? '#818CF8' : (day.count > 0 ? '#38BDF8' : colors.surfaceRaised),
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.dayLabel,
                    { color: isToday ? '#818CF8' : colors.textMuted, fontWeight: isToday ? '800' : '500' },
                  ]}
                >
                  {day.dayLabel}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 5. Recommended Next Topics */}
      {metrics && metrics.recommendedTopics.length > 0 && (
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            Recommended Next Topics
          </Text>
          <View style={styles.topicCardsGrid}>
            {metrics.recommendedTopics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                onPress={() => onNavigateTab('technical', topic.id)}
                style={[
                  styles.topicCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <View style={[styles.topicIconWrap, { backgroundColor: '#818CF815' }]}>
                  <BookOpen size={18} color="#818CF8" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.topicTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {topic.name}
                  </Text>
                  <Text style={[styles.topicRemaining, { color: colors.textMuted }]}>
                    {topic.remaining} questions left
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 6. Company Hub Shortcut Card */}
      <TouchableOpacity
        onPress={() => onNavigateTab('companies')}
        style={[styles.companyBanner, { backgroundColor: isDark ? '#141E33' : '#EFF6FF', borderColor: '#38BDF830' }]}
      >
        <Building2 size={24} color="#38BDF8" style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.companyBannerTitle, { color: colors.textPrimary }]}>
            Company-Wise Interview Preparation
          </Text>
          <Text style={[styles.companyBannerSubtitle, { color: colors.textSecondary }]}>
            Targeted prep for Infosys, Deloitte, TCS, Accenture, Capgemini & more
          </Text>
        </View>
        <ChevronRight size={20} color="#38BDF8" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  streakText: {
    color: '#F59E0B',
    fontWeight: '800',
    fontSize: 13,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  statMiniCol: {
    alignItems: 'center',
  },
  statMiniNum: {
    fontSize: 20,
    fontWeight: '900',
  },
  statMiniLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  dividerVertical: {
    width: 1,
    height: 30,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  editTargetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  targetProgressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  targetCountBig: {
    fontSize: 22,
    fontWeight: '900',
  },
  targetStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionGrid: {
    gap: 10,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#818CF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  primaryActionSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  secondaryActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryActionBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  secondaryActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
    paddingTop: 10,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
  },
  barCount: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 70,
    justifyContent: 'flex-end',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    marginTop: 6,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  topicCardsGrid: {
    gap: 8,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  topicIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  topicRemaining: {
    fontSize: 12,
    marginTop: 2,
  },
  companyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
  },
  companyBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  companyBannerSubtitle: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
});
