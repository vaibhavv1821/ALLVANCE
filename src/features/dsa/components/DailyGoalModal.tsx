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
} from 'react-native';
import { X, Target, Clock, Trophy } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { dsaGoalRepository } from '@/database/repositories/DsaGoalRepository';
import { DsaDailyGoal } from '@/database/schema/dsa';

interface DailyGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  currentGoal?: DsaDailyGoal | null;
}

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({
  visible,
  onClose,
  onSaved,
  currentGoal,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [problemTarget, setProblemTarget] = useState('3');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [weeklyTarget, setWeeklyTarget] = useState('20');
  const [preferredDifficulty, setPreferredDifficulty] = useState('All');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && currentGoal) {
      setProblemTarget(String(currentGoal.problemTarget || 3));
      setDurationMinutes(String(currentGoal.durationTargetMinutes || 60));
      setWeeklyTarget(String(currentGoal.weeklyProblemTarget || 20));
      setPreferredDifficulty(currentGoal.preferredDifficulty || 'All');
    }
  }, [visible, currentGoal]);

  const handleSave = async () => {
    const pTarget = parseInt(problemTarget, 10);
    const dTarget = parseInt(durationMinutes, 10);
    const wTarget = parseInt(weeklyTarget, 10);

    if (isNaN(pTarget) || pTarget < 1) {
      alert('Please enter a valid daily problem target (at least 1).');
      return;
    }

    setSaving(true);
    try {
      await dsaGoalRepository.updateTodayGoal({
        problemTarget: pTarget,
        durationTargetMinutes: isNaN(dTarget) ? 60 : dTarget,
        weeklyProblemTarget: isNaN(wTarget) ? 20 : wTarget,
        preferredDifficulty,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      alert(e?.message || 'Failed to update goal');
    } finally {
      setSaving(false);
    }
  };

  const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard'];

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
                <Target size={20} color="#10B981" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.fontSizes.lg }]}>
                  Set Daily Coding Goal
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
                  Consistent daily practice builds placement readiness
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceRaised }]}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Daily Problem Target */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Daily Problems Target *
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <Target size={18} color="#10B981" style={{ marginRight: spacing.sm }} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={problemTarget}
                  onChangeText={setProblemTarget}
                  placeholder="e.g. 3"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <Text style={[styles.helper, { color: colors.textMuted }]}>
                Recommended: 3 to 5 problems per day
              </Text>
            </View>

            {/* Daily Study Time Target */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Daily Study Duration (Minutes)
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <Clock size={18} color="#38BDF8" style={{ marginRight: spacing.sm }} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={durationMinutes}
                  onChangeText={setDurationMinutes}
                  placeholder="e.g. 60"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Weekly Target */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Weekly Problems Target
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <Trophy size={18} color="#F59E0B" style={{ marginRight: spacing.sm }} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={weeklyTarget}
                  onChangeText={setWeeklyTarget}
                  placeholder="e.g. 20"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Preferred Difficulty */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Focus Difficulty
              </Text>
              <View style={styles.pillRow}>
                {difficultyOptions.map((diff) => {
                  const isSelected = preferredDifficulty === diff;
                  return (
                    <TouchableOpacity
                      key={diff}
                      style={[
                        styles.diffPill,
                        {
                          backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                          borderColor: isSelected ? '#10B981' : colors.border,
                        },
                      ]}
                      onPress={() => setPreferredDifficulty(diff)}
                    >
                      <Text
                        style={[
                          styles.diffPillText,
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
              </View>
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
              title={saving ? 'Saving...' : 'Save Goal'}
              onPress={handleSave}
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
    maxHeight: '85%',
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
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
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
  helper: {
    fontSize: 12,
    marginTop: 4,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  diffPillText: {
    fontSize: 13,
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
