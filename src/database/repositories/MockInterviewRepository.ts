import { BaseRepository } from './BaseRepository';
import { generateUUID } from '@/utils/uuid';
import { MockInterview, MockInterviewQuestion } from '../schema/interviews';
import { QuestionWithMetadata } from './InterviewPrepRepository';

export { MockInterview, MockInterviewQuestion };

export interface CreateMockSessionInput {
  title?: string;
  company?: string;
  categoryId?: string;
  difficulty?: string;
  questionCount: number;
  timeLimitSeconds?: number;
}

export interface MockSessionWithQuestions extends MockInterview {
  questions: (MockInterviewQuestion & {
    questionTitle: string;
    questionDifficulty: string;
    modelAnswer: string;
    example?: string | null;
    codeExample?: string | null;
    keyPoints?: string | null;
    categoryName?: string;
  })[];
}

export interface MockReportSummary {
  attempted: number;
  correct: number;
  totalQuestions: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  categoryBreakdown: { [category: string]: { total: number; correct: number } };
  weakTopics: string[];
  strongTopics: string[];
}

export class MockInterviewRepository extends BaseRepository {
  /**
   * Create a new Mock Interview Session and populate randomized questions
   */
  async createMockSession(input: CreateMockSessionInput): Promise<string> {
    const mockId = generateUUID();
    const now = Date.now();
    const company = input.company || 'General';
    const categoryId = input.categoryId || 'ALL';
    const difficulty = input.difficulty || 'ALL';
    const count = Math.max(1, Math.min(30, input.questionCount || 5));
    const title = input.title || `${company} Mock Interview`;

    // 1. Select random questions matching criteria
    let query = `SELECT id FROM interview_prep_questions WHERE 1=1`;
    const params: any[] = [];

    if (categoryId !== 'ALL') {
      query += ` AND category_id = ?`;
      params.push(categoryId);
    }

    if (difficulty !== 'ALL') {
      query += ` AND difficulty = ?`;
      params.push(difficulty.toUpperCase());
    }

    if (company !== 'General' && company !== 'ALL') {
      query += ` AND LOWER(companies) LIKE ?`;
      params.push(`%${company.toLowerCase()}%`);
    }

    query += ` ORDER BY RANDOM() LIMIT ${count};`;

    let selectedRows = this.rawDb.getAllSync<{ id: string }>(query, params);

    // Fallback if not enough questions found matching strict company filters
    if (selectedRows.length < count) {
      const fallbackQuery = `
        SELECT id FROM interview_prep_questions 
        WHERE id NOT IN (${selectedRows.map((r) => `'${r.id}'`).join(',') || "''"})
        ORDER BY RANDOM() LIMIT ${count - selectedRows.length};
      `;
      const fallbackRows = this.rawDb.getAllSync<{ id: string }>(fallbackQuery);
      selectedRows = [...selectedRows, ...fallbackRows];
    }

    // 2. Insert into mock_interviews
    this.rawDb.runSync(
      `INSERT INTO mock_interviews (
        id, title, company, category_id, difficulty, total_questions, duration_seconds, time_limit_seconds, score, status, summary, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, 0, 'IN_PROGRESS', null, ?);`,
      [mockId, title, company, categoryId, difficulty, selectedRows.length, input.timeLimitSeconds || 0, now]
    );

    // 3. Insert items into mock_interview_questions
    let order = 0;
    for (const q of selectedRows) {
      this.rawDb.runSync(
        `INSERT INTO mock_interview_questions (
          id, mock_id, question_id, order_index, user_answer, self_rating, is_correct, time_spent_seconds
        ) VALUES (?, ?, ?, ?, '', 0, 0, 0);`,
        [generateUUID(), mockId, q.id, order++]
      );
    }

    return mockId;
  }

  /**
   * Get Mock Session by ID with full question details
   */
  async getMockSessionById(mockId: string): Promise<MockSessionWithQuestions | null> {
    try {
      const sessionRow = this.rawDb.getFirstSync<any>(
        'SELECT * FROM mock_interviews WHERE id = ?;',
        [mockId]
      );
      if (!sessionRow) return null;

      const itemsSql = `
        SELECT 
          mq.*,
          q.title as question_title,
          q.difficulty as question_difficulty,
          q.answer as model_answer,
          q.example,
          q.code_example,
          q.key_points,
          c.name as category_name
        FROM mock_interview_questions mq
        JOIN interview_prep_questions q ON mq.question_id = q.id
        JOIN interview_categories c ON q.category_id = c.id
        WHERE mq.mock_id = ?
        ORDER BY mq.order_index ASC;
      `;
      const itemRows = this.rawDb.getAllSync<any>(itemsSql, [mockId]);

      return {
        id: sessionRow.id,
        title: sessionRow.title,
        company: sessionRow.company,
        categoryId: sessionRow.category_id,
        difficulty: sessionRow.difficulty,
        totalQuestions: sessionRow.total_questions,
        durationSeconds: sessionRow.duration_seconds,
        timeLimitSeconds: sessionRow.time_limit_seconds,
        score: sessionRow.score,
        status: sessionRow.status,
        summary: sessionRow.summary,
        createdAt: sessionRow.created_at,
        completedAt: sessionRow.completed_at,
        questions: itemRows.map((r) => ({
          id: r.id,
          mockId: r.mock_id,
          questionId: r.question_id,
          orderIndex: r.order_index,
          userAnswer: r.user_answer,
          selfRating: r.self_rating,
          isCorrect: r.is_correct,
          timeSpentSeconds: r.time_spent_seconds,
          reviewedAt: r.reviewed_at,
          questionTitle: r.question_title,
          questionDifficulty: r.question_difficulty,
          modelAnswer: r.model_answer,
          example: r.example,
          codeExample: r.code_example,
          keyPoints: r.key_points,
          categoryName: r.category_name,
        })),
      };
    } catch (e) {
      console.error('[MockInterviewRepository] getMockSessionById error:', e);
      return null;
    }
  }

