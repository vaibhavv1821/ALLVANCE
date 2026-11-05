import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Briefcase,
  Code2,
  Database,
  Sparkles,
  Bot,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Compass,
  Activity,
  Layers,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useDemoStore } from '@/store/useDemoStore';
import {
  StatCard,
  ProgressBar,
  SectionHeader,
  PrimaryButton,
  EmptyState,
  ConfirmationDialog,
} from '@/components';
import { ALL_MODULES } from '@/constants/modules';
import { getModuleIcon } from '@/utils/iconMap';
import { placementDashboardRepository } from '@/database/repositories/PlacementDashboardRepository';

export const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, isDark, toggleTheme } = useAppTheme();
  const { isDemoMode, toggleDemoMode } = useDemoStore();
  const [quickActionDialog, setQuickActionDialog] = useState<string | null>(null);
  const [realActiveApps, setRealActiveApps] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveStats = async () => {
      try {
        const m = await placementDashboardRepository.getMetrics();
        if (isMounted) {
          setRealActiveApps(m.activeApplications);
        }
      } catch (e) {
        // Fallback to 0 if database not yet initialized or table empty
      }
    };
    fetchLiveStats();
    return () => {
      isMounted = false;
    };
  }, [isDemoMode]);

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Formatted date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  // Demo mode data vs Zero mode data
  const overallProgress = isDemoMode ? 68 : 0;
  const activeApplications = isDemoMode ? 12 : realActiveApps;
  const dsaProgress = isDemoMode ? 142 : 0;
  const sqlProgress = isDemoMode ? 48 : 0;

  const demoTasks = [
    { id: '1', title: 'Solve 3 Dynamic Programming problems', category: 'DSA', completed: true },
    { id: '2', title: 'Revise SQL window functions & CTEs', category: 'SQL', completed: false },
    { id: '3', title: 'Tailor resume for Senior Mobile role', category: 'Resume', completed: false },
    { id: '4', title: 'Review System Design notes in Knowledge Vault', category: 'System', completed: false },
  ];

  const demoEvents = [
    { id: '1', title: 'Google Technical Phone Screen', time: 'Tomorrow, 2:30 PM', tag: 'Interview' },
    { id: '2', title: 'Amazon OA Deadline', time: 'Friday, 11:59 PM', tag: 'Assessment' },
  ];

  const demoActivities = [
    { id: '1', title: 'Solved "LRU Cache" (Medium)', time: '2 hours ago', icon: 'Code2', color: '#10B981' },
    { id: '2', title: 'Applied to Microsoft - Software Engineer', time: 'Yesterday', icon: 'Briefcase', color: '#38BDF8' },
    { id: '3', title: 'Completed SQL Window Functions Quiz', time: '2 days ago', icon: 'Database', color: '#F59E0B' },
  ];

  const quickActions = [
    { title: 'Solve DSA', icon: <Code2 size={18} color="#10B981" />, route: '/dsa' },
    { title: 'New Application', icon: <Briefcase size={18} color="#38BDF8" />, route: '/placement' },
    { title: 'SQL Studio', icon: <Database size={18} color="#F59E0B" />, route: '/sql' },
    { title: 'AI Assistant', icon: <Bot size={18} color="#A855F7" />, route: '/ai' },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Top Bar with ALLVANCE branding, greeting, and switches */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <View style={styles.brandingRow}>
          {/* Logo Monogram */}
          <View
            style={[
              styles.logoBadge,
              {
                backgroundColor: colors.primaryMuted,
                borderColor: colors.primary,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Sparkles size={20} color={colors.primary} />
          </View>

          <View style={styles.titleColumn}>
            <View style={styles.nameRow}>
              <Text
                style={[
                  styles.brandName,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.fontSizes.lg,
                    fontWeight: typography.fontWeights.bold,
                  },
                ]}
              >
                ALLVANCE
              </Text>
              <Text
                style={[
                  styles.greetingText,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.sm,
                    marginLeft: spacing.sm,
                  },
                ]}
              >
                • {getGreeting()}
              </Text>
            </View>
            <Text
              style={[
                styles.dateText,
                { color: colors.textMuted, fontSize: typography.fontSizes.xs },
              ]}
            >
              {formattedDate}
            </Text>
          </View>
        </View>

        {/* Right Action Controls: Demo Switch & Theme Toggle */}
        <View style={styles.headerControls}>
          {/* Demo Mode Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleDemoMode}
            style={[
              styles.demoBadge,
              {
                backgroundColor: isDemoMode ? colors.primary : colors.surfaceRaised,
                borderColor: isDemoMode ? colors.primary : colors.border,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.demoText,
                {
                  color: isDemoMode
                    ? isDark
                      ? '#090D16'
                      : '#FFFFFF'
                    : colors.textSecondary,
                  fontSize: typography.fontSizes.xxs,
                  fontWeight: typography.fontWeights.bold,
                },
              ]}
            >
              {isDemoMode ? 'DEMO ON' : 'DEMO OFF'}
            </Text>
          </TouchableOpacity>

          {/* Theme Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleTheme}
            style={[
              styles.themeToggleBtn,
              {
                backgroundColor: colors.surfaceRaised,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            {isDark ? (
              <Sun size={18} color={colors.warning} />
            ) : (
              <Moon size={18} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { padding: spacing.lg, paddingBottom: spacing.huge + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Progress Banner */}
        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.xl,
              padding: spacing.lg,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <View style={styles.progressHeader}>
            <View>
              <Text
                style={[
                  styles.progressTitle,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.fontSizes.lg,
                    fontWeight: typography.fontWeights.bold,
                  },
                ]}
              >
                Overall Preparation
              </Text>
              <Text
                style={[
                  styles.progressSubtitle,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                    marginTop: 2,
                  },
                ]}
              >
                {isDemoMode
                  ? 'Great momentum! 68% of readiness targets met'
                  : 'Start your journey. Practice problems & track goals'}
              </Text>
            </View>
            <View
              style={[
                styles.percentCircle,
                {
                  backgroundColor: colors.primaryMuted,
                  borderRadius: borderRadius.round,
                },
              ]}
            >
              <Text
                style={[
                  styles.percentValue,
                  {
                    color: colors.primary,
                    fontSize: typography.fontSizes.lg,
                    fontWeight: typography.fontWeights.bold,
                  },
                ]}
              >
                {overallProgress}%
              </Text>
            </View>
          </View>

          <ProgressBar
            progress={overallProgress}
            showPercentage={false}
            height={8}
            style={{ marginTop: spacing.md }}
          />
        </View>

        {/* Key Metrics Stats Grid */}
        <View style={[styles.statsGrid, { marginBottom: spacing.lg }]}>
          <StatCard
            label="Applications"
            value={activeApplications}
            subtext={isDemoMode ? '3 interviews scheduled' : '0 active'}
            accentColor="#38BDF8"
            icon={<Briefcase size={16} color="#38BDF8" />}
            onPress={() => router.push('/placement')}
            style={styles.halfCard}
          />
          <StatCard
            label="DSA Problems"
            value={dsaProgress}
            subtext={isDemoMode ? '3 solved this week' : '0 solved'}
            accentColor="#10B981"
            icon={<Code2 size={16} color="#10B981" />}
            onPress={() => router.push('/dsa')}
            style={styles.halfCard}
          />
        </View>

        <View style={[styles.statsGrid, { marginBottom: spacing.lg }]}>
          <StatCard
            label="SQL Queries"
            value={sqlProgress}
            subtext={isDemoMode ? 'Advanced sets mastered' : '0 solved'}
            accentColor="#F59E0B"
            icon={<Database size={16} color="#F59E0B" />}
            onPress={() => router.push('/sql')}
            style={styles.halfCard}
          />
          <StatCard
            label="Today's Tasks"
            value={isDemoMode ? '1/4' : '0/0'}
            subtext={isDemoMode ? '2 high priority' : 'No tasks'}
            accentColor="#A855F7"
            icon={<CheckCircle2 size={16} color="#A855F7" />}
            onPress={() => router.push('/planner')}
            style={styles.halfCard}
          />
        </View>

        {/* Quick Actions */}
        <SectionHeader
          title="Quick Actions"
          subtitle="Fast shortcuts for high-frequency actions"
          style={{ marginTop: spacing.xs }}
        />
        <View style={[styles.quickActionsRow, { marginBottom: spacing.xl }]}>
          {quickActions.map((action, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => router.push(action.route as any)}
              style={[
                styles.quickActionBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colors.surfaceRaised },
                ]}
              >
                {action.icon}
              </View>
              <Text
                style={[
                  styles.quickActionTitle,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.fontSizes.xs,
                    fontWeight: typography.fontWeights.medium,
                  },
                ]}
                numberOfLines={1}
              >
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Tasks */}
        <SectionHeader
          title="Today's Tasks"
          subtitle="Scheduled objectives for today"
          actionLabel="View Planner"
          onAction={() => router.push('/planner')}
        />
        {isDemoMode ? (
          <View
            style={[
              styles.cardBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                marginBottom: spacing.xl,
              },
            ]}
          >
            {demoTasks.map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskItem,
                  { borderBottomColor: colors.borderSubtle },
                ]}
              >
                {task.completed ? (
                  <CheckCircle2 size={20} color={colors.success} />
                ) : (
                  <Circle size={20} color={colors.textMuted} />
                )}
                <View style={styles.taskTextColumn}>
                  <Text
                    style={[
                      styles.taskTitle,
                      {
                        color: task.completed
                          ? colors.textMuted
                          : colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        textDecorationLine: task.completed
                          ? 'line-through'
                          : 'none',
                      },
                    ]}
                  >
                    {task.title}
                  </Text>
                  <Text
                    style={[
                      styles.taskTag,
                      {
                        color: colors.primary,
                        fontSize: typography.fontSizes.xxs,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {task.category}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<CheckCircle2 size={26} color={colors.textMuted} />}
            title="No Tasks for Today"
            description="Create your first study goal or task for today to build consistency."
            actionLabel="Add Task"
            onAction={() => router.push('/planner')}
            style={{ marginBottom: spacing.xl }}
          />
        )}

        {/* Upcoming Events */}
        <SectionHeader
          title="Upcoming Events"
          subtitle="Interviews, deadlines & assessments"
          actionLabel="Manage"
          onAction={() => router.push('/interviews')}
        />
        {isDemoMode ? (
          <View
            style={[
              styles.cardBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                marginBottom: spacing.xl,
              },
            ]}
          >
            {demoEvents.map((evt) => (
              <View
                key={evt.id}
                style={[
                  styles.eventItem,
                  { borderBottomColor: colors.borderSubtle },
                ]}
              >
                <Calendar size={18} color={colors.accent} />
                <View style={styles.eventTextColumn}>
                  <Text
                    style={[
                      styles.eventTitle,
                      {
                        color: colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: typography.fontWeights.medium,
                      },
                    ]}
                  >
                    {evt.title}
                  </Text>
                  <Text
                    style={[
                      styles.eventTime,
                      {
                        color: colors.textSecondary,
                        fontSize: typography.fontSizes.xs,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {evt.time}
                  </Text>
                </View>
                <View
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: colors.accentMuted,
                      borderRadius: borderRadius.xs,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color: colors.accent,
                        fontSize: typography.fontSizes.xxs,
                      },
                    ]}
                  >
                    {evt.tag}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<Calendar size={26} color={colors.textMuted} />}
            title="No Upcoming Events"
            description="Keep track of upcoming interviews, drive deadlines and exam schedules."
            actionLabel="Add Event"
            onAction={() => router.push('/interviews')}
            style={{ marginBottom: spacing.xl }}
          />
        )}

        {/* Module Shortcuts Grid */}
        <SectionHeader
          title="Module Shortcuts"
          subtitle="Direct access to all 15 growth sections"
          actionLabel="View All (15)"
          onAction={() => router.push('/more')}
        />
        <View style={[styles.moduleGrid, { marginBottom: spacing.xl }]}>
          {ALL_MODULES.slice(0, 6).map((mod) => (
            <TouchableOpacity
              key={mod.id}
              activeOpacity={0.7}
              onPress={() => router.push(mod.route as any)}
              style={[
                styles.moduleGridCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                },
              ]}
            >
              <View
                style={[
                  styles.moduleGridIcon,
                  {
                    backgroundColor: `${mod.accentColor}18`,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                {getModuleIcon(mod.iconName, mod.accentColor, 20)}
              </View>
              <Text
                style={[
                  styles.moduleGridTitle,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.fontSizes.sm,
                    fontWeight: typography.fontWeights.semiBold,
                    marginTop: spacing.sm,
                  },
                ]}
                numberOfLines={1}
              >
                {mod.title}
              </Text>
              <Text
                style={[
                  styles.moduleGridDesc,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xxs,
                    marginTop: 2,
                  },
                ]}
                numberOfLines={2}
              >
                {mod.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <SectionHeader
          title="Recent Activity"
          subtitle="Real-time timeline of your progress"
          actionLabel="Analytics"
          onAction={() => router.push('/analytics')}
        />
        {isDemoMode ? (
          <View
            style={[
              styles.cardBox,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
              },
            ]}
          >
            {demoActivities.map((act) => (
              <View
                key={act.id}
                style={[
                  styles.activityItem,
                  { borderBottomColor: colors.borderSubtle },
                ]}
              >
                <View
                  style={[
                    styles.activityIconCircle,
                    {
                      backgroundColor: `${act.color}18`,
                      borderRadius: borderRadius.round,
                    },
                  ]}
                >
                  {getModuleIcon(act.icon, act.color, 16)}
                </View>
                <View style={styles.activityTextColumn}>
                  <Text
                    style={[
                      styles.activityTitle,
                      {
                        color: colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: typography.fontWeights.medium,
                      },
                    ]}
                  >
                    {act.title}
                  </Text>
                  <Text
                    style={[
                      styles.activityTime,
                      {
                        color: colors.textMuted,
                        fontSize: typography.fontSizes.xxs,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {act.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<Activity size={26} color={colors.textMuted} />}
            title="No Recent Activity"
            description="Activity logs will show here once you solve problems or log applications."
            actionLabel="Explore Modules"
            onAction={() => router.push('/more')}
          />
        )}
      </ScrollView>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={!!quickActionDialog}
        title="Quick Action"
        message={quickActionDialog || ''}
        confirmText="Done"
        cancelText="Close"
        onConfirm={() => setQuickActionDialog(null)}
        onCancel={() => setQuickActionDialog(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleColumn: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    letterSpacing: 0.5,
  },
  greetingText: {},
  dateText: {
    marginTop: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
  },
  demoText: {
    letterSpacing: 0.4,
  },
  themeToggleBtn: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {},
  progressCard: {
    borderWidth: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {},
  progressSubtitle: {
    maxWidth: 240,
  },
  percentCircle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentValue: {},
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionTitle: {
    textAlign: 'center',
  },
  cardBox: {
    borderWidth: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  taskTextColumn: {
    marginLeft: 10,
    flex: 1,
  },
  taskTitle: {},
  taskTag: {},
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  eventTextColumn: {
    marginLeft: 10,
    flex: 1,
  },
  eventTitle: {},
  eventTime: {},
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tagText: {
    fontWeight: '600',
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleGridCard: {
    width: '48%',
    borderWidth: 1,
  },
  moduleGridIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleGridTitle: {},
  moduleGridDesc: {
    lineHeight: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  activityIconCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityTextColumn: {
    flex: 1,
  },
  activityTitle: {},
  activityTime: {},
});
