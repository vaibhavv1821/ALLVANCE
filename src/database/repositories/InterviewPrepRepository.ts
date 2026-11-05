import { BaseRepository } from './BaseRepository';
import { generateUUID } from '@/utils/uuid';
import {
  InterviewPrepCategory,
  InterviewPrepQuestion,
  InterviewPrepNote,
  InterviewUserProject,
} from '../schema/interviews';
import { SEED_COMPANIES, CompanyPrepProfile } from '../seed/interviews/companyData';
import { FLAGSHIP_PROJECTS } from '../seed/interviews/flagshipProjects';

export interface CategoryWithStats extends InterviewPrepCategory {
  completedCount: number;
  percentage: number;
  difficultCount: number;
  bookmarkedCount: number;
}

export interface QuestionFilterOptions {
  categoryId?: string;
  difficulty?: string;
  search?: string;
  status?: 'all' | 'completed' | 'uncompleted' | 'bookmarked' | 'difficult';
  company?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface QuestionWithMetadata extends InterviewPrepQuestion {
  categoryName?: string;
  groupName?: string;
  noteText?: string | null;
}

export interface InterviewDashboardMetrics {
  totalQuestions: number;
  completedQuestions: number;
  remainingQuestions: number;
  overallPercentage: number;
  currentStreak: number;
  todayTarget: number;
  todayCompleted: number;
  weeklyActivity: { dayLabel: string; dateStr: string; count: number }[];
  recentlyStudiedTopics: { id: string; name: string; icon: string; count: number }[];
  recommendedTopics: { id: string; name: string; icon: string; remaining: number }[];
}

export class InterviewPrepRepository extends BaseRepository {
  /**
   * Get all categories with dynamic completion statistics
   */
  async getCategories(): Promise<CategoryWithStats[]> {
    try {
      const sql = `
        SELECT 
          c.*,
          COALESCE(SUM(CASE WHEN q.is_completed = 1 THEN 1 ELSE 0 END), 0) as completed_count,
          COALESCE(SUM(CASE WHEN q.is_difficult = 1 THEN 1 ELSE 0 END), 0) as difficult_count,
          COALESCE(SUM(CASE WHEN q.is_bookmarked = 1 THEN 1 ELSE 0 END), 0) as bookmarked_count,
          COUNT(q.id) as real_total_count
        FROM interview_categories c
        LEFT JOIN interview_prep_questions q ON c.id = q.category_id
        GROUP BY c.id
        ORDER BY c.order_index ASC;
      `;
      const rows = this.rawDb.getAllSync<any>(sql);
      return rows.map((r) => {
        const total = r.real_total_count > 0 ? r.real_total_count : r.total_questions;
        const completed = r.completed_count || 0;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          id: r.id,
          groupId: r.group_id,
          groupName: r.group_name,
          name: r.name,
          description: r.description,
          icon: r.icon,
          orderIndex: r.order_index,
          totalQuestions: total,
          completedCount: completed,
          percentage,
          difficultCount: r.difficult_count || 0,
          bookmarkedCount: r.bookmarked_count || 0,
        };
      });
    } catch (e) {
      console.error('[InterviewPrepRepository] getCategories error:', e);
      return [];
    }
  }

