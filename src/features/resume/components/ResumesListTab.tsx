import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  FileText,
  Plus,
  FileUp,
  Copy,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ResumeSummary } from '@/database/repositories/ResumeRepository';
import { EmptyState, SearchInput } from '@/components';

interface ResumesListTabProps {
  resumes: ResumeSummary[];
  activeResumeId: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectResume: (id: string) => void;
  onCreateResume: () => void;
  onImportResume: () => void;
  onDuplicateResume: (resume: ResumeSummary) => void;
  onRenameResume: (resume: ResumeSummary) => void;
  onDeleteResume: (resume: ResumeSummary) => void;
  onSetDefaultResume: (id: string) => void;
}

export const ResumesListTab: React.FC<ResumesListTabProps> = ({
  resumes,
  activeResumeId,
  searchQuery,
  onSearchChange,
  onSelectResume,
  onCreateResume,
  onImportResume,
  onDuplicateResume,
  onRenameResume,
  onDeleteResume,
  onSetDefaultResume,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const filtered = resumes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.targetRole && r.targetRole.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { padding: spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Action Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCreateResume}
          style={[
            styles.actionBtn,
            { backgroundColor: colors.accent, borderRadius: borderRadius.md },
          ]}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={[styles.actionBtnText, { color: '#FFFFFF', fontSize: typography.fontSizes.sm }]}>
            New Resume
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onImportResume}
          style={[
            styles.actionBtn,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <FileUp size={16} color={colors.textPrimary} />
          <Text style={[styles.actionBtnText, { color: colors.textPrimary, fontSize: typography.fontSizes.sm }]}>
            Import PDF / Backup
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      {resumes.length > 2 && (
        <View style={{ marginBottom: spacing.md }}>
          <SearchInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search resumes by title or role..."
          />
        </View>
      )}

      {/* Resumes List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} color={colors.textMuted} />}
          title={searchQuery ? 'No Matching Resumes' : 'No Resumes Yet'}
          description={
            searchQuery
              ? 'Try adjusting your search query.'
              : 'Create multiple targeted resumes (e.g. SDE, Frontend, Data Analyst) or import an existing document.'
          }
          actionLabel="Create Resume"
          onAction={onCreateResume}
        />
      ) : (
        filtered.map((resume) => {
          const isActive = resume.id === activeResumeId;
          const isDefault = resume.isDefault === 1;

          return (
            <TouchableOpacity
              key={resume.id}
              activeOpacity={0.85}
              onPress={() => onSelectResume(resume.id)}
              style={[
                styles.resumeCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isActive ? colors.accent : colors.border,
                  borderWidth: isActive ? 2 : 1,
                  borderRadius: borderRadius.lg,
                  marginBottom: spacing.md,
                  padding: spacing.md,
                },
              ]}
            >
              {/* Header row */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isActive ? `${colors.accent}25` : colors.surfaceRaised,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                  >
                    <FileText size={20} color={isActive ? colors.accent : colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <View style={styles.titleRow}>
                      <Text
                        style={[
                          styles.resumeTitle,
                          {
                            color: colors.textPrimary,
                            fontSize: typography.fontSizes.md,
                            fontWeight: typography.fontWeights.semiBold,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {resume.title}
                      </Text>
                      {isDefault && (
                        <View
                          style={[
                            styles.badge,
                            {
                              backgroundColor: `${colors.accent}20`,
                              borderColor: `${colors.accent}40`,
                              borderWidth: 1,
                              borderRadius: borderRadius.xs,
                            },
                          ]}
                        >
                          <Star size={10} color={colors.accent} fill={colors.accent} />
                          <Text
                            style={[
                              styles.badgeText,
                              { color: colors.accent, fontSize: typography.fontSizes.xxs },
                            ]}
                          >
                            DEFAULT
                          </Text>
                        </View>
                      )}
                    </View>

                    {resume.targetRole ? (
                      <Text
                        style={[
                          styles.roleText,
                          { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 },
                        ]}
                      >
                        Target: {resume.targetRole}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {/* Meta row */}
              <View style={[styles.metaRow, { marginTop: spacing.sm }]}>
                <Text style={[styles.metaText, { color: colors.textMuted, fontSize: typography.fontSizes.xxs }]}>
                  Template: <Text style={{ color: colors.textSecondary, textTransform: 'capitalize' }}>{resume.templateId}</Text>
                </Text>
                <Text style={[styles.metaText, { color: colors.textMuted, fontSize: typography.fontSizes.xxs }]}>
                  Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                </Text>
              </View>

              {/* Action Buttons row */}
              <View
                style={[
                  styles.cardActions,
                  {
                    borderTopColor: colors.borderSubtle,
                    borderTopWidth: 1,
                    marginTop: spacing.sm,
                    paddingTop: spacing.xs,
                  },
                ]}
              >
                {!isDefault && (
                  <TouchableOpacity
                    onPress={() => onSetDefaultResume(resume.id)}
                    style={styles.iconBtn}
                  >
                    <Star size={14} color={colors.textSecondary} />
                    <Text style={[styles.iconBtnText, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                      Make Default
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => onDuplicateResume(resume)}
                  style={styles.iconBtn}
                >
                  <Copy size={14} color={colors.textSecondary} />
                  <Text style={[styles.iconBtnText, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                    Duplicate
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onRenameResume(resume)}
                  style={styles.iconBtn}
                >
                  <Edit2 size={14} color={colors.textSecondary} />
                  <Text style={[styles.iconBtnText, { color: colors.textSecondary, fontSize: typography.fontSizes.xs }]}>
                    Edit Info
                  </Text>
                </TouchableOpacity>

                {resumes.length > 1 && (
                  <TouchableOpacity
                    onPress={() => onDeleteResume(resume)}
                    style={styles.iconBtn}
                  >
                    <Trash2 size={14} color={colors.danger} />
                    <Text style={[styles.iconBtnText, { color: colors.danger, fontSize: typography.fontSizes.xs }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  actionBtnText: {
    fontWeight: '600',
  },
  resumeCard: {},
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resumeTitle: {
    flexShrink: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontWeight: '700',
  },
  roleText: {},
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {},
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  iconBtnText: {
    fontWeight: '500',
  },
});
