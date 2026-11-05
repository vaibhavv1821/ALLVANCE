import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  XCircle,
  FileCheck2,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StatCard, SectionHeader, EmptyState } from '@/components';
import { PipelineFunnel } from './PipelineFunnel';
import { PlacementDashboardMetrics } from '@/database/repositories/PlacementDashboardRepository';
import {
  APPLICATION_STATUS_METADATA,
  ApplicationStatus,
  PlacementTabType,
} from '../types';
import { formatDate } from '@/utils';

interface PlacementDashboardTabProps {
  metrics: PlacementDashboardMetrics | null;
  refreshing: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: PlacementTabType) => void;
  onOpenNewApplication: () => void;
  onOpenNewCompany: () => void;
  onOpenNewInterview: () => void;
  onOpenNewOffer: () => void;
  onSelectApplication: (id: string) => void;
}

export const PlacementDashboardTab: React.FC<PlacementDashboardTabProps> = ({
  metrics,
  refreshing,
  onRefresh,
  onNavigateTab,
  onOpenNewApplication,
  onOpenNewCompany,
  onOpenNewInterview,
  onOpenNewOffer,
  onSelectApplication,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const totalApps = metrics?.totalApplications || 0;
  const activeApps = metrics?.activeApplications || 0;
  const totalComps = metrics?.totalCompanies || 0;
  const upcomingAssess = metrics?.upcomingAssessments || 0;
  const interviewsSched = metrics?.interviewsScheduled || 0;
  const offersCount = metrics?.offersReceived || 0;
  const rejectionsCount = metrics?.rejections || 0;
  const conversionRate = metrics?.conversionRate || 0;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { padding: spacing.md, paddingBottom: spacing.xxxl },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Quick Action Pills */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenNewApplication}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            },
          ]}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
            Apply
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenNewCompany}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: borderRadius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            },
          ]}
        >
          <Building2 size={16} color={colors.textPrimary} />
          <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
            + Company
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenNewInterview}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: borderRadius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            },
          ]}
        >
          <Calendar size={16} color={colors.accent} />
          <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
            + Experience
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenNewOffer}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: borderRadius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            },
          ]}
        >
          <Sparkles size={16} color={colors.success} />
          <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
            + Offer
          </Text>
        </TouchableOpacity>
      </View>

      {/* KPI Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          label="Active Pipeline"
          value={activeApps}
          subtext={`${totalApps} Total Applications`}
          icon={<Briefcase size={18} color="#38BDF8" />}
          accentColor="#38BDF8"
          onPress={() => onNavigateTab('applications')}
          style={styles.halfCard}
        />
        <StatCard
          label="Total Companies"
          value={totalComps}
          subtext="Recruitment Network"
          icon={<Building2 size={18} color="#818CF8" />}
          accentColor="#818CF8"
          onPress={() => onNavigateTab('companies')}
          style={styles.halfCard}
        />
        <StatCard
          label="Upcoming Assessments"
          value={upcomingAssess}
          subtext="OA & Online Tests"
          icon={<Clock size={18} color="#F59E0B" />}
          accentColor="#F59E0B"
          style={styles.halfCard}
        />
        <StatCard
          label="Interviews Scheduled"
          value={interviewsSched}
          subtext="Technical & HR Rounds"
          icon={<Calendar size={18} color="#A855F7" />}
          accentColor="#A855F7"
          style={styles.halfCard}
        />
        <StatCard
          label="Offers Extended"
          value={offersCount}
          subtext={`${conversionRate}% Conversion Rate`}
          icon={<CheckCircle2 size={18} color="#10B981" />}
          accentColor="#10B981"
          onPress={() => onNavigateTab('offers')}
          style={styles.halfCard}
        />
        <StatCard
          label="Rejections"
          value={rejectionsCount}
          subtext="Learning Opportunities"
          icon={<XCircle size={18} color="#EF4444" />}
          accentColor="#EF4444"
          style={styles.halfCard}
        />
      </View>

      {/* Conversion Rate Highlight Banner */}
      <View
        style={[
          styles.conversionCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginVertical: spacing.md,
          },
        ]}
      >
        <View style={styles.conversionLeft}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
            ]}
          >
            <TrendingUp size={22} color="#10B981" />
          </View>
          <View>
            <Text
              style={[
                styles.conversionTitle,
                { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
              ]}
            >
              Overall Offer Conversion Rate
            </Text>
            <Text
              style={[
                styles.conversionSub,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              {offersCount} offer{offersCount === 1 ? '' : 's'} secured out of {totalApps} total applications
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.conversionRateText,
            { color: colors.success, fontSize: typography.fontSizes.xxl },
          ]}
        >
          {conversionRate}%
        </Text>
      </View>

      {/* Application Pipeline Visualizer */}
      <PipelineFunnel
        stages={metrics?.pipelineStages || []}
        totalApplications={totalApps}
        onSelectStage={() => onNavigateTab('applications')}
      />

      {/* Upcoming Events / Rounds */}
      <SectionHeader
        title="Upcoming Rounds & Schedule"
        actionLabel={metrics?.upcomingEvents?.length ? 'View All' : undefined}
        onAction={() => onNavigateTab('applications')}
      />

      {metrics?.upcomingEvents && metrics.upcomingEvents.length > 0 ? (
        metrics.upcomingEvents.map((evt) => (
          <TouchableOpacity
            key={evt.id}
            activeOpacity={0.7}
            onPress={() => onSelectApplication(evt.applicationId)}
            style={[
              styles.eventCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.sm,
              },
            ]}
          >
            <View style={styles.eventRow}>
              <View
                style={[
                  styles.eventIconBox,
                  {
                    backgroundColor:
                      evt.roundType === 'technical' || evt.roundType === 'hr'
                        ? 'rgba(168, 85, 247, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                  },
                ]}
              >
                {evt.roundType === 'technical' || evt.roundType === 'hr' ? (
                  <Calendar size={18} color="#A855F7" />
                ) : (
                  <Clock size={18} color="#F59E0B" />
                )}
              </View>
              <View style={styles.eventDetails}>
                <Text
                  style={[
                    styles.eventTitle,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                  ]}
                >
                  {evt.roundName}
                </Text>
                <Text
                  style={[
                    styles.eventSub,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {evt.companyName} • {evt.roleTitle}
                </Text>
              </View>
              <View style={styles.eventDateBadge}>
                <Text
                  style={[
                    styles.eventDateText,
                    { color: colors.primary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {formatDate(evt.scheduledDate)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={[
            styles.emptyScheduleBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.lg,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.emptyScheduleText,
              { color: colors.textMuted, fontSize: typography.fontSizes.sm },
            ]}
          >
            No upcoming hiring assessments or interviews scheduled.
          </Text>
        </View>
      )}

      {/* Recent Applications */}
      <SectionHeader
        title="Recent Applications"
        actionLabel={metrics?.recentApplications?.length ? 'View All' : undefined}
        onAction={() => onNavigateTab('applications')}
      />

      {metrics?.recentApplications && metrics.recentApplications.length > 0 ? (
        metrics.recentApplications.map((app) => {
          const meta =
            APPLICATION_STATUS_METADATA[app.status as ApplicationStatus] ||
            APPLICATION_STATUS_METADATA.APPLIED;
          return (
            <TouchableOpacity
              key={app.id}
              activeOpacity={0.7}
              onPress={() => onSelectApplication(app.id)}
              style={[
                styles.appCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                },
              ]}
            >
              <View style={styles.appTopRow}>
                <View style={styles.appTitleWrap}>
                  <Text
                    style={[
                      styles.appName,
                      { color: colors.textPrimary, fontSize: typography.fontSizes.md },
                    ]}
                  >
                    {app.companyName}
                  </Text>
                  <Text
                    style={[
                      styles.appRole,
                      { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                    ]}
                  >
                    {app.roleTitle} {app.ctc ? `• ₹${app.ctc} LPA` : ''}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: meta.bgColor,
                      borderColor: meta.color,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: meta.color, fontSize: typography.fontSizes.xxs },
                    ]}
                  >
                    {meta.label}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <EmptyState
          title="No Applications Recorded Yet"
          description="Log your job applications to unlock pipeline tracking, automated conversion metrics, and round scheduling."
          actionLabel="+ New Application"
          onAction={onOpenNewApplication}
          icon={<Briefcase size={36} color={colors.primary} />}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    minWidth: '46%',
  },
  conversionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  conversionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversionTitle: {
    fontWeight: '700',
  },
  conversionSub: {
    marginTop: 2,
  },
  conversionRateText: {
    fontWeight: '900',
    marginLeft: 12,
  },
  eventCard: {
    borderWidth: 1,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: '700',
  },
  eventSub: {
    marginTop: 2,
  },
  eventDateBadge: {
    alignItems: 'flex-end',
  },
  eventDateText: {
    fontWeight: '700',
  },
  emptyScheduleBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyScheduleText: {
    textAlign: 'center',
  },
  appCard: {
    borderWidth: 1,
  },
  appTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitleWrap: {
    flex: 1,
  },
  appName: {
    fontWeight: '700',
  },
  appRole: {
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  statusPillText: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
