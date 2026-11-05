import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Filter,
  Plus,
  ArrowUpDown,
  FileText,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SearchInput, EmptyState } from '@/components';
import { ApplicationWithCompany } from '@/database/repositories/ApplicationRepository';
import {
  ApplicationStatus,
  APPLICATION_STATUS_METADATA,
} from '../types';
import { formatDate } from '@/utils';

interface ApplicationListTabProps {
  applications: ApplicationWithCompany[];
  refreshing: boolean;
  onRefresh: () => void;
  onSelectApplication: (id: string) => void;
  onOpenAddModal: () => void;
}

const FILTER_STATUSES: Array<{ value: string; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active Pipeline' },
  { value: 'WISHLIST', label: 'Wishlist' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'ASSESSMENT', label: 'Assessment' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFERED', label: 'Offered' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const ApplicationListTab: React.FC<ApplicationListTabProps> = ({
  applications,
  refreshing,
  onRefresh,
  onSelectApplication,
  onOpenAddModal,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'ctc'>('newest');

  const filteredApplications = applications
    .filter((app) => {
      // Search query
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchRole = app.roleTitle.toLowerCase().includes(q);
        const matchComp = app.companyName.toLowerCase().includes(q);
        const matchSource = app.source?.toLowerCase().includes(q);
        if (!matchRole && !matchComp && !matchSource) return false;
      }

      // Status filter
      if (selectedStatus === 'ACTIVE') {
        const activeSet = ['APPLIED', 'ASSESSMENT', 'SHORTLISTED', 'INTERVIEW', 'ON_HOLD'];
        if (!activeSet.includes(app.status)) return false;
      } else if (selectedStatus !== 'ALL') {
        if (app.status !== selectedStatus) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadlineDate) return 1;
        if (!b.deadlineDate) return -1;
        return a.deadlineDate - b.deadlineDate;
      } else if (sortBy === 'ctc') {
        return (b.ctc || 0) - (a.ctc || 0);
      } else {
        return b.createdAt - a.createdAt;
      }
    });

  const renderApplicationItem = ({ item }: { item: ApplicationWithCompany }) => {
    const meta =
      APPLICATION_STATUS_METADATA[item.status as ApplicationStatus] ||
      APPLICATION_STATUS_METADATA.APPLIED;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectApplication(item.id)}
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
        <View style={styles.cardTop}>
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.companyIconWrap,
                { backgroundColor: meta.bgColor },
              ]}
            >
              <Briefcase size={18} color={meta.color} />
            </View>
            <View style={styles.titleWrap}>
              <Text
                style={[
                  styles.roleTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.md },
                ]}
                numberOfLines={1}
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
        </View>

        {/* Highlights Row: Package, Job Type, Source */}
        <View style={styles.highlightRow}>
          {item.ctc ? (
            <View
              style={[
                styles.packagePill,
                {
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  borderRadius: borderRadius.sm,
                },
              ]}
            >
              <Text style={[styles.packageText, { color: '#10B981' }]}>
                ₹{item.ctc} LPA
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.packagePill,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderRadius: borderRadius.sm,
                },
              ]}
            >
              <Text style={[styles.packageText, { color: colors.textMuted }]}>
                CTC Disclosed on Offer
              </Text>
            </View>
          )}

          <View
            style={[
              styles.metaPill,
              {
                backgroundColor: colors.surfaceRaised,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.metaPillText,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
              ]}
            >
              {item.jobType || 'Full-time'}
            </Text>
          </View>

          <View
            style={[
              styles.metaPill,
              {
                backgroundColor: colors.surfaceRaised,
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.metaPillText,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
              ]}
            >
              {item.source || 'Campus'}
            </Text>
          </View>
        </View>

        {/* Bottom Dates Row */}
        <View style={styles.cardBottomRow}>
          <View style={styles.dateItem}>
            <Calendar size={12} color={colors.textMuted} />
            <Text
              style={[
                styles.dateText,
                { color: colors.textMuted, fontSize: typography.fontSizes.xs },
              ]}
            >
              Applied: {formatDate(item.appliedDate)}
            </Text>
          </View>

          {item.deadlineDate ? (
            <View style={styles.dateItem}>
              <Clock size={12} color="#F59E0B" />
              <Text
                style={[
                  styles.dateText,
                  { color: '#F59E0B', fontSize: typography.fontSizes.xs },
                ]}
              >
                Deadline: {formatDate(item.deadlineDate)}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { padding: spacing.md }]}>
      {/* Search Input */}
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search applications by role, company, or source..."
      />

      {/* Status Chips Horizontal Scroll */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_STATUSES.map((st) => (
            <TouchableOpacity
              key={st.value}
              onPress={() => setSelectedStatus(st.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedStatus === st.value
                      ? colors.primary
                      : colors.surfaceRaised,
                  borderColor:
                    selectedStatus === st.value
                      ? colors.primary
                      : colors.border,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedStatus === st.value
                        ? '#FFFFFF'
                        : colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                  },
                ]}
              >
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort row & Add Button */}
      <View style={styles.sortRow}>
        <View style={styles.sortOptions}>
          <TouchableOpacity
            onPress={() => setSortBy('newest')}
            style={[
              styles.sortBtn,
              sortBy === 'newest' && {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.primary,
              },
              { borderColor: colors.border, borderRadius: borderRadius.sm },
            ]}
          >
            <Text
              style={[
                styles.sortBtnText,
                {
                  color:
                    sortBy === 'newest'
                      ? colors.primary
                      : colors.textSecondary,
                  fontSize: typography.fontSizes.xxs,
                },
              ]}
            >
              Newest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy('deadline')}
            style={[
              styles.sortBtn,
              sortBy === 'deadline' && {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.primary,
              },
              { borderColor: colors.border, borderRadius: borderRadius.sm },
            ]}
          >
            <Text
              style={[
                styles.sortBtnText,
                {
                  color:
                    sortBy === 'deadline'
                      ? colors.primary
                      : colors.textSecondary,
                  fontSize: typography.fontSizes.xxs,
                },
              ]}
            >
              Upcoming Deadline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy('ctc')}
            style={[
              styles.sortBtn,
              sortBy === 'ctc' && {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.primary,
              },
              { borderColor: colors.border, borderRadius: borderRadius.sm },
            ]}
          >
            <Text
              style={[
                styles.sortBtnText,
                {
                  color:
                    sortBy === 'ctc' ? colors.primary : colors.textSecondary,
                  fontSize: typography.fontSizes.xxs,
                },
              ]}
            >
              Highest CTC
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenAddModal}
          style={[
            styles.addAppBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addAppBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Applications List */}
      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicationItem}
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
            title="No Applications Found"
            description={
              search.trim() || selectedStatus !== 'ALL'
                ? 'No applications match your selected filters. Try switching tabs or clearing your search.'
                : 'Start tracking your recruitment pipeline by submitting your first application.'
            }
            actionLabel="+ New Application"
            onAction={onOpenAddModal}
            icon={<Briefcase size={36} color={colors.primary} />}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterSection: {
    marginVertical: 10,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  filterChipText: {
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 4,
  },
  sortBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
  },
  sortBtnText: {
    fontWeight: '700',
  },
  addAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addAppBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  listContainer: {
    flexGrow: 1,
  },
  card: {
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  companyIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  roleTitle: {
    fontWeight: '800',
  },
  companyName: {
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  packagePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  packageText: {
    fontWeight: '800',
    fontSize: 12,
  },
  metaPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaPillText: {
    fontWeight: '600',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: 8,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontWeight: '600',
  },
});
