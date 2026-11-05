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
import { X, Building2 } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { Company } from '@/database/schema/placement';
import { DEFAULT_INDUSTRIES } from '../constants';

interface CompanyFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    industry?: string;
    website?: string;
    location?: string;
    description?: string;
    hiringProcess?: string;
    eligibilityCriteria?: string;
    minCgpa?: number;
    eligibleBranches?: string;
    packageRange?: string;
    notes?: string;
  }) => Promise<void>;
  initialData?: Company | null;
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [packageRange, setPackageRange] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [eligibleBranches, setEligibleBranches] = useState('');
  const [hiringProcess, setHiringProcess] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.name || '');
        setIndustry(initialData.industry || '');
        setWebsite(initialData.website || '');
        setLocation(initialData.location || '');
        setPackageRange(initialData.packageRange || '');
        setMinCgpa(initialData.minCgpa ? String(initialData.minCgpa) : '');
        setEligibleBranches(initialData.eligibleBranches || '');
        setHiringProcess(initialData.hiringProcess || '');
        setEligibilityCriteria(initialData.eligibilityCriteria || '');
        setDescription(initialData.description || '');
        setNotes(initialData.notes || '');
      } else {
        setName('');
        setIndustry(DEFAULT_INDUSTRIES[0]);
        setWebsite('');
        setLocation('');
        setPackageRange('');
        setMinCgpa('');
        setEligibleBranches('CSE, IT, ECE');
        setHiringProcess('');
        setEligibilityCriteria('');
        setDescription('');
        setNotes('');
      }
      setError(null);
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Company name is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        name: name.trim(),
        industry: industry.trim() || undefined,
        website: website.trim() || undefined,
        location: location.trim() || undefined,
        packageRange: packageRange.trim() || undefined,
        minCgpa: minCgpa.trim() ? parseFloat(minCgpa.trim()) : undefined,
        eligibleBranches: eligibleBranches.trim() || undefined,
        hiringProcess: hiringProcess.trim() || undefined,
        eligibilityCriteria: eligibilityCriteria.trim() || undefined,
        description: description.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save company profile.');
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
              <Building2 size={20} color={colors.primary} />
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg },
                ]}
              >
                {initialData ? 'Edit Company' : 'Add New Company'}
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
                <Text
                  style={[
                    styles.errorText,
                    { color: colors.danger, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* Company Name */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Company Name *
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
              placeholder="e.g. Google, Microsoft, Atlassian"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            {/* Industry selector pills */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Industry / Sector
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.pillRow}
            >
              {DEFAULT_INDUSTRIES.map((ind) => (
                <TouchableOpacity
                  key={ind}
                  onPress={() => setIndustry(ind)}
                  style={[
                    styles.industryPill,
                    {
                      backgroundColor:
                        industry === ind ? colors.primary : colors.surfaceRaised,
                      borderColor:
                        industry === ind ? colors.primary : colors.border,
                      borderRadius: borderRadius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.industryPillText,
                      {
                        color: industry === ind ? '#FFFFFF' : colors.textSecondary,
                        fontSize: typography.fontSizes.xxs,
                      },
                    ]}
                  >
                    {ind}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Location & Website */}
            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Location / HQ
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
                  placeholder="e.g. Bengaluru / Hybrid"
                  placeholderTextColor={colors.textMuted}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={styles.column}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Careers Website
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
                  placeholder="https://careers.google.com"
                  placeholderTextColor={colors.textMuted}
                  value={website}
                  onChangeText={setWebsite}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Package Range & Min CGPA */}
            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Package Range
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
                  placeholder="e.g. 18 - 25 LPA"
                  placeholderTextColor={colors.textMuted}
                  value={packageRange}
                  onChangeText={setPackageRange}
                />
              </View>

              <View style={styles.column}>
                <Text
                  style={[
                    styles.label,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Minimum CGPA
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
                  placeholder="e.g. 7.5 or 8.0"
                  placeholderTextColor={colors.textMuted}
                  value={minCgpa}
                  onChangeText={setMinCgpa}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Eligible Branches */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Eligible Branches
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
              placeholder="e.g. CSE, IT, ECE, EE, AI/DS"
              placeholderTextColor={colors.textMuted}
              value={eligibleBranches}
              onChangeText={setEligibleBranches}
            />

            {/* Hiring Process */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Hiring Process / Stages
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
              placeholder="e.g. 1. Resume Screen -> 2. OA (3 Coding Qs) -> 3. Tech Round 1 (DSA) -> 4. Tech Round 2 (System Design) -> 5. HR"
              placeholderTextColor={colors.textMuted}
              value={hiringProcess}
              onChangeText={setHiringProcess}
              multiline
              numberOfLines={3}
            />

            {/* Eligibility Criteria */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Eligibility Criteria / Requirements
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
              placeholder="e.g. No active backlogs, 60%+ in 10th/12th, 2026 batch graduates"
              placeholderTextColor={colors.textMuted}
              value={eligibilityCriteria}
              onChangeText={setEligibilityCriteria}
              multiline
              numberOfLines={2}
            />

            {/* Description */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Company Overview & Culture
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
              placeholder="Company profile, engineering culture, tech stack highlights..."
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
            />

            {/* Personal Notes */}
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
              ]}
            >
              Personal Notes / Contacts
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
              placeholder="Recruiter names, referral details, key topics to prepare..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
            />

            {/* Submit Button */}
            <View style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
              <PrimaryButton
                title={initialData ? 'Update Company Profile' : 'Save Company Profile'}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '90%',
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
  errorText: {
    fontWeight: '600',
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
    marginBottom: 8,
  },
  industryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    marginRight: 6,
  },
  industryPillText: {
    fontWeight: '700',
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
});
