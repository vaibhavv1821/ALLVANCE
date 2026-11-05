import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Code2,
  Award,
  Trophy,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  ResumeDetailed,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
  ResumeCertification,
  ResumeAchievement,
} from '@/database/repositories/ResumeRepository';

interface ResumeEditorTabProps {
  resume: ResumeDetailed;
  onEditProfile: () => void;
  onReorderSections: () => void;
  // Education
  onAddEducation: () => void;
  onEditEducation: (edu: ResumeEducation) => void;
  onDeleteEducation: (id: string) => void;
  // Experience
  onAddExperience: (isInternship: number) => void;
  onEditExperience: (exp: ResumeExperience) => void;
  onDeleteExperience: (id: string) => void;
  // Projects
  onAddProject: () => void;
  onEditProject: (proj: ResumeProject) => void;
  onDeleteProject: (id: string) => void;
  // Skills
  onAddSkill: (isSoftSkill: number) => void;
  onEditSkill: (skill: ResumeSkill) => void;
  onDeleteSkill: (id: string) => void;
  // Certifications
  onAddCertification: () => void;
  onEditCertification: (cert: ResumeCertification) => void;
  onDeleteCertification: (id: string) => void;
  // Achievements
  onAddAchievement: (type: 'achievement' | 'extracurricular') => void;
  onEditAchievement: (ach: ResumeAchievement) => void;
  onDeleteAchievement: (id: string) => void;
}

