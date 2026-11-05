import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// 1. Companies table
export const companies = sqliteTable(
  'companies',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    industry: text('industry'),
    website: text('website'),
    location: text('location'),
    description: text('description'),
    hiringProcess: text('hiring_process'),
    eligibilityCriteria: text('eligibility_criteria'),
    minCgpa: real('min_cgpa'),
    eligibleBranches: text('eligible_branches'),
    packageRange: text('package_range'),
    notes: text('notes'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_companies_name').on(table.name),
    index('idx_companies_industry').on(table.industry),
  ]
);

// 2. Company Roles table
export const companyRoles = sqliteTable(
  'company_roles',
  {
    id: text('id').primaryKey(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    roleTitle: text('role_title').notNull(),
    jobType: text('job_type').notNull().default('Full-time'),
    location: text('location'),
    ctc: real('ctc'),
    fixedSalary: real('fixed_salary'),
    variableSalary: real('variable_salary'),
    eligibleBranches: text('eligible_branches'),
    minCgpa: real('min_cgpa'),
    description: text('description'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_company_roles_company_id').on(table.companyId),
  ]
);

// 3. Applications table
export const applications = sqliteTable(
  'applications',
  {
    id: text('id').primaryKey(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    roleId: text('role_id').references(() => companyRoles.id, {
      onDelete: 'set null',
    }),
    roleTitle: text('role_title').notNull(),
    jobType: text('job_type').notNull().default('Full-time'),
    ctc: real('ctc'),
    fixedSalary: real('fixed_salary'),
    variableSalary: real('variable_salary'),
    appliedDate: integer('applied_date').notNull(),
    deadlineDate: integer('deadline_date'),
    source: text('source').notNull().default('Campus'),
    resumeVersion: text('resume_version'),
    status: text('status').notNull().default('APPLIED'),
    notes: text('notes'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_applications_company_id').on(table.companyId),
    index('idx_applications_status').on(table.status),
    index('idx_applications_applied_date').on(table.appliedDate),
  ]
);

// 4. Application Status History table
export const applicationStatusHistory = sqliteTable(
  'application_status_history',
  {
    id: text('id').primaryKey(),
    applicationId: text('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    fromStatus: text('from_status'),
    toStatus: text('to_status').notNull(),
    changedAt: integer('changed_at').notNull(),
    notes: text('notes'),
  },
  (table) => [
    index('idx_app_status_history_app_id').on(table.applicationId),
    index('idx_app_status_history_changed_at').on(table.changedAt),
  ]
);

// 5. Hiring Rounds table
export const hiringRounds = sqliteTable(
  'hiring_rounds',
  {
    id: text('id').primaryKey(),
    applicationId: text('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    roundName: text('round_name').notNull(),
    roundType: text('round_type').notNull().default('other'),
    roundOrder: integer('round_order').notNull().default(1),
    scheduledDate: integer('scheduled_date'),
    completionStatus: text('completion_status').notNull().default('SCHEDULED'),
    result: text('result').notNull().default('PENDING'),
    score: text('score'),
    feedback: text('feedback'),
    questionsAsked: text('questions_asked'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_hiring_rounds_app_id').on(table.applicationId),
    index('idx_hiring_rounds_scheduled_date').on(table.scheduledDate),
  ]
);

// 6. Interviews table
export const interviews = sqliteTable(
  'interviews',
  {
    id: text('id').primaryKey(),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    applicationId: text('application_id').references(() => applications.id, {
      onDelete: 'set null',
    }),
    roundId: text('round_id').references(() => hiringRounds.id, {
      onDelete: 'set null',
    }),
    roleTitle: text('role_title').notNull(),
    interviewRound: text('interview_round').notNull(),
    interviewDate: integer('interview_date').notNull(),
    topicsDiscussed: text('topics_discussed'),
    difficulty: text('difficulty').notNull().default('MEDIUM'),
    feedback: text('feedback'),
    rating: integer('rating').notNull().default(3),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_interviews_company_id').on(table.companyId),
    index('idx_interviews_app_id').on(table.applicationId),
    index('idx_interviews_date').on(table.interviewDate),
  ]
);

// 7. Interview Questions table
export const interviewQuestions = sqliteTable(
  'interview_questions',
  {
    id: text('id').primaryKey(),
    interviewId: text('interview_id')
      .notNull()
      .references(() => interviews.id, { onDelete: 'cascade' }),
    question: text('question').notNull(),
    category: text('category'),
    notes: text('notes'),
    wasAnswered: integer('was_answered').notNull().default(1),
    createdAt: integer('created_at').notNull(),
  },
  (table) => [
    index('idx_interview_questions_interview_id').on(table.interviewId),
  ]
);

// 8. Offers table
export const offers = sqliteTable(
  'offers',
  {
    id: text('id').primaryKey(),
    applicationId: text('application_id').references(() => applications.id, {
      onDelete: 'set null',
    }),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    roleTitle: text('role_title').notNull(),
    ctc: real('ctc').notNull(),
    fixedSalary: real('fixed_salary'),
    variableSalary: real('variable_salary'),
    joiningDate: integer('joining_date'),
    offerDate: integer('offer_date').notNull(),
    acceptanceStatus: text('acceptance_status').notNull().default('PENDING'),
    notes: text('notes'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_offers_company_id').on(table.companyId),
    index('idx_offers_app_id').on(table.applicationId),
    index('idx_offers_status').on(table.acceptanceStatus),
  ]
);

// Drizzle Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  roles: many(companyRoles),
  applications: many(applications),
  interviews: many(interviews),
  offers: many(offers),
}));

export const companyRolesRelations = relations(companyRoles, ({ one, many }) => ({
  company: one(companies, {
    fields: [companyRoles.companyId],
    references: [companies.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  company: one(companies, {
    fields: [applications.companyId],
    references: [companies.id],
  }),
  role: one(companyRoles, {
    fields: [applications.roleId],
    references: [companyRoles.id],
  }),
  statusHistory: many(applicationStatusHistory),
  hiringRounds: many(hiringRounds),
  interviews: many(interviews),
  offers: many(offers),
}));

export const applicationStatusHistoryRelations = relations(
  applicationStatusHistory,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationStatusHistory.applicationId],
      references: [applications.id],
    }),
  })
);

export const hiringRoundsRelations = relations(hiringRounds, ({ one, many }) => ({
  application: one(applications, {
    fields: [hiringRounds.applicationId],
    references: [applications.id],
  }),
  interviews: many(interviews),
}));

export const interviewsRelations = relations(interviews, ({ one, many }) => ({
  company: one(companies, {
    fields: [interviews.companyId],
    references: [companies.id],
  }),
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
  round: one(hiringRounds, {
    fields: [interviews.roundId],
    references: [hiringRounds.id],
  }),
  questions: many(interviewQuestions),
}));

export const interviewQuestionsRelations = relations(
  interviewQuestions,
  ({ one }) => ({
    interview: one(interviews, {
      fields: [interviewQuestions.interviewId],
      references: [interviews.id],
    }),
  })
);

export const offersRelations = relations(offers, ({ one }) => ({
  company: one(companies, {
    fields: [offers.companyId],
    references: [companies.id],
  }),
  application: one(applications, {
    fields: [offers.applicationId],
    references: [applications.id],
  }),
}));

// Inferred Types
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

export type CompanyRole = typeof companyRoles.$inferSelect;
export type NewCompanyRole = typeof companyRoles.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

export type ApplicationStatusHistory = typeof applicationStatusHistory.$inferSelect;
export type NewApplicationStatusHistory = typeof applicationStatusHistory.$inferInsert;

export type HiringRound = typeof hiringRounds.$inferSelect;
export type NewHiringRound = typeof hiringRounds.$inferInsert;

export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;

export type InterviewQuestion = typeof interviewQuestions.$inferSelect;
export type NewInterviewQuestion = typeof interviewQuestions.$inferInsert;

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
