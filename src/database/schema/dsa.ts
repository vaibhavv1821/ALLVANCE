import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// 1. DSA Topics
export const dsaTopics = sqliteTable('dsa_topics', {
  id: text('id').primaryKey(),
  level: integer('level').notNull(), // 1: Foundations, 2: Core DS, 3: Advanced DS, 4: Problem Solving
  levelName: text('level_name').notNull(),
  title: text('title').notNull(),
  orderIndex: integer('order_index').notNull(),
  description: text('description'),
  priority: text('priority').notNull().default('medium'), // low, medium, high
  status: text('status').notNull().default('not_started'), // not_started, in_progress, completed
  mastery: text('mastery').notNull().default('average'), // weak, average, strong
  notes: text('notes'),
  isCustom: integer('is_custom').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 2. DSA Subtopics
export const dsaSubtopics = sqliteTable('dsa_subtopics', {
  id: text('id').primaryKey(),
  topicId: text('topic_id').notNull().references(() => dsaTopics.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  isCompleted: integer('is_completed').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 3. DSA Problems
export const dsaProblems = sqliteTable('dsa_problems', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  problemStatement: text('problem_statement'),
  problemIdExt: text('problem_id_ext'), // e.g. LC-1, GFG-12
  platform: text('platform').notNull().default('LeetCode'), // LeetCode, GeeksforGeeks, HackerRank, CodeStudio, Custom
  externalUrl: text('external_url'),
  topicId: text('topic_id').references(() => dsaTopics.id, { onDelete: 'set null' }),
  topicName: text('topic_name').notNull(),
  subtopicId: text('subtopic_id').references(() => dsaSubtopics.id, { onDelete: 'set null' }),
  subtopicName: text('subtopic_name'),
  difficulty: text('difficulty').notNull().default('Medium'), // Easy, Medium, Hard
  status: text('status').notNull().default('unsolved'), // unsolved, attempted, solved, revision
  firstAttemptedAt: integer('first_attempted_at'),
  solvedAt: integer('solved_at'),
  attemptsCount: integer('attempts_count').notNull().default(0),
  confidenceRating: integer('confidence_rating').default(3), // 1-5
  personalDifficulty: text('personal_difficulty').default('Medium'), // Easy, Medium, Hard
  approach: text('approach'),
  algorithmExplanation: text('algorithm_explanation'),
  timeComplexity: text('time_complexity'),
  spaceComplexity: text('space_complexity'),
  notes: text('notes'),
  importantEdgeCases: text('important_edge_cases'),
  isFavorite: integer('is_favorite').notNull().default(0),
  revisionStatus: text('revision_status').notNull().default('none'), // none, due, overdue, upcoming, completed
  nextRevisionAt: integer('next_revision_at'),
  revisionIntervalStep: integer('revision_interval_step').notNull().default(0), // 0 to 5
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 4. DSA Problem Tags
export const dsaProblemTags = sqliteTable('dsa_problem_tags', {
  id: text('id').primaryKey(),
  problemId: text('problem_id').notNull().references(() => dsaProblems.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
});

// 5. DSA Problem Companies
export const dsaProblemCompanies = sqliteTable('dsa_problem_companies', {
  id: text('id').primaryKey(),
  problemId: text('problem_id').notNull().references(() => dsaProblems.id, { onDelete: 'cascade' }),
  companyName: text('company_name').notNull(),
  isVerified: integer('is_verified').notNull().default(0),
});

// 6. DSA Problem Attempts
export const dsaAttempts = sqliteTable('dsa_attempts', {
  id: text('id').primaryKey(),
  problemId: text('problem_id').notNull().references(() => dsaProblems.id, { onDelete: 'cascade' }),
  attemptNumber: integer('attempt_number').notNull(),
  status: text('status').notNull(), // failed, partially_solved, solved
  timeSpentMinutes: integer('time_spent_minutes').default(0),
  approachNotes: text('approach_notes'),
  codeSnippet: text('code_snippet'),
  language: text('language'),
  attemptedAt: integer('attempted_at').notNull(),
});

// 7. DSA Problem Solutions (Solution Notebook)
export const dsaSolutions = sqliteTable('dsa_solutions', {
  id: text('id').primaryKey(),
  problemId: text('problem_id').notNull().references(() => dsaProblems.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  language: text('language').notNull(), // Java, Python, C++, JavaScript, Custom
  code: text('code').notNull(),
  approach: text('approach'),
  explanation: text('explanation'),
  timeComplexity: text('time_complexity'),
  spaceComplexity: text('space_complexity'),
  edgeCases: text('edge_cases'),
  mistakes: text('mistakes'),
  isOptimal: integer('is_optimal').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 8. DSA Problem Revisions (Spaced Repetition)
export const dsaRevisions = sqliteTable('dsa_revisions', {
  id: text('id').primaryKey(),
  problemId: text('problem_id').notNull().references(() => dsaProblems.id, { onDelete: 'cascade' }),
  revisionNumber: integer('revision_number').notNull(),
  scheduledDate: integer('scheduled_date').notNull(),
  completedDate: integer('completed_date'),
  recallRating: text('recall_rating'), // Easy, Medium, Difficult
  notes: text('notes'),
  timeTakenMinutes: integer('time_taken_minutes').default(0),
  status: text('status').notNull().default('upcoming'), // due, overdue, upcoming, completed
  createdAt: integer('created_at').notNull(),
});

// 9. DSA Study Sessions
export const dsaStudySessions = sqliteTable('dsa_study_sessions', {
  id: text('id').primaryKey(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time'),
  durationMinutes: integer('duration_minutes').notNull().default(0),
  topicId: text('topic_id').references(() => dsaTopics.id, { onDelete: 'set null' }),
  problemsSolved: integer('problems_solved').notNull().default(0),
  notes: text('notes'),
  dateString: text('date_string').notNull(), // YYYY-MM-DD
  createdAt: integer('created_at').notNull(),
});

// 10. DSA Daily Goals
export const dsaDailyGoals = sqliteTable('dsa_daily_goals', {
  id: text('id').primaryKey(),
  targetDate: text('target_date').notNull().unique(), // YYYY-MM-DD
  problemTarget: integer('problem_target').notNull().default(3),
  durationTargetMinutes: integer('duration_target_minutes').notNull().default(60),
  weeklyProblemTarget: integer('weekly_problem_target').notNull().default(20),
  preferredDifficulty: text('preferred_difficulty').default('All'),
  preferredTopics: text('preferred_topics'),
  solvedCount: integer('solved_count').notNull().default(0),
  studyDurationMinutes: integer('study_duration_minutes').notNull().default(0),
  isCompleted: integer('is_completed').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 11. DSA Daily Activity (For streaks and heatmap)
export const dsaDailyActivity = sqliteTable('dsa_daily_activity', {
  id: text('id').primaryKey(),
  dateString: text('date_string').notNull().unique(), // YYYY-MM-DD
  problemsSolved: integer('problems_solved').notNull().default(0),
  problemsAttempted: integer('problems_attempted').notNull().default(0),
  revisionsCompleted: integer('revisions_completed').notNull().default(0),
  studyMinutes: integer('study_minutes').notNull().default(0),
  updatedAt: integer('updated_at').notNull(),
});

// 12. DSA Favorites
export const dsaFavorites = sqliteTable('dsa_favorites', {
  id: text('id').primaryKey(),
  problemId: text('problem_id').notNull().references(() => dsaProblems.id, { onDelete: 'cascade' }).unique(),
  createdAt: integer('created_at').notNull(),
});

// Type definitions for inference
export type DsaTopic = typeof dsaTopics.$inferSelect;
export type NewDsaTopic = typeof dsaTopics.$inferInsert;

export type DsaSubtopic = typeof dsaSubtopics.$inferSelect;
export type NewDsaSubtopic = typeof dsaSubtopics.$inferInsert;

export type DsaProblem = typeof dsaProblems.$inferSelect;
export type NewDsaProblem = typeof dsaProblems.$inferInsert;

export type DsaProblemTag = typeof dsaProblemTags.$inferSelect;
export type NewDsaProblemTag = typeof dsaProblemTags.$inferInsert;

export type DsaProblemCompany = typeof dsaProblemCompanies.$inferSelect;
export type NewDsaProblemCompany = typeof dsaProblemCompanies.$inferInsert;

export type DsaAttempt = typeof dsaAttempts.$inferSelect;
export type NewDsaAttempt = typeof dsaAttempts.$inferInsert;

export type DsaSolution = typeof dsaSolutions.$inferSelect;
export type NewDsaSolution = typeof dsaSolutions.$inferInsert;

export type DsaRevision = typeof dsaRevisions.$inferSelect;
export type NewDsaRevision = typeof dsaRevisions.$inferInsert;

export type DsaStudySession = typeof dsaStudySessions.$inferSelect;
export type NewDsaStudySession = typeof dsaStudySessions.$inferInsert;

export type DsaDailyGoal = typeof dsaDailyGoals.$inferSelect;
export type NewDsaDailyGoal = typeof dsaDailyGoals.$inferInsert;

export type DsaDailyActivity = typeof dsaDailyActivity.$inferSelect;
export type NewDsaDailyActivity = typeof dsaDailyActivity.$inferInsert;

export type DsaFavorite = typeof dsaFavorites.$inferSelect;
export type NewDsaFavorite = typeof dsaFavorites.$inferInsert;
