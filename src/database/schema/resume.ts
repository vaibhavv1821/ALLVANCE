import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// 1. Resumes table
export const resumes = sqliteTable(
  'resumes',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    targetRole: text('target_role'),
    templateId: text('template_id').notNull().default('modern'),
    isDefault: integer('is_default').notNull().default(0),
    versionName: text('version_name').notNull().default('v1.0'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_resumes_is_default').on(table.isDefault),
    index('idx_resumes_created_at').on(table.createdAt),
  ]
);

// 2. Resume Profiles table
export const resumeProfiles = sqliteTable(
  'resume_profiles',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    fullName: text('full_name').notNull(),
    professionalTitle: text('professional_title'),
    email: text('email'),
    phone: text('phone'),
    location: text('location'),
    linkedinUrl: text('linkedin_url'),
    githubUrl: text('github_url'),
    portfolioUrl: text('portfolio_url'),
    summary: text('summary'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_resume_profiles_resume_id').on(table.resumeId),
  ]
);

// 3. Resume Sections Order & Visibility table
export const resumeSections = sqliteTable(
  'resume_sections',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    sectionKey: text('section_key').notNull(),
    title: text('title').notNull(),
    orderIndex: integer('order_index').notNull().default(0),
    isVisible: integer('is_visible').notNull().default(1),
  },
  (table) => [
    index('idx_resume_sections_resume_id').on(table.resumeId),
    index('idx_resume_sections_order').on(table.orderIndex),
  ]
);

// 4. Resume Education table
export const resumeEducation = sqliteTable(
  'resume_education',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    institution: text('institution').notNull(),
    degree: text('degree').notNull(),
    fieldOfStudy: text('field_of_study'),
    location: text('location'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    grade: text('grade'),
    description: text('description'),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_resume_edu_resume_id').on(table.resumeId),
    index('idx_resume_edu_order').on(table.orderIndex),
  ]
);

// 5. Resume Experience & Internships table
export const resumeExperience = sqliteTable(
  'resume_experience',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    isInternship: integer('is_internship').notNull().default(0),
    company: text('company').notNull(),
    position: text('position').notNull(),
    location: text('location'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    isCurrent: integer('is_current').notNull().default(0),
    description: text('description'),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_resume_exp_resume_id').on(table.resumeId),
    index('idx_resume_exp_is_internship').on(table.isInternship),
    index('idx_resume_exp_order').on(table.orderIndex),
  ]
);

// 6. Resume Projects table
export const resumeProjects = sqliteTable(
  'resume_projects',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    techStack: text('tech_stack'),
    liveUrl: text('live_url'),
    githubUrl: text('github_url'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    description: text('description'),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_resume_proj_resume_id').on(table.resumeId),
    index('idx_resume_proj_order').on(table.orderIndex),
  ]
);

// 7. Resume Skills table
export const resumeSkills = sqliteTable(
  'resume_skills',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    skills: text('skills').notNull(),
    proficiency: text('proficiency'),
    isSoftSkill: integer('is_soft_skill').notNull().default(0),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_resume_skills_resume_id').on(table.resumeId),
    index('idx_resume_skills_order').on(table.orderIndex),
  ]
);

// 8. Resume Certifications table
export const resumeCertifications = sqliteTable(
  'resume_certifications',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    issuer: text('issuer').notNull(),
    issueDate: text('issue_date'),
    expiryDate: text('expiry_date'),
    credentialId: text('credential_id'),
    credentialUrl: text('credential_url'),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_resume_cert_resume_id').on(table.resumeId),
    index('idx_resume_cert_order').on(table.orderIndex),
  ]
);

// 9. Resume Achievements & Extracurricular table
export const resumeAchievements = sqliteTable(
  'resume_achievements',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    date: text('date'),
    description: text('description'),
    type: text('type').notNull().default('achievement'), // 'achievement' | 'extracurricular'
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_resume_achieve_resume_id').on(table.resumeId),
    index('idx_resume_achieve_type').on(table.type),
    index('idx_resume_achieve_order').on(table.orderIndex),
  ]
);

// 10. Resume Versions (Snapshots) table
export const resumeVersions = sqliteTable(
  'resume_versions',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    versionLabel: text('version_label').notNull(),
    snapshotData: text('snapshot_data').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    index('idx_resume_versions_resume_id').on(table.resumeId),
    index('idx_resume_versions_created_at').on(table.createdAt),
  ]
);

// 11. Resume Job Matches table
export const resumeJobMatches = sqliteTable(
  'resume_job_matches',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    companyName: text('company_name'),
    jobTitle: text('job_title'),
    jobDescription: text('job_description').notNull(),
    matchScore: integer('match_score').notNull(),
    matchedKeywords: text('matched_keywords'),
    missingKeywords: text('missing_keywords'),
    recommendations: text('recommendations'),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    index('idx_resume_matches_resume_id').on(table.resumeId),
    index('idx_resume_matches_created_at').on(table.createdAt),
  ]
);

// 12. Resume Imported Files table
export const resumeImportedFiles = sqliteTable(
  'resume_imported_files',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id').references(() => resumes.id, { onDelete: 'set null' }),
    fileName: text('file_name').notNull(),
    fileUri: text('file_uri').notNull(),
    fileSize: integer('file_size'),
    importedAt: integer('imported_at').notNull(),
  },
  (table) => [
    index('idx_resume_files_resume_id').on(table.resumeId),
    index('idx_resume_files_imported_at').on(table.importedAt),
  ]
);

// Relations
export const resumesRelations = relations(resumes, ({ one, many }) => ({
  profile: one(resumeProfiles, {
    fields: [resumes.id],
    references: [resumeProfiles.resumeId],
  }),
  sections: many(resumeSections),
  education: many(resumeEducation),
  experience: many(resumeExperience),
  projects: many(resumeProjects),
  skills: many(resumeSkills),
  certifications: many(resumeCertifications),
  achievements: many(resumeAchievements),
  versions: many(resumeVersions),
  jobMatches: many(resumeJobMatches),
  importedFiles: many(resumeImportedFiles),
}));

export const resumeProfilesRelations = relations(resumeProfiles, ({ one }) => ({
  resume: one(resumes, {
    fields: [resumeProfiles.resumeId],
    references: [resumes.id],
  }),
}));

export type Resume = typeof resumes.$inferSelect;
export type ResumeProfile = typeof resumeProfiles.$inferSelect;
export type ResumeSection = typeof resumeSections.$inferSelect;
export type ResumeEducation = typeof resumeEducation.$inferSelect;
export type ResumeExperience = typeof resumeExperience.$inferSelect;
export type ResumeProject = typeof resumeProjects.$inferSelect;
export type ResumeSkill = typeof resumeSkills.$inferSelect;
export type ResumeCertification = typeof resumeCertifications.$inferSelect;
export type ResumeAchievement = typeof resumeAchievements.$inferSelect;
export type ResumeVersion = typeof resumeVersions.$inferSelect;
export type ResumeJobMatch = typeof resumeJobMatches.$inferSelect;
export type ResumeImportedFile = typeof resumeImportedFiles.$inferSelect;
