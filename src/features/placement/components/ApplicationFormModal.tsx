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
import { X, Briefcase, Building2 } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { CompanyWithCounts } from '@/database/repositories/CompanyRepository';
import { ApplicationWithCompany } from '@/database/repositories/ApplicationRepository';
import { resumeRepository, ResumeSummary } from '@/database/repositories/ResumeRepository';
import { ApplicationStatus, APPLICATION_STATUS_METADATA } from '../types';
import { JOB_TYPES, APPLICATION_SOURCES } from '../constants';

interface ApplicationFormModalProps {
  visible: boolean;
  companies: CompanyWithCounts[];
  preselectedCompanyId?: string | null;
  initialData?: ApplicationWithCompany | null;
  onClose: () => void;
  onSubmit: (data: {
    companyId: string;
    roleTitle: string;
    jobType?: string;
    ctc?: number | null;
    fixedSalary?: number | null;
    variableSalary?: number | null;
    appliedDate: number;
    deadlineDate?: number | null;
    source?: string;
    resumeVersion?: string | null;
    status?: ApplicationStatus;
    notes?: string | null;
  }) => Promise<void>;
  onQuickAddCompany: (companyName: string) => Promise<string>;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  visible,
  companies,
  preselectedCompanyId,
  initialData,
  onClose,
  onSubmit,
  onQuickAddCompany,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [companyId, setCompanyId] = useState('');
  const [quickNewCompanyName, setQuickNewCompanyName] = useState('');
  const [isAddingNewCompany, setIsAddingNewCompany] = useState(false);

  const [roleTitle, setRoleTitle] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [ctc, setCtc] = useState('');
  const [fixedSalary, setFixedSalary] = useState('');
  const [variableSalary, setVariableSalary] = useState('');
  const [source, setSource] = useState('Campus Placement');
  const [resumeVersion, setResumeVersion] = useState('');
  const [availableResumes, setAvailableResumes] = useState<ResumeSummary[]>([]);
  const [status, setStatus] = useState<ApplicationStatus>('APPLIED');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      resumeRepository
        .getAllResumes()
        .then((resList) => {
          setAvailableResumes(resList);
          if (!initialData && resList.length > 0) {
            const def = resList.find((r) => r.isDefault === 1) || resList[0];
            setResumeVersion(`${def.title} (${def.versionName})`);
          }
        })
        .catch(() => {});

