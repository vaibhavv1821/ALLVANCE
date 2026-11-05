import { getRawDb } from '../client';
import { DEFAULT_SETTINGS } from '../seed/defaultSettings';
import { DEFAULT_DSA_ROADMAP } from '../seed/defaultDsaRoadmap';
import { generateUUID } from '@/utils/uuid';

export interface Migration {
  version: number;
  name: string;
  up: (db: ReturnType<typeof getRawDb>) => void;
}

export const migrations: Migration[] = [
  {
    version: 1,
    name: '0001_initial_schema',
    up: (db) => {
      // 1. Settings table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);

      // 2. Applications table (Placement - Phase 0 placeholder)
      db.execSync(`
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          company_name TEXT NOT NULL,
          role TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'applied',
          applied_date INTEGER NOT NULL,
          package_lpa REAL,
          location TEXT,
          notes TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);

      // 3. DSA Problems table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_problems (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          title TEXT NOT NULL,
          platform TEXT NOT NULL,
          difficulty TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'unsolved',
          topic TEXT NOT NULL,
          url TEXT,
          notes TEXT,
          solved_at INTEGER,
          created_at INTEGER NOT NULL
        );
      `);

      // 4. Tasks table (Planner / Personal)
      db.execSync(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          due_date INTEGER,
          priority TEXT NOT NULL DEFAULT 'medium',
          status TEXT NOT NULL DEFAULT 'pending',
          category TEXT NOT NULL DEFAULT 'general',
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);

      // 5. Notes table (Knowledge Vault)
      db.execSync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'general',
          tags TEXT,
          is_pinned INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);

      // 6. Activity Logs table (Analytics / Dashboard)
      db.execSync(`
        CREATE TABLE IF NOT EXISTS activity_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          action TEXT NOT NULL,
          module TEXT NOT NULL,
          details TEXT,
          timestamp INTEGER NOT NULL
        );
      `);

      // Seed default settings if not already present
      const now = Date.now();
      const insertStmt = db.prepareSync(
        `INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES (?, ?, ?);`
      );
      try {
        for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
          insertStmt.executeSync([key, value, now]);
        }
      } finally {
        insertStmt.finalizeSync();
      }
    },
  },
  {
    version: 2,
    name: '0002_placement_module',
    up: (db) => {
      // 1. Companies table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS companies (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          industry TEXT,
          website TEXT,
          location TEXT,
          description TEXT,
          hiring_process TEXT,
          eligibility_criteria TEXT,
          min_cgpa REAL,
          eligible_branches TEXT,
          package_range TEXT,
          notes TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
        CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
      `);

      // 2. Company Roles table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS company_roles (
          id TEXT PRIMARY KEY NOT NULL,
          company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          role_title TEXT NOT NULL,
          job_type TEXT NOT NULL DEFAULT 'Full-time',
          location TEXT,
          ctc REAL,
          fixed_salary REAL,
          variable_salary REAL,
          eligible_branches TEXT,
          min_cgpa REAL,
          description TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_company_roles_company_id ON company_roles(company_id);
      `);

      // 3. Upgrade applications table (safely transition from Phase 0 placeholder)
      try {
        const columns = db.getAllSync<{ name: string }>('PRAGMA table_info(applications);');
        const hasCompanyId = columns.some((col) => col.name === 'company_id');
        if (!hasCompanyId && columns.length > 0) {
          db.execSync('ALTER TABLE applications RENAME TO applications_legacy;');
          db.execSync('DROP TABLE IF EXISTS applications_legacy;');
        }
      } catch {
        // Table does not exist yet or already upgraded
      }

      db.execSync(`
        CREATE TABLE IF NOT EXISTS applications (
          id TEXT PRIMARY KEY NOT NULL,
          company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          role_id TEXT REFERENCES company_roles(id) ON DELETE SET NULL,
          role_title TEXT NOT NULL,
          job_type TEXT NOT NULL DEFAULT 'Full-time',
          ctc REAL,
          fixed_salary REAL,
          variable_salary REAL,
          applied_date INTEGER NOT NULL,
          deadline_date INTEGER,
          source TEXT NOT NULL DEFAULT 'Campus',
          resume_version TEXT,
          status TEXT NOT NULL DEFAULT 'APPLIED',
          notes TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_applications_company_id ON applications(company_id);
        CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
        CREATE INDEX IF NOT EXISTS idx_applications_applied_date ON applications(applied_date);
      `);

      // 4. Application Status History table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS application_status_history (
          id TEXT PRIMARY KEY NOT NULL,
          application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
          from_status TEXT,
          to_status TEXT NOT NULL,
          changed_at INTEGER NOT NULL,
          notes TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_app_status_history_app_id ON application_status_history(application_id);
        CREATE INDEX IF NOT EXISTS idx_app_status_history_changed_at ON application_status_history(changed_at);
      `);

      // 5. Hiring Rounds table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS hiring_rounds (
          id TEXT PRIMARY KEY NOT NULL,
          application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
          round_name TEXT NOT NULL,
          round_type TEXT NOT NULL DEFAULT 'other',
          round_order INTEGER NOT NULL DEFAULT 1,
          scheduled_date INTEGER,
          completion_status TEXT NOT NULL DEFAULT 'SCHEDULED',
          result TEXT NOT NULL DEFAULT 'PENDING',
          score TEXT,
          feedback TEXT,
          questions_asked TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_hiring_rounds_app_id ON hiring_rounds(application_id);
        CREATE INDEX IF NOT EXISTS idx_hiring_rounds_scheduled_date ON hiring_rounds(scheduled_date);
      `);

      // 6. Interviews table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS interviews (
          id TEXT PRIMARY KEY NOT NULL,
          company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          application_id TEXT REFERENCES applications(id) ON DELETE SET NULL,
          round_id TEXT REFERENCES hiring_rounds(id) ON DELETE SET NULL,
          role_title TEXT NOT NULL,
          interview_round TEXT NOT NULL,
          interview_date INTEGER NOT NULL,
          topics_discussed TEXT,
          difficulty TEXT NOT NULL DEFAULT 'MEDIUM',
          feedback TEXT,
          rating INTEGER NOT NULL DEFAULT 3,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_interviews_company_id ON interviews(company_id);
        CREATE INDEX IF NOT EXISTS idx_interviews_app_id ON interviews(application_id);
        CREATE INDEX IF NOT EXISTS idx_interviews_date ON interviews(interview_date);
      `);

      // 7. Interview Questions table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS interview_questions (
          id TEXT PRIMARY KEY NOT NULL,
          interview_id TEXT NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
          question TEXT NOT NULL,
          category TEXT,
          notes TEXT,
          was_answered INTEGER NOT NULL DEFAULT 1,
          created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_interview_questions_interview_id ON interview_questions(interview_id);
      `);

      // 8. Offers table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS offers (
          id TEXT PRIMARY KEY NOT NULL,
          application_id TEXT REFERENCES applications(id) ON DELETE SET NULL,
          company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          role_title TEXT NOT NULL,
          ctc REAL NOT NULL,
          fixed_salary REAL,
          variable_salary REAL,
          joining_date INTEGER,
          offer_date INTEGER NOT NULL,
          acceptance_status TEXT NOT NULL DEFAULT 'PENDING',
          notes TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_offers_company_id ON offers(company_id);
        CREATE INDEX IF NOT EXISTS idx_offers_app_id ON offers(application_id);
        CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(acceptance_status);
      `);
    },
  },
  {
    version: 3,
    name: '0003_dsa_module',
    up: (db) => {
      // 1. Upgrade legacy dsa_problems table if it has integer primary key
      let hasLegacy = false;
      try {
        const columns = db.getAllSync<{ name: string; type: string }>('PRAGMA table_info(dsa_problems);');
        const idCol = columns.find((c) => c.name === 'id');
        if (idCol && idCol.type.toUpperCase().includes('INT')) {
          db.execSync('ALTER TABLE dsa_problems RENAME TO dsa_problems_legacy;');
          hasLegacy = true;
        }
      } catch {
        // Table does not exist yet
      }

      // 2. Create dsa_topics table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_topics (
          id TEXT PRIMARY KEY NOT NULL,
          level INTEGER NOT NULL,
          level_name TEXT NOT NULL,
          title TEXT NOT NULL,
          order_index INTEGER NOT NULL,
          description TEXT,
          priority TEXT NOT NULL DEFAULT 'medium',
          status TEXT NOT NULL DEFAULT 'not_started',
          mastery TEXT NOT NULL DEFAULT 'average',
          notes TEXT,
          is_custom INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_topics_level ON dsa_topics(level);
        CREATE INDEX IF NOT EXISTS idx_dsa_topics_status ON dsa_topics(status);
        CREATE INDEX IF NOT EXISTS idx_dsa_topics_order ON dsa_topics(order_index);
      `);

      // 3. Create dsa_subtopics table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_subtopics (
          id TEXT PRIMARY KEY NOT NULL,
          topic_id TEXT NOT NULL REFERENCES dsa_topics(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 0,
          is_completed INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_subtopics_topic_id ON dsa_subtopics(topic_id);
      `);

      // 4. Create new dsa_problems table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_problems (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          problem_statement TEXT,
          problem_id_ext TEXT,
          platform TEXT NOT NULL DEFAULT 'LeetCode',
          external_url TEXT,
          topic_id TEXT REFERENCES dsa_topics(id) ON DELETE SET NULL,
          topic_name TEXT NOT NULL,
          subtopic_id TEXT REFERENCES dsa_subtopics(id) ON DELETE SET NULL,
          subtopic_name TEXT,
          difficulty TEXT NOT NULL DEFAULT 'Medium',
          status TEXT NOT NULL DEFAULT 'unsolved',
          first_attempted_at INTEGER,
          solved_at INTEGER,
          attempts_count INTEGER NOT NULL DEFAULT 0,
          confidence_rating INTEGER DEFAULT 3,
          personal_difficulty TEXT DEFAULT 'Medium',
          approach TEXT,
          algorithm_explanation TEXT,
          time_complexity TEXT,
          space_complexity TEXT,
          notes TEXT,
          important_edge_cases TEXT,
          is_favorite INTEGER NOT NULL DEFAULT 0,
          revision_status TEXT NOT NULL DEFAULT 'none',
          next_revision_at INTEGER,
          revision_interval_step INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_problems_topic_id ON dsa_problems(topic_id);
        CREATE INDEX IF NOT EXISTS idx_dsa_problems_difficulty ON dsa_problems(difficulty);
        CREATE INDEX IF NOT EXISTS idx_dsa_problems_status ON dsa_problems(status);
        CREATE INDEX IF NOT EXISTS idx_dsa_problems_platform ON dsa_problems(platform);
        CREATE INDEX IF NOT EXISTS idx_dsa_problems_favorite ON dsa_problems(is_favorite);
        CREATE INDEX IF NOT EXISTS idx_dsa_problems_rev_status ON dsa_problems(revision_status);
        CREATE INDEX IF NOT EXISTS idx_dsa_problems_next_rev ON dsa_problems(next_revision_at);
        CREATE INDEX IF NOT EXISTS idx_dsa_problems_created ON dsa_problems(created_at);
      `);

      // Migrate any legacy rows if existed
      if (hasLegacy) {
        try {
          const legacyRows = db.getAllSync<any>('SELECT * FROM dsa_problems_legacy;');
          if (legacyRows && legacyRows.length > 0) {
            for (const row of legacyRows) {
              const newId = generateUUID();
              db.runSync(
                `INSERT INTO dsa_problems (
                  id, title, platform, difficulty, status, topic_name, external_url, notes, solved_at, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                  newId,
                  row.title || 'Untitled Problem',
                  row.platform || 'LeetCode',
                  row.difficulty || 'Medium',
                  row.status || 'unsolved',
                  row.topic || 'General',
                  row.url || null,
                  row.notes || null,
                  row.solved_at || null,
                  row.created_at || Date.now(),
                  Date.now(),
                ]
              );
            }
          }
          db.execSync('DROP TABLE IF EXISTS dsa_problems_legacy;');
        } catch (e) {
          console.warn('[Migration 3] Notice when migrating legacy dsa problems:', e);
        }
      }

      // 5. Create dsa_problem_tags table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_problem_tags (
          id TEXT PRIMARY KEY NOT NULL,
          problem_id TEXT NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE,
          tag TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_tags_problem_id ON dsa_problem_tags(problem_id);
        CREATE INDEX IF NOT EXISTS idx_dsa_tags_tag ON dsa_problem_tags(tag);
      `);

      // 6. Create dsa_problem_companies table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_problem_companies (
          id TEXT PRIMARY KEY NOT NULL,
          problem_id TEXT NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE,
          company_name TEXT NOT NULL,
          is_verified INTEGER NOT NULL DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_companies_problem_id ON dsa_problem_companies(problem_id);
        CREATE INDEX IF NOT EXISTS idx_dsa_companies_name ON dsa_problem_companies(company_name);
      `);

      // 7. Create dsa_attempts table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_attempts (
          id TEXT PRIMARY KEY NOT NULL,
          problem_id TEXT NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE,
          attempt_number INTEGER NOT NULL,
          status TEXT NOT NULL,
          time_spent_minutes INTEGER DEFAULT 0,
          approach_notes TEXT,
          code_snippet TEXT,
          language TEXT,
          attempted_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_attempts_problem_id ON dsa_attempts(problem_id);
        CREATE INDEX IF NOT EXISTS idx_dsa_attempts_date ON dsa_attempts(attempted_at);
      `);

      // 8. Create dsa_solutions table (Notebook)
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_solutions (
          id TEXT PRIMARY KEY NOT NULL,
          problem_id TEXT NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          language TEXT NOT NULL,
          code TEXT NOT NULL,
          approach TEXT,
          explanation TEXT,
          time_complexity TEXT,
          space_complexity TEXT,
          edge_cases TEXT,
          mistakes TEXT,
          is_optimal INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_solutions_problem_id ON dsa_solutions(problem_id);
      `);

      // 9. Create dsa_revisions table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_revisions (
          id TEXT PRIMARY KEY NOT NULL,
          problem_id TEXT NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE,
          revision_number INTEGER NOT NULL,
          scheduled_date INTEGER NOT NULL,
          completed_date INTEGER,
          recall_rating TEXT,
          notes TEXT,
          time_taken_minutes INTEGER DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'upcoming',
          created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_revisions_problem_id ON dsa_revisions(problem_id);
        CREATE INDEX IF NOT EXISTS idx_dsa_revisions_status ON dsa_revisions(status);
        CREATE INDEX IF NOT EXISTS idx_dsa_revisions_sched ON dsa_revisions(scheduled_date);
      `);

      // 10. Create dsa_study_sessions table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_study_sessions (
          id TEXT PRIMARY KEY NOT NULL,
          start_time INTEGER NOT NULL,
          end_time INTEGER,
          duration_minutes INTEGER NOT NULL DEFAULT 0,
          topic_id TEXT REFERENCES dsa_topics(id) ON DELETE SET NULL,
          problems_solved INTEGER NOT NULL DEFAULT 0,
          notes TEXT,
          date_string TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_sessions_date ON dsa_study_sessions(date_string);
      `);

      // 11. Create dsa_daily_goals table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_daily_goals (
          id TEXT PRIMARY KEY NOT NULL,
          target_date TEXT NOT NULL UNIQUE,
          problem_target INTEGER NOT NULL DEFAULT 3,
          duration_target_minutes INTEGER NOT NULL DEFAULT 60,
          weekly_problem_target INTEGER NOT NULL DEFAULT 20,
          preferred_difficulty TEXT DEFAULT 'All',
          preferred_topics TEXT,
          solved_count INTEGER NOT NULL DEFAULT 0,
          study_duration_minutes INTEGER NOT NULL DEFAULT 0,
          is_completed INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_goals_date ON dsa_daily_goals(target_date);
      `);

      // 12. Create dsa_daily_activity table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_daily_activity (
          id TEXT PRIMARY KEY NOT NULL,
          date_string TEXT NOT NULL UNIQUE,
          problems_solved INTEGER NOT NULL DEFAULT 0,
          problems_attempted INTEGER NOT NULL DEFAULT 0,
          revisions_completed INTEGER NOT NULL DEFAULT 0,
          study_minutes INTEGER NOT NULL DEFAULT 0,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_daily_activity_date ON dsa_daily_activity(date_string);
      `);

      // 13. Create dsa_favorites table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS dsa_favorites (
          id TEXT PRIMARY KEY NOT NULL,
          problem_id TEXT NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE UNIQUE,
          created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_dsa_fav_problem_id ON dsa_favorites(problem_id);
      `);

      // 14. Pre-seed Curated 26 Roadmap Topics and Subtopics
      const now = Date.now();
      const topicCountRow = db.getFirstSync<{ count: number }>('SELECT COUNT(*) as count FROM dsa_topics;');
      if (!topicCountRow || topicCountRow.count === 0) {
        for (const topic of DEFAULT_DSA_ROADMAP) {
          db.runSync(
            `INSERT OR IGNORE INTO dsa_topics (
              id, level, level_name, title, order_index, description, priority, status, mastery, is_custom, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'not_started', 'average', 0, ?, ?);`,
            [
              topic.id,
              topic.level,
              topic.levelName,
              topic.title,
              topic.orderIndex,
              topic.description,
              topic.priority,
              now,
              now,
            ]
          );

          let subOrder = 1;
          for (const subTitle of topic.subtopics) {
            const subId = `${topic.id}-sub-${subOrder}`;
            db.runSync(
              `INSERT OR IGNORE INTO dsa_subtopics (
                id, topic_id, title, order_index, is_completed, created_at, updated_at
              ) VALUES (?, ?, ?, ?, 0, ?, ?);`,
              [subId, topic.id, subTitle, subOrder, now, now]
            );
            subOrder++;
          }
        }
      }
    },
  },
];

