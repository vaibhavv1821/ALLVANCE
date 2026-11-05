import { getRawDb } from '../client';
import { DEFAULT_SETTINGS } from '../seed/defaultSettings';
import { DEFAULT_DSA_ROADMAP } from '../seed/defaultDsaRoadmap';
import { DEFAULT_SEED_RESUME, DEFAULT_RESUME_SECTIONS } from '../seed/defaultResume';
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
  {
    version: 4,
    name: '0004_resume_module',
    up: (db) => {
      // 1. Resumes table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resumes (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          target_role TEXT,
          template_id TEXT NOT NULL DEFAULT 'modern',
          is_default INTEGER NOT NULL DEFAULT 0,
          version_name TEXT NOT NULL DEFAULT 'v1.0',
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resumes_is_default ON resumes(is_default);
        CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at);
      `);

      // 2. Resume Profiles table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_profiles (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          full_name TEXT NOT NULL,
          professional_title TEXT,
          email TEXT,
          phone TEXT,
          location TEXT,
          linkedin_url TEXT,
          github_url TEXT,
          portfolio_url TEXT,
          summary TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_profiles_resume_id ON resume_profiles(resume_id);
      `);

      // 3. Resume Sections table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_sections (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          section_key TEXT NOT NULL,
          title TEXT NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 0,
          is_visible INTEGER NOT NULL DEFAULT 1
        );
        CREATE INDEX IF NOT EXISTS idx_resume_sections_resume_id ON resume_sections(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_sections_order ON resume_sections(order_index);
      `);

      // 4. Resume Education table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_education (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          institution TEXT NOT NULL,
          degree TEXT NOT NULL,
          field_of_study TEXT,
          location TEXT,
          start_date TEXT,
          end_date TEXT,
          grade TEXT,
          description TEXT,
          order_index INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_edu_resume_id ON resume_education(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_edu_order ON resume_education(order_index);
      `);

      // 5. Resume Experience table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_experience (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          is_internship INTEGER NOT NULL DEFAULT 0,
          company TEXT NOT NULL,
          position TEXT NOT NULL,
          location TEXT,
          start_date TEXT,
          end_date TEXT,
          is_current INTEGER NOT NULL DEFAULT 0,
          description TEXT,
          order_index INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_exp_resume_id ON resume_experience(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_exp_is_internship ON resume_experience(is_internship);
        CREATE INDEX IF NOT EXISTS idx_resume_exp_order ON resume_experience(order_index);
      `);

      // 6. Resume Projects table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_projects (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          subtitle TEXT,
          tech_stack TEXT,
          live_url TEXT,
          github_url TEXT,
          start_date TEXT,
          end_date TEXT,
          description TEXT,
          order_index INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_proj_resume_id ON resume_projects(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_proj_order ON resume_projects(order_index);
      `);

      // 7. Resume Skills table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_skills (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          category TEXT NOT NULL,
          skills TEXT NOT NULL,
          proficiency TEXT,
          is_soft_skill INTEGER NOT NULL DEFAULT 0,
          order_index INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_skills_resume_id ON resume_skills(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_skills_order ON resume_skills(order_index);
      `);

      // 8. Resume Certifications table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_certifications (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          issuer TEXT NOT NULL,
          issue_date TEXT,
          expiry_date TEXT,
          credential_id TEXT,
          credential_url TEXT,
          order_index INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_cert_resume_id ON resume_certifications(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_cert_order ON resume_certifications(order_index);
      `);

      // 9. Resume Achievements table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_achievements (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          date TEXT,
          description TEXT,
          type TEXT NOT NULL DEFAULT 'achievement',
          order_index INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_achieve_resume_id ON resume_achievements(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_achieve_type ON resume_achievements(type);
        CREATE INDEX IF NOT EXISTS idx_resume_achieve_order ON resume_achievements(order_index);
      `);

      // 10. Resume Versions (Snapshots) table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_versions (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          version_label TEXT NOT NULL,
          snapshot_data TEXT NOT NULL,
          created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_versions_created_at ON resume_versions(created_at);
      `);

      // 11. Resume Job Matches table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_job_matches (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
          company_name TEXT,
          job_title TEXT,
          job_description TEXT NOT NULL,
          match_score INTEGER NOT NULL,
          matched_keywords TEXT,
          missing_keywords TEXT,
          recommendations TEXT,
          created_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_matches_resume_id ON resume_job_matches(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_matches_created_at ON resume_job_matches(created_at);
      `);

      // 12. Resume Imported Files table
      db.execSync(`
        CREATE TABLE IF NOT EXISTS resume_imported_files (
          id TEXT PRIMARY KEY NOT NULL,
          resume_id TEXT REFERENCES resumes(id) ON DELETE SET NULL,
          file_name TEXT NOT NULL,
          file_uri TEXT NOT NULL,
          file_size INTEGER,
          imported_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_resume_files_resume_id ON resume_imported_files(resume_id);
        CREATE INDEX IF NOT EXISTS idx_resume_files_imported_at ON resume_imported_files(imported_at);
      `);

      // Seed Default Resume if none exists
      const resumeCountRow = db.getFirstSync<{ cnt: number }>('SELECT COUNT(*) as cnt FROM resumes;');
      if (!resumeCountRow || resumeCountRow.cnt === 0) {
        const now = Date.now();
        const resumeId = generateUUID();
        const profileId = generateUUID();

        // Insert default resume
        db.runSync(
          `INSERT INTO resumes (id, title, target_role, template_id, is_default, version_name, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            resumeId,
            DEFAULT_SEED_RESUME.resume.title,
            DEFAULT_SEED_RESUME.resume.targetRole,
            DEFAULT_SEED_RESUME.resume.templateId,
            DEFAULT_SEED_RESUME.resume.isDefault,
            DEFAULT_SEED_RESUME.resume.versionName,
            now,
            now,
          ]
        );

        // Insert profile
        db.runSync(
          `INSERT INTO resume_profiles (id, resume_id, full_name, professional_title, email, phone, location, linkedin_url, github_url, portfolio_url, summary, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            profileId,
            resumeId,
            DEFAULT_SEED_RESUME.profile.fullName,
            DEFAULT_SEED_RESUME.profile.professionalTitle,
            DEFAULT_SEED_RESUME.profile.email,
            DEFAULT_SEED_RESUME.profile.phone,
            DEFAULT_SEED_RESUME.profile.location,
            DEFAULT_SEED_RESUME.profile.linkedinUrl,
            DEFAULT_SEED_RESUME.profile.githubUrl,
            DEFAULT_SEED_RESUME.profile.portfolioUrl,
            DEFAULT_SEED_RESUME.profile.summary,
            now,
            now,
          ]
        );

        // Insert sections
        for (const sec of DEFAULT_RESUME_SECTIONS) {
          db.runSync(
            `INSERT INTO resume_sections (id, resume_id, section_key, title, order_index, is_visible)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [generateUUID(), resumeId, sec.sectionKey, sec.title, sec.orderIndex, sec.isVisible]
          );
        }

        // Insert education
        for (const edu of DEFAULT_SEED_RESUME.education) {
          db.runSync(
            `INSERT INTO resume_education (id, resume_id, institution, degree, field_of_study, location, start_date, end_date, grade, description, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              edu.institution,
              edu.degree,
              edu.fieldOfStudy,
              edu.location,
              edu.startDate,
              edu.endDate,
              edu.grade,
              edu.description,
              edu.orderIndex,
              now,
              now,
            ]
          );
        }

        // Insert experience & internships
        for (const exp of DEFAULT_SEED_RESUME.experience) {
          db.runSync(
            `INSERT INTO resume_experience (id, resume_id, is_internship, company, position, location, start_date, end_date, is_current, description, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              exp.isInternship,
              exp.company,
              exp.position,
              exp.location,
              exp.startDate,
              exp.endDate,
              exp.isCurrent,
              exp.description,
              exp.orderIndex,
              now,
              now,
            ]
          );
        }

        // Insert projects
        for (const proj of DEFAULT_SEED_RESUME.projects) {
          db.runSync(
            `INSERT INTO resume_projects (id, resume_id, title, subtitle, tech_stack, live_url, github_url, start_date, end_date, description, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              proj.title,
              proj.subtitle,
              proj.techStack,
              proj.liveUrl,
              proj.githubUrl,
              proj.startDate,
              proj.endDate,
              proj.description,
              proj.orderIndex,
              now,
              now,
            ]
          );
        }

        // Insert skills
        for (const sk of DEFAULT_SEED_RESUME.skills) {
          db.runSync(
            `INSERT INTO resume_skills (id, resume_id, category, skills, proficiency, is_soft_skill, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              sk.category,
              sk.skills,
              sk.proficiency,
              sk.isSoftSkill,
              sk.orderIndex,
              now,
              now,
            ]
          );
        }

        // Insert certifications
        for (const cert of DEFAULT_SEED_RESUME.certifications) {
          db.runSync(
            `INSERT INTO resume_certifications (id, resume_id, name, issuer, issue_date, expiry_date, credential_id, credential_url, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              cert.name,
              cert.issuer,
              cert.issueDate,
              cert.expiryDate,
              cert.credentialId,
              cert.credentialUrl,
              cert.orderIndex,
              now,
              now,
            ]
          );
        }

        // Insert achievements
        for (const ach of DEFAULT_SEED_RESUME.achievements) {
          db.runSync(
            `INSERT INTO resume_achievements (id, resume_id, title, date, description, type, order_index, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              generateUUID(),
              resumeId,
              ach.title,
              ach.date,
              ach.description,
              ach.type,
              ach.orderIndex,
              now,
              now,
            ]
          );
        }

        // Create initial snapshot
        const snapshot = {
          resume: {
            title: DEFAULT_SEED_RESUME.resume.title,
            targetRole: DEFAULT_SEED_RESUME.resume.targetRole,
            templateId: DEFAULT_SEED_RESUME.resume.templateId,
            versionName: 'v1.0',
          },
          profile: DEFAULT_SEED_RESUME.profile,
          sections: DEFAULT_RESUME_SECTIONS,
          education: DEFAULT_SEED_RESUME.education,
          experience: DEFAULT_SEED_RESUME.experience,
          projects: DEFAULT_SEED_RESUME.projects,
          skills: DEFAULT_SEED_RESUME.skills,
          certifications: DEFAULT_SEED_RESUME.certifications,
          achievements: DEFAULT_SEED_RESUME.achievements,
        };

        db.runSync(
          `INSERT INTO resume_versions (id, resume_id, version_label, snapshot_data, created_at)
           VALUES (?, ?, ?, ?, ?);`,
          [generateUUID(), resumeId, 'v1.0 - Initial SDE Master Resume', JSON.stringify(snapshot), now]
        );
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
