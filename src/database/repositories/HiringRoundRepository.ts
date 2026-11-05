import { eq, asc, desc, and } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository';
import { hiringRounds, HiringRound, NewHiringRound, applications, companies } from '../schema/placement';
import { generateUUID } from '@/utils/uuid';

export interface HiringRoundWithAppInfo extends HiringRound {
  companyName: string;
  roleTitle: string;
}

export class HiringRoundRepository extends BaseRepository {
  async getByApplicationId(applicationId: string): Promise<HiringRound[]> {
    try {
      return await this.db
        .select()
        .from(hiringRounds)
        .where(eq(hiringRounds.applicationId, applicationId))
        .orderBy(asc(hiringRounds.roundOrder), asc(hiringRounds.scheduledDate));
    } catch (error) {
      this.handleError(`HiringRoundRepository.getByApplicationId(${applicationId})`, error);
    }
  }

  async getUpcomingAssessments(limit: number = 5): Promise<HiringRoundWithAppInfo[]> {
    try {
      const rows = this.rawDb.getAllSync<any>(`
        SELECT 
          r.*,
          c.name as company_name,
          a.role_title as role_title
        FROM hiring_rounds r
        INNER JOIN applications a ON r.application_id = a.id
        INNER JOIN companies c ON a.company_id = c.id
        WHERE r.round_type IN ('assessment', 'aptitude', 'coding', 'oa')
          AND r.completion_status = 'SCHEDULED'
          AND (r.scheduled_date IS NULL OR r.scheduled_date >= ?)
        ORDER BY CASE WHEN r.scheduled_date IS NULL THEN 1 ELSE 0 END, r.scheduled_date ASC
        LIMIT ?;
      `, [Date.now() - 24 * 60 * 60 * 1000, limit]);

      return rows.map((r) => ({
        id: r.id,
        applicationId: r.application_id,
        roundName: r.round_name,
        roundType: r.round_type,
        roundOrder: r.round_order,
        scheduledDate: r.scheduled_date,
        completionStatus: r.completion_status,
        result: r.result,
        score: r.score,
        feedback: r.feedback,
        questionsAsked: r.questions_asked,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        companyName: r.company_name,
        roleTitle: r.role_title,
      }));
    } catch (error) {
      this.handleError('HiringRoundRepository.getUpcomingAssessments', error);
    }
  }

  async getUpcomingInterviews(limit: number = 5): Promise<HiringRoundWithAppInfo[]> {
    try {
      const rows = this.rawDb.getAllSync<any>(`
        SELECT 
          r.*,
          c.name as company_name,
          a.role_title as role_title
        FROM hiring_rounds r
        INNER JOIN applications a ON r.application_id = a.id
        INNER JOIN companies c ON a.company_id = c.id
        WHERE r.round_type IN ('technical', 'managerial', 'hr', 'interview')
          AND r.completion_status = 'SCHEDULED'
          AND (r.scheduled_date IS NULL OR r.scheduled_date >= ?)
        ORDER BY CASE WHEN r.scheduled_date IS NULL THEN 1 ELSE 0 END, r.scheduled_date ASC
        LIMIT ?;
      `, [Date.now() - 24 * 60 * 60 * 1000, limit]);

      return rows.map((r) => ({
        id: r.id,
        applicationId: r.application_id,
        roundName: r.round_name,
        roundType: r.round_type,
        roundOrder: r.round_order,
        scheduledDate: r.scheduled_date,
        completionStatus: r.completion_status,
        result: r.result,
        score: r.score,
        feedback: r.feedback,
        questionsAsked: r.questions_asked,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        companyName: r.company_name,
        roleTitle: r.role_title,
      }));
    } catch (error) {
      this.handleError('HiringRoundRepository.getUpcomingInterviews', error);
    }
  }

  async create(data: {
    applicationId: string;
    roundName: string;
    roundType?: string;
    roundOrder?: number;
    scheduledDate?: number | null;
    completionStatus?: string;
    result?: string;
    score?: string | null;
    feedback?: string | null;
    questionsAsked?: string | null;
  }): Promise<HiringRound> {
    try {
      const now = Date.now();
      const id = generateUUID();

      const newRound: NewHiringRound = {
        id,
        applicationId: data.applicationId,
        roundName: data.roundName.trim(),
        roundType: data.roundType || 'other',
        roundOrder: data.roundOrder || 1,
        scheduledDate: data.scheduledDate || null,
        completionStatus: data.completionStatus || 'SCHEDULED',
        result: data.result || 'PENDING',
        score: data.score?.trim() || null,
        feedback: data.feedback?.trim() || null,
        questionsAsked: data.questionsAsked?.trim() || null,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(hiringRounds).values(newRound);
      const rows = await this.db.select().from(hiringRounds).where(eq(hiringRounds.id, id)).limit(1);
      return rows[0];
    } catch (error) {
      this.handleError('HiringRoundRepository.create', error);
    }
  }

  async update(
    id: string,
    data: Partial<{
      roundName: string;
      roundType: string;
      roundOrder: number;
      scheduledDate: number | null;
      completionStatus: string;
      result: string;
      score: string | null;
      feedback: string | null;
      questionsAsked: string | null;
    }>
  ): Promise<HiringRound> {
    try {
      const now = Date.now();
      await this.db
        .update(hiringRounds)
        .set({
          ...data,
          updatedAt: now,
        })
        .where(eq(hiringRounds.id, id));

      const rows = await this.db.select().from(hiringRounds).where(eq(hiringRounds.id, id)).limit(1);
      return rows[0];
    } catch (error) {
      this.handleError(`HiringRoundRepository.update(${id})`, error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.delete(hiringRounds).where(eq(hiringRounds.id, id));
      return true;
    } catch (error) {
      this.handleError(`HiringRoundRepository.delete(${id})`, error);
    }
  }
}

export const hiringRoundRepository = new HiringRoundRepository();
