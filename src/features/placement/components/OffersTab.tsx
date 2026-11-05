import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  TrendingUp,
  Sparkles,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { EmptyState, ConfirmationDialog } from '@/components';
import {
  OfferWithDetails,
  OfferAcceptanceStatus,
} from '@/database/repositories/OfferRepository';
import { OFFER_STATUS_METADATA } from '../types';
import { formatDate } from '@/utils';

interface OffersTabProps {
  offers: OfferWithDetails[];
  refreshing: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  onUpdateStatus: (id: string, status: OfferAcceptanceStatus) => Promise<void>;
  onDeleteOffer: (id: string) => Promise<void>;
}

export const OffersTab: React.FC<OffersTabProps> = ({
  offers,
  refreshing,
  onRefresh,
  onOpenAddModal,
  onUpdateStatus,
  onDeleteOffer,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculate Summary metrics
  const totalOffers = offers.length;
  const highestCtc = offers.reduce((max, o) => Math.max(max, o.ctc || 0), 0);
  const avgCtc =
    totalOffers > 0
      ? (offers.reduce((sum, o) => sum + (o.ctc || 0), 0) / totalOffers).toFixed(1)
      : '0';
  const acceptedOffer = offers.find((o) => o.acceptanceStatus === 'ACCEPTED');

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    await onDeleteOffer(deletingId);
    setDeletingId(null);
  };

  const renderOfferItem = ({ item }: { item: OfferWithDetails }) => {
    const meta =
      OFFER_STATUS_METADATA[item.acceptanceStatus as OfferAcceptanceStatus] ||
      OFFER_STATUS_METADATA.PENDING;

    return (
      <View
        style={[
          styles.offerCard,
          {
            backgroundColor: colors.surface,
            borderColor:
              item.acceptanceStatus === 'ACCEPTED' ? '#10B981' : colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
              ]}
            >
              <Award size={22} color="#10B981" />
            </View>
            <View style={styles.headerTitleWrap}>
              <Text
                style={[
                  styles.roleTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.md },
                ]}
              >
                {item.roleTitle}
              </Text>
              <Text
                style={[
                  styles.companyName,
                  { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                ]}
              >
                {item.companyName}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: meta.bgColor,
                  borderColor: meta.color,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: meta.color, fontSize: typography.fontSizes.xxs },
                ]}
              >
                {meta.label}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setDeletingId(item.id)}
              style={styles.trashBtn}
            >
              <Trash2 size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Big CTC Display */}
        <View style={styles.ctcHighlightRow}>
          <View>
            <Text
              style={[
                styles.ctcLabel,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
              ]}
            >
              OFFERED ANNUAL CTC
            </Text>
            <Text
              style={[
                styles.ctcValue,
                { color: '#10B981', fontSize: typography.fontSizes.xxl },
              ]}
            >
              ₹{item.ctc} LPA
            </Text>
          </View>

          {(item.fixedSalary || item.variableSalary) && (
            <View style={styles.ctcBreakdownWrap}>
              {item.fixedSalary ? (
                <Text
                  style={[
                    styles.breakdownItem,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Fixed: <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>₹{item.fixedSalary} LPA</Text>
                </Text>
              ) : null}
              {item.variableSalary ? (
                <Text
                  style={[
                    styles.breakdownItem,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Variable: <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>₹{item.variableSalary} LPA</Text>
                </Text>
              ) : null}
            </View>
          )}
        </View>

        {/* Dates Row */}
        <View style={styles.datesRow}>
          <View style={styles.dateCol}>
            <Calendar size={12} color={colors.textMuted} />
            <Text
              style={[
                styles.dateText,
                { color: colors.textMuted, fontSize: typography.fontSizes.xs },
              ]}
            >
              Offer Received: {formatDate(item.offerDate)}
            </Text>
          </View>

          {item.joiningDate ? (
            <View style={styles.dateCol}>
              <Calendar size={12} color={colors.primary} />
              <Text
                style={[
                  styles.dateText,
                  { color: colors.primary, fontSize: typography.fontSizes.xs },
                ]}
              >
                Joining: {formatDate(item.joiningDate)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Additional notes */}
        {item.notes ? (
          <Text
            style={[
              styles.notesText,
              { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
            ]}
          >
            {item.notes}
          </Text>
        ) : null}

        {/* Decision Actions Bar */}
        <View style={styles.decisionButtonBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onUpdateStatus(item.id, 'ACCEPTED')}
            style={[
              styles.decisionBtn,
              {
                backgroundColor:
                  item.acceptanceStatus === 'ACCEPTED'
                    ? '#10B981'
                    : 'rgba(16, 185, 129, 0.12)',
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <CheckCircle2
              size={14}
              color={item.acceptanceStatus === 'ACCEPTED' ? '#FFFFFF' : '#10B981'}
            />
            <Text
              style={[
                styles.decisionBtnText,
                {
                  color:
                    item.acceptanceStatus === 'ACCEPTED' ? '#FFFFFF' : '#10B981',
                },
              ]}
            >
              Accept
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onUpdateStatus(item.id, 'DECLINED')}
            style={[
              styles.decisionBtn,
              {
                backgroundColor:
                  item.acceptanceStatus === 'DECLINED'
                    ? '#EF4444'
                    : 'rgba(239, 68, 68, 0.12)',
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <XCircle
              size={14}
              color={item.acceptanceStatus === 'DECLINED' ? '#FFFFFF' : '#EF4444'}
            />
            <Text
              style={[
                styles.decisionBtnText,
                {
                  color:
                    item.acceptanceStatus === 'DECLINED' ? '#FFFFFF' : '#EF4444',
                },
              ]}
            >
              Decline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onUpdateStatus(item.id, 'PENDING')}
            style={[
              styles.decisionBtn,
              {
                backgroundColor:
                  item.acceptanceStatus === 'PENDING'
                    ? '#F59E0B'
                    : colors.surfaceRaised,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <Text
              style={[
                styles.decisionBtnText,
                {
                  color:
                    item.acceptanceStatus === 'PENDING'
                      ? '#FFFFFF'
                      : colors.textSecondary,
                },
              ]}
            >
              Under Review
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { padding: spacing.md }]}>
      {/* Top Metric Cards */}
      <View style={styles.metricsRow}>
        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.md,
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
            ]}
          >
            Offers Received
          </Text>
          <Text
            style={[
              styles.metricVal,
              { color: colors.textPrimary, fontSize: typography.fontSizes.xl },
            ]}
          >
            {totalOffers}
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.md,
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
            ]}
          >
            Highest CTC
          </Text>
          <Text
            style={[
              styles.metricVal,
              { color: '#10B981', fontSize: typography.fontSizes.xl },
            ]}
          >
            {highestCtc > 0 ? `₹${highestCtc} LPA` : '0 LPA'}
          </Text>
        </View>

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              padding: spacing.md,
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
            ]}
          >
            Average CTC
          </Text>
          <Text
            style={[
              styles.metricVal,
              { color: '#38BDF8', fontSize: typography.fontSizes.xl },
            ]}
          >
            {totalOffers > 0 ? `₹${avgCtc} LPA` : '0 LPA'}
          </Text>
        </View>
      </View>

      {/* Header bar with Add Offer CTA */}
      <View style={styles.headerBar}>
        <Text
          style={[
            styles.headerTitle,
            { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
          ]}
        >
          Offer Letters & Decisions
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenAddModal}
          style={[
            styles.addOfferBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addOfferBtnText}>+ Log Offer</Text>
        </TouchableOpacity>
      </View>

      {/* Offers List */}
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={renderOfferItem}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: spacing.xxxl },
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
        ListEmptyComponent={
          <EmptyState
            title="No Job Offers Recorded Yet"
            description="When companies extend formal offer letters, document CTC breakdowns, base salary, bonuses, and acceptance status here."
            actionLabel="+ Log First Offer"
            onAction={onOpenAddModal}
            icon={<Award size={36} color="#10B981" />}
          />
        }
      />

      <ConfirmationDialog
        visible={deletingId !== null}
        title="Delete Offer Record?"
        message="Are you sure you want to permanently delete this job offer record?"
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricVal: {
    fontWeight: '900',
    marginTop: 4,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  addOfferBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addOfferBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  listContainer: {
    flexGrow: 1,
  },
  offerCard: {
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  trashBtn: {
    padding: 4,
  },
  ctcHighlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 12,
  },
  ctcLabel: {
    fontWeight: '700',
  },
  ctcValue: {
    fontWeight: '900',
  },
  ctcBreakdownWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  breakdownItem: {
    fontWeight: '600',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  dateCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontWeight: '600',
  },
  notesText: {
    marginVertical: 6,
    fontStyle: 'italic',
  },
  decisionButtonBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.15)',
  },
  decisionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  decisionBtnText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
