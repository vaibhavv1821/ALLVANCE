import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  X,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ConfirmationDialog } from '@/components';
import { ApplicationDetailed, ApplicationWithCompany } from '@/database/repositories/ApplicationRepository';
import { HiringRound } from '@/database/schema/placement';
import { APPLICATION_STATUS_METADATA, ApplicationStatus } from '../types';
import { formatDate, formatTime } from '@/utils';
import { StatusChangeModal } from './StatusChangeModal';
import { HiringRoundFormModal } from './HiringRoundFormModal';

interface ApplicationDetailModalProps {
  visible: boolean;
  application: ApplicationDetailed | null;
  onClose: () => void;
  onEdit: (application: ApplicationWithCompany) => void;
  onDelete: (applicationId: string) => Promise<void>;
  onUpdateStatus: (applicationId: string, newStatus: ApplicationStatus, notes?: string) => Promise<void>;
  onAddRound: (data: any) => Promise<void>;
  onUpdateRound: (roundId: string, data: any) => Promise<void>;
  onDeleteRound: (roundId: string) => Promise<void>;
  onOpenAddOffer: (application: ApplicationWithCompany) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  visible,
  application,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus,
  onAddRound,
  onUpdateRound,
  onDeleteRound,
  onOpenAddOffer,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const router = useRouter();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRoundModal, setShowRoundModal] = useState(false);
  const [editingRound, setEditingRound] = useState<HiringRound | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!application) return null;

  const meta =
    APPLICATION_STATUS_METADATA[application.status as ApplicationStatus] ||
    APPLICATION_STATUS_METADATA.APPLIED;

  const handleDelete = async () => {
    await onDelete(application.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleQuickClearRound = async (round: HiringRound) => {
    await onUpdateRound(round.id, {
      completionStatus: 'COMPLETED',
      result: 'CLEARED',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.border, padding: spacing.md },
            ]}
          >
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: meta.bgColor },
                ]}
              >
                <Briefcase size={20} color={meta.color} />
              </View>
              <View style={styles.headerTitleWrap}>
                <Text
                  style={[
                    styles.roleTitle,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.lg },
                  ]}
                  numberOfLines={1}
                >
                  {application.roleTitle}
                </Text>
                <Text
                  style={[
                    styles.companyName,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {application.companyName}
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => onEdit(application)}
                style={[
                  styles.iconActionBtn,
                  { backgroundColor: colors.surfaceRaised },
                ]}
              >
                <Edit2 size={16} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(true)}
                style={[
                  styles.iconActionBtn,
                  { backgroundColor: colors.dangerMuted },
                ]}
              >
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.iconActionBtn}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={[styles.body, { padding: spacing.md }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Status Control Card */}
            <View
              style={[
                styles.statusCard,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: meta.color,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                },
              ]}
            >
              <View style={styles.statusCardLeft}>
                <Text
                  style={[
                    styles.currentStatusLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
                  ]}
                >
                  CURRENT STAGE
                </Text>
                <View style={styles.statusBadgeRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: meta.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusName,
                      { color: meta.color, fontSize: typography.fontSizes.md },
                    ]}
                  >
                    {meta.label}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.statusDescText,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {meta.description}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowStatusModal(true)}
                style={[
                  styles.changeStatusBtn,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  },
                ]}
              >
                <Text style={styles.changeStatusBtnText}>Advance Stage</Text>
              </TouchableOpacity>
            </View>

            {/* Compensation & Details Row */}
            <View style={styles.detailsGrid}>
              <View
                style={[
                  styles.detailCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.borderSubtle,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
                  ]}
                >
                  Total CTC
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: '#10B981', fontSize: typography.fontSizes.md },
                  ]}
                >
                  {application.ctc ? `₹${application.ctc} LPA` : 'Not Disclosed'}
                </Text>
              </View>

              <View
                style={[
                  styles.detailCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.borderSubtle,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
                  ]}
                >
                  Job Type
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                  ]}
                >
                  {application.jobType || 'Full-time'}
                </Text>
              </View>

              <View
                style={[
                  styles.detailCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.borderSubtle,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
                  ]}
                >
                  Source
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                  ]}
                >
                  {application.source || 'Campus'}
                </Text>
              </View>
            </View>

            {/* Fixed vs Variable breakdown if present */}
            {(application.fixedSalary || application.variableSalary) && (
              <View
                style={[
                  styles.salaryBreakdownBox,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                    marginBottom: spacing.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.salaryBreakdownText,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Base Fixed:{' '}
                  <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
                    {application.fixedSalary ? `₹${application.fixedSalary} LPA` : 'N/A'}
                  </Text>
                  {'   •   '}
                  Variable Bonus:{' '}
                  <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
                    {application.variableSalary ? `₹${application.variableSalary} LPA` : 'N/A'}
                  </Text>
                </Text>
              </View>
            )}

            {/* Applied Date & Resume Version */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Calendar size={14} color={colors.textMuted} />
                <Text
                  style={[
                    styles.metaText,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Applied: {formatDate(application.appliedDate)}
                </Text>
              </View>

              {application.resumeVersion ? (
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    router.push('/resume');
                  }}
                  activeOpacity={0.7}
                  style={styles.metaItem}
                >
                  <FileText size={14} color={colors.accent} />
                  <Text
                    style={[
                      styles.metaText,
                      { color: colors.accent, fontSize: typography.fontSizes.xs, textDecorationLine: 'underline' },
                    ]}
                  >
                    Resume: {application.resumeVersion}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Hiring Rounds Manager */}
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                ]}
              >
                Hiring Rounds ({application.hiringRounds?.length || 0})
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingRound(null);
                  setShowRoundModal(true);
                }}
                style={[
                  styles.addSmallBtn,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.full,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 4,
                  },
                ]}
              >
                <Plus size={12} color="#FFFFFF" />
                <Text style={styles.addSmallBtnText}>Add Round</Text>
              </TouchableOpacity>
            </View>

            {application.hiringRounds && application.hiringRounds.length > 0 ? (
              application.hiringRounds.map((round, idx) => (
                <View
                  key={round.id}
                  style={[
                    styles.roundCard,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor:
                        round.result === 'CLEARED'
                          ? '#10B981'
                          : round.result === 'REJECTED'
                          ? '#EF4444'
                          : colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                      marginBottom: spacing.sm,
                    },
                  ]}
                >
                  <View style={styles.roundTop}>
                    <View style={styles.roundTitleWrap}>
                      <Text
                        style={[
                          styles.roundNum,
                          { color: colors.primary, fontSize: typography.fontSizes.xxs },
                        ]}
                      >
                        ROUND {round.roundOrder || idx + 1}
                      </Text>
                      <Text
                        style={[
                          styles.roundName,
                          { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                        ]}
                      >
                        {round.roundName}
                      </Text>
                    </View>

                    <View style={styles.roundActions}>
                      {round.result !== 'CLEARED' && (
                        <TouchableOpacity
                          onPress={() => handleQuickClearRound(round)}
                          style={[
                            styles.quickClearBtn,
                            {
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              borderRadius: borderRadius.sm,
                            },
                          ]}
                        >
                          <CheckCircle2 size={14} color="#10B981" />
                          <Text style={[styles.quickClearText, { color: '#10B981' }]}>
                            Clear
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        onPress={() => {
                          setEditingRound(round);
                          setShowRoundModal(true);
                        }}
                        style={styles.iconMini}
                      >
                        <Edit2 size={14} color={colors.textSecondary} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => onDeleteRound(round.id)}
                        style={styles.iconMini}
                      >
                        <Trash2 size={14} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Score & Result */}
                  <View style={styles.roundMetaRow}>
                    <View
                      style={[
                        styles.resultBadge,
                        {
                          backgroundColor:
                            round.result === 'CLEARED'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : round.result === 'REJECTED'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          borderRadius: borderRadius.sm,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.resultText,
                          {
                            color:
                              round.result === 'CLEARED'
                                ? '#10B981'
                                : round.result === 'REJECTED'
                                ? '#EF4444'
                                : '#F59E0B',
                            fontSize: typography.fontSizes.xxs,
                          },
                        ]}
                      >
                        {round.result}
                      </Text>
                    </View>

                    {round.score ? (
                      <Text
                        style={[
                          styles.scoreText,
                          { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                        ]}
                      >
                        Score: {round.score}
                      </Text>
                    ) : null}

                    {round.scheduledDate ? (
                      <Text
                        style={[
                          styles.roundDateText,
                          { color: colors.textMuted, fontSize: typography.fontSizes.xxs },
                        ]}
                      >
                        {formatDate(round.scheduledDate)}
                      </Text>
                    ) : null}
                  </View>

                  {round.questionsAsked ? (
                    <Text
                      style={[
                        styles.roundQuestions,
                        { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                      ]}
                    >
                      Questions: {round.questionsAsked}
                    </Text>
                  ) : null}
                </View>
              ))
            ) : (
              <View
                style={[
                  styles.emptyRoundsBox,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.emptyRoundsText,
                    { color: colors.textMuted, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  No hiring rounds configured. Add OA, technical rounds, or HR interview to track results.
                </Text>
              </View>
            )}

            {/* Status History Timeline */}
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                ]}
              >
                Status History Timeline ({application.statusHistory?.length || 0})
              </Text>
            </View>

            <View
              style={[
                styles.timelineCard,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              {application.statusHistory && application.statusHistory.length > 0 ? (
                application.statusHistory.map((item, idx) => {
                  const toMeta =
                    APPLICATION_STATUS_METADATA[item.toStatus as ApplicationStatus] ||
                    APPLICATION_STATUS_METADATA.APPLIED;
                  return (
                    <View key={item.id} style={styles.timelineItem}>
                      <View style={styles.timelineLeftCol}>
                        <View
                          style={[
                            styles.timelineDot,
                            { backgroundColor: toMeta.color },
                          ]}
                        />
                        {idx !== application.statusHistory.length - 1 && (
                          <View
                            style={[
                              styles.timelineLine,
                              { backgroundColor: colors.border },
                            ]}
                          />
                        )}
                      </View>
                      <View style={styles.timelineRightCol}>
                        <View style={styles.timelineTitleRow}>
                          <Text
                            style={[
                              styles.timelineStatusName,
                              { color: toMeta.color, fontSize: typography.fontSizes.xs },
                            ]}
                          >
                            {toMeta.label}
                          </Text>
                          <Text
                            style={[
                              styles.timelineTime,
                              { color: colors.textMuted, fontSize: typography.fontSizes.xxs },
                            ]}
                          >
                            {formatDate(item.changedAt)} {formatTime(item.changedAt)}
                          </Text>
                        </View>
                        {item.notes ? (
                          <Text
                            style={[
                              styles.timelineNotes,
                              { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                            ]}
                          >
                            {item.notes}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text style={{ color: colors.textMuted }}>No history recorded.</Text>
              )}
            </View>

            {/* Offer action button if offered */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onOpenAddOffer(application)}
              style={[
                styles.logOfferBtn,
                {
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  borderColor: '#10B981',
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.xl,
                },
              ]}
            >
              <Award size={18} color="#10B981" />
              <Text style={styles.logOfferBtnText}>
                {application.offer ? 'View Extended Offer' : 'Log Official Offer Letter'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Status Changer Modal */}
          <StatusChangeModal
            visible={showStatusModal}
            currentStatus={application.status as ApplicationStatus}
            companyName={application.companyName}
            roleTitle={application.roleTitle}
            onClose={() => setShowStatusModal(false)}
            onSubmit={async (newStatus, notes) => {
              await onUpdateStatus(application.id, newStatus, notes);
            }}
          />

          {/* Hiring Round Modal */}
          <HiringRoundFormModal
            visible={showRoundModal}
            applicationId={application.id}
            initialData={editingRound}
            onClose={() => {
              setShowRoundModal(false);
              setEditingRound(null);
            }}
            onSubmit={async (data) => {
              if (editingRound) {
                await onUpdateRound(editingRound.id, data);
              } else {
                await onAddRound(data);
              }
            }}
          />

          {/* Delete confirmation dialog */}
          <ConfirmationDialog
            visible={showDeleteConfirm}
            title={`Delete Application?`}
            message={`Are you sure you want to delete your application for ${application.roleTitle} at ${application.companyName}?`}
            confirmText="Delete Application"
            cancelText="Keep"
            isDestructive={true}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '92%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  roleTitle: {
    fontWeight: '800',
  },
  companyName: {
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingBottom: 32,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 14,
  },
  statusCardLeft: {
    flex: 1,
  },
  currentStatusLabel: {
    fontWeight: '800',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusName: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  statusDescText: {
    marginTop: 2,
  },
  changeStatusBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeStatusBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  detailCard: {
    flex: 1,
    borderWidth: 1,
  },
  detailLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontWeight: '800',
    marginTop: 4,
  },
  salaryBreakdownBox: {
    borderWidth: 1,
  },
  salaryBreakdownText: {
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addSmallBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  roundCard: {
    borderWidth: 1,
  },
  roundTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundTitleWrap: {
    flex: 1,
  },
  roundNum: {
    fontWeight: '800',
  },
  roundName: {
    fontWeight: '700',
    marginTop: 2,
  },
  roundActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickClearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quickClearText: {
    fontWeight: '700',
    fontSize: 11,
  },
  iconMini: {
    padding: 4,
  },
  roundMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  resultBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  resultText: {
    fontWeight: '800',
  },
  scoreText: {
    fontWeight: '600',
  },
  roundDateText: {
    fontWeight: '600',
  },
  roundQuestions: {
    marginTop: 6,
  },
  emptyRoundsBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyRoundsText: {
    lineHeight: 18,
  },
  timelineCard: {
    borderWidth: 1,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeftCol: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineRightCol: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 14,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineStatusName: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  timelineTime: {
    fontWeight: '600',
  },
  timelineNotes: {
    marginTop: 2,
  },
  logOfferBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  logOfferBtnText: {
    color: '#10B981',
    fontWeight: '800',
  },
});