export function runMigrations(): { success: boolean; appliedCount: number; error?: string } {
  try {
    const rawDb = getRawDb();

    // Ensure schema_migrations table exists
    rawDb.execSync(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        version INTEGER NOT NULL UNIQUE,
        name TEXT NOT NULL,
        applied_at INTEGER NOT NULL
      );
    `);

    // Check applied migrations
    const appliedRows = rawDb.getAllSync<{ version: number }>(
      'SELECT version FROM schema_migrations ORDER BY version ASC;'
    );
    const appliedVersions = new Set(appliedRows.map((r) => r.version));

    let appliedCount = 0;

    for (const migration of migrations) {
      if (!appliedVersions.has(migration.version)) {
        rawDb.execSync('BEGIN TRANSACTION;');
        try {
          migration.up(rawDb);
          rawDb.runSync(
            'INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?);',
            [migration.version, migration.name, Date.now()]
          );
          rawDb.execSync(`PRAGMA user_version = ${migration.version};`);
          rawDb.execSync('COMMIT;');
          appliedCount++;
        } catch (err) {
          rawDb.execSync('ROLLBACK;');
          throw err;
        }
      }
    }

    return { success: true, appliedCount };
  } catch (error: any) {
    console.error('[ALLVANCE Database] Migration error:', error);
    return {
      success: false,
      appliedCount: 0,
      error: error?.message || 'Unknown migration error',
    };
  }
}
