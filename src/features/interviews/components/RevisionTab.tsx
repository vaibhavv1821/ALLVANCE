import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  RotateCcw,
  AlertTriangle,
  Bookmark,
  FileEdit,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  Layers,
  Circle,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  interviewPrepRepository,
  QuestionWithMetadata,
  CategoryWithStats,
} from '@/database/repositories/InterviewPrepRepository';

interface RevisionTabProps {
  categories: CategoryWithStats[];
  onSelectQuestion: (question: QuestionWithMetadata) => void;
  onNavigateToCategory?: (categoryId: string) => void;
}

export const RevisionTab: React.FC<RevisionTabProps> = ({
  categories,
  onSelectQuestion,
  onNavigateToCategory,
}) => {
  const { colors, typography, spacing, isDark } = useAppTheme();
  const [activeFilter, setActiveFilter] = useState<'due' | 'difficult' | 'bookmarked' | 'notes' | 'topics'>('due');
  const [questions, setQuestions] = useState<QuestionWithMetadata[]>([]);
  const [notesQuestions, setNotesQuestions] = useState<QuestionWithMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRevisionData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeFilter === 'notes') {
        const withNotes = await interviewPrepRepository.getQuestionsWithNotes();
        setNotesQuestions(withNotes);
      } else if (activeFilter !== 'topics') {
        const queue = await interviewPrepRepository.getRevisionQueue(activeFilter);
        setQuestions(queue);
      }
    } catch (e) {
      console.error('Failed to load revision data', e);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadRevisionData();
  }, [loadRevisionData]);

  const handleAdvanceRevision = async (questionId: string, ease: 'hard' | 'good' | 'easy') => {
    await interviewPrepRepository.advanceRevisionItem(questionId, ease);
    await loadRevisionData();
  };

  const difficultCount = categories.reduce((acc, c) => acc + c.difficultCount, 0);
  const bookmarkedCount = categories.reduce((acc, c) => acc + c.bookmarkedCount, 0);

  const displayedList = activeFilter === 'notes' ? notesQuestions : questions;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* 1. Revision Overview Hero Card */}
      <View style={[styles.heroCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.bannerRow}>
          <View style={styles.bannerIconBox}>
            <RotateCcw size={22} color="#818CF8" />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={[styles.bannerTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
              Smart Spaced Revision
            </Text>
            <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
              Retain critical algorithms, edge cases, and difficult questions through scheduled spaced recall.
            </Text>
          </View>
        </View>

        <View style={styles.statsSummaryRow}>
          <View style={styles.statMiniCol}>
            <Text style={[styles.statMiniNum, { color: '#EF4444', fontWeight: '700' }]}>{difficultCount}</Text>
            <Text style={[styles.statMiniLabel, { color: colors.textSecondary }]}>Difficult</Text>
          </View>
          <View style={[styles.dividerVertical, { backgroundColor: colors.border }]} />
          <View style={styles.statMiniCol}>
            <Text style={[styles.statMiniNum, { color: '#F59E0B', fontWeight: '700' }]}>{bookmarkedCount}</Text>
            <Text style={[styles.statMiniLabel, { color: colors.textSecondary }]}>Bookmarked</Text>
          </View>
          <View style={[styles.dividerVertical, { backgroundColor: colors.border }]} />
          <View style={styles.statMiniCol}>
            <Text style={[styles.statMiniNum, { color: '#818CF8', fontWeight: '700' }]}>{categories.length}</Text>
            <Text style={[styles.statMiniLabel, { color: colors.textSecondary }]}>Categories</Text>
          </View>
        </View>
      </View>

      {/* 2. Filter Tabs */}
      <View style={styles.filterPillsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'due', label: 'Due for Review', icon: Clock },
            { id: 'difficult', label: `Difficult (${difficultCount})`, icon: AlertTriangle },
            { id: 'bookmarked', label: `Bookmarked (${bookmarkedCount})`, icon: Bookmark },
            { id: 'notes', label: 'Revision Notes', icon: FileEdit },
            { id: 'topics', label: 'Topic Progress', icon: Layers },
          ].map((pill) => {
            const isSelected = activeFilter === pill.id;
            const Icon = pill.icon;
            return (
              <TouchableOpacity
                key={pill.id}
                onPress={() => setActiveFilter(pill.id as any)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? '#818CF8' : isDark ? '#1E293B' : '#F1F5F9',
                    borderColor: isSelected ? '#818CF8' : colors.border,
                  },
                ]}
              >
                <Icon size={14} color={isSelected ? '#FFFFFF' : colors.textSecondary} />
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Content View */}
      {loading ? (
        <ActivityIndicator size="small" color="#818CF8" style={{ marginTop: 32 }} />
      ) : activeFilter === 'topics' ? (
        // Topic-wise Completion View
        <View style={styles.topicsContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onNavigateToCategory && onNavigateToCategory(cat.id)}
              style={[styles.topicCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}
              activeOpacity={0.8}
            >
              <View style={styles.topicHeaderRow}>
                <View style={styles.topicHeaderLeft}>
                  <Text style={[styles.topicName, { color: colors.textPrimary, fontWeight: '700' }]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.topicGroup, { color: colors.textSecondary }]}>
                    {cat.groupName}
                  </Text>
                </View>
                <View style={styles.topicProgressBadge}>
                  <Text style={styles.topicProgressText}>{cat.percentage}%</Text>
                </View>
              </View>

              <View style={[styles.topicProgressBarBg, { backgroundColor: isDark ? '#0F172A' : '#E2E8F0' }]}>
                <View
                  style={[
                    styles.topicProgressBarFill,
                    { width: `${cat.percentage}%`, backgroundColor: cat.percentage === 100 ? '#10B981' : '#818CF8' },
                  ]}
                />
              </View>

              <View style={styles.topicFooterRow}>
                <Text style={[styles.topicCountText, { color: colors.textSecondary }]}>
                  {cat.completedCount} of {cat.totalQuestions} solved
                </Text>
                {cat.difficultCount > 0 && (
                  <View style={styles.topicDifficultBadge}>
                    <AlertTriangle size={11} color="#EF4444" />
                    <Text style={styles.topicDifficultText}>{cat.difficultCount} hard</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        // Question Queue List View
        <View style={styles.queueContainer}>
          {displayedList.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
              <CheckCircle2 size={36} color="#10B981" />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
                Queue is Clear!
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {activeFilter === 'due'
                  ? 'No questions currently due for spaced review. Keep practicing!'
                  : activeFilter === 'difficult'
                  ? 'No questions marked difficult yet. Star challenging questions during practice.'
                  : activeFilter === 'bookmarked'
                  ? 'No bookmarked questions yet.'
                  : 'You have not written personal notes on any questions yet.'}
              </Text>
            </View>
          ) : (
            displayedList.map((q) => (
              <TouchableOpacity
                key={q.id}
                onPress={() => onSelectQuestion(q)}
                style={[styles.questionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}
                activeOpacity={0.8}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.cardBadges}>
                    <View style={[styles.miniBadge, { backgroundColor: '#818CF820' }]}>
                      <Text style={styles.miniBadgeText}>{q.categoryName || 'General'}</Text>
                    </View>
                    <View style={[styles.miniBadge, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
                      <Text style={[styles.miniBadgeText, { color: colors.textSecondary }]}>{q.difficulty}</Text>
                    </View>
                  </View>

                  <View style={styles.cardIndicators}>
                    {q.isDifficult === 1 && (
                      <View style={styles.alertIconPill}>
                        <AlertTriangle size={13} color="#EF4444" />
                      </View>
                    )}
                    {q.isBookmarked === 1 && (
                      <View style={styles.bookmarkIconPill}>
                        <Bookmark size={13} color="#F59E0B" fill="#F59E0B" />
                      </View>
                    )}
                  </View>
                </View>

                <Text style={[styles.questionTitle, { color: colors.textPrimary, fontWeight: '600' }]}>
                  {q.title}
                </Text>

                {/* If notes view, show the user's personal notes preview */}
                {activeFilter === 'notes' && q.noteText && (
                  <View style={[styles.noteBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
                    <View style={styles.noteLabelRow}>
                      <FileEdit size={12} color="#818CF8" />
                      <Text style={styles.noteLabel}>YOUR PERSONAL NOTE</Text>
                    </View>
                    <Text style={[styles.noteText, { color: colors.textSecondary }]} numberOfLines={3}>
                      {q.noteText}
                    </Text>
                  </View>
                )}

                {/* Spaced Revision Actions */}
                {activeFilter === 'due' && (
                  <View style={[styles.easeActionsRow, { borderTopColor: colors.border }]}>
                    <Text style={[styles.easePrompt, { color: colors.textSecondary }]}>Rate Recall:</Text>
                    <View style={styles.easeBtns}>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAdvanceRevision(q.id, 'hard');
                        }}
                        style={[styles.easeBtn, { backgroundColor: '#EF444420', borderColor: '#EF4444' }]}
                      >
                        <Text style={[styles.easeBtnText, { color: '#EF4444' }]}>Hard (1d)</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAdvanceRevision(q.id, 'good');
                        }}
                        style={[styles.easeBtn, { backgroundColor: '#F59E0B20', borderColor: '#F59E0B' }]}
                      >
                        <Text style={[styles.easeBtnText, { color: '#F59E0B' }]}>Good (2d)</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAdvanceRevision(q.id, 'easy');
                        }}
                        style={[styles.easeBtn, { backgroundColor: '#10B98120', borderColor: '#10B981' }]}
                      >
                        <Text style={[styles.easeBtnText, { color: '#10B981' }]}>Easy (3d)</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statMiniCol: {
    alignItems: 'center',
  },
  statMiniNum: {
    fontSize: 18,
    marginBottom: 2,
  },
  statMiniLabel: {
    fontSize: 11,
  },
  dividerVertical: {
    width: 1,
    height: 24,
  },
  filterPillsRow: {
    marginTop: 14,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
  },
  topicsContainer: {
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  topicCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  topicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  topicHeaderLeft: {
    flex: 1,
  },
  topicName: {
    fontSize: 14,
  },
  topicGroup: {
    fontSize: 11,
    marginTop: 2,
  },
  topicProgressBadge: {
    backgroundColor: '#818CF820',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  topicProgressText: {
    fontSize: 12,
    color: '#818CF8',
    fontWeight: '700',
  },
  topicProgressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  topicProgressBarFill: {
    height: 6,
    borderRadius: 3,
  },
  topicFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicCountText: {
    fontSize: 11,
  },
  topicDifficultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF444420',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topicDifficultText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
  },
  queueContainer: {
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  questionCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  miniBadgeText: {
    fontSize: 10,
    color: '#818CF8',
    fontWeight: '600',
  },
  cardIndicators: {
    flexDirection: 'row',
    gap: 6,
  },
  alertIconPill: {
    backgroundColor: '#EF444420',
    padding: 4,
    borderRadius: 4,
  },
  bookmarkIconPill: {
    backgroundColor: '#F59E0B20',
    padding: 4,
    borderRadius: 4,
  },
  questionTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  noteBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  noteLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  noteLabel: {
    fontSize: 9,
    color: '#818CF8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 17,
  },
  easeActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  easePrompt: {
    fontSize: 11,
    fontWeight: '600',
  },
  easeBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  easeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  easeBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
