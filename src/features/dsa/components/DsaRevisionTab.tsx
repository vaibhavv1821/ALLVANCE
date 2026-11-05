import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  RotateCcw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  ChevronRight,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StatCard, EmptyState } from '@/components';
import { RevisionWithProblem } from '@/database/repositories/DsaRevisionRepository';
import { DIFFICULTY_COLORS } from '../constants';

interface DsaRevisionTabProps {
  revisions: RevisionWithProblem[];
  activeFilter: 'all' | 'due' | 'overdue' | 'upcoming' | 'completed';
  onFilterChange: (filter: 'all' | 'due' | 'overdue' | 'upcoming' | 'completed') => void;
  onOpenCompleteModal: (rev: RevisionWithProblem) => void;
  onSelectProblem: (problemId: string) => void;
}

export const DsaRevisionTab: React.FC<DsaRevisionTabProps> = ({
  revisions,
  activeFilter,
  onFilterChange,
  onOpenCompleteModal,
  onSelectProblem,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const filterTabs = [
    { id: 'due', label: 'Due Today' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'all', label: 'All' },
  ] as const;

  const dueCount = revisions.filter((r) => r.status === 'due').length;
  const overdueCount = revisions.filter((r) => r.status === 'overdue').length;

  return (
    <View style={styles.container}>
      {/* Revision Filters Segmented Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {filterTabs.map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab,
                {
                  backgroundColor: isSelected ? '#818CF8' : colors.surfaceRaised,
                  borderColor: isSelected ? '#818CF8' : colors.border,
                },
              ]}
              onPress={() => onFilterChange(tab.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Revision List */}
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingBottom: spacing.huge + 35 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Helper Banner when Overdue or Due items exist */}
        {activeFilter !== 'completed' && (overdueCount > 0 || dueCount > 0) && (
          <View style={[styles.reminderBanner, { backgroundColor: 'rgba(129, 140, 248, 0.1)', borderColor: 'rgba(129, 140, 248, 0.3)' }]}>
            <RotateCcw size={18} color="#818CF8" />
            <Text style={[styles.reminderText, { color: colors.textPrimary }]}>
              {overdueCount > 0
                ? `${overdueCount} problems overdue for spaced review! Refresh your recall today.`
                : `${dueCount} problems scheduled for revision today.`}
            </Text>
          </View>
        )}

        {revisions.length === 0 ? (
          <EmptyState
            icon={<RotateCcw size={32} color={colors.textMuted} />}
            title="No Revisions in this Category"
            description="When you solve problems, ALLVANCE automatically schedules spaced repetition intervals (1d, 3d, 7d, 15d, 30d)."
          />
        ) : (
          revisions.map((rev) => {
            const diffMeta =
              DIFFICULTY_COLORS[rev.problemDifficulty as 'Easy' | 'Medium' | 'Hard'] ||
              DIFFICULTY_COLORS.Medium;
            const isDone = rev.completedDate !== null;
            const isDue = rev.status === 'due';
            const isOverdue = rev.status === 'overdue';

            const schedStr = new Date(rev.scheduledDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            return (
              <View
                key={rev.id}
                style={[
                  styles.revCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: isOverdue
                      ? 'rgba(239, 68, 68, 0.4)'
                      : isDue
                      ? 'rgba(129, 140, 248, 0.4)'
                      : isDone
                      ? 'rgba(16, 185, 129, 0.3)'
                      : colors.border,
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={[styles.diffTag, { backgroundColor: diffMeta.bg, borderColor: diffMeta.border }]}>
                      <Text style={[styles.diffTagText, { color: diffMeta.color }]}>
                        {rev.problemDifficulty}
                      </Text>
                    </View>
                    <Text style={[styles.topicTag, { color: colors.textMuted }]}>
                      {rev.problemTopic}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isDone
                          ? 'rgba(16, 185, 129, 0.15)'
                          : isOverdue
                          ? 'rgba(239, 68, 68, 0.15)'
                          : isDue
                          ? 'rgba(129, 140, 248, 0.15)'
                          : 'rgba(56, 189, 248, 0.15)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color: isDone
                            ? '#10B981'
                            : isOverdue
                            ? '#EF4444'
                            : isDue
                            ? '#818CF8'
                            : '#38BDF8',
                        },
                      ]}
                    >
                      {isDone
                        ? 'COMPLETED'
                        : isOverdue
                        ? 'OVERDUE'
                        : isDue
                        ? 'DUE TODAY'
                        : 'UPCOMING'}
                    </Text>
                  </View>
                </View>

                {/* Problem Title (Tappable to view detail) */}
                <TouchableOpacity onPress={() => onSelectProblem(rev.problemId)}>
                  <Text style={[styles.probTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                    {rev.problemTitle}
                  </Text>
                </TouchableOpacity>

                {/* Revision Step & Scheduled Info */}
                <View style={styles.schedRow}>
                  <Text style={[styles.stepText, { color: '#818CF8' }]}>
                    Spaced Step #{rev.revisionNumber}
                  </Text>
                  <Text style={[styles.dateText, { color: colors.textMuted }]}>
                    {isDone ? `Reviewed on ${new Date(rev.completedDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : `Scheduled: ${schedStr}`}
                  </Text>
                </View>

                {/* Action or Completed Details */}
                {isDone ? (
                  <View style={styles.completedBox}>
                    <View style={styles.recallRow}>
                      <Text style={[styles.recallLabel, { color: colors.textMuted }]}>Recall Rating:</Text>
                      <Text style={[styles.recallVal, { color: '#10B981' }]}>
                        {rev.recallRating || 'Good'}
                      </Text>
                    </View>
                    {rev.notes ? (
                      <Text style={[styles.notesText, { color: colors.textSecondary }]}>
                        {rev.notes}
                      </Text>
                    ) : null}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.reviewBtn,
                      { backgroundColor: isOverdue ? '#EF4444' : '#818CF8' },
                    ]}
                    onPress={() => onOpenCompleteModal(rev)}
                  >
                    <RotateCcw size={15} color="#FFF" />
                    <Text style={styles.reviewBtnText}>Review & Test Recall</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  reminderText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  revCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diffTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  diffTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  topicTag: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  probTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 8,
  },
  schedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reviewBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  completedBox: {
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  recallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recallLabel: {
    fontSize: 12,
  },
  recallVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  notesText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
