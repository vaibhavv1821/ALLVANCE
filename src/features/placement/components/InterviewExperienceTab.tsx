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
  Calendar,
  Building2,
  Star,
  Plus,
  Trash2,
  HelpCircle,
  Tag,
  CheckCircle,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SearchInput, EmptyState, ConfirmationDialog } from '@/components';
import { InterviewWithDetails } from '@/database/repositories/InterviewRepository';
import { DIFFICULTY_METADATA } from '../types';
import { formatDate } from '@/utils';

interface InterviewExperienceTabProps {
  interviews: InterviewWithDetails[];
  refreshing: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  onDeleteInterview: (id: string) => Promise<void>;
}

export const InterviewExperienceTab: React.FC<InterviewExperienceTabProps> = ({
  interviews,
  refreshing,
  onRefresh,
  onOpenAddModal,
  onDeleteInterview,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredInterviews = interviews.filter((item) => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchComp = item.companyName.toLowerCase().includes(q);
      const matchRole = item.roleTitle.toLowerCase().includes(q);
      const matchTopics = item.topicsDiscussed?.toLowerCase().includes(q);
      if (!matchComp && !matchRole && !matchTopics) return false;
    }

    if (selectedDifficulty !== 'ALL') {
      if (item.difficulty !== selectedDifficulty) return false;
    }

    return true;
  });

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    await onDeleteInterview(deletingId);
    setDeletingId(null);
  };

  const renderInterviewCard = ({ item }: { item: InterviewWithDetails }) => {
    const diffMeta = DIFFICULTY_METADATA[item.difficulty] || DIFFICULTY_METADATA.MEDIUM;

    return (
      <View
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
                { backgroundColor: 'rgba(168, 85, 247, 0.12)' },
              ]}
            >
              <Calendar size={18} color="#A855F7" />
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
                {item.companyName} • {item.interviewRound}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View
              style={[
                styles.diffBadge,
                {
                  backgroundColor: diffMeta.bgColor,
                  borderColor: diffMeta.color,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Text
                style={[
                  styles.diffBadgeText,
                  { color: diffMeta.color, fontSize: typography.fontSizes.xxs },
                ]}
              >
                {diffMeta.label}
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

        {/* Date & Rating Stars */}
        <View style={styles.ratingDateRow}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                color={star <= item.rating ? '#F59E0B' : colors.textMuted}
                fill={star <= item.rating ? '#F59E0B' : 'transparent'}
              />
            ))}
            <Text
              style={[
                styles.ratingText,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              ({item.rating}/5)
            </Text>
          </View>

          <Text
            style={[
              styles.dateText,
              { color: colors.textMuted, fontSize: typography.fontSizes.xs },
            ]}
          >
            {formatDate(item.interviewDate)}
          </Text>
        </View>

        {/* Topics Discussed */}
        {item.topicsDiscussed ? (
          <View style={styles.topicsRow}>
            <Tag size={12} color={colors.primary} />
            <Text
              style={[
                styles.topicsText,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Topics: {item.topicsDiscussed}
            </Text>
          </View>
        ) : null}

        {/* Questions List */}
        {item.questions && item.questions.length > 0 ? (
          <View
            style={[
              styles.questionsBox,
              {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.borderSubtle,
                borderRadius: borderRadius.md,
                padding: spacing.sm,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.questionsHeading,
                { color: colors.textPrimary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Questions Asked:
            </Text>
            {item.questions.map((q, idx) => (
              <View key={q.id || idx} style={styles.questionItem}>
                <Text
                  style={[
                    styles.qBullet,
                    { color: colors.primary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {idx + 1}.
                </Text>
                <Text
                  style={[
                    styles.qContent,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {q.question}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Feedback / Reflection */}
        {item.feedback ? (
          <Text
            style={[
              styles.feedbackText,
              { color: colors.textMuted, fontSize: typography.fontSizes.xs },
            ]}
            numberOfLines={2}
          >
            Reflection: {item.feedback}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.container, { padding: spacing.md }]}>
      {/* Search Bar */}
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search experiences by company, role, or topics..."
      />

      {/* Difficulty Filters & Add Button */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {['ALL', 'EASY', 'MEDIUM', 'HARD', 'VERY_HARD'].map((diff) => (
            <TouchableOpacity
              key={diff}
              onPress={() => setSelectedDifficulty(diff)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedDifficulty === diff
                      ? colors.primary
                      : colors.surfaceRaised,
                  borderColor:
                    selectedDifficulty === diff ? colors.primary : colors.border,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedDifficulty === diff
                        ? '#FFFFFF'
                        : colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                  },
                ]}
              >
                {diff === 'ALL' ? 'All Difficulties' : diff}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onOpenAddModal}
          style={[
            styles.addBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
            },
          ]}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Record</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredInterviews}
        keyExtractor={(item) => item.id}
        renderItem={renderInterviewCard}
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
            title="No Interview Experiences Recorded"
            description={
              search.trim() || selectedDifficulty !== 'ALL'
                ? 'No experiences match your active search or difficulty filters.'
                : 'Document questions, topics, difficulty, and reflections from your technical & HR rounds.'
            }
            actionLabel="+ Record Interview"
            onAction={onOpenAddModal}
            icon={<Calendar size={36} color={colors.primary} />}
          />
        }
      />

      <ConfirmationDialog
        visible={deletingId !== null}
        title="Delete Interview Experience?"
        message="Are you sure you want to delete this recorded interview experience and its associated questions?"
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  filterChipText: {
    fontWeight: '700',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
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
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    gap: 8,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  diffBadgeText: {
    fontWeight: '800',
  },
  trashBtn: {
    padding: 4,
  },
  ratingDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '700',
    marginLeft: 4,
  },
  dateText: {
    fontWeight: '600',
  },
  topicsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  topicsText: {
    fontWeight: '600',
    flex: 1,
  },
  questionsBox: {
    borderWidth: 1,
  },
  questionsHeading: {
    fontWeight: '700',
    marginBottom: 4,
  },
  questionItem: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 2,
  },
  qBullet: {
    fontWeight: '700',
  },
  qContent: {
    flex: 1,
    lineHeight: 18,
  },
  feedbackText: {
    marginTop: 8,
    fontStyle: 'italic',
  },
});