  /**
   * Get filtered questions
   */
  async getQuestions(options?: QuestionFilterOptions): Promise<QuestionWithMetadata[]> {
    try {
      let query = `
        SELECT 
          q.*,
          c.name as category_name,
          c.group_name,
          n.note_text
        FROM interview_prep_questions q
        JOIN interview_categories c ON q.category_id = c.id
        LEFT JOIN interview_notes n ON q.id = n.question_id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (options?.categoryId && options.categoryId !== 'ALL') {
        query += ` AND q.category_id = ?`;
        params.push(options.categoryId);
      }

      if (options?.difficulty && options.difficulty !== 'ALL') {
        query += ` AND q.difficulty = ?`;
        params.push(options.difficulty.toUpperCase());
      }

      if (options?.search && options.search.trim()) {
        const searchPattern = `%${options.search.trim().toLowerCase()}%`;
        query += ` AND (LOWER(q.title) LIKE ? OR LOWER(q.answer) LIKE ? OR LOWER(q.tags) LIKE ?)`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      if (options?.company && options.company !== 'ALL') {
        query += ` AND LOWER(q.companies) LIKE ?`;
        params.push(`%${options.company.toLowerCase()}%`);
      }

      if (options?.tag && options.tag !== 'ALL') {
        query += ` AND LOWER(q.tags) LIKE ?`;
        params.push(`%${options.tag.toLowerCase()}%`);
      }

      if (options?.status) {
        if (options.status === 'completed') {
          query += ` AND q.is_completed = 1`;
        } else if (options.status === 'uncompleted') {
          query += ` AND q.is_completed = 0`;
        } else if (options.status === 'bookmarked') {
          query += ` AND q.is_bookmarked = 1`;
        } else if (options.status === 'difficult') {
          query += ` AND q.is_difficult = 1`;
        }
      }

      query += ` ORDER BY q.is_completed ASC, q.created_at ASC`;

      if (options?.limit) {
        query += ` LIMIT ${options.limit}`;
        if (options?.offset) {
          query += ` OFFSET ${options.offset}`;
        }
      }

      const rows = this.rawDb.getAllSync<any>(query, params);
      return rows.map((r) => this.mapQuestionRow(r));
    } catch (e) {
      console.error('[InterviewPrepRepository] getQuestions error:', e);
      return [];
    }
  }

  /**
   * Get single question by ID with notes
   */
  async getQuestionById(id: string): Promise<QuestionWithMetadata | null> {
    try {
      const sql = `
        SELECT 
          q.*,
          c.name as category_name,
          c.group_name,
          n.note_text
        FROM interview_prep_questions q
        JOIN interview_categories c ON q.category_id = c.id
        LEFT JOIN interview_notes n ON q.id = n.question_id
        WHERE q.id = ?;
      `;
      const row = this.rawDb.getFirstSync<any>(sql, [id]);
      if (!row) return null;
      return this.mapQuestionRow(row);
    } catch (e) {
      console.error('[InterviewPrepRepository] getQuestionById error:', e);
      return null;
    }
  }

  /**
   * Toggle Bookmark status for a question
   */
  async toggleBookmark(questionId: string): Promise<boolean> {
    try {
      const q = await this.getQuestionById(questionId);
      if (!q) return false;
      const nextState = q.isBookmarked === 1 ? 0 : 1;

      this.rawDb.runSync(
        `UPDATE interview_prep_questions SET is_bookmarked = ?, updated_at = ? WHERE id = ?;`,
        [nextState, Date.now(), questionId]
      );

      if (nextState === 1) {
        this.rawDb.runSync(
          `INSERT OR IGNORE INTO interview_bookmarks (id, question_id, created_at) VALUES (?, ?, ?);`,
          [generateUUID(), questionId, Date.now()]
        );
      } else {
        this.rawDb.runSync(`DELETE FROM interview_bookmarks WHERE question_id = ?;`, [questionId]);
      }

      return nextState === 1;
    } catch (e) {
      console.error('[InterviewPrepRepository] toggleBookmark error:', e);
      return false;
    }
  }

  /**
   * Toggle Completed status for a question
   */
  async toggleCompleted(questionId: string): Promise<boolean> {
    try {
      const q = await this.getQuestionById(questionId);
      if (!q) return false;
      const nextState = q.isCompleted === 1 ? 0 : 1;
      const now = Date.now();

      this.rawDb.runSync(
        `UPDATE interview_prep_questions SET is_completed = ?, completed_at = ?, updated_at = ? WHERE id = ?;`,
        [nextState, nextState === 1 ? now : null, now, questionId]
      );

      // If marked completed, increment daily progress
      if (nextState === 1) {
        await this.incrementDailyGoal();
      }

      return nextState === 1;
    } catch (e) {
      console.error('[InterviewPrepRepository] toggleCompleted error:', e);
      return false;
    }
  }

  /**
   * Toggle Difficult status for a question
   */
  async toggleDifficult(questionId: string): Promise<boolean> {
    try {
      const q = await this.getQuestionById(questionId);
      if (!q) return false;
      const nextState = q.isDifficult === 1 ? 0 : 1;
      const now = Date.now();

      this.rawDb.runSync(
        `UPDATE interview_prep_questions SET is_difficult = ?, updated_at = ? WHERE id = ?;`,
        [nextState, now, questionId]
      );

      // If marked difficult, add to revision queue (due in 1 day)
      if (nextState === 1) {
        const dueDate = now + 86400000; // +24 hours
        this.rawDb.runSync(
          `INSERT OR REPLACE INTO interview_revisions (id, question_id, due_date, interval_days, ease_factor, repetition_count, status, created_at)
           VALUES (?, ?, ?, 1, 2.5, 0, 'PENDING', ?);`,
          [generateUUID(), questionId, dueDate, now]
        );
      }

      return nextState === 1;
    } catch (e) {
      console.error('[InterviewPrepRepository] toggleDifficult error:', e);
      return false;
    }
  }

  /**
   * Save Personal Note for a question
   */
  async saveQuestionNote(questionId: string, noteText: string): Promise<void> {
    try {
      const now = Date.now();
      const existing = this.rawDb.getFirstSync<any>(
        'SELECT id FROM interview_notes WHERE question_id = ?;',
        [questionId]
      );

      if (existing) {
        this.rawDb.runSync(
          'UPDATE interview_notes SET note_text = ?, updated_at = ? WHERE question_id = ?;',
          [noteText, now, questionId]
        );
      } else {
        this.rawDb.runSync(
          'INSERT INTO interview_notes (id, question_id, note_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?);',
          [generateUUID(), questionId, noteText, now, now]
        );
      }
    } catch (e) {
      console.error('[InterviewPrepRepository] saveQuestionNote error:', e);
    }
  }

  /**
   * Delete Note for a question
   */
  async deleteQuestionNote(questionId: string): Promise<void> {
    try {
      this.rawDb.runSync('DELETE FROM interview_notes WHERE question_id = ?;', [questionId]);
    } catch (e) {
      console.error('[InterviewPrepRepository] deleteQuestionNote error:', e);
    }
  }

  /**
   * Get Comprehensive Dashboard Metrics
   */
  async getDashboardMetrics(): Promise<InterviewDashboardMetrics> {
    try {
      const totalRow = this.rawDb.getFirstSync<{ total: number; completed: number }>(`
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END), 0) as completed
        FROM interview_prep_questions;
      `);

      const total = totalRow?.total || 0;
      const completed = totalRow?.completed || 0;
      const remaining = Math.max(0, total - completed);
      const overallPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Today's Goal
      const todayStr = this.getTodayDateString();
      const goalRow = this.rawDb.getFirstSync<{ target_count: number; completed_count: number }>(
        'SELECT target_count, completed_count FROM interview_daily_goals WHERE date_str = ?;',
        [todayStr]
      );
      const todayTarget = goalRow?.target_count ?? 5;
      const todayCompleted = goalRow?.completed_count ?? 0;

      // Current Streak Calculation
      const streak = this.calculateStreak();

      // Weekly Activity (Last 7 Days)
      const weeklyActivity = this.getWeeklyActivityChart();

      // Recently Studied Topics
      const recentRows = this.rawDb.getAllSync<any>(`
        SELECT 
          c.id, c.name, c.icon,
          COUNT(q.id) as count
        FROM interview_categories c
        JOIN interview_prep_questions q ON c.id = q.category_id
        WHERE q.is_completed = 1
        GROUP BY c.id
        ORDER BY MAX(COALESCE(q.completed_at, q.updated_at)) DESC
        LIMIT 4;
      `);
      const recentlyStudiedTopics = recentRows.map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon || 'Folder',
        count: r.count,
      }));

      // Recommended Topics (Categories with lowest completion percentage)
      const recRows = this.rawDb.getAllSync<any>(`
        SELECT 
          c.id, c.name, c.icon,
          COUNT(q.id) as total,
          COALESCE(SUM(CASE WHEN q.is_completed = 1 THEN 1 ELSE 0 END), 0) as comp
        FROM interview_categories c
        LEFT JOIN interview_prep_questions q ON c.id = q.category_id
        GROUP BY c.id
        HAVING (COUNT(q.id) - COALESCE(SUM(CASE WHEN q.is_completed = 1 THEN 1 ELSE 0 END), 0)) > 0
        ORDER BY (COUNT(q.id) - COALESCE(SUM(CASE WHEN q.is_completed = 1 THEN 1 ELSE 0 END), 0)) DESC
        LIMIT 4;
      `);
      const recommendedTopics = recRows.map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon || 'Sparkles',
        remaining: r.total - r.comp,
      }));

      return {
        totalQuestions: total,
        completedQuestions: completed,
        remainingQuestions: remaining,
        overallPercentage,
        currentStreak: streak,
        todayTarget,
        todayCompleted,
        weeklyActivity,
        recentlyStudiedTopics,
        recommendedTopics,
      };
    } catch (e) {
      console.error('[InterviewPrepRepository] getDashboardMetrics error:', e);
      return {
        totalQuestions: 0,
        completedQuestions: 0,
        remainingQuestions: 0,
        overallPercentage: 0,
        currentStreak: 0,
        todayTarget: 5,
        todayCompleted: 0,
        weeklyActivity: [],
        recentlyStudiedTopics: [],
        recommendedTopics: [],
      };
    }
  }

  /**
   * Daily Goal Tracking
   */
  async getDailyGoal(): Promise<{ dateStr: string; target: number; completed: number; isAchieved: boolean }> {
    const todayStr = this.getTodayDateString();
    const row = this.rawDb.getFirstSync<any>(
      'SELECT * FROM interview_daily_goals WHERE date_str = ?;',
      [todayStr]
    );

    if (row) {
      return {
        dateStr: row.date_str,
        target: row.target_count,
        completed: row.completed_count,
        isAchieved: row.is_achieved === 1,
      };
    }

    // Auto-initialize for today
    const now = Date.now();
    this.rawDb.runSync(
      'INSERT INTO interview_daily_goals (id, date_str, target_count, completed_count, is_achieved, created_at, updated_at) VALUES (?, ?, 5, 0, 0, ?, ?);',
      [generateUUID(), todayStr, now, now]
    );

    return {
      dateStr: todayStr,
      target: 5,
      completed: 0,
      isAchieved: false,
    };
  }

  async updateDailyTarget(newTarget: number): Promise<void> {
    const todayStr = this.getTodayDateString();
    const now = Date.now();
    const target = Math.max(1, newTarget);
    this.rawDb.runSync(
      `INSERT INTO interview_daily_goals (id, date_str, target_count, completed_count, is_achieved, created_at, updated_at)
       VALUES (?, ?, ?, 0, 0, ?, ?)
       ON CONFLICT(date_str) DO UPDATE SET target_count = ?, updated_at = ?;`,
      [generateUUID(), todayStr, target, now, now, target, now]
    );
  }

  private async incrementDailyGoal(): Promise<void> {
    const todayStr = this.getTodayDateString();
    const now = Date.now();
    const current = await this.getDailyGoal();
    const nextCompleted = current.completed + 1;
    const isAchieved = nextCompleted >= current.target ? 1 : 0;

    this.rawDb.runSync(
      `UPDATE interview_daily_goals 
       SET completed_count = ?, is_achieved = ?, updated_at = ? 
       WHERE date_str = ?;`,
      [nextCompleted, isAchieved, now, todayStr]
    );
  }

  /**
   * Log Study Session
   */
  async logStudySession(categoryId: string | null, durationMinutes: number, questionsReviewed: number): Promise<void> {
    try {
      const todayStr = this.getTodayDateString();
      this.rawDb.runSync(
        `INSERT INTO interview_study_sessions (id, date_str, category_id, duration_minutes, questions_reviewed, created_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [generateUUID(), todayStr, categoryId, durationMinutes, questionsReviewed, Date.now()]
      );
    } catch (e) {
      console.error('[InterviewPrepRepository] logStudySession error:', e);
    }
  }

  /**
   * Revision Queue management
   */
  async getRevisionQueue(filter: 'all' | 'due' | 'difficult' | 'bookmarked' = 'all'): Promise<QuestionWithMetadata[]> {
    try {
      let query = `
        SELECT 
          q.*,
          c.name as category_name,
          c.group_name,
          n.note_text
        FROM interview_prep_questions q
        JOIN interview_categories c ON q.category_id = c.id
        LEFT JOIN interview_notes n ON q.id = n.question_id
        LEFT JOIN interview_revisions r ON q.id = r.question_id
        WHERE 1=1
      `;

      if (filter === 'due') {
        const now = Date.now();
        query += ` AND (r.due_date <= ${now} OR q.is_difficult = 1)`;
      } else if (filter === 'difficult') {
        query += ` AND q.is_difficult = 1`;
      } else if (filter === 'bookmarked') {
        query += ` AND q.is_bookmarked = 1`;
      } else {
        query += ` AND (q.is_difficult = 1 OR q.is_bookmarked = 1 OR r.id IS NOT NULL)`;
      }

      query += ` ORDER BY q.is_difficult DESC, q.updated_at DESC LIMIT 50;`;

      const rows = this.rawDb.getAllSync<any>(query);
      return rows.map((r) => this.mapQuestionRow(r));
    } catch (e) {
      console.error('[InterviewPrepRepository] getRevisionQueue error:', e);
      return [];
    }
  }

  /**
   * Get all questions with user personal revision notes
   */
  async getQuestionsWithNotes(): Promise<QuestionWithMetadata[]> {
    try {
      const query = `
        SELECT 
          q.*,
          c.name as category_name,
          c.group_name,
          n.note_text
        FROM interview_prep_questions q
        JOIN interview_categories c ON q.category_id = c.id
        JOIN interview_notes n ON q.id = n.question_id
        WHERE n.note_text IS NOT NULL AND length(trim(n.note_text)) > 0
        ORDER BY n.updated_at DESC;
      `;
      const rows = this.rawDb.getAllSync<any>(query);
      return rows.map((r) => this.mapQuestionRow(r));
    } catch (e) {
      console.error('[InterviewPrepRepository] getQuestionsWithNotes error:', e);
      return [];
    }
  }

  /**
   * Mark a revision item reviewed (advances interval)
   */
  async advanceRevisionItem(questionId: string, easeLevel: 'hard' | 'good' | 'easy'): Promise<void> {
    try {
      const now = Date.now();
      const mult = easeLevel === 'easy' ? 2.5 : easeLevel === 'good' ? 1.8 : 1.2;
      const nextDue = now + Math.round(mult * 86400000);

      this.rawDb.runSync(
        `UPDATE interview_revisions 
         SET repetition_count = repetition_count + 1,
             due_date = ?,
             last_reviewed_at = ?,
             status = 'COMPLETED'
         WHERE question_id = ?;`,
        [nextDue, now, questionId]
      );
    } catch (e) {
      console.error('[InterviewPrepRepository] advanceRevisionItem error:', e);
    }
  }

  /**
   * Company Preparation Checklist
   */
  async getCompanyChecklist(companyName: string): Promise<{ id: string; key: string; text: string; isCompleted: boolean }[]> {
    try {
      const rows = this.rawDb.getAllSync<any>(
        'SELECT * FROM interview_company_checklists WHERE company_name = ? ORDER BY item_key ASC;',
        [companyName]
      );
      return rows.map((r) => ({
        id: r.id,
        key: r.item_key,
        text: r.item_text,
        isCompleted: r.is_completed === 1,
      }));
    } catch (e) {
      console.error('[InterviewPrepRepository] getCompanyChecklist error:', e);
      return [];
    }
  }

  async toggleCompanyChecklistItem(id: string): Promise<boolean> {
    try {
      const row = this.rawDb.getFirstSync<any>(
        'SELECT is_completed FROM interview_company_checklists WHERE id = ?;',
        [id]
      );
      if (!row) return false;
      const next = row.is_completed === 1 ? 0 : 1;
      this.rawDb.runSync(
        'UPDATE interview_company_checklists SET is_completed = ?, updated_at = ? WHERE id = ?;',
        [next, Date.now(), id]
      );
      return next === 1;
    } catch (e) {
      console.error('[InterviewPrepRepository] toggleCompanyChecklistItem error:', e);
      return false;
    }
  }

  /**
   * Project Interview Management
   */
  async getProjects(): Promise<InterviewUserProject[]> {
    try {
      const rows = this.rawDb.getAllSync<any>(
        'SELECT * FROM interview_user_projects ORDER BY is_predefined DESC, created_at DESC;'
      );
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        subtitle: r.subtitle,
        techStack: r.tech_stack,
        problemStatement: r.problem_statement,
        architecture: r.architecture,
        databaseDesign: r.database_design,
        apis: r.apis,
        challenges: r.challenges,
        technicalDecisions: r.technical_decisions,
        scalability: r.scalability,
        security: r.security,
        futureImprovements: r.future_improvements,
        customQuestions: r.custom_questions,
        isPredefined: r.is_predefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    } catch (e) {
      console.error('[InterviewPrepRepository] getProjects error:', e);
      return [];
    }
  }

  /**
   * Get projects saved in Resume Manager (resume_projects table)
   */
  async getResumeProjects(): Promise<{ id: string; resumeId: string; title: string; subtitle: string | null; techStack: string | null; description: string | null }[]> {
    try {
      const rows = this.rawDb.getAllSync<any>(`
        SELECT id, resume_id as resumeId, title, subtitle, tech_stack as techStack, description 
        FROM resume_projects 
        ORDER BY updated_at DESC;
      `);
      return rows;
    } catch {
      return [];
    }
  }

  async getProjectById(id: string): Promise<InterviewUserProject | null> {
    try {
      const row = this.rawDb.getFirstSync<any>(
        'SELECT * FROM interview_user_projects WHERE id = ?;',
        [id]
      );
      if (!row) return null;
      return {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        techStack: row.tech_stack,
        problemStatement: row.problem_statement,
        architecture: row.architecture,
        databaseDesign: row.database_design,
        apis: row.apis,
        challenges: row.challenges,
        technicalDecisions: row.technical_decisions,
        scalability: row.scalability,
        security: row.security,
        futureImprovements: row.future_improvements,
        customQuestions: row.custom_questions,
        isPredefined: row.is_predefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (e) {
      console.error('[InterviewPrepRepository] getProjectById error:', e);
      return null;
    }
  }

  async saveCustomProject(project: Partial<InterviewUserProject>): Promise<string> {
    const id = project.id || generateUUID();
    const now = Date.now();
    this.rawDb.runSync(
      `INSERT INTO interview_user_projects (
        id, title, subtitle, tech_stack, problem_statement, architecture, database_design, apis, challenges, technical_decisions, scalability, security, future_improvements, custom_questions, is_predefined, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        subtitle = excluded.subtitle,
        tech_stack = excluded.tech_stack,
        problem_statement = excluded.problem_statement,
        architecture = excluded.architecture,
        database_design = excluded.database_design,
        apis = excluded.apis,
        challenges = excluded.challenges,
        technical_decisions = excluded.technical_decisions,
        scalability = excluded.scalability,
        security = excluded.security,
        future_improvements = excluded.future_improvements,
        custom_questions = excluded.custom_questions,
        updated_at = excluded.updated_at;`,
      [
        id,
        project.title || 'Untitled Project',
        project.subtitle || '',
        project.techStack || '',
        project.problemStatement || '',
        project.architecture || '',
        project.databaseDesign || '',
        project.apis || '',
        project.challenges || '',
        project.technicalDecisions || '',
        project.scalability || '',
        project.security || '',
        project.futureImprovements || '',
        project.customQuestions || '[]',
        now,
        now,
      ]
    );
    return id;
  }

  async addCustomProjectQuestion(projectId: string, question: string, answer: string): Promise<void> {
    const proj = await this.getProjectById(projectId);
    if (!proj) return;
    let list: any[] = [];
    try {
      list = JSON.parse(proj.customQuestions || '[]');
    } catch {
      list = [];
    }
    list.push({ id: generateUUID(), question, answer });
    this.rawDb.runSync(
      'UPDATE interview_user_projects SET custom_questions = ?, updated_at = ? WHERE id = ?;',
      [JSON.stringify(list), Date.now(), projectId]
    );
  }

  async deleteCustomProjectQuestion(projectId: string, qId: string): Promise<void> {
    const proj = await this.getProjectById(projectId);
    if (!proj) return;
    let list: any[] = [];
    try {
      list = JSON.parse(proj.customQuestions || '[]');
    } catch {
      list = [];
    }
    list = list.filter((item: any) => item.id !== qId);
    this.rawDb.runSync(
      'UPDATE interview_user_projects SET custom_questions = ?, updated_at = ? WHERE id = ?;',
      [JSON.stringify(list), Date.now(), projectId]
    );
  }

  /**
   * HR Custom Answers
   */
  async getHrAnswer(questionKey: string): Promise<string> {
    try {
      const row = this.rawDb.getFirstSync<any>(
        'SELECT custom_answer FROM interview_hr_answers WHERE question_key = ?;',
        [questionKey]
      );
      return row?.custom_answer || '';
    } catch {
      return '';
    }
  }

  async saveHrAnswer(questionKey: string, customAnswer: string): Promise<void> {
    const now = Date.now();
    this.rawDb.runSync(
      `INSERT INTO interview_hr_answers (id, question_key, custom_answer, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(question_key) DO UPDATE SET custom_answer = ?, updated_at = ?;`,
      [generateUUID(), questionKey, customAnswer, now, customAnswer, now]
    );
  }

  /**
   * Helper: Map row to QuestionWithMetadata
   */
  private mapQuestionRow(r: any): QuestionWithMetadata {
    return {
      id: r.id,
      categoryId: r.category_id,
      title: r.title,
      difficulty: r.difficulty,
      answer: r.answer,
      example: r.example,
      codeExample: r.code_example,
      keyPoints: r.key_points,
      followUps: r.follow_ups,
      companies: r.companies,
      tags: r.tags,
      isCompleted: r.is_completed,
      isBookmarked: r.is_bookmarked,
      isDifficult: r.is_difficult,
      completedAt: r.completed_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      categoryName: r.category_name,
      groupName: r.group_name,
      noteText: r.note_text,
    };
  }

  /**
   * Helper: Calculate Study Streak
   */
  private calculateStreak(): number {
    try {
      const rows = this.rawDb.getAllSync<{ date_str: string }>(`
        SELECT DISTINCT date_str 
        FROM interview_daily_goals 
        WHERE completed_count > 0 
        ORDER BY date_str DESC 
        LIMIT 60;
      `);

      if (rows.length === 0) return 0;

      const today = new Date();
      const todayStr = this.formatDate(today);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = this.formatDate(yesterday);

      const dates = new Set(rows.map((r) => r.date_str));
      let currentCheck = dates.has(todayStr) ? today : (dates.has(yesterdayStr) ? yesterday : null);

      if (!currentCheck) return 0;

      let streak = 0;
      while (dates.has(this.formatDate(currentCheck))) {
        streak++;
        currentCheck.setDate(currentCheck.getDate() - 1);
      }
      return streak;
    } catch {
      return 0;
    }
  }

  /**
   * Helper: Get 7-Day Activity Chart
   */
  private getWeeklyActivityChart(): { dayLabel: string; dateStr: string; count: number }[] {
    const days: { dayLabel: string; dateStr: string; count: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = this.formatDate(d);
      const dayLabel = dayNames[d.getDay()];

      const row = this.rawDb.getFirstSync<{ count: number }>(
        'SELECT completed_count as count FROM interview_daily_goals WHERE date_str = ?;',
        [dateStr]
      );
      days.push({
        dayLabel,
        dateStr,
        count: row?.count || 0,
      });
    }

    return days;
  }

  private getTodayDateString(): string {
    return this.formatDate(new Date());
  }

  private formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export const interviewPrepRepository = new InterviewPrepRepository();
