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
import { X, Code2, Plus, Tag, Building2, AlertCircle } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import {
  dsaProblemRepository,
  ProblemDetailed,
} from '@/database/repositories/DsaProblemRepository';
import { TopicWithStats } from '@/database/repositories/DsaTopicRepository';
import {
  DSA_PLATFORMS,
  DSA_DIFFICULTIES,
  DIFFICULTY_COLORS,
  POPULAR_COMPANY_TAGS,
  POPULAR_TOPIC_TAGS,
} from '../constants';

interface ProblemFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: (problemId: string) => void;
  problemToEdit?: ProblemDetailed | null;
  topics: TopicWithStats[];
  initialTopicTitle?: string;
  initialTopicId?: string;
}

export const ProblemFormModal: React.FC<ProblemFormModalProps> = ({
  visible,
  onClose,
  onSaved,
  problemToEdit,
  topics,
  initialTopicTitle,
  initialTopicId,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [title, setTitle] = useState('');
  const [problemIdExt, setProblemIdExt] = useState('');
  const [platform, setPlatform] = useState<string>('LeetCode');
  const [customPlatform, setCustomPlatform] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [topicName, setTopicName] = useState('Arrays');
  const [topicId, setTopicId] = useState<string | undefined>(undefined);
  const [subtopicName, setSubtopicName] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [status, setStatus] = useState<'unsolved' | 'attempted' | 'solved' | 'revision'>('unsolved');
  const [statement, setStatement] = useState('');
  const [approach, setApproach] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [notes, setNotes] = useState('');
  const [edgeCases, setEdgeCases] = useState('');

  // Tags & Companies
  const [tags, setTags] = useState<string[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');

  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (problemToEdit) {
        setTitle(problemToEdit.title);
        setProblemIdExt(problemToEdit.problemIdExt || '');
        setPlatform(problemToEdit.platform);
        setExternalUrl(problemToEdit.externalUrl || '');
        setTopicName(problemToEdit.topicName);
        setTopicId(problemToEdit.topicId || undefined);
        setSubtopicName(problemToEdit.subtopicName || '');
        setDifficulty(problemToEdit.difficulty as any);
        setStatus(problemToEdit.status as any);
        setStatement(problemToEdit.problemStatement || '');
        setApproach(problemToEdit.approach || '');
        setTimeComplexity(problemToEdit.timeComplexity || 'O(N)');
        setSpaceComplexity(problemToEdit.spaceComplexity || 'O(1)');
        setNotes(problemToEdit.notes || '');
        setEdgeCases(problemToEdit.importantEdgeCases || '');
        setTags(problemToEdit.tags || []);
        setCompanies(problemToEdit.companies || []);
      } else {
        setTitle('');
        setProblemIdExt('');
        setPlatform('LeetCode');
        setCustomPlatform('');
        setExternalUrl('');
        setTopicName(initialTopicTitle || (topics.length > 0 ? topics[0].title : 'Arrays'));
        setTopicId(initialTopicId || (topics.length > 0 ? topics[0].id : undefined));
        setSubtopicName('');
        setDifficulty('Medium');
        setStatus('unsolved');
        setStatement('');
        setApproach('');
        setTimeComplexity('O(N)');
        setSpaceComplexity('O(1)');
        setNotes('');
        setEdgeCases('');
        setTags([]);
        setCompanies([]);
      }
      setDuplicateWarning(false);
    }
  }, [visible, problemToEdit, initialTopicTitle, initialTopicId, topics]);

  // Check duplicate on blur or title change
  const handleCheckDuplicate = async () => {
    if (!title.trim()) return;
    const effectivePlatform = platform === 'Custom' ? customPlatform.trim() || 'Custom' : platform;
    const isDup = await dsaProblemRepository.checkForDuplicate(
      title,
      effectivePlatform,
      problemToEdit?.id
    );
    setDuplicateWarning(isDup);
  };

  const handleAddTag = (t: string) => {
    const clean = t.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleAddCompany = (c: string) => {
    const clean = c.trim();
    if (clean && !companies.includes(clean)) {
      setCompanies([...companies, clean]);
    }
    setCompanyInput('');
  };

  const handleRemoveCompany = (c: string) => {
    setCompanies(companies.filter((item) => item !== c));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a problem title.');
      return;
    }

    const effectivePlatform = platform === 'Custom' ? customPlatform.trim() || 'Custom' : platform;

    setSaving(true);
    try {
      let savedId = '';
      if (problemToEdit) {
        await dsaProblemRepository.update(problemToEdit.id, {
          title: title.trim(),
          problemIdExt: problemIdExt.trim() || undefined,
          platform: effectivePlatform,
          externalUrl: externalUrl.trim() || undefined,
          topicId,
          topicName: topicName.trim(),
          subtopicName: subtopicName.trim() || undefined,
          difficulty,
          status,
          problemStatement: statement.trim() || undefined,
          approach: approach.trim() || undefined,
          timeComplexity: timeComplexity.trim() || undefined,
          spaceComplexity: spaceComplexity.trim() || undefined,
          notes: notes.trim() || undefined,
          importantEdgeCases: edgeCases.trim() || undefined,
          tags,
          companies,
        });
        savedId = problemToEdit.id;
      } else {
        savedId = await dsaProblemRepository.create({
          title: title.trim(),
          problemIdExt: problemIdExt.trim() || undefined,
          platform: effectivePlatform,
          externalUrl: externalUrl.trim() || undefined,
          topicId,
          topicName: topicName.trim(),
          subtopicName: subtopicName.trim() || undefined,
          difficulty,
          status,
          problemStatement: statement.trim() || undefined,
          approach: approach.trim() || undefined,
          timeComplexity: timeComplexity.trim() || undefined,
          spaceComplexity: spaceComplexity.trim() || undefined,
          notes: notes.trim() || undefined,
          importantEdgeCases: edgeCases.trim() || undefined,
          tags,
          companies,
        });
      }
      onSaved(savedId);
      onClose();
    } catch (e: any) {
      alert(e?.message || 'Failed to save problem');
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
                  {problemToEdit ? 'Edit DSA Problem' : 'Add New Problem'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
                  Track your approach, complexities, and placement tags
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceRaised }]}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title & External ID */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Problem Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                value={title}
                onChangeText={setTitle}
                onBlur={handleCheckDuplicate}
                placeholder="e.g. Two Sum, Trapping Rain Water, Course Schedule"
                placeholderTextColor={colors.textMuted}
              />
              {duplicateWarning && (
                <View style={styles.dupAlert}>
                  <AlertCircle size={14} color="#F59E0B" />
                  <Text style={[styles.dupAlertText, { color: '#F59E0B' }]}>
                    A problem with this title already exists on {platform}.
                  </Text>
                </View>
              )}
            </View>

            {/* Problem ID & Platform */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Problem ID / #</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                  value={problemIdExt}
                  onChangeText={setProblemIdExt}
                  placeholder="e.g. LC-1, #42"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1.4 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Platform</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -2 }}>
                  {DSA_PLATFORMS.map((p) => {
                    const isSelected = platform === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.platformPill,
                          {
                            backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                            borderColor: isSelected ? '#10B981' : colors.border,
                          },
                        ]}
                        onPress={() => setPlatform(p)}
                      >
                        <Text style={[styles.platformPillText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                          {p}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            {platform === 'Custom' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Custom Platform Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                  value={customPlatform}
                  onChangeText={setCustomPlatform}
                  placeholder="e.g. AtCoder, InterviewBit"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}

            {/* External URL */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>External Problem Link</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                value={externalUrl}
                onChangeText={setExternalUrl}
                placeholder="https://leetcode.com/problems/..."
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
            </View>

            {/* Topic & Subtopic */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Topic *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
                {topics.map((t) => {
                  const isSelected = topicName.toLowerCase() === t.title.toLowerCase();
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
                      onPress={() => {
                        setTopicName(t.title);
                        setTopicId(t.id);
                      }}
                    >
                      <Text style={[styles.topicPillText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                        {t.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Subtopic Optional */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Subtopic / Technique</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                value={subtopicName}
                onChangeText={setSubtopicName}
                placeholder="e.g. Kadane's Algorithm, Binary Lifting, Monotonic Stack"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Difficulty & Status */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1.2 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Difficulty *</Text>
                <View style={styles.diffRow}>
                  {DSA_DIFFICULTIES.map((d) => {
                    const isSelected = difficulty === d;
                    const c = DIFFICULTY_COLORS[d].color;
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[
                          styles.diffBtn,
                          {
                            backgroundColor: isSelected ? c : colors.surfaceRaised,
                            borderColor: isSelected ? c : colors.border,
                          },
                        ]}
                        onPress={() => setDifficulty(d)}
                      >
                        <Text style={[styles.diffBtnText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                          {d}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Status</Text>
                <View style={styles.statusCol}>
                  {(['unsolved', 'attempted', 'solved'] as const).map((s) => {
                    const isSelected = status === s;
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.statusBtn,
                          {
                            backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                            borderColor: isSelected ? '#10B981' : colors.border,
                          },
                        ]}
                        onPress={() => setStatus(s)}
                      >
                        <Text style={[styles.statusBtnText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                          {s.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Company Tags */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Company Tags</Text>
              <View style={[styles.tagInputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <Building2 size={16} color="#38BDF8" style={{ marginRight: 6 }} />
                <TextInput
                  style={[styles.tagInput, { color: colors.textPrimary }]}
                  value={companyInput}
                  onChangeText={setCompanyInput}
                  onSubmitEditing={() => handleAddCompany(companyInput)}
                  placeholder="Type company (Amazon, Infosys, etc.)"
                  placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity
                  onPress={() => handleAddCompany(companyInput)}
                  disabled={!companyInput.trim()}
                  style={[styles.tagAddBtn, { backgroundColor: '#38BDF8', opacity: companyInput.trim() ? 1 : 0.4 }]}
                >
                  <Plus size={14} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Selected Companies */}
              {companies.length > 0 && (
                <View style={styles.tagsChipRow}>
                  {companies.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.activeTagChip, { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: '#38BDF8' }]}
                      onPress={() => handleRemoveCompany(c)}
                    >
                      <Text style={[styles.activeTagChipText, { color: '#38BDF8' }]}>{c}</Text>
                      <X size={12} color="#38BDF8" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Popular suggestions */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                {POPULAR_COMPANY_TAGS.filter((c) => !companies.includes(c)).map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.suggestChip, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}
                    onPress={() => handleAddCompany(c)}
                  >
                    <Text style={[styles.suggestChipText, { color: colors.textMuted }]}>+{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Tags / Algorithms */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Pattern & Concept Tags</Text>
              <View style={[styles.tagInputContainer, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <Tag size={16} color="#10B981" style={{ marginRight: 6 }} />
                <TextInput
                  style={[styles.tagInput, { color: colors.textPrimary }]}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={() => handleAddTag(tagInput)}
                  placeholder="Type pattern tag (Two Pointers, DP, etc.)"
                  placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity
                  onPress={() => handleAddTag(tagInput)}
                  disabled={!tagInput.trim()}
                  style={[styles.tagAddBtn, { backgroundColor: '#10B981', opacity: tagInput.trim() ? 1 : 0.4 }]}
                >
                  <Plus size={14} color="#FFF" />
                </TouchableOpacity>
              </View>

              {tags.length > 0 && (
                <View style={styles.tagsChipRow}>
                  {tags.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.activeTagChip, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' }]}
                      onPress={() => handleRemoveTag(t)}
                    >
                      <Text style={[styles.activeTagChipText, { color: '#10B981' }]}>{t}</Text>
                      <X size={12} color="#10B981" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                {POPULAR_TOPIC_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.suggestChip, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}
                    onPress={() => handleAddTag(t)}
                  >
                    <Text style={[styles.suggestChipText, { color: colors.textMuted }]}>+{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Complexities */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Time Complexity</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                  value={timeComplexity}
                  onChangeText={setTimeComplexity}
                  placeholder="e.g. O(N)"
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
              <Text style={[styles.label, { color: colors.textPrimary }]}>Core Intuition / Approach</Text>
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
                placeholder="What is the mental model? How do we reduce complexity?"
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
              />
            </View>

            {/* Edge Cases & Notes */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Edge Cases & Constraints</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                value={edgeCases}
                onChangeText={setEdgeCases}
                placeholder="Empty input, negatives, large numbers, duplicates"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Personal Notes</Text>
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
                numberOfLines={2}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special trick or revision cue"
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
              title={saving ? 'Saving...' : problemToEdit ? 'Update Problem' : 'Save Problem'}
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
  },
  dupAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  dupAlertText: {
    fontSize: 12,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  platformPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 3,
  },
  platformPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  topicPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  topicPillText: {
    fontSize: 13,
    fontWeight: '500',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 6,
  },
  diffBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  diffBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusCol: {
    flexDirection: 'row',
    gap: 4,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 6,
    height: 46,
  },
  tagInput: {
    flex: 1,
    fontSize: 13,
  },
  tagAddBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  activeTagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  activeTagChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  suggestChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
  },
  suggestChipText: {
    fontSize: 11,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 70,
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
