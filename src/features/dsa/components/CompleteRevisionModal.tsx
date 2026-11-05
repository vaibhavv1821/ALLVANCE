import React, { useState } from 'react';
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
} from 'react-native';
import { X, RotateCcw, CheckCircle2, AlertTriangle, Flame, Clock } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { dsaRevisionRepository, RevisionWithProblem } from '@/database/repositories/DsaRevisionRepository';

interface CompleteRevisionModalProps {
  visible: boolean;
  onClose: () => void;
  onCompleted: () => void;
  revision: RevisionWithProblem | null;
}

export const CompleteRevisionModal: React.FC<CompleteRevisionModalProps> = ({
  visible,
  onClose,
  onCompleted,
  revision,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [recallRating, setRecallRating] = useState<'Easy' | 'Medium' | 'Difficult'>('Medium');
  const [timeTakenMinutes, setTimeTakenMinutes] = useState('15');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!revision) return null;

  const handleComplete = async () => {
    setSaving(true);
    try {
      const mins = parseInt(timeTakenMinutes, 10) || 0;
      await dsaRevisionRepository.completeRevision(
        revision.id,
        recallRating,
        notes.trim() || undefined,
        mins
      );
      onCompleted();
      onClose();
    } catch (e: any) {
      alert(e?.message || 'Failed to complete revision');
    } finally {
      setSaving(false);
    }
  };

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
              <View style={[styles.iconBox, { backgroundColor: 'rgba(129, 140, 248, 0.15)' }]}>
                <RotateCcw size={20} color="#818CF8" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.fontSizes.lg }]}>
                  Complete Revision
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
                  Spaced Repetition #{revision.revisionNumber}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceRaised }]}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Problem card banner */}
            <View style={[styles.problemBanner, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
              <Text style={[styles.probTopic, { color: '#10B981' }]}>{revision.problemTopic}</Text>
              <Text style={[styles.probTitle, { color: colors.textPrimary }]}>{revision.problemTitle}</Text>
              <View style={styles.probMetaRow}>
                <Text style={[styles.probDiff, { color: colors.textSecondary }]}>
                  Difficulty: {revision.problemDifficulty}
                </Text>
                <Text style={[styles.probPlatform, { color: colors.textMuted }]}>
                  • {revision.problemPlatform}
                </Text>
              </View>
            </View>

            {/* Recall Rating Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                How was your recall of the optimal solution? *
              </Text>
              <View style={styles.ratingGrid}>
                {/* Easy */}
                <TouchableOpacity
                  style={[
                    styles.ratingCard,
                    {
                      backgroundColor: recallRating === 'Easy' ? 'rgba(16, 185, 129, 0.15)' : colors.surfaceRaised,
                      borderColor: recallRating === 'Easy' ? '#10B981' : colors.border,
                    },
                  ]}
                  onPress={() => setRecallRating('Easy')}
                >
                  <CheckCircle2 size={24} color="#10B981" />
                  <Text style={[styles.ratingTitle, { color: colors.textPrimary }]}>Easy</Text>
                  <Text style={[styles.ratingDesc, { color: colors.textMuted }]}>
                    Recalled instantly without hints
                  </Text>
                </TouchableOpacity>

                {/* Medium */}
                <TouchableOpacity
                  style={[
                    styles.ratingCard,
                    {
                      backgroundColor: recallRating === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : colors.surfaceRaised,
                      borderColor: recallRating === 'Medium' ? '#F59E0B' : colors.border,
                    },
                  ]}
                  onPress={() => setRecallRating('Medium')}
                >
                  <Flame size={24} color="#F59E0B" />
                  <Text style={[styles.ratingTitle, { color: colors.textPrimary }]}>Medium</Text>
                  <Text style={[styles.ratingDesc, { color: colors.textMuted }]}>
                    Took a few minutes to remember
                  </Text>
                </TouchableOpacity>

                {/* Difficult */}
                <TouchableOpacity
                  style={[
                    styles.ratingCard,
                    {
                      backgroundColor: recallRating === 'Difficult' ? 'rgba(239, 68, 68, 0.15)' : colors.surfaceRaised,
                      borderColor: recallRating === 'Difficult' ? '#EF4444' : colors.border,
                    },
                  ]}
                  onPress={() => setRecallRating('Difficult')}
                >
                  <AlertTriangle size={24} color="#EF4444" />
                  <Text style={[styles.ratingTitle, { color: colors.textPrimary }]}>Difficult</Text>
                  <Text style={[styles.ratingDesc, { color: colors.textMuted }]}>
                    Forgot key idea; needs re-review
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Dynamic smart hint */}
              <View style={[styles.hintBox, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                  {recallRating === 'Easy' &&
                    '✓ Great job! Next revision will advance to the next spaced interval.'}
                  {recallRating === 'Medium' &&
                    '✓ Good effort. Next revision scheduled with standard spaced repetition.'}
                  {recallRating === 'Difficult' &&
                    '⚠️ Since recall was difficult, an earlier 1-day revision will be scheduled to strengthen retention.'}
                </Text>
              </View>
            </View>

            {/* Time Taken */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Time Spent on Revision (Minutes)
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <Clock size={18} color="#818CF8" style={{ marginRight: spacing.sm }} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={timeTakenMinutes}
                  onChangeText={setTimeTakenMinutes}
                  placeholder="e.g. 15"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Revision Notes & Mistakes to Avoid
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
                placeholder="What was the tricky edge case or invariant?"
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.borderSubtle }]}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={onClose}
              disabled={saving}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <PrimaryButton
              title={saving ? 'Submitting...' : 'Save & Schedule Next'}
              onPress={handleComplete}
              disabled={saving}
              style={{ flex: 1 }}
            />
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
    maxHeight: '90%',
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
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
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
  problemBanner: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  probTopic: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  probTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  probMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  probDiff: {
    fontSize: 12,
    fontWeight: '600',
  },
  probPlatform: {
    fontSize: 12,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  ratingGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  ratingDesc: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 13,
  },
  hintBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
