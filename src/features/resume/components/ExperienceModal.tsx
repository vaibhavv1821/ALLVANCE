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
import { X, Briefcase, Info } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { ResumeExperience } from '@/database/schema/resume';

interface ExperienceModalProps {
  visible: boolean;
  isInternshipDefault?: number;
  initialData?: ResumeExperience | null;
  onClose: () => void;
  onSubmit: (data: Omit<ResumeExperience, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  visible,
  isInternshipDefault = 0,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [isInternship, setIsInternship] = useState(isInternshipDefault === 1);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setCompany(initialData.company);
        setPosition(initialData.position);
        setLocation(initialData.location || '');
        setStartDate(initialData.startDate || '');
        setEndDate(initialData.endDate || '');
        setIsCurrent(initialData.isCurrent === 1);
        setIsInternship(initialData.isInternship === 1);
        setDescription(initialData.description || '');
      } else {
        setCompany('');
        setPosition(isInternshipDefault === 1 ? 'Software Engineering Intern' : 'Software Engineer');
        setLocation('Bangalore, India');
        setStartDate('May 2024');
        setEndDate(isInternshipDefault === 1 ? 'Jul 2024' : 'Present');
        setIsCurrent(isInternshipDefault === 0);
        setIsInternship(isInternshipDefault === 1);
        setDescription(
          '• Architected core microservice handling 15,000+ daily requests with 99.9% uptime.\n• Optimized database query execution plans, reducing p95 latency by 35%.'
        );
      }
      setError(null);
    }
  }, [visible, initialData, isInternshipDefault]);

  const handleSubmit = async () => {
    if (!company.trim() || !position.trim()) {
      setError('Company name and Role/Position are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        company: company.trim(),
        position: position.trim(),
        location: location.trim() || null,
        startDate: startDate.trim() || null,
        endDate: isCurrent ? 'Present' : endDate.trim() || null,
        isCurrent: isCurrent ? 1 : 0,
        isInternship: isInternship ? 1 : 0,
        description: description.trim() || null,
        orderIndex: initialData ? initialData.orderIndex : 0,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to save experience');
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
              <Briefcase size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                {initialData ? 'Edit Role' : isInternship ? 'Add Internship' : 'Add Experience'}
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
                  Internship Position
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs }}>
                  Categorize under Internships rather than full-time experience
                </Text>
              </View>
              <Switch
                value={isInternship}
                onValueChange={setIsInternship}
                trackColor={{ false: colors.border, true: colors.accent }}
              />
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
              COMPANY / ORGANIZATION *
            </Text>
            <TextInput
              value={company}
              onChangeText={setCompany}
              placeholder="e.g. Amazon, Google, Acme Tech"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              ROLE / POSITION TITLE *
            </Text>
            <TextInput
              value={position}
              onChangeText={setPosition}
              placeholder="e.g. Software Development Engineer Intern"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              LOCATION
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Bangalore, India (or Remote)"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  START DATE
                </Text>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="e.g. May 2024"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  END DATE
                </Text>
                <TextInput
                  value={isCurrent ? 'Present' : endDate}
                  onChangeText={setEndDate}
                  editable={!isCurrent}
                  placeholder="e.g. Aug 2024"
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: isCurrent ? colors.surfaceHighlight : colors.surfaceRaised,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, marginBottom: spacing.md }}>
              <Switch
                value={isCurrent}
                onValueChange={(val) => {
                  setIsCurrent(val);
                  if (val) setEndDate('Present');
                }}
                trackColor={{ false: colors.border, true: colors.accent }}
              />
              <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.xs, marginLeft: 8 }}>
                Currently working in this role
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                BULLET POINTS & ACHIEVEMENTS
              </Text>
            </View>

            <View style={[styles.tipBox, { backgroundColor: `${colors.accent}12`, borderRadius: borderRadius.sm, padding: spacing.xs, marginBottom: 6 }]}>
              <Info size={12} color={colors.accent} />
              <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs, flex: 1 }}>
                Begin bullets with action verbs (Architected, Engineered, Optimized) and include numbers (% or metrics).
              </Text>
            </View>

            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholder="• Spearheaded development of...\n• Decreased API response time by 40% through redis caching..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  minHeight: 110,
                },
              ]}
            />
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <PrimaryButton
              title={initialData ? 'Save Changes' : 'Save Position'}
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
    maxHeight: '88%',
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
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorBanner: {
    padding: 10,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
  },
});
