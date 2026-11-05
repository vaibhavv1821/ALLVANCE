import { eq, desc } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository';
import {
  interviews,
  interviewQuestions,
  companies,
  Interview,
  NewInterview,
  InterviewQuestion,
  NewInterviewQuestion,
} from '../schema/placement';
import { generateUUID } from '@/utils/uuid';

export interface InterviewWithDetails extends Interview {
  companyName: string;
  companyIndustry?: string | null;
  questions: InterviewQuestion[];
}

export interface CreateInterviewInput {
  companyId: string;
  applicationId?: string | null;
  roundId?: string | null;
  roleTitle: string;
  interviewRound: string;
  interviewDate: number;
  topicsDiscussed?: string | null;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD';
  feedback?: string | null;
  rating?: number;
  questions?: Array<{
    question: string;
    category?: string | null;
    notes?: string | null;
    wasAnswered?: boolean;
  }>;
}

export class InterviewRepository extends BaseRepository {
  async getAll(options?: {
    companyId?: string;
    difficulty?: string;
    search?: string;
  }): Promise<InterviewWithDetails[]> {
    try {
      let sqlQuery = `
        SELECT 
          i.*,
          c.name as company_name,
          c.industry as company_industry
        FROM interviews i
        INNER JOIN companies c ON i.company_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (options?.companyId) {
        sqlQuery += ` AND i.company_id = ?`;
        params.push(options.companyId);
      }

      if (options?.difficulty && options.difficulty !== 'ALL') {
        sqlQuery += ` AND i.difficulty = ?`;
        params.push(options.difficulty);
      }

      if (options?.search && options.search.trim()) {
        const q = `%${options.search.trim()}%`;
        sqlQuery += ` AND (c.name LIKE ? OR i.role_title LIKE ? OR i.topics_discussed LIKE ?)`;
        params.push(q, q, q);
      }

      sqlQuery += ` ORDER BY i.interview_date DESC;`;

      const rows = this.rawDb.getAllSync<any>(sqlQuery, params);
      if (rows.length === 0) return [];

      // Fetch all questions for these interviews
      const interviewIds = rows.map((r) => `'${r.id}'`).join(',');
      const questionsRows = this.rawDb.getAllSync<any>(`
        SELECT * FROM interview_questions 
        WHERE interview_id IN (${interviewIds}) 
        ORDER BY created_at ASC;
      `);

      const questionsMap = new Map<string, InterviewQuestion[]>();
      for (const q of questionsRows) {
        const list = questionsMap.get(q.interview_id) || [];
        list.push({
          id: q.id,
          interviewId: q.interview_id,
          question: q.question,
          category: q.category,
          notes: q.notes,
          wasAnswered: q.was_answered,
          createdAt: q.created_at,
        });
        questionsMap.set(q.interview_id, list);
      }

      return rows.map((r) => ({
        id: r.id,
        companyId: r.company_id,
        applicationId: r.application_id,
        roundId: r.round_id,
        roleTitle: r.role_title,
        interviewRound: r.interview_round,
        interviewDate: r.interview_date,
        topicsDiscussed: r.topics_discussed,
        difficulty: r.difficulty,
        feedback: r.feedback,
        rating: r.rating,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        companyName: r.company_name,
        companyIndustry: r.company_industry,
        questions: questionsMap.get(r.id) || [],
      }));
    } catch (error) {
      this.handleError('InterviewRepository.getAll', error);
    }
  }

  async getById(id: string): Promise<InterviewWithDetails | null> {
    try {
      const all = await this.getAll();
      return all.find((item) => item.id === id) || null;
    } catch (error) {
      this.handleError(`InterviewRepository.getById(${id})`, error);
    }
  }

  async create(data: CreateInterviewInput): Promise<InterviewWithDetails> {
    try {
      const now = Date.now();
      const id = generateUUID();

      const newInterview: NewInterview = {
        id,
        companyId: data.companyId,
        applicationId: data.applicationId || null,
        roundId: data.roundId || null,
        roleTitle: data.roleTitle.trim(),
        interviewRound: data.interviewRound.trim(),
        interviewDate: data.interviewDate,
        topicsDiscussed: data.topicsDiscussed?.trim() || null,
        difficulty: data.difficulty || 'MEDIUM',
        feedback: data.feedback?.trim() || null,
        rating: data.rating !== undefined ? Math.max(1, Math.min(5, data.rating)) : 3,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(interviews).values(newInterview);

      // Insert questions if provided
      if (data.questions && data.questions.length > 0) {
        for (const q of data.questions) {
          if (!q.question.trim()) continue;
          const qId = generateUUID();
          await this.db.insert(interviewQuestions).values({
            id: qId,
            interviewId: id,
            question: q.question.trim(),
            category: q.category?.trim() || null,
            notes: q.notes?.trim() || null,
            wasAnswered: q.wasAnswered === false ? 0 : 1,
            createdAt: now,
          });
        }
      }

      return (await this.getById(id))!;
    } catch (error) {
      this.handleError('InterviewRepository.create', error);
    }
  }

  async update(
    id: string,
    data: Partial<{
      companyId: string;
      roleTitle: string;
      interviewRound: string;
      interviewDate: number;
      topicsDiscussed: string | null;
      difficulty: string;
      feedback: string | null;
      rating: number;
    }>
  ): Promise<InterviewWithDetails> {
    try {
      const now = Date.now();
      await this.db
        .update(interviews)
        .set({
          ...data,
          updatedAt: now,
        })
        .where(eq(interviews.id, id));

      return (await this.getById(id))!;
    } catch (error) {
      this.handleError(`InterviewRepository.update(${id})`, error);
    }
  }

  async addQuestion(
    interviewId: string,
    question: string,
    category?: string,
    notes?: string
  ): Promise<InterviewQuestion> {
    try {
      const now = Date.now();
      const id = generateUUID();
      const newQ: NewInterviewQuestion = {
        id,
        interviewId,
        question: question.trim(),
        category: category?.trim() || null,
        notes: notes?.trim() || null,
        wasAnswered: 1,
        createdAt: now,
      };

      await this.db.insert(interviewQuestions).values(newQ);
      const rows = await this.db.select().from(interviewQuestions).where(eq(interviewQuestions.id, id)).limit(1);
      return rows[0];
    } catch (error) {
      this.handleError(`InterviewRepository.addQuestion(${interviewId})`, error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.delete(interviews).where(eq(interviews.id, id));
      return true;
    } catch (error) {
      this.handleError(`InterviewRepository.delete(${id})`, error);
    }
  }

  async count(): Promise<number> {
    try {
      const row = this.rawDb.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM interviews;'
      );
      return row?.count || 0;
    } catch (error) {
      this.handleError('InterviewRepository.count', error);
    }
  }
}

export const interviewRepository = new InterviewRepository();
