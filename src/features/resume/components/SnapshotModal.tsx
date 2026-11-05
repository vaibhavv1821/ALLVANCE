import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, History } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';

interface SnapshotModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (label: string) => Promise<void>;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [label, setLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!label.trim()) {
      setError('Please provide a descriptive version label.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(label.trim());
      setLabel('');
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to create snapshot');
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
              <History size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                Save Version Snapshot
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {error && (
              <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}15`, borderRadius: borderRadius.sm }]}>
                <Text style={{ color: colors.danger, fontSize: typography.fontSizes.xs }}>{error}</Text>
              </View>
            )}

            <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginBottom: spacing.md }}>
              This creates a complete offline snapshot of all education, experience, projects, and skills. You can restore it anytime with one tap.
            </Text>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
              VERSION LABEL *
            </Text>
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. v1.1 - Added AWS Cert or Tailored for Deloitte"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.md,
                },
              ]}
            />

            <PrimaryButton
              title="Create Snapshot"
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
  errorBanner: {
    padding: 10,
    marginBottom: 12,
  },
});
