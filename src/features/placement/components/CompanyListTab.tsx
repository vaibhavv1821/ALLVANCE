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
  Building2,
  MapPin,
  Globe,
  Plus,
  Briefcase,
  GraduationCap,
  Banknote,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SearchInput, EmptyState, PrimaryButton } from '@/components';
import { CompanyWithCounts } from '@/database/repositories/CompanyRepository';

interface CompanyListTabProps {
  companies: CompanyWithCounts[];
  industries: string[];
  refreshing: boolean;
  onRefresh: () => void;
  onSelectCompany: (company: CompanyWithCounts) => void;
  onOpenAddModal: () => void;
  onOpenApplyToCompany: (company: CompanyWithCounts) => void;
}

export const CompanyListTab: React.FC<CompanyListTabProps> = ({
  companies,
  industries,
  refreshing,
  onRefresh,
  onSelectCompany,
  onOpenAddModal,
  onOpenApplyToCompany,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPLIED' | 'NOT_APPLIED'>('ALL');

  const filteredCompanies = companies.filter((comp) => {
    // Search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchName = comp.name.toLowerCase().includes(q);
      const matchIndustry = comp.industry?.toLowerCase().includes(q);
      const matchLoc = comp.location?.toLowerCase().includes(q);
      if (!matchName && !matchIndustry && !matchLoc) return false;
    }

    // Industry filter
    if (selectedIndustry !== 'ALL') {
      if (comp.industry !== selectedIndustry) return false;
    }

    // Application status filter
    if (statusFilter === 'APPLIED') {
      if (comp.applicationCount === 0) return false;
    } else if (statusFilter === 'NOT_APPLIED') {
      if (comp.applicationCount > 0) return false;
    }

    return true;
  });

  const renderCompanyItem = ({ item }: { item: CompanyWithCounts }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectCompany(item)}
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
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: 'rgba(56, 189, 248, 0.12)' },
              ]}
            >
              <Building2 size={20} color="#38BDF8" />
            </View>
            <View style={styles.headerTextWrap}>
              <Text
                style={[
                  styles.companyName,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.md },
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.industry,
                  { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                ]}
              >
                {item.industry || 'General Industry'}
              </Text>
            </View>
          </View>

          {item.applicationCount > 0 ? (
            <View
              style={[
                styles.appliedBadge,
                {
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  borderColor: '#10B981',
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Text
                style={[
                  styles.appliedBadgeText,
                  { color: '#10B981', fontSize: typography.fontSizes.xxs },
                ]}
              >
                {item.applicationCount} Applied
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onOpenApplyToCompany(item)}
              style={[
                styles.quickApplyBtn,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Plus size={12} color={colors.primary} />
              <Text
                style={[
                  styles.quickApplyText,
                  { color: colors.primary, fontSize: typography.fontSizes.xxs },
                ]}
              >
                Apply
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Highlights Row */}
        <View style={styles.highlightsRow}>
          {item.location ? (
            <View style={styles.highlightItem}>
              <MapPin size={12} color={colors.textMuted} />
              <Text
                style={[
                  styles.highlightText,
                  { color: colors.textMuted, fontSize: typography.fontSizes.xs },
                ]}
                numberOfLines={1}
              >
                {item.location}
              </Text>
            </View>
          ) : null}

          {item.packageRange ? (
            <View style={styles.highlightItem}>
              <Banknote size={12} color="#10B981" />
              <Text
                style={[
                  styles.highlightText,
                  { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                ]}
              >
                {item.packageRange}
              </Text>
            </View>
          ) : null}

          {item.minCgpa ? (
            <View style={styles.highlightItem}>
              <GraduationCap size={12} color="#38BDF8" />
              <Text
                style={[
                  styles.highlightText,
                  { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                ]}
              >
                {item.minCgpa} CGPA
              </Text>
            </View>
          ) : null}
        </View>

        {/* Eligible Branches & Description snippet */}
        {item.eligibleBranches ? (
          <Text
            style={[
              styles.branchesText,
              { color: colors.textMuted, fontSize: typography.fontSizes.xs },
            ]}
            numberOfLines={1}
          >
            Branches: {item.eligibleBranches}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { padding: spacing.md }]}>
      {/* Search Input */}
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search company by name, industry, or location..."
      />

      {/* Industry Filter horizontal scroll */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            onPress={() => setSelectedIndustry('ALL')}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedIndustry === 'ALL'
                    ? colors.primary
                    : colors.surfaceRaised,
                borderColor:
                  selectedIndustry === 'ALL' ? colors.primary : colors.border,
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                {
                  color:
                    selectedIndustry === 'ALL'
                      ? '#FFFFFF'
                      : colors.textSecondary,
                  fontSize: typography.fontSizes.xs,
                },
              ]}
            >
              All Industries ({companies.length})
            </Text>
          </TouchableOpacity>

          {industries.map((ind) => (
            <TouchableOpacity
              key={ind}
              onPress={() => setSelectedIndustry(ind)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedIndustry === ind
                      ? colors.primary
                      : colors.surfaceRaised,
                  borderColor:
                    selectedIndustry === ind ? colors.primary : colors.border,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedIndustry === ind
                        ? '#FFFFFF'
                        : colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                  },
                ]}
              >
                {ind}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Application Status Toggle Filter & Add Button */}
      <View style={styles.subFilterRow}>
        <View style={styles.statusToggleGroup}>
          <TouchableOpacity
            onPress={() => setStatusFilter('ALL')}
            style={[
              styles.statusToggleBtn,
              statusFilter === 'ALL' && {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.primary,
              },
              { borderColor: colors.border, borderRadius: borderRadius.sm },
            ]}
          >
            <Text
              style={[
                styles.statusToggleText,
                {
                  color:
                    statusFilter === 'ALL'
                      ? colors.primary
                      : colors.textSecondary,
                  fontSize: typography.fontSizes.xxs,
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStatusFilter('APPLIED')}
            style={[
              styles.statusToggleBtn,
              statusFilter === 'APPLIED' && {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.primary,
              },
              { borderColor: colors.border, borderRadius: borderRadius.sm },
            ]}
          >
            <Text
              style={[
                styles.statusToggleText,
                {
                  color:
                    statusFilter === 'APPLIED'
                      ? colors.primary
                      : colors.textSecondary,
                  fontSize: typography.fontSizes.xxs,
                },
              ]}
            >
              Applied
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStatusFilter('NOT_APPLIED')}
            style={[
              styles.statusToggleBtn,
              statusFilter === 'NOT_APPLIED' && {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.primary,
              },
              { borderColor: colors.border, borderRadius: borderRadius.sm },
            ]}
          >
            <Text
              style={[
                styles.statusToggleText,
                {
                  color:
                    statusFilter === 'NOT_APPLIED'
                      ? colors.primary
                      : colors.textSecondary,
                  fontSize: typography.fontSizes.xxs,
                },
              ]}
            >
              Unapplied
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenAddModal}
          style={[
            styles.addCompanyBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addCompanyBtnText}>Add Company</Text>
        </TouchableOpacity>
      </View>

      {/* Companies List */}
      <FlatList
        data={filteredCompanies}
        keyExtractor={(item) => item.id}
        renderItem={renderCompanyItem}
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
            title="No Companies Found"
            description={
              search.trim() || selectedIndustry !== 'ALL' || statusFilter !== 'ALL'
                ? 'Try clearing your filters or search keywords.'
                : 'Start building your recruitment pipeline by adding prospective companies.'
            }
            actionLabel="+ Add First Company"
            onAction={onOpenAddModal}
            icon={<Building2 size={36} color={colors.primary} />}
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
  subFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusToggleGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  statusToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  statusToggleText: {
    fontWeight: '700',
  },
  addCompanyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addCompanyBtnText: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
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
  headerTextWrap: {
    flex: 1,
  },
  companyName: {
    fontWeight: '800',
  },
  industry: {
    marginTop: 2,
  },
  appliedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  appliedBadgeText: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  quickApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  quickApplyText: {
    fontWeight: '700',
  },
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  highlightText: {
    fontWeight: '600',
  },
  branchesText: {
    marginTop: 6,
  },
});