export const ResumeEditorTab: React.FC<ResumeEditorTabProps> = ({
  resume,
  onEditProfile,
  onReorderSections,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
  onAddCertification,
  onEditCertification,
  onDeleteCertification,
  onAddAchievement,
  onEditAchievement,
  onDeleteAchievement,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const p = resume.profile;

  const workExperience = resume.experience.filter((e) => e.isInternship === 0);
  const internships = resume.experience.filter((e) => e.isInternship === 1);
  const technicalSkills = resume.skills.filter((s) => s.isSoftSkill === 0);
  const softSkills = resume.skills.filter((s) => s.isSoftSkill === 1);
  const honors = resume.achievements.filter((a) => a.type === 'achievement');
  const extracurriculars = resume.achievements.filter((a) => a.type === 'extracurricular');

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { padding: spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Banner with Section Reorder Button */}
      <View style={styles.topHeader}>
        <View>
          <Text
            style={[
              styles.activeResumeTitle,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.lg,
                fontWeight: typography.fontWeights.bold,
              },
            ]}
          >
            {resume.title}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 }}>
            Version: {resume.versionName} • Template: {resume.templateId}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onReorderSections}
          activeOpacity={0.7}
          style={[
            styles.reorderBtn,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <ArrowUpDown size={14} color={colors.accent} />
          <Text style={[styles.reorderBtnText, { color: colors.accent, fontSize: typography.fontSizes.xs }]}>
            Reorder
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. Profile / Contact Info Card */}
      <View
        style={[
          styles.sectionBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            marginBottom: spacing.lg,
            padding: spacing.md,
          },
        ]}
      >
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleLeft}>
            <User size={18} color={colors.accent} />
            <Text
              style={[
                styles.sectionHeading,
                {
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.md,
                  fontWeight: typography.fontWeights.semiBold,
                },
              ]}
            >
              Contact & Profile
            </Text>
          </View>
          <TouchableOpacity
            onPress={onEditProfile}
            style={[
              styles.editProfileBtn,
              { backgroundColor: `${colors.accent}20`, borderRadius: borderRadius.sm },
            ]}
          >
            <Edit2 size={13} color={colors.accent} />
            <Text style={{ color: colors.accent, fontSize: typography.fontSizes.xs, fontWeight: '600' }}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: spacing.sm }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.fontSizes.md,
              fontWeight: '700',
            }}
          >
            {p?.fullName || 'Full Name Not Set'}
          </Text>
          {p?.professionalTitle ? (
            <Text style={{ color: colors.accent, fontSize: typography.fontSizes.xs, fontWeight: '600', marginTop: 2 }}>
              {p.professionalTitle}
            </Text>
          ) : null}

          <View style={[styles.contactItemsWrap, { marginTop: spacing.xs }]}>
            {p?.email ? (
              <View style={styles.contactChip}>
                <Mail size={12} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs }}>{p.email}</Text>
              </View>
            ) : null}
            {p?.phone ? (
              <View style={styles.contactChip}>
                <Phone size={12} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs }}>{p.phone}</Text>
              </View>
            ) : null}
            {p?.location ? (
              <View style={styles.contactChip}>
                <MapPin size={12} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs }}>{p.location}</Text>
              </View>
            ) : null}
          </View>

          {p?.summary ? (
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSizes.xs,
                lineHeight: 18,
                marginTop: spacing.sm,
              }}
              numberOfLines={3}
            >
              {p.summary}
            </Text>
          ) : (
            <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xs, fontStyle: 'italic', marginTop: spacing.xs }}>
              No professional summary added yet.
            </Text>
          )}
        </View>
      </View>

      {/* 2. Education Section */}
      <SectionCard
        title="Education"
        icon={<GraduationCap size={18} color="#38BDF8" />}
        onAdd={onAddEducation}
        addLabel="Add Education"
      >
        {resume.education.length === 0 ? (
          <EmptySectionText message="No education history added yet." />
        ) : (
          resume.education.map((edu) => (
            <ItemRow
              key={edu.id}
              title={edu.institution}
              subtitle={`${edu.degree}${edu.fieldOfStudy ? ` • ${edu.fieldOfStudy}` : ''}`}
              date={[edu.startDate, edu.endDate].filter(Boolean).join(' - ')}
              meta={edu.grade ? `Grade: ${edu.grade}` : undefined}
              onEdit={() => onEditEducation(edu)}
              onDelete={() => onDeleteEducation(edu.id)}
            />
          ))
        )}
      </SectionCard>

      {/* 3. Technical Skills Section */}
      <SectionCard
        title="Technical Skills"
        icon={<Code2 size={18} color="#10B981" />}
        onAdd={() => onAddSkill(0)}
        addLabel="Add Skill Category"
      >
        {technicalSkills.length === 0 ? (
          <EmptySectionText message="No technical skills added yet." />
        ) : (
          technicalSkills.map((sk) => (
            <ItemRow
              key={sk.id}
              title={sk.category}
              subtitle={sk.skills}
              meta={sk.proficiency ? `Level: ${sk.proficiency}` : undefined}
              onEdit={() => onEditSkill(sk)}
              onDelete={() => onDeleteSkill(sk.id)}
            />
          ))
        )}
      </SectionCard>

      {/* 4. Projects Section */}
      <SectionCard
        title="Projects"
        icon={<FolderGit2 size={18} color="#F59E0B" />}
        onAdd={onAddProject}
        addLabel="Add Project"
      >
        {resume.projects.length === 0 ? (
          <EmptySectionText message="No projects added yet." />
        ) : (
          resume.projects.map((proj) => (
            <ItemRow
              key={proj.id}
              title={proj.title}
              subtitle={proj.techStack ? `Tech: ${proj.techStack}` : undefined}
              date={[proj.startDate, proj.endDate].filter(Boolean).join(' - ')}
              meta={proj.description}
              onEdit={() => onEditProject(proj)}
              onDelete={() => onDeleteProject(proj.id)}
            />
          ))
        )}
      </SectionCard>

      {/* 5. Work Experience Section */}
      <SectionCard
        title="Work Experience"
        icon={<Briefcase size={18} color="#818CF8" />}
        onAdd={() => onAddExperience(0)}
        addLabel="Add Experience"
      >
        {workExperience.length === 0 ? (
          <EmptySectionText message="No work experience added." />
        ) : (
          workExperience.map((exp) => (
            <ItemRow
              key={exp.id}
              title={exp.position}
              subtitle={exp.company}
              date={[exp.startDate, exp.isCurrent ? 'Present' : exp.endDate].filter(Boolean).join(' - ')}
              meta={exp.location || undefined}
              onEdit={() => onEditExperience(exp)}
              onDelete={() => onDeleteExperience(exp.id)}
            />
          ))
        )}
      </SectionCard>

      {/* 6. Internships Section */}
      <SectionCard
        title="Internships"
        icon={<Briefcase size={18} color="#EC4899" />}
        onAdd={() => onAddExperience(1)}
        addLabel="Add Internship"
      >
        {internships.length === 0 ? (
          <EmptySectionText message="No internships added." />
        ) : (
          internships.map((exp) => (
            <ItemRow
              key={exp.id}
              title={exp.position}
              subtitle={exp.company}
              date={[exp.startDate, exp.isCurrent ? 'Present' : exp.endDate].filter(Boolean).join(' - ')}
              meta={exp.location || undefined}
              onEdit={() => onEditExperience(exp)}
              onDelete={() => onDeleteExperience(exp.id)}
            />
          ))
        )}
      </SectionCard>

      {/* 7. Certifications Section */}
      <SectionCard
        title="Certifications"
        icon={<Award size={18} color="#F97316" />}
        onAdd={onAddCertification}
        addLabel="Add Certification"
      >
        {resume.certifications.length === 0 ? (
          <EmptySectionText message="No certifications added." />
        ) : (
          resume.certifications.map((cert) => (
            <ItemRow
              key={cert.id}
              title={cert.name}
              subtitle={cert.issuer}
              date={cert.issueDate || undefined}
              meta={cert.credentialId ? `ID: ${cert.credentialId}` : undefined}
              onEdit={() => onEditCertification(cert)}
              onDelete={() => onDeleteCertification(cert.id)}
            />
          ))
        )}
      </SectionCard>

      {/* 8. Achievements & Awards Section */}
      <SectionCard
        title="Achievements & Honors"
        icon={<Trophy size={18} color="#EAB308" />}
        onAdd={() => onAddAchievement('achievement')}
        addLabel="Add Achievement"
      >
        {honors.length === 0 ? (
          <EmptySectionText message="No achievements added." />
        ) : (
          honors.map((ach) => (
            <ItemRow
              key={ach.id}
              title={ach.title}
              subtitle={ach.description || undefined}
              date={ach.date || undefined}
              onEdit={() => onEditAchievement(ach)}
              onDelete={() => onDeleteAchievement(ach.id)}
            />
          ))
        )}
      </SectionCard>

      {/* 9. Extracurricular & Leadership Section */}
      <SectionCard
        title="Extracurricular & Leadership"
        icon={<Trophy size={18} color="#14B8A6" />}
        onAdd={() => onAddAchievement('extracurricular')}
        addLabel="Add Extracurricular"
      >
        {extracurriculars.length === 0 ? (
          <EmptySectionText message="No extracurricular activities added." />
        ) : (
          extracurriculars.map((ach) => (
            <ItemRow
              key={ach.id}
              title={ach.title}
              subtitle={ach.description || undefined}
              date={ach.date || undefined}
              onEdit={() => onEditAchievement(ach)}
              onDelete={() => onDeleteAchievement(ach.id)}
            />
          ))
        )}
      </SectionCard>

      {/* 10. Soft Skills Section */}
      <SectionCard
        title="Soft Skills & Leadership"
        icon={<Code2 size={18} color="#6366F1" />}
        onAdd={() => onAddSkill(1)}
        addLabel="Add Soft Skill Group"
      >
        {softSkills.length === 0 ? (
          <EmptySectionText message="No soft skills added." />
        ) : (
          softSkills.map((sk) => (
            <ItemRow
              key={sk.id}
              title={sk.category}
              subtitle={sk.skills}
              onEdit={() => onEditSkill(sk)}
              onDelete={() => onDeleteSkill(sk.id)}
            />
          ))
        )}
      </SectionCard>
    </ScrollView>
  );
};