      if (initialData) {
        setCompanyId(initialData.companyId);
        setRoleTitle(initialData.roleTitle || '');
        setJobType(initialData.jobType || 'Full-time');
        setCtc(initialData.ctc ? String(initialData.ctc) : '');
        setFixedSalary(initialData.fixedSalary ? String(initialData.fixedSalary) : '');
        setVariableSalary(initialData.variableSalary ? String(initialData.variableSalary) : '');
        setSource(initialData.source || 'Campus Placement');
        setResumeVersion(initialData.resumeVersion || '');
        setStatus(initialData.status as ApplicationStatus);
        setNotes(initialData.notes || '');
        setIsAddingNewCompany(false);
      } else {
        setCompanyId(preselectedCompanyId || (companies.length > 0 ? companies[0].id : ''));
        setRoleTitle('Software Development Engineer');
        setJobType('Full-time');
        setCtc('');
        setFixedSalary('');
        setVariableSalary('');
        setSource('Campus Placement');
        setResumeVersion('');
        setStatus('APPLIED');
        setNotes('');
        setIsAddingNewCompany(companies.length === 0);
        setQuickNewCompanyName('');
      }
      setError(null);
    }
  }, [visible, initialData, preselectedCompanyId, companies]);

  const handleSubmit = async () => {
    if (!roleTitle.trim()) {
      setError('Job role title is required.');
      return;
    }

    let finalCompanyId = companyId;

    if (isAddingNewCompany) {
      if (!quickNewCompanyName.trim()) {
        setError('Please enter a company name.');
        return;
      }
      try {
        finalCompanyId = await onQuickAddCompany(quickNewCompanyName.trim());
      } catch (err: any) {
        setError(err?.message || 'Failed to create new company.');
        return;
      }
    }

    if (!finalCompanyId) {
      setError('Please select or create a company.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        companyId: finalCompanyId,
        roleTitle: roleTitle.trim(),
        jobType,
        ctc: ctc.trim() ? parseFloat(ctc.trim()) : null,
        fixedSalary: fixedSalary.trim() ? parseFloat(fixedSalary.trim()) : null,
        variableSalary: variableSalary.trim() ? parseFloat(variableSalary.trim()) : null,
        appliedDate: initialData?.appliedDate || Date.now(),
        deadlineDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
        source,
        resumeVersion: resumeVersion.trim() || null,
        status,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save application.');
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
              <Briefcase size={20} color={colors.primary} />
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg },
                ]}
              >
                {initialData ? 'Edit Application' : 'Log New Application'}
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

            {/* Company Selection / Creation */}
            <View style={styles.companySelectHeader}>
              <Text
                style={[
                  styles.label,
                  { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                ]}
              >
                Company *
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddingNewCompany(!isAddingNewCompany)}
              >
                <Text
                  style={[
                    styles.toggleCompanyModeText,
                    { color: colors.primary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {isAddingNewCompany ? 'Select Existing' : '+ Quick Add Company'}
                </Text>
              </TouchableOpacity>
            </View>

            {isAddingNewCompany ? (
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
                placeholder="Enter Company Name (e.g. Amazon)"
                placeholderTextColor={colors.textMuted}
                value={quickNewCompanyName}
                onChangeText={setQuickNewCompanyName}
              />
            ) : (
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
            )}

            {/* Role Title */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Job Role Title *
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
              placeholder="e.g. Software Engineer, Backend Intern, Data Analyst"
              placeholderTextColor={colors.textMuted}
              value={roleTitle}
              onChangeText={setRoleTitle}
            />

            {/* Job Type Selector */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Job Type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pillRow}
            >
              {JOB_TYPES.map((jt) => (
                <TouchableOpacity
                  key={jt}
                  onPress={() => setJobType(jt)}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor:
                        jobType === jt ? colors.primary : colors.surfaceRaised,
                      borderColor:
                        jobType === jt ? colors.primary : colors.border,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      {
                        color:
                          jobType === jt ? '#FFFFFF' : colors.textSecondary,
                        fontSize: typography.fontSizes.xxs,
                      },
                    ]}
                  >
                    {jt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Compensation Breakdown: Total CTC, Fixed, Variable */}
            <View style={styles.threeCol}>
              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  CTC (LPA)
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
                  placeholder="e.g. 21.5"
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
                  Fixed (LPA)
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
                  placeholder="e.g. 16.0"
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
                  Variable (LPA)
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
                  placeholder="e.g. 5.5"
                  placeholderTextColor={colors.textMuted}
                  value={variableSalary}
                  onChangeText={setVariableSalary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Application Source & Resume Version */}
            <View style={styles.twoCol}>
              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Source
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
                  placeholder="Campus / Referral"
                  placeholderTextColor={colors.textMuted}
                  value={source}
                  onChangeText={setSource}
                />
              </View>

              <View style={styles.col}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Resume Version
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
                  placeholder="SWE_v2.pdf"
                  placeholderTextColor={colors.textMuted}
                  value={resumeVersion}
                  onChangeText={setResumeVersion}
                />
                {availableResumes.length > 0 && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {availableResumes.slice(0, 3).map((r) => (
                      <TouchableOpacity
                        key={r.id}
                        onPress={() => setResumeVersion(`${r.title} (${r.versionName})`)}
                        style={{
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          backgroundColor: `${colors.accent}15`,
                          borderRadius: borderRadius.xs,
                        }}
                      >
                        <Text style={{ fontSize: typography.fontSizes.xxs, color: colors.accent, fontWeight: '600' }} numberOfLines={1}>
                          {r.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Initial Status selector */}
            {!initialData && (
              <>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Initial Stage
                </Text>
                <View style={styles.statusChipsRow}>
                  {(['WISHLIST', 'APPLIED', 'ASSESSMENT'] as ApplicationStatus[]).map((st) => {
                    const meta = APPLICATION_STATUS_METADATA[st];
                    const isSelected = status === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        onPress={() => setStatus(st)}
                        style={[
                          styles.statusChip,
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
                            styles.statusChipText,
                            {
                              color: isSelected ? meta.color : colors.textSecondary,
                              fontSize: typography.fontSizes.xs,
                            },
                          ]}
                        >
                          {meta.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* Personal Notes */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Application Notes & Referral Tracking
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
              placeholder="Referral code used, key responsibilities, preparation strategy..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
              <PrimaryButton
                title={initialData ? 'Update Application' : 'Submit Application'}
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
  companySelectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleCompanyModeText: {
    fontWeight: '700',
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
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    marginRight: 6,
  },
  typeChipText: {
    fontWeight: '700',
  },
  threeCol: {
    flexDirection: 'row',
    gap: 8,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  statusChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  statusChipText: {
    fontWeight: '700',
  },
});
