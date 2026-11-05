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
} from 'react-native';
import { X, FileText, Check } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { RESUME_TEMPLATES, TemplateId } from '../services/pdfGenerator';
import { ResumeSummary } from '@/database/repositories/ResumeRepository';

interface ResumeFormModalProps {
  visible: boolean;
  initialData?: ResumeSummary | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    targetRole?: string;
    templateId?: string;
  }) => Promise<void>;
}

export const ResumeFormModal: React.FC<ResumeFormModalProps> = ({
  visible,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [templateId, setTemplateId] = useState<TemplateId>('modern');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title);
        setTargetRole(initialData.targetRole || '');
        setTemplateId((initialData.templateId as TemplateId) || 'modern');
      } else {
        setTitle('');
        setTargetRole('Software Development Engineer');
        setTemplateId('modern');
      }
      setError(null);
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Resume title is required (e.g. "Full-Stack SDE", "Infosys Resume")');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        targetRole: targetRole.trim() || undefined,
        templateId,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to save resume');
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
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <FileText size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                {initialData ? 'Edit Resume Info' : 'Create New Resume'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {error && (
              <View
                style={[
                  styles.errorBanner,
                  { backgroundColor: `${colors.danger}15`, borderRadius: borderRadius.sm },
                ]}
              >
                <Text style={{ color: colors.danger, fontSize: typography.fontSizes.xs }}>{error}</Text>
              </View>
            )}

            {/* Title */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
              RESUME TITLE *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. SDE Resume 2026, Deloitte Consulting Resume"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                },
              ]}
            />

            {/* Target Role */}
            <Text
              style={[
                styles.fieldLabel,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md },
              ]}
            >
              TARGET ROLE
            </Text>
            <TextInput
              value={targetRole}
              onChangeText={setTargetRole}
              placeholder="e.g. Software Development Engineer, Frontend Specialist"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                },
              ]}
            />

            {/* Default Template Choice */}
            <Text
              style={[
                styles.fieldLabel,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md },
              ]}
            >
              LAYOUT TEMPLATE
            </Text>
            <View style={{ gap: 8 }}>
              {RESUME_TEMPLATES.map((tmpl) => {
                const isSelected = tmpl.id === templateId;
                return (
                  <TouchableOpacity
                    key={tmpl.id}
                    onPress={() => setTemplateId(tmpl.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.templateOption,
                      {
                        backgroundColor: isSelected ? `${colors.accent}15` : colors.surfaceRaised,
                        borderColor: isSelected ? colors.accent : colors.border,
                        borderRadius: borderRadius.md,
                        padding: spacing.sm,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text
                        style={{
                          color: isSelected ? colors.accent : colors.textPrimary,
                          fontSize: typography.fontSizes.sm,
                          fontWeight: '600',
                        }}
                      >
                        {tmpl.name}
                      </Text>
                      {isSelected && <Check size={16} color={colors.accent} />}
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs, marginTop: 2 }}>
                      {tmpl.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Footer Submit */}
          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <PrimaryButton
              title={initialData ? 'Update Resume' : 'Create Resume'}
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
  fieldLabel: {
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
  },
  templateOption: {
    borderWidth: 1.5,
  },
  errorBanner: {
    padding: 10,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
  },
});
