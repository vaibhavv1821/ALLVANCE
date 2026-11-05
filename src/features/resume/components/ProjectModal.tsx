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
import { X, FolderGit2, Info } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { ResumeProject } from '@/database/schema/resume';

interface ProjectModalProps {
  visible: boolean;
  initialData?: ResumeProject | null;
  onClose: () => void;
  onSubmit: (data: Omit<ResumeProject, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  visible,
  initialData,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [techStack, setTechStack] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title);
        setSubtitle(initialData.subtitle || '');
        setTechStack(initialData.techStack || '');
        setLiveUrl(initialData.liveUrl || '');
        setGithubUrl(initialData.githubUrl || '');
        setStartDate(initialData.startDate || '');
        setEndDate(initialData.endDate || '');
        setDescription(initialData.description || '');
      } else {
        setTitle('');
        setSubtitle('');
        setTechStack('React Native, TypeScript, SQLite, Node.js');
        setLiveUrl('');
        setGithubUrl('https://github.com/username/project');
        setStartDate('Jan 2024');
        setEndDate('Apr 2024');
        setDescription(
          '• Developed a distributed real-time platform handling 2,000+ simultaneous users.\n• Implemented optimized caching algorithms reducing server latency by 45%.'
        );
      }
      setError(null);
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Project Title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        techStack: techStack.trim() || null,
        liveUrl: liveUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
        startDate: startDate.trim() || null,
        endDate: endDate.trim() || null,
        description: description.trim() || null,
        orderIndex: initialData ? initialData.orderIndex : 0,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to save project');
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
              <FolderGit2 size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                {initialData ? 'Edit Project' : 'Add Project'}
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
              PROJECT TITLE *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. ALLVANCE Mobile Suite"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              SUBTITLE / ONE-LINE TAGLINE
            </Text>
            <TextInput
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder="e.g. Offline-First Mobile Productivity Engine"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: spacing.md }]}>
              TECH STACK & TOOLS (COMMA-SEPARATED)
            </Text>
            <TextInput
              value={techStack}
              onChangeText={setTechStack}
              placeholder="e.g. React Native, TypeScript, SQLite, Drizzle ORM, Docker"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  GITHUB REPO URL
                </Text>
                <TextInput
                  value={githubUrl}
                  onChangeText={setGithubUrl}
                  autoCapitalize="none"
                  placeholder="https://github.com/..."
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  LIVE DEMO / URL
                </Text>
                <TextInput
                  value={liveUrl}
                  onChangeText={setLiveUrl}
                  autoCapitalize="none"
                  placeholder="https://demo.app"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.md }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  START DATE
                </Text>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="e.g. Jan 2024"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                  END DATE
                </Text>
                <TextInput
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="e.g. Apr 2024 (or Present)"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.surfaceRaised, borderColor: colors.border, color: colors.textPrimary, borderRadius: borderRadius.md, padding: spacing.md }]}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                DESCRIPTION & METRICS
              </Text>
            </View>

            <View style={[styles.tipBox, { backgroundColor: `${colors.accent}12`, borderRadius: borderRadius.sm, padding: spacing.xs, marginBottom: 6 }]}>
              <Info size={12} color={colors.accent} />
              <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs, flex: 1 }}>
                Google XYZ formula: Accomplished [X], measured by [Y], by doing [Z].
              </Text>
            </View>

            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="• Engineered an offline-first caching layer reducing query time by 42%.\n• Designed multi-client sync protocol handling 2,000+ concurrent requests."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  minHeight: 100,
                },
              ]}
            />
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <PrimaryButton
              title={initialData ? 'Save Changes' : 'Add Project'}
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
