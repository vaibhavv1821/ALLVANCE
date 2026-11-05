import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  X,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  ChevronDown,
  ChevronUp,
  Tag,
  Building2,
  Sparkles,
  Code2,
  Check,
  Trash2,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { QuestionWithMetadata, interviewPrepRepository } from '@/database/repositories/InterviewPrepRepository';

interface QuestionDetailModalProps {
  visible: boolean;
  question: QuestionWithMetadata | null;
  onClose: () => void;
  onToggleBookmark?: (id: string) => void;
  onToggleCompleted?: (id: string) => void;
  onToggleDifficult?: (id: string) => void;
  onNoteUpdated?: () => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  visible,
  question,
  onClose,
  onToggleBookmark,
  onToggleCompleted,
  onToggleDifficult,
  onNoteUpdated,
}) => {
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();

  const [expandedFollowUps, setExpandedFollowUps] = useState<{ [index: number]: boolean }>({});
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (question) {
      setNoteText(question.noteText || '');
      setIsEditingNote(false);
      setExpandedFollowUps({});
    }
  }, [question]);

  if (!question) return null;

  let keyPointsList: string[] = [];
  try {
    keyPointsList = JSON.parse(question.keyPoints || '[]');
  } catch {
    keyPointsList = [];
  }

  let followUpsList: Array<{ question: string; answer?: string }> = [];
  try {
    followUpsList = JSON.parse(question.followUps || '[]');
  } catch {
    followUpsList = [];
  }

  let companiesList: string[] = [];
  try {
    companiesList = JSON.parse(question.companies || '[]');
  } catch {
    companiesList = [];
  }

  let tagsList: string[] = [];
  try {
    tagsList = JSON.parse(question.tags || '[]');
  } catch {
    tagsList = [];
  }

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

  const handleSaveNote = async () => {
    if (!question) return;
    setIsSavingNote(true);
    try {
      await interviewPrepRepository.saveQuestionNote(question.id, noteText);
      setIsEditingNote(false);
      onNoteUpdated?.();
    } catch {
      Alert.alert('Error', 'Failed to save note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!question) return;
    Alert.alert('Delete Note', 'Are you sure you want to delete your personal note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await interviewPrepRepository.deleteQuestionNote(question.id);
          setNoteText('');
          setIsEditingNote(false);
          onNoteUpdated?.();
        },
      },
    ]);
  };

  const toggleFollowUp = (idx: number) => {
    setExpandedFollowUps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const diffColor = getDifficultyColor(question.difficulty);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header Bar */}
        <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={styles.headerTitleContainer}>
            <View style={[styles.difficultyBadge, { backgroundColor: `${diffColor}20` }]}>
              <Text style={[styles.difficultyText, { color: diffColor }]}>{question.difficulty}</Text>
            </View>
            <Text style={[styles.categoryBadgeText, { color: colors.textSecondary }]}>
              {question.categoryName || question.groupName || 'Interview Prep'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={[styles.closeButton, { backgroundColor: colors.surfaceRaised }]}
          >
            <X size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Title */}
          <Text style={[styles.questionTitle, { color: colors.textPrimary, fontSize: typography.fontSizes.xl }]}>
            {question.title}
          </Text>

          {/* Quick Action Badges */}
          <View style={[styles.actionRow, { marginVertical: spacing.md }]}>
            <TouchableOpacity
              onPress={() => onToggleCompleted?.(question.id)}
              style={[
                styles.actionChip,
                {
                  backgroundColor: question.isCompleted ? '#10B98125' : colors.surfaceRaised,
                  borderColor: question.isCompleted ? '#10B981' : colors.border,
                },
              ]}
            >
              <CheckCircle2
                size={16}
                color={question.isCompleted ? '#10B981' : colors.textMuted}
              />
              <Text
                style={[
                  styles.actionChipText,
                  { color: question.isCompleted ? '#10B981' : colors.textSecondary },
                ]}
              >
                {question.isCompleted ? 'Completed' : 'Mark Completed'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onToggleBookmark?.(question.id)}
              style={[
                styles.actionChip,
                {
                  backgroundColor: question.isBookmarked ? '#818CF825' : colors.surfaceRaised,
                  borderColor: question.isBookmarked ? '#818CF8' : colors.border,
                },
              ]}
            >
              <Bookmark
                size={16}
                color={question.isBookmarked ? '#818CF8' : colors.textMuted}
                fill={question.isBookmarked ? '#818CF8' : 'none'}
              />
              <Text
                style={[
                  styles.actionChipText,
                  { color: question.isBookmarked ? '#818CF8' : colors.textSecondary },
                ]}
              >
                {question.isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onToggleDifficult?.(question.id)}
              style={[
                styles.actionChip,
                {
                  backgroundColor: question.isDifficult ? '#EF444425' : colors.surfaceRaised,
                  borderColor: question.isDifficult ? '#EF4444' : colors.border,
                },
              ]}
            >
              <AlertTriangle
                size={16}
                color={question.isDifficult ? '#EF4444' : colors.textMuted}
              />
              <Text
                style={[
                  styles.actionChipText,
                  { color: question.isDifficult ? '#EF4444' : colors.textSecondary },
                ]}
              >
                {question.isDifficult ? 'Difficult' : 'Mark Difficult'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Companies & Tags */}
          {(companiesList.length > 0 || tagsList.length > 0) && (
            <View style={[styles.metaRow, { marginBottom: spacing.lg }]}>
              {companiesList.map((comp) => (
                <View
                  key={comp}
                  style={[styles.tagPill, { backgroundColor: '#38BDF815', borderColor: '#38BDF830' }]}
                >
                  <Building2 size={12} color="#38BDF8" style={{ marginRight: 4 }} />
                  <Text style={[styles.tagPillText, { color: '#38BDF8' }]}>{comp}</Text>
                </View>
              ))}
              {tagsList.map((tag) => (
                <View
                  key={tag}
                  style={[styles.tagPill, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
                >
                  <Tag size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                  <Text style={[styles.tagPillText, { color: colors.textSecondary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Detailed Answer Section */}
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Sparkles size={18} color="#818CF8" />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Model Answer</Text>
            </View>
            <Text style={[styles.answerText, { color: colors.textSecondary, fontSize: typography.fontSizes.md }]}>
              {question.answer}
            </Text>
          </View>

          {/* Conceptual / Practical Example */}
          {question.example && (
            <View
              style={[
                styles.sectionCard,
                { backgroundColor: isDark ? '#141E33' : '#F1F5F9', borderColor: colors.border },
              ]}
            >
              <Text style={[styles.subSectionTitle, { color: colors.textPrimary }]}>Real-World Example</Text>
              <Text style={[styles.exampleText, { color: colors.textSecondary }]}>{question.example}</Text>
            </View>
          )}

          {/* Code Snippet Block */}
          {question.codeExample && (
            <View style={[styles.codeCard, { backgroundColor: isDark ? '#020617' : '#0F172A' }]}>
              <View style={styles.codeHeader}>
                <View style={styles.codeHeaderLeft}>
                  <Code2 size={16} color="#38BDF8" />
                  <Text style={styles.codeLanguageText}>Code Example</Text>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={styles.codeSnippetText}>{question.codeExample}</Text>
              </ScrollView>
            </View>
          )}

          {/* Important Interview Points */}
          {keyPointsList.length > 0 && (
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.subSectionTitle, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
                Important Interview Takeaways
              </Text>
              {keyPointsList.map((pt, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: '#818CF8' }]} />
                  <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{pt}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Follow-up Questions Accordion */}
          {followUpsList.length > 0 && (
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.subSectionTitle, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
                Common Follow-Up Questions ({followUpsList.length})
              </Text>
              {followUpsList.map((item, idx) => {
                const isExpanded = expandedFollowUps[idx];
                return (
                  <View
                    key={idx}
                    style={[
                      styles.followUpCard,
                      {
                        backgroundColor: colors.surfaceRaised,
                        borderColor: colors.border,
                        marginBottom: idx < followUpsList.length - 1 ? spacing.sm : 0,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => toggleFollowUp(idx)}
                      style={styles.followUpHeader}
                    >
                      <Text style={[styles.followUpQuestionText, { color: colors.textPrimary }]}>
                        Q: {item.question}
                      </Text>
                      {isExpanded ? (
                        <ChevronUp size={18} color={colors.textMuted} />
                      ) : (
                        <ChevronDown size={18} color={colors.textMuted} />
                      )}
                    </TouchableOpacity>
                    {isExpanded && item.answer && (
                      <View style={[styles.followUpAnswerContainer, { borderTopColor: colors.border }]}>
                        <Text style={[styles.followUpAnswerText, { color: colors.textSecondary }]}>
                          A: {item.answer}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Personal Notes Section */}
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.noteHeader}>
              <View style={styles.noteHeaderLeft}>
                <FileEdit size={18} color="#818CF8" />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginLeft: 8 }]}>
                  My Personal Notes
                </Text>
              </View>
              {!isEditingNote && (
                <TouchableOpacity
                  onPress={() => setIsEditingNote(true)}
                  style={[styles.smallButton, { backgroundColor: colors.surfaceRaised }]}
                >
                  <Text style={[styles.smallButtonText, { color: '#818CF8' }]}>
                    {noteText ? 'Edit Note' : '+ Add Note'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {isEditingNote ? (
              <View style={{ marginTop: spacing.sm }}>
                <TextInput
                  style={[
                    styles.noteInput,
                    {
                      backgroundColor: colors.surfaceRaised,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                    },
                  ]}
                  value={noteText}
                  onChangeText={setNoteText}
                  placeholder="Write your custom notes, mnemonics, or key points here..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View style={styles.noteActionsRow}>
                  {noteText.length > 0 && (
                    <TouchableOpacity
                      onPress={handleDeleteNote}
                      style={[styles.deleteNoteButton, { borderColor: '#EF444440' }]}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity
                    onPress={() => setIsEditingNote(false)}
                    style={[styles.cancelButton, { backgroundColor: colors.surfaceRaised }]}
                  >
                    <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveNote}
                    disabled={isSavingNote}
                    style={[styles.saveButton, { backgroundColor: '#818CF8' }]}
                  >
                    <Check size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                      {isSavingNote ? 'Saving...' : 'Save Note'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: spacing.sm }}>
                {noteText ? (
                  <Text style={[styles.noteDisplayText, { color: colors.textSecondary }]}>
                    {noteText}
                  </Text>
                ) : (
                  <Text style={[styles.emptyNoteText, { color: colors.textMuted }]}>
                    No personal notes added yet. Tap &quot;+ Add Note&quot; to jot down memory aids or interviewer tips.
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  questionTitle: {
    fontWeight: '800',
    lineHeight: 28,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  answerText: {
    lineHeight: 24,
    fontWeight: '400',
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  codeCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  codeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeLanguageText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  codeSnippetText: {
    color: '#E2E8F0',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  followUpCard: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  followUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  followUpQuestionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    marginRight: 8,
  },
  followUpAnswerContainer: {
    padding: 12,
    borderTopWidth: 1,
  },
  followUpAnswerText: {
    fontSize: 13,
    lineHeight: 20,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noteHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 90,
  },
  noteActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  deleteNoteButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  noteDisplayText: {
    fontSize: 14,
    lineHeight: 22,
  },
  emptyNoteText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
});
