import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  AlertTriangle,
  FileEdit,
  Code2,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  CategoryWithStats,
  QuestionWithMetadata,
  QuestionFilterOptions,
} from '@/database/repositories/InterviewPrepRepository';

interface TechnicalPrepTabProps {
  categories: CategoryWithStats[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  questions: QuestionWithMetadata[];
  onSelectQuestion: (question: QuestionWithMetadata) => void;
  onToggleBookmark: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onToggleDifficult: (id: string) => void;
  filterOptions: QuestionFilterOptions;
  onFilterChange: (options: QuestionFilterOptions) => void;
}

export const TechnicalPrepTab: React.FC<TechnicalPrepTabProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  questions,
  onSelectQuestion,
  onToggleBookmark,
  onToggleCompleted,
  onToggleDifficult,
  filterOptions,
  onFilterChange,
}) => {
  const { colors, typography, spacing, isDark } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState(filterOptions.search || '');

  // Group Categories by Group
  const categoryGroups: { [group: string]: CategoryWithStats[] } = {};
  for (const cat of categories) {
    const group = cat.groupName || 'Other';
    if (!categoryGroups[group]) categoryGroups[group] = [];
    categoryGroups[group].push(cat);
  }

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    onFilterChange({ ...filterOptions, search: text });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toUpperCase()) {
      case 'BEGINNER':
        return '#10B981';
      case 'INTERMEDIATE':
        return '#F59E0B';
      case 'ADVANCED':
        return '#EF4444';
      default:
        return '#818CF8';
    }
  };

  const DIFFICULTY_FILTERS = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const STATUS_FILTERS: Array<{ id: QuestionFilterOptions['status']; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'uncompleted', label: 'Unsolved' },
    { id: 'completed', label: 'Completed' },
    { id: 'bookmarked', label: 'Bookmarked' },
    { id: 'difficult', label: 'Difficult' },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Category Pill Carousel */}
      <View style={[styles.categoriesBar, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <TouchableOpacity
            onPress={() => onSelectCategory('ALL')}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategoryId === 'ALL' ? '#818CF8' : colors.surfaceRaised,
                borderColor: selectedCategoryId === 'ALL' ? '#818CF8' : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: selectedCategoryId === 'ALL' ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              All Topics
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => onSelectCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? '#818CF8' : colors.surfaceRaised,
                    borderColor: isSelected ? '#818CF8' : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {cat.name} ({cat.totalQuestions})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. Search & Filter Bar */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search questions (e.g. JVM, B-Tree, Normalization)..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Filter Chips Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
          {STATUS_FILTERS.map((s) => {
            const isSelected = (filterOptions.status || 'all') === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => onFilterChange({ ...filterOptions, status: s.id })}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? '#818CF825' : colors.surfaceRaised,
                    borderColor: isSelected ? '#818CF8' : colors.border,
                  },
                ]}
              >
                <Text style={[styles.filterPillText, { color: isSelected ? '#818CF8' : colors.textSecondary }]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.verticalFilterSep} />

          {DIFFICULTY_FILTERS.map((d) => {
            const isSelected = (filterOptions.difficulty || 'ALL') === d;
            return (
              <TouchableOpacity
                key={d}
                onPress={() => onFilterChange({ ...filterOptions, difficulty: d })}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? '#38BDF825' : colors.surfaceRaised,
                    borderColor: isSelected ? '#38BDF8' : colors.border,
                  },
                ]}
              >
                <Text style={[styles.filterPillText, { color: isSelected ? '#38BDF8' : colors.textSecondary }]}>
                  {d === 'ALL' ? 'All Diff' : d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Question List */}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg, paddingBottom: spacing.huge + 30 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Sparkles size={40} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Questions Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Try clearing your search query or selecting &quot;All Topics&quot; and &quot;All Diff&quot;.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const diffColor = getDifficultyColor(item.difficulty);
          let tags: string[] = [];
          try {
            tags = JSON.parse(item.tags || '[]');
          } catch {
            tags = [];
          }

          return (
            <TouchableOpacity
              onPress={() => onSelectQuestion(item)}
              activeOpacity={0.7}
              style={[
                styles.questionItemCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: item.isCompleted ? '#10B98140' : colors.border,
                },
              ]}
            >
              <View style={styles.itemTopRow}>
                <TouchableOpacity
                  onPress={() => onToggleCompleted(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <CheckCircle2
                    size={20}
                    color={item.isCompleted ? '#10B981' : colors.textMuted}
                    fill={item.isCompleted ? '#10B98120' : 'none'}
                  />
                </TouchableOpacity>

                <View style={[styles.diffBadge, { backgroundColor: `${diffColor}20` }]}>
                  <Text style={[styles.diffBadgeText, { color: diffColor }]}>{item.difficulty}</Text>
                </View>

                <Text style={[styles.catLabel, { color: colors.textMuted }]} numberOfLines={1}>
                  {item.categoryName || 'Interview'}
                </Text>

                <View style={{ flex: 1 }} />

                {item.noteText && (
                  <FileEdit size={14} color="#818CF8" style={{ marginRight: 6 }} />
                )}

                <TouchableOpacity
                  onPress={() => onToggleDifficult(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{ marginRight: 6 }}
                >
                  <AlertTriangle
                    size={16}
                    color={item.isDifficult ? '#EF4444' : colors.textMuted}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onToggleBookmark(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Bookmark
                    size={16}
                    color={item.isBookmarked ? '#818CF8' : colors.textMuted}
                    fill={item.isBookmarked ? '#818CF8' : 'none'}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.itemTitle,
                  {
                    color: item.isCompleted ? colors.textSecondary : colors.textPrimary,
                    textDecorationLine: item.isCompleted ? 'line-through' : 'none',
                  },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              {tags.length > 0 && (
                <View style={styles.itemTagsRow}>
                  {tags.slice(0, 3).map((tag) => (
                    <View key={tag} style={[styles.itemTagPill, { backgroundColor: colors.surfaceRaised }]}>
                      <Text style={[styles.itemTagPillText, { color: colors.textMuted }]}>{tag}</Text>
                    </View>
                  ))}
                  {tags.length > 3 && (
                    <Text style={[styles.moreTagsText, { color: colors.textMuted }]}>+{tags.length - 3}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesBar: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
  },
  filterChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  verticalFilterSep: {
    width: 1,
    height: 16,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },
  listContent: {
    gap: 10,
  },
  questionItemCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  diffBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 120,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  itemTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  itemTagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemTagPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  moreTagsText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
});
