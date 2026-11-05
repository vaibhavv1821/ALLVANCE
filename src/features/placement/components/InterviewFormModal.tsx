import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Calendar, Star, Plus, Trash2, Building2 } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { CompanyWithCounts } from '@/database/repositories/CompanyRepository';
import { InterviewWithDetails, CreateInterviewInput } from '@/database/repositories/InterviewRepository';
import { DIFFICULTY_METADATA } from '../types';

interface InterviewFormModalProps {
  visible: boolean;
  companies: CompanyWithCounts[];
  preselectedCompanyId?: string | null;
  initialData?: InterviewWithDetails | null;
  onClose: () => void;
  onSubmit: (data: CreateInterviewInput) => Promise<void>;
}

export const InterviewFormModal: React.FC<InterviewFormModalProps> = ({
  visible,
  companies,
  preselectedCompanyId,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [companyId, setCompanyId] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [interviewRound, setInterviewRound] = useState('');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD'>('MEDIUM');
  const [rating, setRating] = useState(4);
  const [topicsDiscussed, setTopicsDiscussed] = useState('');
  const [feedback, setFeedback] = useState('');
  const [questions, setQuestions] = useState<Array<{ question: string; category?: string }>>([
    { question: '', category: 'DSA' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setCompanyId(initialData.companyId);
        setRoleTitle(initialData.roleTitle);
        setInterviewRound(initialData.interviewRound);
        setDifficulty((initialData.difficulty as any) || 'MEDIUM');
        setRating(initialData.rating || 3);
        setTopicsDiscussed(initialData.topicsDiscussed || '');
        setFeedback(initialData.feedback || '');
        if (initialData.questions && initialData.questions.length > 0) {
          setQuestions(
            initialData.questions.map((q) => ({
              question: q.question,
              category: q.category || 'DSA',
            }))
          );
        } else {
          setQuestions([{ question: '', category: 'DSA' }]);
        }
      } else {
        setCompanyId(preselectedCompanyId || (companies.length > 0 ? companies[0].id : ''));
        setRoleTitle('Software Development Engineer');
        setInterviewRound('Technical Round 1 - Problem Solving');
        setDifficulty('MEDIUM');
        setRating(4);
        setTopicsDiscussed('Binary Trees, Sliding Window, REST API Design');
        setFeedback('');
        setQuestions([{ question: '', category: 'DSA' }]);
      }
      setError(null);
    }
  }, [visible, initialData, preselectedCompanyId, companies]);

  const handleAddQuestionRow = () => {
    setQuestions([...questions, { question: '', category: 'Coding' }]);
  };

  const handleRemoveQuestionRow = (idx: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (text: string, idx: number) => {
    const updated = [...questions];
    updated[idx].question = text;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!companyId) {
      setError('Please select a company.');
      return;
    }
    if (!roleTitle.trim()) {
      setError('Job role title is required.');
      return;
    }
    if (!interviewRound.trim()) {
      setError('Interview round name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        companyId,
        roleTitle: roleTitle.trim(),
        interviewRound: interviewRound.trim(),
        interviewDate: initialData?.interviewDate || Date.now(),
        difficulty,
        rating,
        topicsDiscussed: topicsDiscussed.trim() || undefined,
        feedback: feedback.trim() || undefined,
        questions: questions.filter((q) => q.question.trim().length > 0),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save interview experience.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.border, padding: spacing.md },
            ]}
          >
            <View style={styles.headerLeft}>
              <Calendar size={20} color={colors.accent} />
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg },
                ]}
              >
                {initialData ? 'Edit Interview Experience' : 'Record Interview Experience'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={[styles.formBody, { padding: spacing.md }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {error && (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.dangerMuted,
                    borderColor: colors.danger,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                    marginBottom: spacing.md,
                  },
                ]}
              >
                <Text style={{ color: colors.danger, fontWeight: '700' }}>
                  {error}
                </Text>
              </View>
            )}

            {/* Company Picker */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Company *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pillRow}
            >
              {companies.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setCompanyId(c.id)}
                  style={[
                    styles.companyChip,
                    {
                      backgroundColor:
                        companyId === c.id
                          ? colors.primary
                          : colors.surfaceRaised,
                      borderColor:
                        companyId === c.id ? colors.primary : colors.border,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.companyChipText,
                      {
                        color:
                          companyId === c.id
                            ? '#FFFFFF'
                            : colors.textSecondary,
                        fontSize: typography.fontSizes.xxs,
                      },
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Role & Interview Round */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Job Role *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceRaised,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="e.g. Frontend Developer, SDE-1"
              placeholderTextColor={colors.textMuted}
              value={roleTitle}
              onChangeText={setRoleTitle}
            />

            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Interview Round Title *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceRaised,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="e.g. Round 2: Data Structures & Algorithms"
              placeholderTextColor={colors.textMuted}
              value={interviewRound}
              onChangeText={setInterviewRound}
            />

            {/* Difficulty Selector */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Round Difficulty
            </Text>
            <View style={styles.diffRow}>
              {(['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'] as const).map((diffKey) => {
                const meta = DIFFICULTY_METADATA[diffKey];
                const isSelected = difficulty === diffKey;
                return (
                  <TouchableOpacity
                    key={diffKey}
                    onPress={() => setDifficulty(diffKey)}
                    style={[
                      styles.diffBtn,
                      {
                        backgroundColor: isSelected
                          ? meta.bgColor
                          : colors.surfaceRaised,
                        borderColor: isSelected ? meta.color : colors.border,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diffBtnText,
                        {
                          color: isSelected ? meta.color : colors.textSecondary,
                          fontSize: typography.fontSizes.xxs,
                        },
                      ]}
                    >
                      {meta.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Self Performance Rating (1-5 stars) */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Self Performance Rating: {rating} / 5 Stars
            </Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starBtn}
                >
                  <Star
                    size={28}
                    color={star <= rating ? '#F59E0B' : colors.textMuted}
                    fill={star <= rating ? '#F59E0B' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Topics Discussed */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Topics Discussed / Question Themes
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceRaised,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="e.g. Dynamic Programming, Trees, Database Indexing, System Design"
              placeholderTextColor={colors.textMuted}
              value={topicsDiscussed}
              onChangeText={setTopicsDiscussed}
            />

            {/* Specific Questions Asked */}
            <View style={styles.questionSectionHeader}>
              <Text
                style={[
                  styles.label,
                  { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                ]}
              >
                Questions Asked ({questions.length})
              </Text>
              <TouchableOpacity
                onPress={handleAddQuestionRow}
                style={[
                  styles.addQBtn,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.border,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              >
                <Plus size={12} color={colors.primary} />
                <Text
                  style={[
                    styles.addQText,
                    { color: colors.primary, fontSize: typography.fontSizes.xxs },
                  ]}
                >
                  Add Question
                </Text>
              </TouchableOpacity>
            </View>

            {questions.map((q, idx) => (
              <View key={idx} style={styles.questionInputRow}>
                <TextInput
                  style={[
                    styles.questionInput,
                    {
                      backgroundColor: colors.surfaceRaised,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  placeholder={`Question ${idx + 1} (e.g. Find minimum in rotated sorted array)`}
                  placeholderTextColor={colors.textMuted}
                  value={q.question}
                  onChangeText={(val) => handleQuestionChange(val, idx)}
                />
                {questions.length > 1 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveQuestionRow(idx)}
                    style={styles.trashBtn}
                  >
                    <Trash2 size={16} color={colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Interviewer Feedback */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Interview Feedback & Learnings
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surfaceRaised,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="What went well? Any areas of improvement for future rounds?"
              placeholderTextColor={colors.textMuted}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={3}
            />

            <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
              <PrimaryButton
                title={initialData ? 'Update Experience' : 'Save Interview Experience'}
                onPress={handleSubmit}
                loading={submitting}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '92%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  formBody: {
    paddingBottom: 32,
  },
  errorBox: {
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  pillRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  companyChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    marginRight: 6,
  },
  companyChipText: {
    fontWeight: '700',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  diffBtnText: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  starRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  starBtn: {
    padding: 2,
  },
  questionSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addQBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  addQText: {
    fontWeight: '700',
  },
  questionInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  questionInput: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  trashBtn: {
    padding: 6,
  },
});
