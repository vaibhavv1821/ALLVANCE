import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Layers,
  Plus,
  CheckCircle2,
  ChevronRight,
  Filter,
  Sparkles,
  Award,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ProgressBar, SearchInput, EmptyState } from '@/components';
import { TopicWithStats } from '@/database/repositories/DsaTopicRepository';
import { MASTERY_COLORS, PRIORITY_COLORS } from '../constants';

interface DsaRoadmapTabProps {
  topics: TopicWithStats[];
  onSelectTopic: (topic: TopicWithStats) => void;
  onOpenAddTopic: () => void;
}

export const DsaRoadmapTab: React.FC<DsaRoadmapTabProps> = ({
  topics,
  onSelectTopic,
  onOpenAddTopic,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [selectedLevel, setSelectedLevel] = useState<number | 'ALL'>('ALL');
  const [selectedMastery, setSelectedMastery] = useState<'ALL' | 'weak' | 'average' | 'strong'>('ALL');
  const [search, setSearch] = useState('');

  const levels = [
    { id: 'ALL', label: 'All Levels' },
    { id: 1, label: 'L1: Foundations' },
    { id: 2, label: 'L2: Core DS' },
    { id: 3, label: 'L3: Advanced DS' },
    { id: 4, label: 'L4: Problem Solving' },
  ];

  const filteredTopics = topics.filter((t) => {
    if (selectedLevel !== 'ALL' && t.level !== selectedLevel) return false;
    if (selectedMastery !== 'ALL' && t.mastery !== selectedMastery) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q) || false;
      const matchSub = t.subtopics.some((s) => s.title.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSub) return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchWrap}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search topics, patterns, or algorithms..."
        />
      </View>

      {/* Level Filters Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.levelFilterContainer}
      >
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <TouchableOpacity
              key={String(lvl.id)}
              style={[
                styles.levelPill,
                {
                  backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                  borderColor: isSelected ? '#10B981' : colors.border,
                },
              ]}
              onPress={() => setSelectedLevel(lvl.id as any)}
            >
              <Text
                style={[
                  styles.levelPillText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {lvl.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Mastery Filter Bar & Add Custom Topic Button */}
      <View style={styles.subFilterRow}>
        <View style={styles.masteryFilters}>
          {(['ALL', 'weak', 'average', 'strong'] as const).map((m) => {
            const isSelected = selectedMastery === m;
            return (
              <TouchableOpacity
                key={m}
                style={[
                  styles.masteryPill,
                  {
                    backgroundColor: isSelected
                      ? m === 'weak'
                        ? '#EF4444'
                        : m === 'strong'
                        ? '#10B981'
                        : '#38BDF8'
                      : colors.surfaceRaised,
                    borderColor: isSelected ? 'transparent' : colors.borderSubtle,
                  },
                ]}
                onPress={() => setSelectedMastery(m)}
              >
                <Text
                  style={[
                    styles.masteryPillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textMuted,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {m.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.addTopicBtn, { backgroundColor: '#10B981' }]}
          onPress={onOpenAddTopic}
        >
          <Plus size={14} color="#FFF" />
          <Text style={styles.addTopicBtnText}>Topic</Text>
        </TouchableOpacity>
      </View>

      {/* Topics List */}
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingBottom: spacing.huge + 30 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredTopics.length === 0 ? (
          <EmptyState
            icon={<Layers size={32} color={colors.textMuted} />}
            title="No Topics Found"
            description="Try adjusting your filters or search query, or create a custom topic."
            actionLabel="+ Add Topic"
            onAction={onOpenAddTopic}
          />
        ) : (
          filteredTopics.map((topic) => {
            const masteryMeta =
              MASTERY_COLORS[topic.mastery as 'weak' | 'average' | 'strong'] ||
              MASTERY_COLORS.average;
            const priorityMeta =
              PRIORITY_COLORS[topic.priority as 'low' | 'medium' | 'high'] ||
              PRIORITY_COLORS.medium;

            return (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: topic.progressPercent === 100 ? 'rgba(16, 185, 129, 0.4)' : colors.border,
                  },
                ]}
                onPress={() => onSelectTopic(topic)}
              >
                <View style={styles.topicHeader}>
                  <View style={styles.topicHeaderLeft}>
                    <View style={styles.levelTag}>
                      <Text style={[styles.levelTagText, { color: '#10B981' }]}>
                        LEVEL {topic.level} • {topic.levelName.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.topicTitle, { color: colors.textPrimary }]}>
                      {topic.title}
                    </Text>
                  </View>

                  <View style={styles.badgesRow}>
                    {/* Mastery Badge */}
                    <View style={[styles.badgePill, { backgroundColor: masteryMeta.color + '20', borderColor: masteryMeta.color }]}>
                      <Text style={[styles.badgePillText, { color: masteryMeta.color }]}>
                        {masteryMeta.label}
                      </Text>
                    </View>

                    {/* Priority Badge */}
                    <View style={[styles.badgePill, { backgroundColor: priorityMeta.color + '20', borderColor: priorityMeta.color }]}>
                      <Text style={[styles.badgePillText, { color: priorityMeta.color }]}>
                        {priorityMeta.label}
                      </Text>
                    </View>
                  </View>
                </View>

                {topic.description ? (
                  <Text style={[styles.topicDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                    {topic.description}
                  </Text>
                ) : null}

                {/* Progress bar */}
                <View style={styles.progressRow}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <ProgressBar
                      progress={topic.progressPercent / 100}
                      color={topic.progressPercent === 100 ? '#10B981' : '#38BDF8'}
                      height={5}
                    />
                  </View>
                  <Text style={[styles.progressPercent, { color: colors.textPrimary }]}>
                    {topic.progressPercent}%
                  </Text>
                </View>

                {/* Subtopics and Problems Count */}
                <View style={styles.footerRow}>
                  <Text style={[styles.footerText, { color: colors.textMuted }]}>
                    {topic.completedSubtopicsCount}/{topic.subtopicsCount} subtopics
                  </Text>
                  <Text style={[styles.footerText, { color: colors.textMuted }]}>
                    {topic.solvedProblems}/{topic.totalProblems} questions solved
                  </Text>
                  <ChevronRight size={14} color={colors.textMuted} />
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
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  levelFilterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  levelPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  levelPillText: {
    fontSize: 12,
  },
  subFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 6,
  },
  masteryFilters: {
    flexDirection: 'row',
    gap: 6,
  },
  masteryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  masteryPillText: {
    fontSize: 10,
  },
  addTopicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addTopicBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  topicCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  topicHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  levelTag: {
    marginBottom: 2,
  },
  levelTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 4,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  topicDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerText: {
    fontSize: 11,
  },
});
