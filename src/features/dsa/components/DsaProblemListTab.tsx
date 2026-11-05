import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Search,
  Filter,
  Plus,
  Star,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Building2,
  Tag,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SearchInput, EmptyState } from '@/components';
import {
  ProblemDetailed,
  ProblemFilterOptions,
} from '@/database/repositories/DsaProblemRepository';
import {
  DIFFICULTY_COLORS,
  STATUS_COLORS,
  POPULAR_COMPANY_TAGS,
} from '../constants';

interface DsaProblemListTabProps {
  problems: ProblemDetailed[];
  filterOptions: ProblemFilterOptions;
  onFilterChange: (newOptions: Partial<ProblemFilterOptions>) => void;
  onSelectProblem: (problem: ProblemDetailed) => void;
  onToggleFavorite: (problemId: string) => void;
  onOpenAddProblem: () => void;
  availableCompanies: string[];
}

export const DsaProblemListTab: React.FC<DsaProblemListTabProps> = ({
  problems,
  filterOptions,
  onFilterChange,
  onSelectProblem,
  onToggleFavorite,
  onOpenAddProblem,
  availableCompanies,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const difficulties = ['ALL', 'Easy', 'Medium', 'Hard'] as const;
  const statuses = ['ALL', 'unsolved', 'attempted', 'solved'] as const;
  const platforms = ['ALL', 'LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeStudio'] as const;

  const sortOptions = [
    { id: 'recently_added', label: 'Recently Added' },
    { id: 'recently_solved', label: 'Recently Solved' },
    { id: 'difficulty_desc', label: 'Hardest First' },
    { id: 'difficulty_asc', label: 'Easiest First' },
    { id: 'most_attempted', label: 'Most Attempts' },
    { id: 'revision_due', label: 'Revision Due' },
  ] as const;

  return (
    <View style={styles.container}>
      {/* Search Bar & Favorite Toggle */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <SearchInput
            value={filterOptions.search || ''}
            onChangeText={(text) => onFilterChange({ search: text })}
            placeholder="Search questions, IDs, notes..."
          />
        </View>

        {/* Favorite Only Toggle Button */}
        <TouchableOpacity
          style={[
            styles.favToggleBtn,
            {
              backgroundColor: filterOptions.isFavoriteOnly ? 'rgba(245, 158, 11, 0.15)' : colors.surfaceRaised,
              borderColor: filterOptions.isFavoriteOnly ? '#F59E0B' : colors.border,
            },
          ]}
          onPress={() => onFilterChange({ isFavoriteOnly: !filterOptions.isFavoriteOnly })}
        >
          <Star
            size={18}
            color={filterOptions.isFavoriteOnly ? '#F59E0B' : colors.textMuted}
            fill={filterOptions.isFavoriteOnly ? '#F59E0B' : 'none'}
          />
        </TouchableOpacity>

        {/* Filter Toggle Button */}
        <TouchableOpacity
          style={[
            styles.favToggleBtn,
            {
              backgroundColor: showAdvancedFilters ? 'rgba(16, 185, 129, 0.15)' : colors.surfaceRaised,
              borderColor: showAdvancedFilters ? '#10B981' : colors.border,
            },
          ]}
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Filter size={18} color={showAdvancedFilters ? '#10B981' : colors.textMuted} />
        </TouchableOpacity>

        {/* Add Problem Button */}
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: '#10B981' }]}
          onPress={onOpenAddProblem}
        >
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Primary Difficulty Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsRow}
      >
        {difficulties.map((diff) => {
          const isSelected = (filterOptions.difficulty || 'ALL') === diff;
          const c = diff === 'ALL' ? '#10B981' : DIFFICULTY_COLORS[diff].color;
          return (
            <TouchableOpacity
              key={diff}
              style={[
                styles.diffChip,
                {
                  backgroundColor: isSelected ? c : colors.surfaceRaised,
                  borderColor: isSelected ? c : colors.border,
                },
              ]}
              onPress={() => onFilterChange({ difficulty: diff })}
            >
              <Text
                style={[
                  styles.diffChipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {diff}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={[styles.filterDivider, { backgroundColor: colors.border }]} />

        {/* Status Chips */}
        {statuses.map((st) => {
          const isSelected = (filterOptions.status || 'ALL') === st;
          return (
            <TouchableOpacity
              key={st}
              style={[
                styles.statusChip,
                {
                  backgroundColor: isSelected ? '#38BDF8' : colors.surfaceRaised,
                  borderColor: isSelected ? '#38BDF8' : colors.border,
                },
              ]}
              onPress={() => onFilterChange({ status: st })}
            >
              <Text
                style={[
                  styles.statusChipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {st.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Advanced Filter Collapsible Panel */}
      {showAdvancedFilters && (
        <View style={[styles.advancedPanel, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          {/* Company Filter Row */}
          <View style={styles.advFilterGroup}>
            <Text style={[styles.advLabel, { color: colors.textMuted }]}>Company Tags:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.advChip,
                  {
                    backgroundColor: !filterOptions.company || filterOptions.company === 'ALL' ? '#38BDF8' : colors.surface,
                    borderColor: !filterOptions.company || filterOptions.company === 'ALL' ? '#38BDF8' : colors.border,
                  },
                ]}
                onPress={() => onFilterChange({ company: 'ALL' })}
              >
                <Text style={[styles.advChipText, { color: !filterOptions.company || filterOptions.company === 'ALL' ? '#FFF' : colors.textSecondary }]}>
                  All Companies
                </Text>
              </TouchableOpacity>

              {availableCompanies.slice(0, 10).map((comp) => {
                const isSelected = filterOptions.company === comp;
                return (
                  <TouchableOpacity
                    key={comp}
                    style={[
                      styles.advChip,
                      {
                        backgroundColor: isSelected ? '#38BDF8' : colors.surface,
                        borderColor: isSelected ? '#38BDF8' : colors.border,
                      },
                    ]}
                    onPress={() => onFilterChange({ company: comp })}
                  >
                    <Text style={[styles.advChipText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                      {comp}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Sort Selector */}
          <View style={styles.advFilterGroup}>
            <Text style={[styles.advLabel, { color: colors.textMuted }]}>Sort By:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sortOptions.map((opt) => {
                const isSelected = (filterOptions.sortBy || 'recently_added') === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.advChip,
                      {
                        backgroundColor: isSelected ? '#10B981' : colors.surface,
                        borderColor: isSelected ? '#10B981' : colors.border,
                      },
                    ]}
                    onPress={() => onFilterChange({ sortBy: opt.id })}
                  >
                    <Text style={[styles.advChipText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Problems List */}
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingBottom: spacing.huge + 35 }]}
        showsVerticalScrollIndicator={false}
      >
        {problems.length === 0 ? (
          <EmptyState
            icon={<Search size={32} color={colors.textMuted} />}
            title="No Problems Found"
            description="No coding problems match your active filter criteria."
            actionLabel="+ Add New Problem"
            onAction={onOpenAddProblem}
          />
        ) : (
          problems.map((prob) => {
            const diffMeta =
              DIFFICULTY_COLORS[prob.difficulty as 'Easy' | 'Medium' | 'Hard'] ||
              DIFFICULTY_COLORS.Medium;
            const statusMeta =
              STATUS_COLORS[prob.status] || STATUS_COLORS.unsolved;
            const isSolved = prob.status === 'solved';
            const isAttempted = prob.status === 'attempted';

            return (
              <TouchableOpacity
                key={prob.id}
                style={[
                  styles.problemCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: isSolved ? 'rgba(16, 185, 129, 0.35)' : colors.border,
                  },
                ]}
                onPress={() => onSelectProblem(prob)}
              >
                {/* Top Row: Difficulty badge, Ext ID, Favorite star */}
                <View style={styles.cardTopRow}>
                  <View style={styles.cardTopLeft}>
                    <View style={[styles.cardDiffBadge, { backgroundColor: diffMeta.bg, borderColor: diffMeta.border }]}>
                      <Text style={[styles.cardDiffText, { color: diffMeta.color }]}>
                        {prob.difficulty}
                      </Text>
                    </View>

                    {prob.problemIdExt && (
                      <Text style={[styles.cardExtId, { color: colors.textMuted }]}>
                        {prob.problemIdExt}
                      </Text>
                    )}

                    <Text style={[styles.cardPlatform, { color: colors.textSecondary }]}>
                      • {prob.platform}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => onToggleFavorite(prob.id)}
                    style={styles.favBtn}
                  >
                    <Star
                      size={18}
                      color={prob.isFavorite === 1 ? '#F59E0B' : colors.textMuted}
                      fill={prob.isFavorite === 1 ? '#F59E0B' : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                {/* Problem Title */}
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                  {prob.title}
                </Text>

                {/* Topic and Tags row */}
                <View style={styles.cardTagsRow}>
                  <View style={[styles.cardTopicPill, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
                    <Text style={[styles.cardTopicText, { color: colors.textSecondary }]}>
                      {prob.topicName}
                    </Text>
                  </View>

                  {prob.companies.slice(0, 2).map((c) => (
                    <View
                      key={c}
                      style={[styles.cardCompPill, { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}
                    >
                      <Text style={[styles.cardCompText, { color: '#38BDF8' }]}>{c}</Text>
                    </View>
                  ))}

                  {prob.companies.length > 2 && (
                    <Text style={[styles.moreTagsText, { color: colors.textMuted }]}>
                      +{prob.companies.length - 2}
                    </Text>
                  )}
                </View>

                {/* Card Bottom Row: Status indicator & Attempts/Revision */}
                <View style={styles.cardBottomRow}>
                  <View style={styles.cardStatusWrap}>
                    {isSolved ? (
                      <CheckCircle2 size={16} color="#10B981" />
                    ) : isAttempted ? (
                      <Play size={15} color="#38BDF8" />
                    ) : (
                      <Circle size={15} color={colors.textMuted} />
                    )}
                    <Text style={[styles.cardStatusLabel, { color: statusMeta.color }]}>
                      {statusMeta.label}
                    </Text>
                  </View>

                  <View style={styles.cardMetaWrap}>
                    {prob.attemptsCount > 0 && (
                      <Text style={[styles.cardMetaText, { color: colors.textMuted }]}>
                        {prob.attemptsCount} {prob.attemptsCount === 1 ? 'attempt' : 'attempts'}
                      </Text>
                    )}
                    {prob.revisionStatus === 'due' && (
                      <View style={styles.revDueBadge}>
                        <RotateCcw size={11} color="#EF4444" />
                        <Text style={styles.revDueText}>Revise Due</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  favToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipsRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    alignItems: 'center',
  },
  diffChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  diffChipText: {
    fontSize: 12,
  },
  filterDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 4,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusChipText: {
    fontSize: 11,
  },
  advancedPanel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  advFilterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  advLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 80,
  },
  advChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
  },
  advChipText: {
    fontSize: 11,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  problemCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardDiffBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardDiffText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardExtId: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardPlatform: {
    fontSize: 11,
  },
  favBtn: {
    padding: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  cardTopicPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardTopicText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardCompPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardCompText: {
    fontSize: 10,
    fontWeight: '700',
  },
  moreTagsText: {
    fontSize: 11,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardStatusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardMetaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMetaText: {
    fontSize: 11,
  },
  revDueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  revDueText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
  },
});
