import { BaseRepository } from './BaseRepository';
import { generateUUID } from '@/utils/uuid';
import { DsaRevision } from '../schema/dsa';

export interface RevisionWithProblem extends DsaRevision {
  problemTitle: string;
  problemDifficulty: string;
  problemTopic: string;
  problemPlatform: string;
  confidenceRating: number | null;
}

export const REVISION_INTERVALS = [1, 3, 7, 15, 30]; // in days

export class DsaRevisionRepository extends BaseRepository {
  /**
   * Return start and end timestamps of today (00:00:00 to 23:59:59.999 in local time)
   */
  private getTodayBounds(): { start: number; end: number } {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    return { start, end };
  }

  async getAllWithProblem(
    filter: 'all' | 'due' | 'overdue' | 'upcoming' | 'completed' = 'all'
  ): Promise<RevisionWithProblem[]> {
    try {
      const { start: todayStart, end: todayEnd } = this.getTodayBounds();

      let query = `
        SELECT 
          r.id,
          r.problem_id as problemId,
          r.revision_number as revisionNumber,
          r.scheduled_date as scheduledDate,
          r.completed_date as completedDate,
          r.recall_rating as recallRating,
          r.notes,
          r.time_taken_minutes as timeTakenMinutes,
          r.status,
          r.created_at as createdAt,
          p.title as problemTitle,
          p.difficulty as problemDifficulty,
          p.topic_name as problemTopic,
          p.platform as problemPlatform,
          p.confidence_rating as confidenceRating
        FROM dsa_revisions r
        JOIN dsa_problems p ON r.problem_id = p.id
      `;

      const conditions: string[] = [];

      if (filter === 'completed') {
        conditions.push('r.completed_date IS NOT NULL');
      } else if (filter === 'due') {
        conditions.push(`r.completed_date IS NULL AND r.scheduled_date >= ${todayStart} AND r.scheduled_date <= ${todayEnd}`);
      } else if (filter === 'overdue') {
        conditions.push(`r.completed_date IS NULL AND r.scheduled_date < ${todayStart}`);
      } else if (filter === 'upcoming') {
        conditions.push(`r.completed_date IS NULL AND r.scheduled_date > ${todayEnd}`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      if (filter === 'completed') {
        query += ' ORDER BY r.completed_date DESC;';
      } else {
        query += ' ORDER BY r.scheduled_date ASC;';
      }

      const rows = this.rawDb.getAllSync<any>(query);

      // Re-evaluate live dynamic status for pending revisions
      return rows.map((row) => {
        let computedStatus = row.status;
        if (!row.completedDate) {
          if (row.scheduledDate < todayStart) {
            computedStatus = 'overdue';
          } else if (row.scheduledDate <= todayEnd) {
            computedStatus = 'due';
          } else {
            computedStatus = 'upcoming';
          }
        }
        return {
          ...row,
          status: computedStatus,
        };
      });
    } catch (error) {
      this.handleError('DsaRevisionRepository.getAllWithProblem', error);
    }
  }

  async getRevisionStats(): Promise<{
    dueToday: number;
    overdue: number;
    upcoming: number;
    completed: number;
    total: number;
  }> {
    try {
      const { start: todayStart, end: todayEnd } = this.getTodayBounds();

      const row = this.rawDb.getFirstSync<{
        dueToday: number;
        overdue: number;
        upcoming: number;
        completed: number;
        total: number;
      }>(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN completed_date IS NOT NULL THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN completed_date IS NULL AND scheduled_date >= ${todayStart} AND scheduled_date <= ${todayEnd} THEN 1 ELSE 0 END) as dueToday,
          SUM(CASE WHEN completed_date IS NULL AND scheduled_date < ${todayStart} THEN 1 ELSE 0 END) as overdue,
          SUM(CASE WHEN completed_date IS NULL AND scheduled_date > ${todayEnd} THEN 1 ELSE 0 END) as upcoming
        FROM dsa_revisions;
      `);

      return {
        dueToday: row?.dueToday || 0,
        overdue: row?.overdue || 0,
        upcoming: row?.upcoming || 0,
        completed: row?.completed || 0,
        total: row?.total || 0,
      };
    } catch (error) {
      this.handleError('DsaRevisionRepository.getRevisionStats', error);
    }
  }

  async scheduleInitialRevision(problemId: string, customStartDate?: number): Promise<string> {
    try {
      const baseDate = customStartDate || Date.now();
      const scheduledDate = baseDate + 1 * 24 * 60 * 60 * 1000; // 1 day
      const id = generateUUID();

      this.rawDb.runSync(
        `INSERT INTO dsa_revisions (
          id, problem_id, revision_number, scheduled_date, status, created_at
        ) VALUES (?, ?, 1, ?, 'upcoming', ?);`,
        [id, problemId, scheduledDate, Date.now()]
      );

      this.rawDb.runSync(
        `UPDATE dsa_problems SET 
          revision_status = 'upcoming',
          next_revision_at = ?,
          revision_interval_step = 1,
          updated_at = ?
         WHERE id = ?;`,
        [scheduledDate, Date.now(), problemId]
      );

      return id;
    } catch (error) {
      this.handleError('DsaRevisionRepository.scheduleInitialRevision', error);
    }
  }

  async completeRevision(
    revisionId: string,
    recallRating: 'Easy' | 'Medium' | 'Difficult',
    notes?: string,
    timeTakenMinutes: number = 0
  ): Promise<{ nextScheduledDate?: number; isMastered?: boolean }> {
    try {
      const now = Date.now();
      const rev = this.rawDb.getFirstSync<DsaRevision>(
        'SELECT * FROM dsa_revisions WHERE id = ? LIMIT 1;',
        [revisionId]
      );
      if (!rev) {
        throw new Error('Revision record not found');
      }

      // Mark current revision completed
      this.rawDb.runSync(
        `UPDATE dsa_revisions SET 
          completed_date = ?,
          recall_rating = ?,
          notes = ?,
          time_taken_minutes = ?,
          status = 'completed'
         WHERE id = ?;`,
        [now, recallRating, notes || null, timeTakenMinutes, revisionId]
      );

      // Log daily activity for revision completed
      const todayString = new Date().toISOString().split('T')[0];
      this.rawDb.runSync(
        `INSERT INTO dsa_daily_activity (id, date_string, revisions_completed, updated_at)
         VALUES (?, ?, 1, ?)
         ON CONFLICT(date_string) DO UPDATE SET
           revisions_completed = revisions_completed + 1,
           study_minutes = study_minutes + ?,
           updated_at = ?;`,
        [generateUUID(), todayString, now, timeTakenMinutes, now]
      );

      // Determine next step
      let nextStep = rev.revisionNumber + 1;
      let nextDays = 1;

      if (recallRating === 'Difficult') {
        // Suggested earlier revision interval (1 day)
        nextStep = 1;
        nextDays = 1;
      } else if (recallRating === 'Medium') {
        const intervalIndex = Math.min(rev.revisionNumber - 1, REVISION_INTERVALS.length - 1);
        nextDays = REVISION_INTERVALS[intervalIndex];
      } else {
        // Easy recall: progress to next interval
        const intervalIndex = Math.min(rev.revisionNumber, REVISION_INTERVALS.length - 1);
        nextDays = REVISION_INTERVALS[intervalIndex];
      }

      if (nextStep > 5 && recallRating === 'Easy') {
        // Problem mastered through all 5 revision intervals!
        this.rawDb.runSync(
          `UPDATE dsa_problems SET 
            revision_status = 'completed',
            next_revision_at = NULL,
            revision_interval_step = 5,
            updated_at = ?
           WHERE id = ?;`,
          [now, rev.problemId]
        );
        return { isMastered: true };
      }

      // Schedule next revision
      const nextScheduledDate = now + nextDays * 24 * 60 * 60 * 1000;
      const nextId = generateUUID();

      this.rawDb.runSync(
        `INSERT INTO dsa_revisions (
          id, problem_id, revision_number, scheduled_date, status, created_at
        ) VALUES (?, ?, ?, ?, 'upcoming', ?);`,
        [nextId, rev.problemId, nextStep, nextScheduledDate, now]
      );

      this.rawDb.runSync(
        `UPDATE dsa_problems SET 
          revision_status = 'upcoming',
          next_revision_at = ?,
          revision_interval_step = ?,
          updated_at = ?
         WHERE id = ?;`,
        [nextScheduledDate, nextStep, now, rev.problemId]
      );

      return { nextScheduledDate };
    } catch (error) {
      this.handleError('DsaRevisionRepository.completeRevision', error);
    }
  }

  async getHistoryForProblem(problemId: string): Promise<DsaRevision[]> {
    try {
      return this.rawDb.getAllSync<DsaRevision>(
        'SELECT * FROM dsa_revisions WHERE problem_id = ? ORDER BY scheduled_date ASC;',
        [problemId]
      );
    } catch (error) {
      this.handleError('DsaRevisionRepository.getHistoryForProblem', error);
    }
  }
}

export const dsaRevisionRepository = new DsaRevisionRepository();
