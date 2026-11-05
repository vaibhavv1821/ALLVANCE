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
import { X, Award } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { ResumeCertification } from '@/database/schema/resume';

interface CertificationModalProps {
  visible: boolean;
  initialData?: ResumeCertification | null;
  onClose: () => void;
  onSubmit: (data: Omit<ResumeCertification, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const CertificationModal: React.FC<CertificationModalProps> = ({
  visible,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.name);
        setIssuer(initialData.issuer);
        setIssueDate(initialData.issueDate || '');
        setExpiryDate(initialData.expiryDate || '');
        setCredentialId(initialData.credentialId || '');
        setCredentialUrl(initialData.credentialUrl || '');
      } else {
        setName('');
        setIssuer('Amazon Web Services / Coursera / Meta');
        setIssueDate('2024');
        setExpiryDate('');
        setCredentialId('');
        setCredentialUrl('');
      }
      setError(null);
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (!name.trim() || !issuer.trim()) {
      setError('Certification Name and Issuer are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        name: name.trim(),
        issuer: issuer.trim(),
        issueDate: issueDate.trim() || null,
        expiryDate: expiryDate.trim() || null,
        credentialId: credentialId.trim() || null,
        credentialUrl: credentialUrl.trim() || null,
        orderIndex: initialData ? initialData.orderIndex : 0,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to save certification');
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
              <Award size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                {initialData ? 'Edit Certification' : 'Add Certification'}
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

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
              CERTIFICATION NAME *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. AWS Certified Solutions Architect – Associate"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              ISSUING ORGANIZATION *
            </Text>
            <TextInput
              value={issuer}
              onChangeText={setIssuer}
              placeholder="e.g. Amazon Web Services, Meta, HackerRank"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  ISSUE DATE
                </Text>
                <TextInput
                  value={issueDate}
                  onChangeText={setIssueDate}
                  placeholder="e.g. Aug 2024"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  EXPIRY DATE (OPTIONAL)
                </Text>
                <TextInput
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="e.g. Aug 2027"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              CREDENTIAL ID / LICENSE #
            </Text>
            <TextInput
              value={credentialId}
              onChangeText={setCredentialId}
              placeholder="e.g. AWS-SAA-8392109"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              VERIFICATION URL (OPTIONAL)
            </Text>
            <TextInput
              value={credentialUrl}
              onChangeText={setCredentialUrl}
              autoCapitalize="none"
              placeholder="https://credly.com/..."
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <PrimaryButton
              title={initialData ? 'Save Changes' : 'Add Certification'}
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
  errorBanner: {
    padding: 10,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
  },
});
