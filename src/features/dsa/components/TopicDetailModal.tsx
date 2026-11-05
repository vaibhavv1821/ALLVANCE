import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  Layers,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  FileQuestion,
  BookOpen,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ProgressBar, PrimaryButton } from '@/components';
import { dsaTopicRepository, TopicWithStats } from '@/database/repositories/DsaTopicRepository';
import { DsaSubtopic } from '@/database/schema/dsa';
import { MASTERY_COLORS, PRIORITY_COLORS } from '../constants';

interface TopicDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
  topic: TopicWithStats | null;
  onEditTopic: (topic: TopicWithStats) => void;
  onViewProblemsInTopic: (topicTitle: string) => void;
  onAddProblemToTopic: (topicTitle: string, topicId: string) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  visible,
  onClose,
  onRefresh,
  topic,
  onEditTopic,
  onViewProblemsInTopic,
  onAddProblemToTopic,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [activeTopic, setActiveTopic] = useState<TopicWithStats | null>(topic);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [addingSubtopic, setAddingSubtopic] = useState(false);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    setActiveTopic(topic);
    if (topic) {
      setNotes(topic.notes || '');
    }
  }, [topic, visible]);

  if (!activeTopic) return null;

  const reloadCurrentTopic = async () => {
    const updated = await dsaTopicRepository.getById(activeTopic.id);
    if (updated) {
      setActiveTopic(updated);
    }
    onRefresh();
  };

  const handleToggleSubtopic = async (sub: DsaSubtopic) => {
    try {
      const nextVal = sub.isCompleted === 1 ? false : true;
      await dsaTopicRepository.toggleSubtopic(sub.id, nextVal);
      await reloadCurrentTopic();
    } catch (e: any) {
      alert(e?.message || 'Failed to update subtopic');
    }
  };

  const handleAddSubtopic = async () => {
    if (!newSubtopicTitle.trim()) return;
    setAddingSubtopic(true);
    try {
      await dsaTopicRepository.addSubtopic(activeTopic.id, newSubtopicTitle.trim());
      setNewSubtopicTitle('');
      await reloadCurrentTopic();
    } catch (e: any) {
      alert(e?.message || 'Failed to add subtopic');
    } finally {
      setAddingSubtopic(false);
    }
  };

  const handleDeleteSubtopic = async (subId: string) => {
    try {
      await dsaTopicRepository.deleteSubtopic(subId);
      await reloadCurrentTopic();
    } catch (e: any) {
      alert(e?.message || 'Failed to delete subtopic');
    }
  };

  const handleUpdateMastery = async (m: 'weak' | 'average' | 'strong') => {
    try {
      await dsaTopicRepository.update(activeTopic.id, { mastery: m });
      await reloadCurrentTopic();
    } catch (e: any) {
      alert(e?.message || 'Failed to update mastery');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await dsaTopicRepository.update(activeTopic.id, { notes: notes.trim() });
      setIsEditingNotes(false);
      await reloadCurrentTopic();
    } catch (e: any) {
      alert(e?.message || 'Failed to save notes');
    }
  };

  const masteryMeta =
    MASTERY_COLORS[activeTopic.mastery as 'weak' | 'average' | 'strong'] ||
    MASTERY_COLORS.average;
  const priorityMeta =
    PRIORITY_COLORS[activeTopic.priority as 'low' | 'medium' | 'high'] ||
    PRIORITY_COLORS.medium;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Layers size={20} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.levelBadge, { color: '#10B981' }]}>
                  {activeTopic.levelName.toUpperCase()} • LEVEL {activeTopic.level}
                </Text>
                <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.fontSizes.lg }]} numberOfLines={1}>
                  {activeTopic.title}
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  onEditTopic(activeTopic);
                }}
                style={[styles.actionIconBtn, { backgroundColor: colors.surfaceRaised }]}
              >
                <Edit2 size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceRaised }]}>
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Meta Tags Row */}
            <View style={styles.metaRow}>
              {/* Mastery selector */}
              <View style={styles.badgeWrapper}>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Mastery:</Text>
                <View style={styles.masteryPillRow}>
                  {(['weak', 'average', 'strong'] as const).map((m) => {
                    const isSelected = activeTopic.mastery === m;
                    const c = MASTERY_COLORS[m].color;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[
                          styles.masteryPill,
                          {
                            backgroundColor: isSelected ? c : colors.surfaceRaised,
                            borderColor: isSelected ? c : colors.border,
                          },
                        ]}
                        onPress={() => handleUpdateMastery(m)}
                      >
                        <Text
                          style={[
                            styles.masteryPillText,
                            { color: isSelected ? '#FFF' : colors.textSecondary },
                          ]}
                        >
                          {m.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.priorityBox}>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Priority:</Text>
                <View style={[styles.pill, { backgroundColor: priorityMeta.color + '20', borderColor: priorityMeta.color }]}>
                  <Text style={[styles.pillText, { color: priorityMeta.color }]}>
                    {priorityMeta.label}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            {activeTopic.description ? (
              <View style={[styles.descCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
                <Text style={[styles.descText, { color: colors.textSecondary }]}>
                  {activeTopic.description}
                </Text>
              </View>
            ) : null}

            {/* Overall Progress Bar */}
            <View style={[styles.progressCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>Topic Mastery Progress</Text>
                <Text style={[styles.progressVal, { color: '#10B981' }]}>{activeTopic.progressPercent}%</Text>
              </View>
              <ProgressBar progress={activeTopic.progressPercent / 100} color="#10B981" />
              <View style={styles.progressMeta}>
                <Text style={[styles.progressMetaText, { color: colors.textMuted }]}>
                  {activeTopic.completedSubtopicsCount} of {activeTopic.subtopicsCount} subtopics mastered
                </Text>
                <Text style={[styles.progressMetaText, { color: colors.textMuted }]}>
                  {activeTopic.solvedProblems} / {activeTopic.totalProblems} problems solved
                </Text>
              </View>
            </View>

            {/* Subtopics Checklist */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Core Subtopics & Concepts ({activeTopic.subtopics.length})
                </Text>
              </View>

              {activeTopic.subtopics.length === 0 ? (
                <Text style={[styles.emptySubs, { color: colors.textMuted }]}>
                  No subtopics defined yet. Add key concepts below.
                </Text>
              ) : (
                activeTopic.subtopics.map((sub) => {
                  const isDone = sub.isCompleted === 1;
                  return (
                    <View
                      key={sub.id}
                      style={[
                        styles.subtopicItem,
                        {
                          backgroundColor: colors.surfaceRaised,
                          borderColor: isDone ? 'rgba(16, 185, 129, 0.4)' : colors.border,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.subtopicCheckArea}
                        onPress={() => handleToggleSubtopic(sub)}
                      >
                        {isDone ? (
                          <CheckCircle2 size={20} color="#10B981" />
                        ) : (
                          <Circle size={20} color={colors.textMuted} />
                        )}
                        <Text
                          style={[
                            styles.subtopicTitle,
                            {
                              color: isDone ? colors.textMuted : colors.textPrimary,
                              textDecorationLine: isDone ? 'line-through' : 'none',
                            },
                          ]}
                        >
                          {sub.title}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteSubtopic(sub.id)}
                        style={styles.subDeleteBtn}
                      >
                        <Trash2 size={15} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}

              {/* Add Subtopic Input */}
              <View style={[styles.addSubRow, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.addSubInput, { color: colors.textPrimary }]}
                  placeholder="+ Add new subtopic / technique..."
                  placeholderTextColor={colors.textMuted}
                  value={newSubtopicTitle}
                  onChangeText={setNewSubtopicTitle}
                  onSubmitEditing={handleAddSubtopic}
                />
                <TouchableOpacity
                  onPress={handleAddSubtopic}
                  disabled={addingSubtopic || !newSubtopicTitle.trim()}
                  style={[styles.addSubBtn, { backgroundColor: '#10B981', opacity: newSubtopicTitle.trim() ? 1 : 0.4 }]}
                >
                  <Plus size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Questions Association Banner */}
            <View style={[styles.questionsCard, { backgroundColor: 'rgba(56, 189, 248, 0.08)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
              <View style={styles.qCardLeft}>
                <FileQuestion size={22} color="#38BDF8" />
                <View>
                  <Text style={[styles.qCardTitle, { color: colors.textPrimary }]}>
                    {activeTopic.totalProblems} Practice Questions
                  </Text>
                  <Text style={[styles.qCardSubtitle, { color: colors.textMuted }]}>
                    {activeTopic.solvedProblems} solved • {activeTopic.totalProblems - activeTopic.solvedProblems} pending
                  </Text>
                </View>
              </View>
              <View style={styles.qActions}>
                <TouchableOpacity
                  style={[styles.qActionBtn, { backgroundColor: '#38BDF8' }]}
                  onPress={() => {
                    onClose();
                    onViewProblemsInTopic(activeTopic.title);
                  }}
                >
                  <Text style={styles.qActionBtnText}>View Questions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.qActionBtnSecondary, { borderColor: '#10B981' }]}
                  onPress={() => {
                    onClose();
                    onAddProblemToTopic(activeTopic.title, activeTopic.id);
                  }}
                >
                  <Text style={[styles.qActionBtnTextSecondary, { color: '#10B981' }]}>+ Add Question</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Personal Notes */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Personal Study Notes</Text>
                {!isEditingNotes ? (
                  <TouchableOpacity onPress={() => setIsEditingNotes(true)}>
                    <Text style={[styles.editNotesBtn, { color: '#10B981' }]}>Edit Notes</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleSaveNotes}>
                    <Text style={[styles.editNotesBtn, { color: '#10B981', fontWeight: '700' }]}>Save Notes</Text>
                  </TouchableOpacity>
                )}
              </View>

              {isEditingNotes ? (
                <TextInput
                  style={[
                    styles.notesInput,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  multiline
                  numberOfLines={4}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Record intuition, standard templates, or invariant rules..."
                  placeholderTextColor={colors.textMuted}
                  textAlignVertical="top"
                />
              ) : (
                <View style={[styles.notesCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
                  <Text style={[styles.notesText, { color: activeTopic.notes ? colors.textPrimary : colors.textMuted }]}>
                    {activeTopic.notes || 'No personal notes saved yet. Tap "Edit Notes" to jot down formulas and templates.'}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
            <PrimaryButton title="Done" onPress={onClose} style={{ flex: 1 }} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    maxHeight: '92%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '700',
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  masteryPillRow: {
    flexDirection: 'row',
    gap: 4,
  },
  masteryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  masteryPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  priorityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  descCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  descText: {
    fontSize: 13,
    lineHeight: 18,
  },
  progressCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressMetaText: {
    fontSize: 11,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptySubs: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  subtopicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  subtopicCheckArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  subtopicTitle: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  subDeleteBtn: {
    padding: 6,
  },
  addSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 6,
    height: 44,
    marginTop: 4,
  },
  addSubInput: {
    flex: 1,
    fontSize: 13,
  },
  addSubBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionsCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  qCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  qCardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  qCardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  qActions: {
    flexDirection: 'row',
    gap: 10,
  },
  qActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  qActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  qActionBtnSecondary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  qActionBtnTextSecondary: {
    fontWeight: '700',
    fontSize: 13,
  },
  editNotesBtn: {
    fontSize: 13,
    fontWeight: '600',
  },
  notesCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    minHeight: 90,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
});
