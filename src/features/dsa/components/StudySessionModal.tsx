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
import { X, Clock, Play, BookOpen, CheckCircle2 } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { dsaGoalRepository } from '@/database/repositories/DsaGoalRepository';
import { TopicWithStats } from '@/database/repositories/DsaTopicRepository';

interface StudySessionModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  topics: TopicWithStats[];
}

export const StudySessionModal: React.FC<StudySessionModalProps> = ({
  visible,
  onClose,
  onSaved,
  topics,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [durationMinutes, setDurationMinutes] = useState('45');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [problemsSolved, setProblemsSolved] = useState('2');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const mins = parseInt(durationMinutes, 10);
    if (isNaN(mins) || mins < 1) {
      alert('Please enter a valid study duration in minutes (at least 1 min).');
      return;
    }

    const solved = parseInt(problemsSolved, 10) || 0;

    setSaving(true);
    try {
      await dsaGoalRepository.recordStudySession({
        durationMinutes: mins,
        topicId: selectedTopicId || undefined,
        problemsSolved: solved,
        notes: notes.trim() || undefined,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      alert(e?.message || 'Failed to save study session');
    } finally {
      setSaving(false);
    }
  };

  const quickMinutes = [25, 45, 60, 90, 120];

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
              <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Clock size={20} color="#38BDF8" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.fontSizes.lg }]}>
                  Log DSA Study Session
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
                  Track your deep focus time & problems solved
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceRaised }]}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Quick Duration Buttons */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Study Duration (Minutes) *
              </Text>
              <View style={styles.quickRow}>
                {quickMinutes.map((m) => {
                  const isSelected = durationMinutes === String(m);
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.quickPill,
                        {
                          backgroundColor: isSelected ? '#38BDF8' : colors.surfaceRaised,
                          borderColor: isSelected ? '#38BDF8' : colors.border,
                        },
                      ]}
                      onPress={() => setDurationMinutes(String(m))}
                    >
                      <Text
                        style={[
                          styles.quickPillText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {m}m
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, marginTop: 8 }]}>
                <Clock size={18} color="#38BDF8" style={{ marginRight: spacing.sm }} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={durationMinutes}
                  onChangeText={setDurationMinutes}
                  placeholder="Custom minutes"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Topic Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Topic Studied
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
                <TouchableOpacity
                  style={[
                    styles.topicPill,
                    {
                      backgroundColor: selectedTopicId === '' ? '#10B981' : colors.surfaceRaised,
                      borderColor: selectedTopicId === '' ? '#10B981' : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedTopicId('')}
                >
                  <Text
                    style={[
                      styles.topicPillText,
                      { color: selectedTopicId === '' ? '#FFF' : colors.textSecondary },
                    ]}
                  >
                    General / Multi-topic
                  </Text>
                </TouchableOpacity>

                {topics.map((t) => {
                  const isSelected = selectedTopicId === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[
                        styles.topicPill,
                        {
                          backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                          borderColor: isSelected ? '#10B981' : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedTopicId(t.id)}
                    >
                      <Text
                        style={[
                          styles.topicPillText,
                          { color: isSelected ? '#FFF' : colors.textSecondary },
                        ]}
                      >
                        {t.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Problems Solved */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Problems Solved in this Session
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <CheckCircle2 size={18} color="#10B981" style={{ marginRight: spacing.sm }} />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary }]}
                  keyboardType="numeric"
                  value={problemsSolved}
                  onChangeText={setProblemsSolved}
                  placeholder="e.g. 2"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Session Notes & Key Insights
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
                placeholder="What patterns or edge cases did you encounter?"
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
              title={saving ? 'Logging...' : 'Save Session'}
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
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPillText: {
    fontSize: 13,
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
  topicPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  topicPillText: {
    fontSize: 13,
    fontWeight: '500',
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