// Sub-components
const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  onAdd: () => void;
  addLabel: string;
  children: React.ReactNode;
}> = ({ title, icon, onAdd, addLabel, children }) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  return (
    <View
      style={[
        styles.sectionBox,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          marginBottom: spacing.lg,
          padding: spacing.md,
        },
      ]}
    >
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionTitleLeft}>
          {icon}
          <Text
            style={[
              styles.sectionHeading,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.md,
                fontWeight: typography.fontWeights.semiBold,
              },
            ]}
          >
            {title}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onAdd}
          style={[
            styles.addItemBtn,
            { backgroundColor: `${colors.accent}15`, borderRadius: borderRadius.sm },
          ]}
        >
          <Plus size={13} color={colors.accent} />
          <Text style={{ color: colors.accent, fontSize: typography.fontSizes.xs, fontWeight: '600' }}>
            {addLabel}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: spacing.sm }}>{children}</View>
    </View>
  );
};

const ItemRow: React.FC<{
  title: string;
  subtitle?: string;
  date?: string;
  meta?: string | null;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ title, subtitle, date, meta, onEdit, onDelete }) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  return (
    <View
      style={[
        styles.itemRow,
        {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.borderSubtle,
          borderRadius: borderRadius.md,
          marginBottom: spacing.xs,
          padding: spacing.sm,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.fontSizes.sm,
              fontWeight: '600',
              flex: 1,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {date ? (
            <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs, marginLeft: 8 }}>
              {date}
            </Text>
          ) : null}
        </View>

        {subtitle ? (
          <Text
            style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 }}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        ) : null}

        {meta ? (
          <Text
            style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs, marginTop: 3 }}
            numberOfLines={2}
          >
            {meta}
          </Text>
        ) : null}
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionIconBtn}>
          <Edit2 size={13} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionIconBtn}>
          <Trash2 size={13} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EmptySectionText: React.FC<{ message: string }> = ({ message }) => {
  const { colors, typography } = useAppTheme();
  return (
    <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xs, fontStyle: 'italic', paddingVertical: 4 }}>
      {message}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  activeResumeTitle: {},
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  reorderBtnText: {
    fontWeight: '600',
  },
  sectionBox: {
    borderWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {},
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  contactItemsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  actionIconBtn: {
    padding: 6,
  },
});
