import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Flame,
  Clock,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Building2,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ProgressBar, SectionHeader, StatCard } from '@/components';
import {
  dsaDashboardRepository,
  DsaAnalyticsMetrics,
} from '@/database/repositories/DsaDashboardRepository';
import {
  dsaGoalRepository,
  HeatmapDay,
  WeeklyProgressDay,
} from '@/database/repositories/DsaGoalRepository';
import {
  dsaCompanyRepository,
  CompanyDsaStats,
} from '@/database/repositories/DsaCompanyRepository';
import { DIFFICULTY_COLORS } from '../constants';

export const DsaAnalyticsTab: React.FC = () => {
  const { colors, typography, spacing } = useAppTheme();

  const [analytics, setAnalytics] = useState<DsaAnalyticsMetrics | null>(null);
  const [weekly, setWeekly] = useState<WeeklyProgressDay[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>([]);
  const [companyStats, setCompanyStats] = useState<CompanyDsaStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchAnalytics() {
      try {
        const [aData, wData, hData, cData] = await Promise.all([
          dsaDashboardRepository.getAnalyticsMetrics(),
          dsaGoalRepository.getWeeklyProgress(),
          dsaGoalRepository.getCalendarHeatmap(42), // 6 weeks of 7 days
          dsaCompanyRepository.getAllCompaniesWithStats(),
        ]);
        if (isMounted) {
          setAnalytics(aData);
          setWeekly(wData);
          setHeatmap(hData);
          setCompanyStats(cData);
        }
      } catch (e) {
        console.warn('[DsaAnalyticsTab] Failed to load analytics:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!analytics) return null;

  const maxWeeklySolved = Math.max(1, ...weekly.map((w) => Math.max(w.solved, w.target)));

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 4:
        return '#10B981';
      case 3:
        return 'rgba(16, 185, 129, 0.75)';
      case 2:
        return 'rgba(16, 185, 129, 0.5)';
      case 1:
        return 'rgba(16, 185, 129, 0.25)';
      default:
        return colors.surfaceRaised;
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingBottom: spacing.huge + 35 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Hero Card */}
      <View style={[styles.heroCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
        <View style={styles.heroTop}>
          <View>
            <Text style={[styles.heroSub, { color: colors.textMuted }]}>ALL-TIME SOLVE RATIO</Text>
            <Text style={[styles.heroCount, { color: colors.textPrimary }]}>
              {analytics.totalSolved}
              <Text style={[styles.heroTotal, { color: colors.textMuted }]}> / {analytics.totalProblems} Solved</Text>
            </Text>
          </View>
          <View style={styles.heroRateBadge}>
            <Text style={styles.heroRateVal}>{analytics.solveRate}%</Text>
            <Text style={styles.heroRateLabel}>Solved</Text>
          </View>
        </View>

        <ProgressBar progress={analytics.solveRate / 100} color="#10B981" height={8} />

        <View style={styles.heroBreakdownRow}>
          <View style={styles.heroBreakdownItem}>
            <Text style={[styles.heroBreakdownVal, { color: DIFFICULTY_COLORS.Easy.color }]}>
              {analytics.easySolved}
            </Text>
            <Text style={[styles.heroBreakdownLabel, { color: colors.textMuted }]}>Easy</Text>
          </View>
          <View style={styles.heroBreakdownItem}>
            <Text style={[styles.heroBreakdownVal, { color: DIFFICULTY_COLORS.Medium.color }]}>
              {analytics.mediumSolved}
            </Text>
            <Text style={[styles.heroBreakdownLabel, { color: colors.textMuted }]}>Medium</Text>
          </View>
          <View style={styles.heroBreakdownItem}>
            <Text style={[styles.heroBreakdownVal, { color: DIFFICULTY_COLORS.Hard.color }]}>
              {analytics.hardSolved}
            </Text>
            <Text style={[styles.heroBreakdownLabel, { color: colors.textMuted }]}>Hard</Text>
          </View>
        </View>
      </View>

      {/* 2. Key Metrics Grid */}
      <View style={styles.metricsGrid}>
        <StatCard
          label="Attempt / Solve Ratio"
          value={`${analytics.attemptToSolveRatio}x`}
          subtext="Total attempts per solve"
          accentColor="#38BDF8"
          icon={<TrendingUp size={16} color="#38BDF8" />}
          style={styles.halfCard}
        />
        <StatCard
          label="Avg Attempts / Problem"
          value={analytics.avgAttemptsPerSolved}
          subtext="Trial rounds before AC"
          accentColor="#F59E0B"
          icon={<Clock size={16} color="#F59E0B" />}
          style={styles.halfCard}
        />
      </View>

      <View style={styles.metricsGrid}>
        <StatCard
          label="Revision Completion"
          value={`${analytics.revisionCompletionRate}%`}
          subtext="Spaced intervals cleared"
          accentColor="#818CF8"
          icon={<RotateCcw size={16} color="#818CF8" />}
          style={styles.halfCard}
        />
        <StatCard
          label="Total Coding Time"
          value={`${analytics.totalCodingHours} hrs`}
          subtext="Study & practice logged"
          accentColor="#10B981"
          icon={<Award size={16} color="#10B981" />}
          style={styles.halfCard}
        />
      </View>

      {/* 3. 7-Day Solving Activity Bar Chart */}
      <View style={styles.sectionMargin}>
        <SectionHeader
          title="7-Day Problem Solving Activity"
          subtitle="Real-time daily consistency compared against daily target"
        />

        <View style={[styles.chartCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          <View style={styles.chartBarsRow}>
            {weekly.map((w, idx) => {
              const heightPercent = Math.min(100, Math.round((w.solved / maxWeeklySolved) * 100));
              const isToday = idx === weekly.length - 1;

              return (
                <View key={w.date} style={styles.barCol}>
                  <Text style={[styles.barCount, { color: w.solved > 0 ? '#10B981' : colors.textMuted }]}>
                    {w.solved}
                  </Text>
                  <View style={[styles.barTrack, { backgroundColor: colors.surface }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${Math.max(8, heightPercent)}%`,
                          backgroundColor: isToday ? '#10B981' : '#38BDF8',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDay, { color: isToday ? '#10B981' : colors.textMuted, fontWeight: isToday ? '800' : '500' }]}>
                    {w.dayName}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* 4. Consistency Heatmap (6 Weeks / 42 Days) */}
      <View style={styles.sectionMargin}>
        <SectionHeader
          title="Coding Consistency Heatmap"
          subtitle="42-day activity calendar based on actual solving & study sessions"
        />

        <View style={[styles.heatmapCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          <View style={styles.heatmapGrid}>
            {heatmap.map((day) => (
              <View
                key={day.date}
                style={[
                  styles.heatmapCell,
                  {
                    backgroundColor: getHeatmapColor(day.level),
                    borderColor: day.level > 0 ? 'rgba(0,0,0,0.2)' : colors.borderSubtle,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.heatmapLegend}>
            <Text style={[styles.legendText, { color: colors.textMuted }]}>Less</Text>
            <View style={[styles.legendCell, { backgroundColor: colors.surface }]} />
            <View style={[styles.legendCell, { backgroundColor: 'rgba(16, 185, 129, 0.25)' }]} />
            <View style={[styles.legendCell, { backgroundColor: 'rgba(16, 185, 129, 0.5)' }]} />
            <View style={[styles.legendCell, { backgroundColor: 'rgba(16, 185, 129, 0.75)' }]} />
            <View style={[styles.legendCell, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.legendText, { color: colors.textMuted }]}>More</Text>
          </View>
        </View>
      </View>

      {/* 5. Weakest vs Strongest Topics */}
      <View style={styles.sectionMargin}>
        <SectionHeader
          title="Topic Proficiency Insights"
          subtitle="Target areas with low accuracy and reinforce your strongest patterns"
        />

        {/* Weakest */}
        {analytics.weakestTopics.length > 0 && (
          <View style={[styles.topicGroupCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, marginBottom: 12 }]}>
            <View style={styles.topicGroupHeader}>
              <AlertTriangle size={18} color="#EF4444" />
              <Text style={[styles.topicGroupTitle, { color: '#EF4444' }]}>Focus Areas (Lowest Solve Rate)</Text>
            </View>

            {analytics.weakestTopics.map((item) => (
              <View key={`weak-${item.topic}`} style={styles.topicRowItem}>
                <View style={styles.topicRowInfo}>
                  <Text style={[styles.topicRowName, { color: colors.textPrimary }]}>{item.topic}</Text>
                  <Text style={[styles.topicRowCount, { color: colors.textMuted }]}>
                    {item.solved}/{item.total} solved
                  </Text>
                </View>
                <View style={styles.topicRowBar}>
                  <ProgressBar progress={item.percent / 100} color="#EF4444" height={5} />
                </View>
                <Text style={[styles.topicRowPercent, { color: '#EF4444' }]}>{item.percent}%</Text>
              </View>
            ))}
          </View>
        )}

        {/* Strongest */}
        {analytics.strongestTopics.length > 0 && (
          <View style={[styles.topicGroupCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
            <View style={styles.topicGroupHeader}>
              <Award size={18} color="#10B981" />
              <Text style={[styles.topicGroupTitle, { color: '#10B981' }]}>Strongest Areas</Text>
            </View>

            {analytics.strongestTopics.map((item) => (
              <View key={`strong-${item.topic}`} style={styles.topicRowItem}>
                <View style={styles.topicRowInfo}>
                  <Text style={[styles.topicRowName, { color: colors.textPrimary }]}>{item.topic}</Text>
                  <Text style={[styles.topicRowCount, { color: colors.textMuted }]}>
                    {item.solved}/{item.total} solved
                  </Text>
                </View>
                <View style={styles.topicRowBar}>
                  <ProgressBar progress={item.percent / 100} color="#10B981" height={5} />
                </View>
                <Text style={[styles.topicRowPercent, { color: '#10B981' }]}>{item.percent}%</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 6. Company Tag Distribution */}
      {companyStats.length > 0 && (
        <View style={styles.sectionMargin}>
          <SectionHeader
            title="Company-Wise DSA Preparation"
            subtitle="Problems solved by company recruitment profiles"
          />

          <View style={[styles.companyCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
            {companyStats.map((comp) => (
              <View key={comp.companyName} style={styles.companyRow}>
                <View style={styles.companyLeft}>
                  <Text style={[styles.companyName, { color: colors.textPrimary }]}>{comp.companyName}</Text>
                  <Text style={[styles.companyMeta, { color: colors.textMuted }]}>
                    {comp.solvedProblems} of {comp.totalProblems} solved • {comp.easyCount}E {comp.mediumCount}M {comp.hardCount}H
                  </Text>
                </View>
                <View style={styles.companyRight}>
                  <Text style={[styles.companyPercent, { color: '#38BDF8' }]}>{comp.completionPercent}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heroCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroCount: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  heroTotal: {
    fontSize: 14,
    fontWeight: '500',
  },
  heroRateBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  heroRateVal: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: '800',
  },
  heroRateLabel: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroBreakdownItem: {
    alignItems: 'center',
  },
  heroBreakdownVal: {
    fontSize: 17,
    fontWeight: '800',
  },
  heroBreakdownLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  metricsGrid: {
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
  chartCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barCount: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barDay: {
    fontSize: 11,
    marginTop: 6,
  },
  heatmapCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'center',
  },
  heatmapCell: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 12,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    marginHorizontal: 4,
  },
  topicGroupCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
  },
  topicGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  topicGroupTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  topicRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  topicRowInfo: {
    width: 110,
  },
  topicRowName: {
    fontSize: 12,
    fontWeight: '600',
  },
  topicRowCount: {
    fontSize: 10,
  },
  topicRowBar: {
    flex: 1,
  },
  topicRowPercent: {
    width: 38,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  companyCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
  },
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  companyLeft: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
  },
  companyMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  companyRight: {
    marginLeft: 12,
  },
  companyPercent: {
    fontSize: 14,
    fontWeight: '800',
  },
});
