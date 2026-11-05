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
import { X, Layers, Plus } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { dsaTopicRepository, TopicWithStats } from '@/database/repositories/DsaTopicRepository';

interface TopicFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
  topicToEdit?: TopicWithStats | null;
}

export const TopicFormModal: React.FC<TopicFormModalProps> = ({
  visible,
  onClose,
  onSaved,
  topicToEdit,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [mastery, setMastery] = useState<'weak' | 'average' | 'strong'>('average');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const levels = [
    { level: 1, name: 'Foundations' },
    { level: 2, name: 'Core Data Structures' },
    { level: 3, name: 'Advanced Data Structures' },
    { level: 4, name: 'Problem Solving' },
  ];

  useEffect(() => {
    if (visible) {
      if (topicToEdit) {
        setTitle(topicToEdit.title);
        setLevel(topicToEdit.level);
        setDescription(topicToEdit.description || '');
        setPriority((topicToEdit.priority as any) || 'medium');
        setMastery((topicToEdit.mastery as any) || 'average');
        setNotes(topicToEdit.notes || '');
      } else {
        setTitle('');
        setLevel(2);
        setDescription('');
        setPriority('medium');
        setMastery('average');
        setNotes('');
      }
    }
  }, [visible, topicToEdit]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a topic title.');
      return;
    }

    const selectedLevelObj = levels.find((l) => l.level === level) || levels[1];

    setSaving(true);
    try {
      if (topicToEdit) {
        await dsaTopicRepository.update(topicToEdit.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          mastery,
          notes: notes.trim() || undefined,
        });
      } else {
        await dsaTopicRepository.create({
          title: title.trim(),
          level,
          levelName: selectedLevelObj.name,
          description: description.trim() || undefined,
          priority,
          mastery,
          notes: notes.trim() || undefined,
        });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      alert(e?.message || 'Failed to save topic');
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
                <Layers size={20} color="#10B981" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.fontSizes.lg }]}>
                  {topicToEdit ? 'Edit Roadmap Topic' : 'Add Custom Topic'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
                  Organize your personal DSA learning journey
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
              <Text style={[styles.label, { color: colors.textPrimary }]}>Topic Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary }]}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Segment Trees, Monotonic Queues"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Level Selector */}
            {!topicToEdit && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Roadmap Level *</Text>
                <View style={styles.levelCol}>
                  {levels.map((lvl) => {
                    const isSelected = level === lvl.level;
                    return (
                      <TouchableOpacity
                        key={lvl.level}
                        style={[
                          styles.levelCard,
                          {
                            backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : colors.surfaceRaised,
                            borderColor: isSelected ? '#10B981' : colors.border,
                          },
                        ]}
                        onPress={() => setLevel(lvl.level)}
                      >
                        <Text style={[styles.levelNum, { color: '#10B981' }]}>L{lvl.level}</Text>
                        <Text style={[styles.levelTitle, { color: colors.textPrimary }]}>{lvl.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Priority & Mastery */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Priority</Text>
                <View style={styles.pillGroup}>
                  {(['low', 'medium', 'high'] as const).map((p) => {
                    const isSelected = priority === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.pill,
                          {
                            backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                            borderColor: isSelected ? '#10B981' : colors.border,
                          },
                        ]}
                        onPress={() => setPriority(p)}
                      >
                        <Text style={[styles.pillText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                          {p.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1.2 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Mastery Level</Text>
                <View style={styles.pillGroup}>
                  {(['weak', 'average', 'strong'] as const).map((m) => {
                    const isSelected = mastery === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[
                          styles.pill,
                          {
                            backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                            borderColor: isSelected ? '#10B981' : colors.border,
                          },
                        ]}
                        onPress={() => setMastery(m)}
                      >
                        <Text style={[styles.pillText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                          {m.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Description</Text>
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
                value={description}
                onChangeText={setDescription}
                placeholder="What concepts and patterns does this topic encompass?"
                placeholderTextColor={colors.textMuted}
                textAlignVertical="top"
              />
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Personal Study Notes</Text>
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
                placeholder="Key formulas, time complexities, or cheat sheet points"
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
              title={saving ? 'Saving...' : 'Save Topic'}
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
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 70,
  },
  levelCol: {
    gap: 8,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  levelNum: {
    fontWeight: '800',
    fontSize: 13,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
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
