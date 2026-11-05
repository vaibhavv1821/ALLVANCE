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
import { X, Trophy } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { ResumeAchievement } from '@/database/schema/resume';

interface AchievementModalProps {
  visible: boolean;
  typeDefault?: 'achievement' | 'extracurricular';
  initialData?: ResumeAchievement | null;
  onClose: () => void;
  onSubmit: (data: Omit<ResumeAchievement, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  typeDefault = 'achievement',
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'achievement' | 'extracurricular'>(typeDefault);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title);
        setDate(initialData.date || '');
        setDescription(initialData.description || '');
        setType((initialData.type as 'achievement' | 'extracurricular') || 'achievement');
      } else {
        setTitle('');
        setDate('2024');
        setDescription('');
        setType(typeDefault);
      }
      setError(null);
    }
  }, [visible, initialData, typeDefault]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        date: date.trim() || null,
        description: description.trim() || null,
        type,
        orderIndex: initialData ? initialData.orderIndex : 0,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to save item');
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
              <Trophy size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                {initialData ? 'Edit Entry' : type === 'extracurricular' ? 'Add Extracurricular / Leadership' : 'Add Achievement / Award'}
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
                  Extracurricular / Club Leadership
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs }}>
                  Toggle on for community involvement, societies, or volunteer leadership
                </Text>
              </View>
              <Switch
                value={type === 'extracurricular'}
                onValueChange={(val) => setType(val ? 'extracurricular' : 'achievement')}
                trackColor={{ false: colors.border, true: colors.accent }}
              />
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
              TITLE / RECOGNITION *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={type === 'extracurricular' ? 'e.g. President - Developers Society' : 'e.g. Winner - National Hackathon'}
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              YEAR / DATE
            </Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="e.g. Dec 2023 or 2023 - 2024"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              DETAILS / METRIC IMPACT
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="e.g. Secured 1st place out of 450+ teams. Led a team of 4 engineers building..."
              placeholderTextColor={colors.textMuted}
              style={[styles.textArea, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md, minHeight: 75 }]}
            />
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <PrimaryButton
              title={initialData ? 'Save Changes' : 'Save Entry'}
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
  errorBanner: {
    padding: 10,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
  },
});
