import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// 1. Interview Categories
export const interviewCategories = sqliteTable('interview_categories', {
  id: text('id').primaryKey(),
  groupId: text('group_id').notNull(), // programming, database, cs_core, development, aiml, hr, projects
  groupName: text('group_name').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  orderIndex: integer('order_index').notNull().default(0),
  totalQuestions: integer('total_questions').notNull().default(0),
});

// 2. Interview Prep Questions
export const interviewPrepQuestions = sqliteTable('interview_prep_questions', {
  id: text('id').primaryKey(),
  categoryId: text('category_id')
    .notNull()
    .references(() => interviewCategories.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  difficulty: text('difficulty').notNull().default('INTERMEDIATE'), // BEGINNER, INTERMEDIATE, ADVANCED
  answer: text('answer').notNull(),
  example: text('example'),
  codeExample: text('code_example'),
  keyPoints: text('key_points'), // JSON string array of key takeaways
  followUps: text('follow_ups'), // JSON string array of follow-up questions/answers
  companies: text('companies'), // JSON string array of companies
  tags: text('tags'), // JSON string array of tags
  isCompleted: integer('is_completed').notNull().default(0),
  isBookmarked: integer('is_bookmarked').notNull().default(0),
  isDifficult: integer('is_difficult').notNull().default(0),
  completedAt: integer('completed_at'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 3. Interview Question Notes
export const interviewNotes = sqliteTable('interview_notes', {
  id: text('id').primaryKey(),
  questionId: text('question_id')
    .notNull()
    .references(() => interviewPrepQuestions.id, { onDelete: 'cascade' }),
  noteText: text('note_text').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 4. Interview Bookmarks
export const interviewBookmarks = sqliteTable('interview_bookmarks', {
  id: text('id').primaryKey(),
  questionId: text('question_id')
    .notNull()
    .references(() => interviewPrepQuestions.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at').notNull(),
});

// 5. Interview Question Practice Attempts
export const interviewAttempts = sqliteTable('interview_attempts', {
  id: text('id').primaryKey(),
  questionId: text('question_id')
    .notNull()
    .references(() => interviewPrepQuestions.id, { onDelete: 'cascade' }),
  sessionId: text('session_id'),
  userAnswer: text('user_answer'),
  selfRating: integer('self_rating').default(0), // 1-5
  isCorrect: integer('is_correct').default(0),
  timeSpentSeconds: integer('time_spent_seconds').notNull().default(0),
  attemptedAt: integer('attempted_at').notNull(),
});

// 6. Mock Interview Sessions
export const mockInterviews = sqliteTable('mock_interviews', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  company: text('company'), // 'General', 'Infosys', 'TCS', etc.
  categoryId: text('category_id'), // specific category id or 'ALL'
  difficulty: text('difficulty').notNull().default('ALL'),
  totalQuestions: integer('total_questions').notNull(),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  timeLimitSeconds: integer('time_limit_seconds').default(0),
  score: integer('score').notNull().default(0), // Percentage 0-100
  status: text('status').notNull().default('IN_PROGRESS'), // IN_PROGRESS, COMPLETED, ABANDONED
  summary: text('summary'), // JSON string: { attempted, correct, timeSpent, weakTopics, strongTopics }
  createdAt: integer('created_at').notNull(),
  completedAt: integer('completed_at'),
});

// 7. Mock Interview Question Items
export const mockInterviewQuestions = sqliteTable('mock_interview_questions', {
  id: text('id').primaryKey(),
  mockId: text('mock_id')
    .notNull()
    .references(() => mockInterviews.id, { onDelete: 'cascade' }),
  questionId: text('question_id')
    .notNull()
    .references(() => interviewPrepQuestions.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull().default(0),
  userAnswer: text('user_answer'),
  selfRating: integer('self_rating').default(0),
  isCorrect: integer('is_correct').default(0),
  timeSpentSeconds: integer('time_spent_seconds').notNull().default(0),
  reviewedAt: integer('reviewed_at'),
});

// 8. Interview Daily Goals
export const interviewDailyGoals = sqliteTable('interview_daily_goals', {
  id: text('id').primaryKey(),
  dateStr: text('date_str').notNull().unique(), // YYYY-MM-DD
  targetCount: integer('target_count').notNull().default(5),
  completedCount: integer('completed_count').notNull().default(0),
  isAchieved: integer('is_achieved').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 9. Interview Study Sessions
export const interviewStudySessions = sqliteTable('interview_study_sessions', {
  id: text('id').primaryKey(),
  dateStr: text('date_str').notNull(),
  categoryId: text('category_id'),
  durationMinutes: integer('duration_minutes').notNull().default(0),
  questionsReviewed: integer('questions_reviewed').notNull().default(0),
  createdAt: integer('created_at').notNull(),
});

// 10. Interview Spaced Revision Queue
export const interviewRevisions = sqliteTable('interview_revisions', {
  id: text('id').primaryKey(),
  questionId: text('question_id')
    .notNull()
    .references(() => interviewPrepQuestions.id, { onDelete: 'cascade' }),
  dueDate: integer('due_date').notNull(),
  intervalDays: integer('interval_days').notNull().default(1),
  easeFactor: real('ease_factor').notNull().default(2.5),
  repetitionCount: integer('repetition_count').notNull().default(0),
  status: text('status').notNull().default('PENDING'), // PENDING, COMPLETED, OVERDUE
  lastReviewedAt: integer('last_reviewed_at'),
  createdAt: integer('created_at').notNull(),
});

// 11. Company Preparation Checklists
export const interviewCompanyChecklists = sqliteTable('interview_company_checklists', {
  id: text('id').primaryKey(),
  companyName: text('company_name').notNull(),
  itemKey: text('item_key').notNull(),
  itemText: text('item_text').notNull(),
  isCompleted: integer('is_completed').notNull().default(0),
  updatedAt: integer('updated_at').notNull(),
});

// 12. Interview Flagship & User Projects
export const interviewUserProjects = sqliteTable('interview_user_projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  techStack: text('tech_stack'),
  problemStatement: text('problem_statement'),
  architecture: text('architecture'),
  databaseDesign: text('database_design'),
  apis: text('apis'),
  challenges: text('challenges'),
  technicalDecisions: text('technical_decisions'),
  scalability: text('scalability'),
  security: text('security'),
  futureImprovements: text('future_improvements'),
  customQuestions: text('custom_questions'), // JSON string array of { id, question, answer }
  isPredefined: integer('is_predefined').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 13. HR Custom Answers
export const interviewHrAnswers = sqliteTable('interview_hr_answers', {
  id: text('id').primaryKey(),
  questionKey: text('question_key').notNull().unique(),
  customAnswer: text('custom_answer').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// Types
export type InterviewPrepCategory = typeof interviewCategories.$inferSelect;
export type NewInterviewPrepCategory = typeof interviewCategories.$inferInsert;

export type InterviewPrepQuestion = typeof interviewPrepQuestions.$inferSelect;
export type NewInterviewPrepQuestion = typeof interviewPrepQuestions.$inferInsert;

export type InterviewPrepNote = typeof interviewNotes.$inferSelect;
export type NewInterviewPrepNote = typeof interviewNotes.$inferInsert;

export type InterviewPrepBookmark = typeof interviewBookmarks.$inferSelect;
export type NewInterviewPrepBookmark = typeof interviewBookmarks.$inferInsert;

export type InterviewAttempt = typeof interviewAttempts.$inferSelect;
export type NewInterviewAttempt = typeof interviewAttempts.$inferInsert;

export type MockInterview = typeof mockInterviews.$inferSelect;
export type NewMockInterview = typeof mockInterviews.$inferInsert;

export type MockInterviewQuestion = typeof mockInterviewQuestions.$inferSelect;
export type NewMockInterviewQuestion = typeof mockInterviewQuestions.$inferInsert;

export type InterviewDailyGoal = typeof interviewDailyGoals.$inferSelect;
export type NewInterviewDailyGoal = typeof interviewDailyGoals.$inferInsert;

export type InterviewStudySession = typeof interviewStudySessions.$inferSelect;
export type NewInterviewStudySession = typeof interviewStudySessions.$inferInsert;

export type InterviewRevision = typeof interviewRevisions.$inferSelect;
export type NewInterviewRevision = typeof interviewRevisions.$inferInsert;

export type InterviewCompanyChecklist = typeof interviewCompanyChecklists.$inferSelect;
export type NewInterviewCompanyChecklist = typeof interviewCompanyChecklists.$inferInsert;

export type InterviewUserProject = typeof interviewUserProjects.$inferSelect;
export type NewInterviewUserProject = typeof interviewUserProjects.$inferInsert;

export type InterviewHrAnswer = typeof interviewHrAnswers.$inferSelect;
export type NewInterviewHrAnswer = typeof interviewHrAnswers.$inferInsert;
