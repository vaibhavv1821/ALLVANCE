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
import { X, Layers, Calendar, CheckCircle2 } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { HiringRound } from '@/database/schema/placement';
import {
  HIRING_ROUND_TYPES,
  ROUND_RESULTS,
  ROUND_COMPLETION_STATUSES,
} from '../constants';

interface HiringRoundFormModalProps {
  visible: boolean;
  applicationId: string;
  initialData?: HiringRound | null;
  onClose: () => void;
  onSubmit: (data: {
    applicationId: string;
    roundName: string;
    roundType?: string;
    roundOrder?: number;
    scheduledDate?: number | null;
    completionStatus?: string;
    result?: string;
    score?: string | null;
    feedback?: string | null;
    questionsAsked?: string | null;
  }) => Promise<void>;
}

export const HiringRoundFormModal: React.FC<HiringRoundFormModalProps> = ({
  visible,
  applicationId,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [roundName, setRoundName] = useState('');
  const [roundType, setRoundType] = useState('technical');
  const [roundOrder, setRoundOrder] = useState('1');
  const [completionStatus, setCompletionStatus] = useState('SCHEDULED');
  const [result, setResult] = useState('PENDING');
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [questionsAsked, setQuestionsAsked] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setRoundName(initialData.roundName || '');
        setRoundType(initialData.roundType || 'technical');
        setRoundOrder(String(initialData.roundOrder || 1));
        setCompletionStatus(initialData.completionStatus || 'SCHEDULED');
        setResult(initialData.result || 'PENDING');
        setScore(initialData.score || '');
        setFeedback(initialData.feedback || '');
        setQuestionsAsked(initialData.questionsAsked || '');
      } else {
        setRoundName('Technical Interview 1');
        setRoundType('technical');
        setRoundOrder('1');
        setCompletionStatus('SCHEDULED');
        setResult('PENDING');
        setScore('');
        setFeedback('');
        setQuestionsAsked('');
      }
      setError(null);
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (!roundName.trim()) {
      setError('Round name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        applicationId,
        roundName: roundName.trim(),
        roundType,
        roundOrder: parseInt(roundOrder.trim(), 10) || 1,
        scheduledDate: Date.now() + 24 * 60 * 60 * 1000, // defaults to tomorrow for scheduled rounds
        completionStatus,
        result,
        score: score.trim() || undefined,
        feedback: feedback.trim() || undefined,
        questionsAsked: questionsAsked.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save hiring round.');
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
              <Layers size={20} color={colors.primary} />
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg },
                ]}
              >
                {initialData ? 'Edit Hiring Round' : 'Add Hiring Round'}
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

            {/* Quick Round Templates */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Select Round Type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeScroll}
            >
              {HIRING_ROUND_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => {
                    setRoundType(t.value);
                    if (!initialData) setRoundName(t.label);
                  }}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor:
                        roundType === t.value
                          ? colors.primary
                          : colors.surfaceRaised,
                      borderColor:
                        roundType === t.value ? colors.primary : colors.border,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      {
                        color:
                          roundType === t.value
                            ? '#FFFFFF'
                            : colors.textSecondary,
                        fontSize: typography.fontSizes.xxs,
                      },
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Round Name */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Round Title / Name *
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
              placeholder="e.g. Technical Interview 1 - Data Structures"
              placeholderTextColor={colors.textMuted}
              value={roundName}
              onChangeText={setRoundName}
            />

            {/* Round Order & Score */}
            <View style={styles.twoCol}>
              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Round Number / Step
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
                  placeholder="1, 2, 3..."
                  placeholderTextColor={colors.textMuted}
                  value={roundOrder}
                  onChangeText={setRoundOrder}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Score / Metrics (Optional)
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
                  placeholder="e.g. 95/100 or 3/3 Qs"
                  placeholderTextColor={colors.textMuted}
                  value={score}
                  onChangeText={setScore}
                />
              </View>
            </View>

            {/* Completion Status & Result */}
            <View style={styles.twoCol}>
              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Status
                </Text>
                <View style={styles.chipRowWrap}>
                  {ROUND_COMPLETION_STATUSES.map((cs) => (
                    <TouchableOpacity
                      key={cs.value}
                      onPress={() => setCompletionStatus(cs.value)}
                      style={[
                        styles.smallChip,
                        {
                          backgroundColor:
                            completionStatus === cs.value
                              ? colors.primary
                              : colors.surfaceRaised,
                          borderColor:
                            completionStatus === cs.value
                              ? colors.primary
                              : colors.border,
                          borderRadius: borderRadius.sm,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.smallChipText,
                          {
                            color:
                              completionStatus === cs.value
                                ? '#FFFFFF'
                                : colors.textSecondary,
                            fontSize: typography.fontSizes.xxs,
                          },
                        ]}
                      >
                        {cs.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Round Result
                </Text>
                <View style={styles.chipRowWrap}>
                  {ROUND_RESULTS.map((res) => (
                    <TouchableOpacity
                      key={res.value}
                      onPress={() => setResult(res.value)}
                      style={[
                        styles.smallChip,
                        {
                          backgroundColor:
                            result === res.value
                              ? res.color
                              : colors.surfaceRaised,
                          borderColor:
                            result === res.value ? res.color : colors.border,
                          borderRadius: borderRadius.sm,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.smallChipText,
                          {
                            color:
                              result === res.value
                                ? '#FFFFFF'
                                : colors.textSecondary,
                            fontSize: typography.fontSizes.xxs,
                          },
                        ]}
                      >
                        {res.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Questions Asked */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Questions Asked in Round
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
              placeholder="e.g. 1. Invert a Binary Tree. 2. Implement Rate Limiter in Redis. 3. Conflict resolution project story."
              placeholderTextColor={colors.textMuted}
              value={questionsAsked}
              onChangeText={setQuestionsAsked}
              multiline
              numberOfLines={3}
            />

            {/* Feedback & Notes */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Interviewer Feedback / Self Reflection
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
              placeholder="Interviewer liked communication on edge cases; advised practicing more concurrency..."
              placeholderTextColor={colors.textMuted}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={2}
            />

            <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
              <PrimaryButton
                title={initialData ? 'Update Round' : 'Save Hiring Round'}
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
    maxHeight: '90%',
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
  typeScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    marginRight: 6,
  },
  typeChipText: {
    fontWeight: '700',
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
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  chipRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  smallChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
  },
  smallChipText: {
    fontWeight: '700',
  },
});
