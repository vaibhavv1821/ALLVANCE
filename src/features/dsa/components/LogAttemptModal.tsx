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
import { X, PlayCircle, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { dsaProblemRepository } from '@/database/repositories/DsaProblemRepository';
import { SOLUTION_LANGUAGES } from '../constants';

interface LogAttemptModalProps {
  visible: boolean;
  onClose: () => void;
  onLogged: () => void;
  problemId: string;
  problemTitle: string;
}

export const LogAttemptModal: React.FC<LogAttemptModalProps> = ({
  visible,
  onClose,
  onLogged,
  problemId,
  problemTitle,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [status, setStatus] = useState<'failed' | 'partially_solved' | 'solved'>('partially_solved');
  const [timeSpentMinutes, setTimeSpentMinutes] = useState('30');
  const [language, setLanguage] = useState<string>('Java');
  const [approachNotes, setApproachNotes] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const mins = parseInt(timeSpentMinutes, 10) || 0;
      await dsaProblemRepository.markAttempted(problemId, {
        status,
        timeSpentMinutes: mins,
        approachNotes: approachNotes.trim() || undefined,
        codeSnippet: codeSnippet.trim() || undefined,
        language,
      });
      onLogged();
      onClose();
    } catch (e: any) {
      alert(e?.message || 'Failed to log attempt');
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
              <View style={[styles.iconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <PlayCircle size={20} color="#38BDF8" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.fontSizes.lg }]}>
                  Log Solving Attempt
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]} numberOfLines={1}>
                  {problemTitle}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceRaised }]}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Outcome Status */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Attempt Outcome *</Text>
              <View style={styles.outcomeRow}>
                {/* Solved */}
                <TouchableOpacity
                  style={[
                    styles.outcomeCard,
                    {
                      backgroundColor: status === 'solved' ? 'rgba(16, 185, 129, 0.15)' : colors.surfaceRaised,
                      borderColor: status === 'solved' ? '#10B981' : colors.border,
                    },
                  ]}
                  onPress={() => setStatus('solved')}
                >
                  <CheckCircle2 size={20} color="#10B981" />
                  <Text style={[styles.outcomeText, { color: colors.textPrimary }]}>Solved</Text>
                </TouchableOpacity>

                {/* Partially Solved */}
                <TouchableOpacity
                  style={[
                    styles.outcomeCard,
                    {
                      backgroundColor: status === 'partially_solved' ? 'rgba(245, 158, 11, 0.15)' : colors.surfaceRaised,
                      borderColor: status === 'partially_solved' ? '#F59E0B' : colors.border,
                    },
                  ]}
                  onPress={() => setStatus('partially_solved')}
                >
                  <AlertTriangle size={20} color="#F59E0B" />
                  <Text style={[styles.outcomeText, { color: colors.textPrimary }]}>Partial</Text>
                </TouchableOpacity>

                {/* Failed */}
                <TouchableOpacity
                  style={[
                    styles.outcomeCard,
                    {
                      backgroundColor: status === 'failed' ? 'rgba(239, 68, 68, 0.15)' : colors.surfaceRaised,
                      borderColor: status === 'failed' ? '#EF4444' : colors.border,
                    },
                  ]}
                  onPress={() => setStatus('failed')}
                >
                  <XCircle size={20} color="#EF4444" />
                  <Text style={[styles.outcomeText, { color: colors.textPrimary }]}>Unsolved</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Time Taken & Language */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Time Spent (Mins)</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                  <Clock size={16} color="#38BDF8" style={{ marginRight: 6 }} />
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    keyboardType="numeric"
                    value={timeSpentMinutes}
                    onChangeText={setTimeSpentMinutes}
                    placeholder="30"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1.2 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Language</Text>
                <View style={[styles.inputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    value={language}
                    onChangeText={setLanguage}
                    placeholder="Java, Python..."
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
            </View>

            {/* Approach Notes */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>What did you try? (Approach Notes)</Text>
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
                value={approachNotes}
                onChangeText={setApproachNotes}
                placeholder="Tried recursion but TLE; switched to DP memoization..."
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
              />
            </View>

            {/* Code Snippet */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Code Snippet (Optional)</Text>
              <TextInput
                style={[
                  styles.codeInput,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                multiline
                numberOfLines={6}
                value={codeSnippet}
                onChangeText={setCodeSnippet}
                placeholder="// Paste rough scratch code or submission attempt"
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
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
              title={saving ? 'Logging...' : 'Record Attempt'}
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
    maxHeight: '88%',
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
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  outcomeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outcomeCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 4,
  },
  outcomeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
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
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 70,
  },
  codeInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 110,
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
