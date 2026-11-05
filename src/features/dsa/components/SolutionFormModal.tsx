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
  Switch,
} from 'react-native';
import { X, Code2, Sparkles, BookOpen, Layers } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { dsaSolutionRepository } from '@/database/repositories/DsaSolutionRepository';
import { DsaSolution } from '@/database/schema/dsa';
import { SOLUTION_LANGUAGES } from '../constants';

interface SolutionFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  problemId: string;
  problemTitle: string;
  solutionToEdit?: DsaSolution | null;
}

export const SolutionFormModal: React.FC<SolutionFormModalProps> = ({
  visible,
  onClose,
  onSaved,
  problemId,
  problemTitle,
  solutionToEdit,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<string>('Java');
  const [code, setCode] = useState('');
  const [approach, setApproach] = useState('');
  const [explanation, setExplanation] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [edgeCases, setEdgeCases] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [isOptimal, setIsOptimal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (solutionToEdit) {
        setTitle(solutionToEdit.title);
        setLanguage(solutionToEdit.language);
        setCode(solutionToEdit.code);
        setApproach(solutionToEdit.approach || '');
        setExplanation(solutionToEdit.explanation || '');
        setTimeComplexity(solutionToEdit.timeComplexity || 'O(N)');
        setSpaceComplexity(solutionToEdit.spaceComplexity || 'O(1)');
        setEdgeCases(solutionToEdit.edgeCases || '');
        setMistakes(solutionToEdit.mistakes || '');
        setIsOptimal(solutionToEdit.isOptimal === 1);
      } else {
        setTitle('Optimal Solution');
        setLanguage('Java');
        setCode('');
        setApproach('');
        setExplanation('');
        setTimeComplexity('O(N)');
        setSpaceComplexity('O(1)');
        setEdgeCases('');
        setMistakes('');
        setIsOptimal(true);
      }
    }
  }, [visible, solutionToEdit]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a solution title (e.g., Optimal Two Pointers, Brute Force).');
      return;
    }
    if (!code.trim()) {
      alert('Please enter the solution code.');
      return;
    }

    setSaving(true);
    try {
      if (solutionToEdit) {
        await dsaSolutionRepository.update(solutionToEdit.id, {
          title: title.trim(),
          language,
          code,
          approach: approach.trim() || undefined,
          explanation: explanation.trim() || undefined,
          timeComplexity: timeComplexity.trim() || undefined,
          spaceComplexity: spaceComplexity.trim() || undefined,
          edgeCases: edgeCases.trim() || undefined,
          mistakes: mistakes.trim() || undefined,
          isOptimal,
        });
      } else {
        await dsaSolutionRepository.create({
          problemId,
          title: title.trim(),
          language,
          code,
          approach: approach.trim() || undefined,
          explanation: explanation.trim() || undefined,
          timeComplexity: timeComplexity.trim() || undefined,
          spaceComplexity: spaceComplexity.trim() || undefined,
          edgeCases: edgeCases.trim() || undefined,
          mistakes: mistakes.trim() || undefined,
          isOptimal,
        });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      alert(e?.message || 'Failed to save solution');
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
              <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Code2 size={20} color="#10B981" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.fontSizes.lg }]}>
                  {solutionToEdit ? 'Edit Solution' : 'Add Solution to Notebook'}
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
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Solution Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Optimal Two Pointers, In-place reversal"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Language Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Programming Language *</Text>
              <View style={styles.langRow}>
                {SOLUTION_LANGUAGES.map((lang) => {
                  const isSelected = language === lang;
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.langPill,
                        {
                          backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                          borderColor: isSelected ? '#10B981' : colors.border,
                        },
                      ]}
                      onPress={() => setLanguage(lang)}
                    >
                      <Text
                        style={[
                          styles.langPillText,
                          {
                            color: isSelected ? '#FFF' : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Is Optimal Switch */}
            <View style={[styles.switchRow, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchTitle, { color: colors.textPrimary }]}>Mark as Optimal Solution</Text>
                <Text style={[styles.switchSubtitle, { color: colors.textMuted }]}>
                  Highlights this solution as your best/recommended approach
                </Text>
              </View>
              <Switch
                value={isOptimal}
                onValueChange={setIsOptimal}
                trackColor={{ false: colors.border, true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Code Editor */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Solution Code *</Text>
                <Text style={[styles.codeBadge, { color: '#10B981' }]}>{language}</Text>
              </View>
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
                numberOfLines={10}
                value={code}
                onChangeText={setCode}
                placeholder={`// Enter clean ${language} implementation\nclass Solution {\n  public int solve() {\n    // your code\n  }\n}`}
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Complexity Row */}
            <View style={styles.complexRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Time Complexity</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                  value={timeComplexity}
                  onChangeText={setTimeComplexity}
                  placeholder="e.g. O(N log N)"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Space Complexity</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                  value={spaceComplexity}
                  onChangeText={setSpaceComplexity}
                  placeholder="e.g. O(1)"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Approach */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Intuition & Approach</Text>
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
                value={approach}
                onChangeText={setApproach}
                placeholder="High-level idea: Why does this work? What pattern is used?"
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
              />
            </View>

            {/* Edge Cases & Common Mistakes */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Edge Cases to Watch</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                value={edgeCases}
                onChangeText={setEdgeCases}
                placeholder="e.g. Empty array, single node, duplicate elements, overflow"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Personal Mistakes / Gotchas</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                value={mistakes}
                onChangeText={setMistakes}
                placeholder="e.g. Off-by-one in binary search, forgetting visited array"
                placeholderTextColor={colors.textMuted}
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
              title={saving ? 'Saving...' : 'Save to Notebook'}
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  codeBadge: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
  },
  codeInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 180,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  langPillText: {
    fontSize: 13,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  complexRow: {
    flexDirection: 'row',
    gap: 12,
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
