import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Code2,
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  Plus,
  Play,
  Layers,
  ChevronRight,
  Target,
  Trophy,
  AlertCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StatCard, ProgressBar, SectionHeader, EmptyState } from '@/components';
import { DsaDashboardMetrics } from '@/database/repositories/DsaDashboardRepository';
import { TopicWithStats } from '@/database/repositories/DsaTopicRepository';
import { DIFFICULTY_COLORS } from '../constants';

interface DsaDashboardTabProps {
  metrics: DsaDashboardMetrics | null;
  topics: TopicWithStats[];
  onOpenAddProblem: () => void;
  onOpenSetGoal: () => void;
  onOpenStudySession: () => void;
  onNavigateToTab: (tab: 'overview' | 'roadmap' | 'problems' | 'revision' | 'analytics') => void;
  onSelectProblem: (problemId: string) => void;
}

export const DsaDashboardTab: React.FC<DsaDashboardTabProps> = ({
  metrics,
  topics,
  onOpenAddProblem,
  onOpenSetGoal,
  onOpenStudySession,
  onNavigateToTab,
  onSelectProblem,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  if (!metrics) return null;

  const easyMeta = DIFFICULTY_COLORS.Easy;
  const medMeta = DIFFICULTY_COLORS.Medium;
  const hardMeta = DIFFICULTY_COLORS.Hard;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: spacing.huge + 30 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Daily Goal Progress Card */}
      <View style={[styles.goalCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
        <View style={styles.goalHeader}>
          <View style={styles.goalHeaderLeft}>
            <View style={[styles.goalIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Target size={18} color="#10B981" />
            </View>
            <View>
              <Text style={[styles.goalTitle, { color: colors.textPrimary }]}>Daily Coding Target</Text>
              <Text style={[styles.goalSubtitle, { color: colors.textMuted }]}>
                {metrics.dailyGoal.completed} of {metrics.dailyGoal.target} problems completed today
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.setGoalBtn, { borderColor: '#10B981' }]}
            onPress={onOpenSetGoal}
          >
            <Text style={[styles.setGoalBtnText, { color: '#10B981' }]}>Set Goal</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginVertical: 10 }}>
          <ProgressBar
            progress={metrics.dailyGoal.percentage / 100}
            color="#10B981"
            height={8}
          />
        </View>

        <View style={styles.goalFooter}>
          <Text style={[styles.goalRemaining, { color: colors.textSecondary }]}>
            {metrics.dailyGoal.remaining > 0
              ? `${metrics.dailyGoal.remaining} problems remaining to achieve goal`
              : '🎉 Goal achieved for today! Great consistency!'}
          </Text>
          <Text style={[styles.goalPercent, { color: '#10B981' }]}>
            {metrics.dailyGoal.percentage}%
          </Text>
        </View>
      </View>

      {/* 2. Quick Action Shortcuts */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          style={[styles.actionChip, { backgroundColor: '#10B981' }]}
          onPress={onOpenAddProblem}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.actionChipTextPrimary}>Add Problem</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionChipSecondary, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
          onPress={() => onNavigateToTab('revision')}
        >
          <RotateCcw size={15} color="#818CF8" />
          <Text style={[styles.actionChipText, { color: colors.textPrimary }]}>
            Revision ({metrics.pendingRevisions})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionChipSecondary, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
          onPress={onOpenStudySession}
        >
          <Play size={15} color="#38BDF8" />
          <Text style={[styles.actionChipText, { color: colors.textPrimary }]}>Study Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionChipSecondary, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
          onPress={() => onNavigateToTab('roadmap')}
        >
          <Layers size={15} color="#F59E0B" />
          <Text style={[styles.actionChipText, { color: colors.textPrimary }]}>Roadmap</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Core Overview Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Total Problems"
          value={metrics.totalProblems}
          subtext={`${metrics.solvedProblems} solved • ${metrics.attemptedProblems} active`}
          accentColor="#10B981"
          icon={<Code2 size={16} color="#10B981" />}
          onPress={() => onNavigateToTab('problems')}
          style={styles.halfCard}
        />
        <StatCard
          label="Coding Streak"
          value={`${metrics.streak.currentStreak} Days`}
          subtext={`Best: ${metrics.streak.longestStreak} days active`}
          accentColor="#F59E0B"
          icon={<Flame size={16} color="#F59E0B" />}
          onPress={() => onNavigateToTab('analytics')}
          style={styles.halfCard}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          label="Pending Revision"
          value={metrics.pendingRevisions}
          subtext={metrics.pendingRevisions > 0 ? 'Due for spaced review' : 'All caught up!'}
          accentColor="#818CF8"
          icon={<RotateCcw size={16} color="#818CF8" />}
          onPress={() => onNavigateToTab('revision')}
          style={styles.halfCard}
        />
        <StatCard
          label="Study Focus Time"
          value={`${metrics.totalCodingHours} hrs`}
          subtext="Logged learning sessions"
          accentColor="#38BDF8"
          icon={<Clock size={16} color="#38BDF8" />}
          onPress={onOpenStudySession}
          style={styles.halfCard}
        />
      </View>

      {/* 4. Difficulty Distribution Section */}
      <View style={styles.sectionMargin}>
        <SectionHeader
          title="Difficulty Distribution"
          subtitle="Balance problem solving across Easy, Medium, and Hard"
        />

        <View style={styles.diffCardsRow}>
          {/* Easy */}
          <View style={[styles.diffCard, { backgroundColor: easyMeta.bg, borderColor: easyMeta.border }]}>
            <Text style={[styles.diffCardTitle, { color: easyMeta.color }]}>Easy</Text>
            <Text style={[styles.diffCardCount, { color: colors.textPrimary }]}>
              {metrics.easySolved}
              <Text style={[styles.diffCardTotal, { color: colors.textMuted }]}> / {metrics.easyTotal}</Text>
            </Text>
            <ProgressBar
              progress={metrics.easyTotal > 0 ? metrics.easySolved / metrics.easyTotal : 0}
              color={easyMeta.color}
              height={4}
            />
          </View>

          {/* Medium */}
          <View style={[styles.diffCard, { backgroundColor: medMeta.bg, borderColor: medMeta.border }]}>
            <Text style={[styles.diffCardTitle, { color: medMeta.color }]}>Medium</Text>
            <Text style={[styles.diffCardCount, { color: colors.textPrimary }]}>
              {metrics.mediumSolved}
              <Text style={[styles.diffCardTotal, { color: colors.textMuted }]}> / {metrics.mediumTotal}</Text>
            </Text>
            <ProgressBar
              progress={metrics.mediumTotal > 0 ? metrics.mediumSolved / metrics.mediumTotal : 0}
              color={medMeta.color}
              height={4}
            />
          </View>

          {/* Hard */}
          <View style={[styles.diffCard, { backgroundColor: hardMeta.bg, borderColor: hardMeta.border }]}>
            <Text style={[styles.diffCardTitle, { color: hardMeta.color }]}>Hard</Text>
            <Text style={[styles.diffCardCount, { color: colors.textPrimary }]}>
              {metrics.hardSolved}
              <Text style={[styles.diffCardTotal, { color: colors.textMuted }]}> / {metrics.hardTotal}</Text>
            </Text>
            <ProgressBar
              progress={metrics.hardTotal > 0 ? metrics.hardSolved / metrics.hardTotal : 0}
              color={hardMeta.color}
              height={4}
            />
          </View>
        </View>
      </View>

      {/* 5. Topic Progress Highlights */}
      <View style={styles.sectionMargin}>
        <View style={styles.sectionHeaderRow}>
          <SectionHeader
            title="Roadmap Topic Progress"
            subtitle="Topic-wise completion across foundational and core areas"
          />
          <TouchableOpacity onPress={() => onNavigateToTab('roadmap')}>
            <Text style={[styles.viewAllText, { color: '#10B981' }]}>View All ({topics.length})</Text>
          </TouchableOpacity>
        </View>

        {topics.slice(0, 5).map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.topicProgressRow, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
            onPress={() => onNavigateToTab('roadmap')}
          >
            <View style={styles.topicInfo}>
              <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>{t.title}</Text>
              <Text style={[styles.topicSubtext, { color: colors.textMuted }]}>
                {t.solvedProblems} / {t.totalProblems} solved • {t.completedSubtopicsCount}/{t.subtopicsCount} subtopics
              </Text>
            </View>
            <View style={styles.topicBarWrapper}>
              <Text style={[styles.topicPercentText, { color: '#10B981' }]}>{t.progressPercent}%</Text>
              <ProgressBar progress={t.progressPercent / 100} color="#10B981" height={5} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 6. Recent Activity Feeds */}
      <View style={styles.sectionMargin}>
        <SectionHeader
          title="Recent Activity"
          subtitle="Recently solved, attempted, and revised problems"
        />

        {metrics.recentSolved.length === 0 &&
        metrics.recentAttempted.length === 0 &&
        metrics.recentRevised.length === 0 ? (
          <EmptyState
            icon={<Code2 size={32} color={colors.textMuted} />}
            title="No Activity Logged Yet"
            description="Start practicing by adding your first problem or reviewing the roadmap."
            actionLabel="Add Problem"
            onAction={onOpenAddProblem}
          />
        ) : (
          <View style={styles.recentList}>
            {metrics.recentSolved.map((item) => (
              <TouchableOpacity
                key={`solved-${item.id}`}
                style={[styles.activityItem, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
                onPress={() => onSelectProblem(item.id)}
              >
                <View style={[styles.activityIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <CheckCircle2 size={16} color="#10B981" />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={[styles.activityTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.activityMeta, { color: colors.textMuted }]}>
                    Solved • {item.topicName} • {item.difficulty}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}

            {metrics.recentAttempted.map((item) => (
              <TouchableOpacity
                key={`attempted-${item.id}`}
                style={[styles.activityItem, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
                onPress={() => onSelectProblem(item.id)}
              >
                <View style={[styles.activityIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                  <Play size={16} color="#38BDF8" />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={[styles.activityTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.activityMeta, { color: colors.textMuted }]}>
                    Attempted • {item.topicName} • {item.difficulty}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  goalCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  goalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  goalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  setGoalBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  setGoalBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalRemaining: {
    fontSize: 12,
    flex: 1,
  },
  goalPercent: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionChipTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  actionChipSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  halfCard: {
    flex: 1,
  },
  sectionMargin: {
    marginTop: 14,
  },
  diffCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  diffCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  diffCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  diffCardCount: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  diffCardTotal: {
    fontSize: 12,
    fontWeight: '400',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  topicProgressRow: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  topicInfo: {
    marginBottom: 6,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  topicSubtext: {
    fontSize: 11,
    marginTop: 2,
  },
  topicBarWrapper: {
    flexDirection: 'column',
    gap: 4,
  },
  topicPercentText: {
    fontSize: 11,
    fontWeight: '800',
    alignSelf: 'flex-end',
  },
  recentList: {
    gap: 8,
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  activityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityMeta: {
    fontSize: 11,
    marginTop: 2,
  },
});