  /**
   * Save user's answer and self-assessment rating for a specific question
   */
  async saveMockQuestionAnswer(
    mockId: string,
    questionId: string,
    input: {
      userAnswer?: string;
      selfRating?: number;
      isCorrect?: boolean;
      timeSpentSeconds?: number;
    }
  ): Promise<void> {
    try {
      const now = Date.now();
      const rating = input.selfRating ?? 0;
      const isCorrect = input.isCorrect !== undefined ? (input.isCorrect ? 1 : 0) : (rating >= 3 ? 1 : 0);

      this.rawDb.runSync(
        `UPDATE mock_interview_questions 
         SET user_answer = ?, self_rating = ?, is_correct = ?, time_spent_seconds = ?, reviewed_at = ?
         WHERE mock_id = ? AND question_id = ?;`,
        [input.userAnswer || '', rating, isCorrect, input.timeSpentSeconds || 0, now, mockId, questionId]
      );

      // Record in interview_attempts log
      this.rawDb.runSync(
        `INSERT INTO interview_attempts (
          id, question_id, session_id, user_answer, self_rating, is_correct, time_spent_seconds, attempted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [generateUUID(), questionId, mockId, input.userAnswer || '', rating, isCorrect, input.timeSpentSeconds || 0, now]
      );
    } catch (e) {
      console.error('[MockInterviewRepository] saveMockQuestionAnswer error:', e);
    }
  }

  /**
   * Complete Mock Session, calculate diagnostic report, and enqueue weak topics for revision
   */
  async completeMockSession(mockId: string, totalDurationSeconds: number): Promise<MockReportSummary | null> {
    try {
      const session = await this.getMockSessionById(mockId);
      if (!session) return null;

      let attempted = 0;
      let correct = 0;
      const categoryBreakdown: { [category: string]: { total: number; correct: number } } = {};
      const weakTopicsSet = new Set<string>();
      const strongTopicsSet = new Set<string>();

      for (const q of session.questions) {
        if ((q.selfRating ?? 0) > 0 || (q.userAnswer && q.userAnswer.trim().length > 0)) {
          attempted++;
        }

        const cat = q.categoryName || 'General';
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { total: 0, correct: 0 };
        }
        categoryBreakdown[cat].total++;

        if (q.isCorrect === 1 || (q.selfRating ?? 0) >= 3) {
          correct++;
          categoryBreakdown[cat].correct++;
          strongTopicsSet.add(cat);
        } else {
          weakTopicsSet.add(cat);
          // Enqueue weak question for revision
          this.rawDb.runSync(
            `INSERT OR IGNORE INTO interview_revisions (id, question_id, due_date, interval_days, ease_factor, repetition_count, status, created_at)
             VALUES (?, ?, ?, 1, 2.5, 0, 'PENDING', ?);`,
            [generateUUID(), q.questionId, Date.now() + 86400000, Date.now()]
          );
        }
      }

      const scorePercentage = session.questions.length > 0 ? Math.round((correct / session.questions.length) * 100) : 0;
      const weakTopics = Array.from(weakTopicsSet);
      const strongTopics = Array.from(strongTopicsSet).filter((t) => !weakTopicsSet.has(t));

      const summary: MockReportSummary = {
        attempted,
        correct,
        totalQuestions: session.questions.length,
        scorePercentage,
        timeSpentSeconds: totalDurationSeconds,
        categoryBreakdown,
        weakTopics,
        strongTopics,
      };

      const now = Date.now();
      this.rawDb.runSync(
        `UPDATE mock_interviews 
         SET score = ?, duration_seconds = ?, status = 'COMPLETED', summary = ?, completed_at = ?
         WHERE id = ?;`,
        [scorePercentage, totalDurationSeconds, JSON.stringify(summary), now, mockId]
      );

      // Log study session
      const durationMinutes = Math.max(1, Math.round(totalDurationSeconds / 60));
      this.rawDb.runSync(
        `INSERT INTO interview_study_sessions (id, date_str, category_id, duration_minutes, questions_reviewed, created_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [generateUUID(), this.getTodayDateString(), session.categoryId, durationMinutes, attempted, now]
      );

      return summary;
    } catch (e) {
      console.error('[MockInterviewRepository] completeMockSession error:', e);
      return null;
    }
  }

  /**
   * Get past mock interview history
   */
  async getMockHistory(): Promise<MockInterview[]> {
    try {
      const rows = this.rawDb.getAllSync<any>(
        'SELECT * FROM mock_interviews ORDER BY created_at DESC LIMIT 30;'
      );
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        company: r.company,
        categoryId: r.category_id,
        difficulty: r.difficulty,
        totalQuestions: r.total_questions,
        durationSeconds: r.duration_seconds,
        timeLimitSeconds: r.time_limit_seconds,
        score: r.score,
        status: r.status,
        summary: r.summary,
        createdAt: r.created_at,
        completedAt: r.completed_at,
      }));
    } catch (e) {
      console.error('[MockInterviewRepository] getMockHistory error:', e);
      return [];
    }
  }

  private getTodayDateString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export const mockInterviewRepository = new MockInterviewRepository();
