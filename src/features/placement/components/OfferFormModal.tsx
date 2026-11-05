import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Award, CheckCircle2 } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { CompanyWithCounts } from '@/database/repositories/CompanyRepository';
import { OfferWithDetails, OfferAcceptanceStatus } from '@/database/repositories/OfferRepository';
import { OFFER_STATUS_METADATA } from '../types';

interface OfferFormModalProps {
  visible: boolean;
  companies: CompanyWithCounts[];
  preselectedCompanyId?: string | null;
  preselectedRole?: string | null;
  preselectedAppId?: string | null;
  preselectedCtc?: number | null;
  preselectedFixed?: number | null;
  preselectedVariable?: number | null;
  initialData?: OfferWithDetails | null;
  onClose: () => void;
  onSubmit: (data: {
    companyId: string;
    applicationId?: string | null;
    roleTitle: string;
    ctc: number;
    fixedSalary?: number | null;
    variableSalary?: number | null;
    joiningDate?: number | null;
    offerDate: number;
    acceptanceStatus?: OfferAcceptanceStatus;
    notes?: string | null;
  }) => Promise<void>;
}

export const OfferFormModal: React.FC<OfferFormModalProps> = ({
  visible,
  companies,
  preselectedCompanyId,
  preselectedRole,
  preselectedAppId,
  preselectedCtc,
  preselectedFixed,
  preselectedVariable,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [companyId, setCompanyId] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [ctc, setCtc] = useState('');
  const [fixedSalary, setFixedSalary] = useState('');
  const [variableSalary, setVariableSalary] = useState('');
  const [acceptanceStatus, setAcceptanceStatus] = useState<OfferAcceptanceStatus>('PENDING');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setCompanyId(initialData.companyId);
        setRoleTitle(initialData.roleTitle);
        setCtc(String(initialData.ctc));
        setFixedSalary(initialData.fixedSalary ? String(initialData.fixedSalary) : '');
        setVariableSalary(initialData.variableSalary ? String(initialData.variableSalary) : '');
        setAcceptanceStatus(initialData.acceptanceStatus as OfferAcceptanceStatus);
        setNotes(initialData.notes || '');
      } else {
        setCompanyId(preselectedCompanyId || (companies.length > 0 ? companies[0].id : ''));
        setRoleTitle(preselectedRole || 'Software Development Engineer');
        setCtc(preselectedCtc ? String(preselectedCtc) : '');
        setFixedSalary(preselectedFixed ? String(preselectedFixed) : '');
        setVariableSalary(preselectedVariable ? String(preselectedVariable) : '');
        setAcceptanceStatus('PENDING');
        setNotes('');
      }
      setError(null);
    }
  }, [
    visible,
    initialData,
    preselectedCompanyId,
    preselectedRole,
    preselectedCtc,
    preselectedFixed,
    preselectedVariable,
    companies,
  ]);

  const handleSubmit = async () => {
    if (!companyId) {
      setError('Please select a company.');
      return;
    }
    if (!roleTitle.trim()) {
      setError('Job role title is required.');
      return;
    }
    if (!ctc.trim() || isNaN(parseFloat(ctc.trim()))) {
      setError('A valid total CTC in LPA is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        companyId,
        applicationId: preselectedAppId || initialData?.applicationId || null,
        roleTitle: roleTitle.trim(),
        ctc: parseFloat(ctc.trim()),
        fixedSalary: fixedSalary.trim() ? parseFloat(fixedSalary.trim()) : null,
        variableSalary: variableSalary.trim() ? parseFloat(variableSalary.trim()) : null,
        offerDate: initialData?.offerDate || Date.now(),
        joiningDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // standard 2 months notice/joining
        acceptanceStatus,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save offer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
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
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.border, padding: spacing.md },
            ]}
          >
            <View style={styles.headerLeft}>
              <Award size={20} color="#10B981" />
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg },
                ]}
              >
                {initialData ? 'Edit Offer Letter' : 'Log Official Offer Letter'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={[styles.formBody, { padding: spacing.md }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {error && (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.dangerMuted,
                    borderColor: colors.danger,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                    marginBottom: spacing.md,
                  },
                ]}
              >
                <Text style={{ color: colors.danger, fontWeight: '700' }}>
                  {error}
                </Text>
              </View>
            )}

            {/* Company Picker */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Offering Company *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pillRow}
            >
              {companies.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setCompanyId(c.id)}
                  style={[
                    styles.companyChip,
                    {
                      backgroundColor:
                        companyId === c.id
                          ? colors.primary
                          : colors.surfaceRaised,
                      borderColor:
                        companyId === c.id ? colors.primary : colors.border,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.companyChipText,
                      {
                        color:
                          companyId === c.id
                            ? '#FFFFFF'
                            : colors.textSecondary,
                        fontSize: typography.fontSizes.xxs,
                      },
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Role Title */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Designation / Role Title *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceRaised,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="e.g. Associate Software Engineer"
              placeholderTextColor={colors.textMuted}
              value={roleTitle}
              onChangeText={setRoleTitle}
            />

            {/* Total CTC & Salary Split */}
            <View style={styles.threeCol}>
              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Total CTC (LPA) *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceRaised,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  placeholder="24.0"
                  placeholderTextColor={colors.textMuted}
                  value={ctc}
                  onChangeText={setCtc}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Base Fixed (LPA)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceRaised,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  placeholder="18.0"
                  placeholderTextColor={colors.textMuted}
                  value={fixedSalary}
                  onChangeText={setFixedSalary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Variable / ESOPs
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceRaised,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  placeholder="6.0"
                  placeholderTextColor={colors.textMuted}
                  value={variableSalary}
                  onChangeText={setVariableSalary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Offer Decision Status */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Candidate Acceptance Decision
            </Text>
            <View style={styles.decisionRow}>
              {(['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED'] as OfferAcceptanceStatus[]).map(
                (statusKey) => {
                  const meta = OFFER_STATUS_METADATA[statusKey];
                  const isSelected = acceptanceStatus === statusKey;
                  return (
                    <TouchableOpacity
                      key={statusKey}
                      onPress={() => setAcceptanceStatus(statusKey)}
                      style={[
                        styles.decisionBtn,
                        {
                          backgroundColor: isSelected
                            ? meta.bgColor
                            : colors.surfaceRaised,
                          borderColor: isSelected ? meta.color : colors.border,
                          borderRadius: borderRadius.md,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.decisionText,
                          {
                            color: isSelected ? meta.color : colors.textSecondary,
                            fontSize: typography.fontSizes.xxs,
                          },
                        ]}
                      >
                        {meta.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            {/* Additional Notes */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Benefits, Relocation & Notes
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surfaceRaised,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  borderRadius: borderRadius.md,
                },
              ]}
              placeholder="Joining bonus, insurance coverage, relocation allowance, shift details..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
              <PrimaryButton
                title={initialData ? 'Update Offer Details' : 'Save Offer Letter'}
                onPress={handleSubmit}
                loading={submitting}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '92%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  formBody: {
    paddingBottom: 32,
  },
  errorBox: {
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  pillRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  companyChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    marginRight: 6,
  },
  companyChipText: {
    fontWeight: '700',
  },
  threeCol: {
    flexDirection: 'row',
    gap: 8,
  },
  col: {
    flex: 1,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  decisionBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  decisionText: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
