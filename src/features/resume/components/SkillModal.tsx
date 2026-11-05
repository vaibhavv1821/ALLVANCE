import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { X, Code2 } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { ResumeSkill } from '@/database/schema/resume';

interface SkillModalProps {
  visible: boolean;
  isSoftSkillDefault?: number;
  initialData?: ResumeSkill | null;
  onClose: () => void;
  onSubmit: (data: Omit<ResumeSkill, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const COMMON_CATEGORIES = [
  'Languages',
  'Frameworks & Libraries',
  'Databases & Caching',
  'Cloud & DevOps / Tools',
  'Core Computer Science',
  'Soft Skills & Leadership',
];

export const SkillModal: React.FC<SkillModalProps> = ({
  visible,
  isSoftSkillDefault = 0,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [category, setCategory] = useState('');
  const [skills, setSkills] = useState('');
  const [proficiency, setProficiency] = useState('Advanced');
  const [isSoftSkill, setIsSoftSkill] = useState(isSoftSkillDefault === 1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setCategory(initialData.category);
        setSkills(initialData.skills);
        setProficiency(initialData.proficiency || 'Advanced');
        setIsSoftSkill(initialData.isSoftSkill === 1);
      } else {
        setCategory(isSoftSkillDefault === 1 ? 'Soft Skills & Leadership' : 'Languages');
        setSkills('');
        setProficiency('Advanced');
        setIsSoftSkill(isSoftSkillDefault === 1);
      }
      setError(null);
    }
  }, [visible, initialData, isSoftSkillDefault]);

  const handleSubmit = async () => {
    if (!category.trim() || !skills.trim()) {
      setError('Category and Skills list are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        category: category.trim(),
        skills: skills.trim(),
        proficiency: proficiency || 'Advanced',
        isSoftSkill: isSoftSkill ? 1 : 0,
        orderIndex: initialData ? initialData.orderIndex : 0,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to save skills');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Code2 size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                {initialData ? 'Edit Skill Group' : 'Add Skill Group'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {error && (
              <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}15`, borderRadius: borderRadius.sm }]}>
                <Text style={{ color: colors.danger, fontSize: typography.fontSizes.xs }}>{error}</Text>
              </View>
            )}

            <View style={[styles.switchRow, { backgroundColor: colors.surfaceRaised, borderRadius: borderRadius.md, padding: spacing.sm, marginBottom: spacing.md }]}>
              <View>
                <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.xs, fontWeight: '700' }}>
                  Soft Skill Category
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs }}>
                  Toggle on for interpersonal, leadership, or communication skills
                </Text>
              </View>
              <Switch
                value={isSoftSkill}
                onValueChange={setIsSoftSkill}
                trackColor={{ false: colors.border, true: colors.accent }}
              />
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
              CATEGORY NAME *
            </Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Languages, Frameworks, Cloud & DevOps"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            {/* Quick Category Chips */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6, marginBottom: spacing.sm }}>
              {COMMON_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.quickChip,
                    { backgroundColor: category === cat ? `${colors.accent}25` : colors.surfaceRaised, borderRadius: borderRadius.xs },
                  ]}
                >
                  <Text style={{ color: category === cat ? colors.accent : colors.textSecondary, fontSize: typography.fontSizes.xxs }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.xs }]}>
              SKILLS (COMMA-SEPARATED) *
            </Text>
            <TextInput
              value={skills}
              onChangeText={setSkills}
              placeholder="e.g. C++, TypeScript, Python, SQL, Git"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              style={[styles.textArea, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md, minHeight: 70 }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              PROFICIENCY LEVEL
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {PROFICIENCIES.map((lvl) => {
                const isSelected = lvl === proficiency;
                return (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => setProficiency(lvl)}
                    style={[
                      styles.profPill,
                      {
                        backgroundColor: isSelected ? `${colors.accent}20` : colors.surfaceRaised,
                        borderColor: isSelected ? colors.accent : colors.border,
                        borderRadius: borderRadius.sm,
                      },
                    ]}
                  >
                    <Text style={{ color: isSelected ? colors.accent : colors.textPrimary, fontSize: typography.fontSizes.xs, fontWeight: '600' }}>
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <PrimaryButton
              title={initialData ? 'Save Changes' : 'Add Skills'}
              onPress={handleSubmit}
              loading={submitting}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '85%',
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
  },
  modalTitle: {},
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
  },
  textArea: {
    borderWidth: 1,
  },
  quickChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  profPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
  },
  errorBanner: {
    padding: 10,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
  },
});
