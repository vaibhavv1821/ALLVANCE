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
import { X, GraduationCap } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { ResumeEducation } from '@/database/schema/resume';

interface EducationModalProps {
  visible: boolean;
  initialData?: ResumeEducation | null;
  onClose: () => void;
  onSubmit: (data: Omit<ResumeEducation, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const EducationModal: React.FC<EducationModalProps> = ({
  visible,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setInstitution(initialData.institution);
        setDegree(initialData.degree);
        setFieldOfStudy(initialData.fieldOfStudy || '');
        setLocation(initialData.location || '');
        setStartDate(initialData.startDate || '');
        setEndDate(initialData.endDate || '');
        setGrade(initialData.grade || '');
        setDescription(initialData.description || '');
      } else {
        setInstitution('');
        setDegree('B.Tech in Computer Science & Engineering');
        setFieldOfStudy('Computer Science');
        setLocation('');
        setStartDate('2021');
        setEndDate('2025');
        setGrade('CGPA: 8.8 / 10.0');
        setDescription('');
      }
      setError(null);
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (!institution.trim() || !degree.trim()) {
      setError('Institution and Degree are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim() || null,
        location: location.trim() || null,
        startDate: startDate.trim() || null,
        endDate: endDate.trim() || null,
        grade: grade.trim() || null,
        description: description.trim() || null,
        orderIndex: initialData ? initialData.orderIndex : 0,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to save education');
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
              <GraduationCap size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                {initialData ? 'Edit Education' : 'Add Education'}
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
              COLLEGE / UNIVERSITY / SCHOOL *
            </Text>
            <TextInput
              value={institution}
              onChangeText={setInstitution}
              placeholder="e.g. Indian Institute of Technology, Bangalore"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              DEGREE / CERTIFICATE *
            </Text>
            <TextInput
              value={degree}
              onChangeText={setDegree}
              placeholder="e.g. B.Tech in Computer Science and Engineering"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  FIELD OF STUDY
                </Text>
                <TextInput
                  value={fieldOfStudy}
                  onChangeText={setFieldOfStudy}
                  placeholder="e.g. Computer Science"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  CGPA / PERCENTAGE
                </Text>
                <TextInput
                  value={grade}
                  onChangeText={setGrade}
                  placeholder="e.g. 8.9 / 10.0 or 92%"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  START YEAR
                </Text>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="e.g. 2021"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  END YEAR (OR EXPECTED)
                </Text>
                <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="e.g. 2025"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              CAMPUS LOCATION
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Bangalore, India"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              RELEVANT COURSEWORK / NOTES (OPTIONAL)
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholder="e.g. Coursework: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks."
              placeholderTextColor={colors.textMuted}
              style={[styles.textArea, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md, minHeight: 70 }]}
            />
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <PrimaryButton
              title={initialData ? 'Save Changes' : 'Add Education'}
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
