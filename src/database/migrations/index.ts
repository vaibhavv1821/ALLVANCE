import { getRawDb } from '../client';
import { DEFAULT_SETTINGS } from '../seed/defaultSettings';

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
