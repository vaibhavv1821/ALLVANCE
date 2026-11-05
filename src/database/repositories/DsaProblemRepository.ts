import { BaseRepository } from './BaseRepository';
import { generateUUID } from '@/utils/uuid';
import {
  DsaProblem,
  DsaAttempt,
  DsaSolution,
  DsaRevision,
  DsaProblemTag,
  DsaProblemCompany,
} from '../schema/dsa';
import { dsaRevisionRepository } from './DsaRevisionRepository';

export interface ProblemDetailed extends DsaProblem {
  tags: string[];
  companies: string[];
  solutions: DsaSolution[];
  attempts: DsaAttempt[];
  revisions: DsaRevision[];
  isFavorite: number;
}

export interface ProblemFilterOptions {
  search?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'ALL';
  platform?: string;
  status?: 'unsolved' | 'attempted' | 'solved' | 'revision' | 'ALL';
  company?: string;
  revisionStatus?: 'none' | 'due' | 'overdue' | 'upcoming' | 'completed' | 'ALL';
  isFavoriteOnly?: boolean;
  sortBy?:
    | 'recently_added'
    | 'recently_solved'
    | 'difficulty_desc'
    | 'difficulty_asc'
    | 'most_attempted'
    | 'revision_due';
}

export class DsaProblemRepository extends BaseRepository {
  async getAll(options?: ProblemFilterOptions): Promise<ProblemDetailed[]> {
    try {
      let query = `
        SELECT 
          p.*,
          (SELECT GROUP_CONCAT(tag, '|||') FROM dsa_problem_tags WHERE problem_id = p.id) as tags_str,
          (SELECT GROUP_CONCAT(company_name, '|||') FROM dsa_problem_companies WHERE problem_id = p.id) as companies_str
        FROM dsa_problems p
      `;

      const conditions: string[] = [];
      const params: any[] = [];

      if (options?.search && options.search.trim()) {
        const searchTerm = `%${options.search.trim()}%`;
        conditions.push(
          '(p.title LIKE ? OR p.problem_id_ext LIKE ? OR p.topic_name LIKE ? OR p.notes LIKE ?)'
        );
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (options?.topic && options.topic !== 'ALL') {
        conditions.push('(p.topic_name = ? OR p.topic_id = ?)');
        params.push(options.topic, options.topic);
      }

      if (options?.subtopic && options.subtopic !== 'ALL') {
        conditions.push('(p.subtopic_name = ? OR p.subtopic_id = ?)');
        params.push(options.subtopic, options.subtopic);
      }

      if (options?.difficulty && options.difficulty !== 'ALL') {
        conditions.push('p.difficulty = ?');
        params.push(options.difficulty);
      }

      if (options?.platform && options.platform !== 'ALL') {
        conditions.push('p.platform = ?');
        params.push(options.platform);
      }

      if (options?.status && options.status !== 'ALL') {
        conditions.push('p.status = ?');
        params.push(options.status);
      }

      if (options?.company && options.company !== 'ALL') {
        conditions.push(
          'EXISTS (SELECT 1 FROM dsa_problem_companies c WHERE c.problem_id = p.id AND c.company_name = ?)'
        );
        params.push(options.company);
      }

      if (options?.revisionStatus && options.revisionStatus !== 'ALL') {
        conditions.push('p.revision_status = ?');
        params.push(options.revisionStatus);
      }

      if (options?.isFavoriteOnly) {
        conditions.push('p.is_favorite = 1');
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      // Sorting
      switch (options?.sortBy) {
        case 'recently_solved':
          query += ' ORDER BY p.solved_at DESC NULLS LAST, p.created_at DESC';
          break;
        case 'difficulty_desc':
          query +=
            " ORDER BY CASE p.difficulty WHEN 'Hard' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Easy' THEN 3 ELSE 4 END ASC, p.created_at DESC";
          break;
        case 'difficulty_asc':
          query +=
            " ORDER BY CASE p.difficulty WHEN 'Easy' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Hard' THEN 3 ELSE 4 END ASC, p.created_at DESC";
          break;
        case 'most_attempted':
          query += ' ORDER BY p.attempts_count DESC, p.created_at DESC';
          break;
        case 'revision_due':
          query +=
            ' ORDER BY p.next_revision_at ASC NULLS LAST, p.created_at DESC';
          break;
        case 'recently_added':
        default:
          query += ' ORDER BY p.created_at DESC';
          break;
      }

      const rows = this.rawDb.getAllSync<any>(query, params);

      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        problemStatement: r.problem_statement,
        problemIdExt: r.problem_id_ext,
        platform: r.platform,
        externalUrl: r.external_url,
        topicId: r.topic_id,
        topicName: r.topic_name,
        subtopicId: r.subtopic_id,
        subtopicName: r.subtopic_name,
        difficulty: r.difficulty,
        status: r.status,
        firstAttemptedAt: r.first_attempted_at,
        solvedAt: r.solved_at,
        attemptsCount: r.attempts_count || 0,
        confidenceRating: r.confidence_rating,
        personalDifficulty: r.personal_difficulty,
        approach: r.approach,
        algorithmExplanation: r.algorithm_explanation,
        timeComplexity: r.time_complexity,
        spaceComplexity: r.space_complexity,
        notes: r.notes,
        importantEdgeCases: r.important_edge_cases,
        isFavorite: r.is_favorite || 0,
        revisionStatus: r.revision_status || 'none',
        nextRevisionAt: r.next_revision_at,
        revisionIntervalStep: r.revision_interval_step || 0,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        tags: r.tags_str ? r.tags_str.split('|||').filter(Boolean) : [],
        companies: r.companies_str
          ? r.companies_str.split('|||').filter(Boolean)
          : [],
        solutions: [],
        attempts: [],
        revisions: [],
      }));
    } catch (error) {
      this.handleError('DsaProblemRepository.getAll', error);
    }
  }

  async getById(id: string): Promise<ProblemDetailed | null> {
    try {
      const row = this.rawDb.getFirstSync<any>(
        'SELECT * FROM dsa_problems WHERE id = ? LIMIT 1;',
        [id]
      );
      if (!row) return null;

      const tags = this.rawDb
        .getAllSync<DsaProblemTag>(
          'SELECT * FROM dsa_problem_tags WHERE problem_id = ?;',
          [id]
        )
        .map((t) => t.tag);

      const companies = this.rawDb
        .getAllSync<DsaProblemCompany>(
          'SELECT * FROM dsa_problem_companies WHERE problem_id = ?;',
          [id]
        )
        .map((c) => c.companyName);

      const solutions = this.rawDb.getAllSync<DsaSolution>(
        'SELECT * FROM dsa_solutions WHERE problem_id = ? ORDER BY is_optimal DESC, created_at DESC;',
        [id]
      );

      const attempts = this.rawDb.getAllSync<DsaAttempt>(
        'SELECT * FROM dsa_attempts WHERE problem_id = ? ORDER BY attempt_number DESC;',
        [id]
      );

      const revisions = this.rawDb.getAllSync<DsaRevision>(
        'SELECT * FROM dsa_revisions WHERE problem_id = ? ORDER BY scheduled_date ASC;',
        [id]
      );

      return {
        id: row.id,
        title: row.title,
        problemStatement: row.problem_statement,
        problemIdExt: row.problem_id_ext,
        platform: row.platform,
        externalUrl: row.external_url,
        topicId: row.topic_id,
        topicName: row.topic_name,
        subtopicId: row.subtopic_id,
        subtopicName: row.subtopic_name,
        difficulty: row.difficulty,
        status: row.status,
        firstAttemptedAt: row.first_attempted_at,
        solvedAt: row.solved_at,
        attemptsCount: row.attempts_count || 0,
        confidenceRating: row.confidence_rating,
        personalDifficulty: row.personal_difficulty,
        approach: row.approach,
        algorithmExplanation: row.algorithm_explanation,
        timeComplexity: row.time_complexity,
        spaceComplexity: row.space_complexity,
        notes: row.notes,
        importantEdgeCases: row.important_edge_cases,
        isFavorite: row.is_favorite || 0,
        revisionStatus: row.revision_status || 'none',
        nextRevisionAt: row.next_revision_at,
        revisionIntervalStep: row.revision_interval_step || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        tags,
        companies,
        solutions,
        attempts,
        revisions,
      };
    } catch (error) {
      this.handleError('DsaProblemRepository.getById', error);
    }
  }

  async checkForDuplicate(
    title: string,
    platform: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      let query =
        'SELECT id FROM dsa_problems WHERE LOWER(title) = LOWER(?) AND platform = ?';
      const params: any[] = [title.trim(), platform];
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      query += ' LIMIT 1;';
      const row = this.rawDb.getFirstSync<{ id: string }>(query, params);
      return !!row;
    } catch (error) {
      return false;
    }
  }

  async create(data: {
    title: string;
    problemStatement?: string;
    problemIdExt?: string;
    platform: string;
    externalUrl?: string;
    topicId?: string;
    topicName: string;
    subtopicId?: string;
    subtopicName?: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status?: 'unsolved' | 'attempted' | 'solved' | 'revision';
    approach?: string;
    algorithmExplanation?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    notes?: string;
    importantEdgeCases?: string;
    tags?: string[];
    companies?: string[];
  }): Promise<string> {
    try {
      const id = generateUUID();
      const now = Date.now();
      const status = data.status || 'unsolved';
      const solvedAt = status === 'solved' ? now : null;

      this.rawDb.runSync(
        `INSERT INTO dsa_problems (
          id, title, problem_statement, problem_id_ext, platform, external_url,
          topic_id, topic_name, subtopic_id, subtopic_name, difficulty, status,
          solved_at, approach, algorithm_explanation, time_complexity,
          space_complexity, notes, important_edge_cases, is_favorite,
          revision_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'none', ?, ?);`,
        [
          id,
          data.title.trim(),
          data.problemStatement || null,
          data.problemIdExt || null,
          data.platform || 'LeetCode',
          data.externalUrl || null,
          data.topicId || null,
          data.topicName.trim(),
          data.subtopicId || null,
          data.subtopicName || null,
          data.difficulty || 'Medium',
          status,
          solvedAt,
          data.approach || null,
          data.algorithmExplanation || null,
          data.timeComplexity || null,
          data.spaceComplexity || null,
          data.notes || null,
          data.importantEdgeCases || null,
          now,
          now,
        ]
      );

      // Insert tags
      if (data.tags && data.tags.length > 0) {
        for (const tag of data.tags) {
          if (tag.trim()) {
            this.rawDb.runSync(
              'INSERT INTO dsa_problem_tags (id, problem_id, tag) VALUES (?, ?, ?);',
              [generateUUID(), id, tag.trim()]
            );
          }
        }
      }

      // Insert companies
      if (data.companies && data.companies.length > 0) {
        for (const company of data.companies) {
          if (company.trim()) {
            this.rawDb.runSync(
              'INSERT INTO dsa_problem_companies (id, problem_id, company_name) VALUES (?, ?, ?);',
              [generateUUID(), id, company.trim()]
            );
          }
        }
      }

      // If marked solved initially, trigger revision scheduling and daily activity
      if (status === 'solved') {
        await dsaRevisionRepository.scheduleInitialRevision(id, now);
        this.recordDailySolveActivity();
      }

      return id;
    } catch (error) {
      this.handleError('DsaProblemRepository.create', error);
    }
  }

  async update(
    id: string,
    data: {
      title?: string;
      problemStatement?: string;
      problemIdExt?: string;
      platform?: string;
      externalUrl?: string;
      topicId?: string;
      topicName?: string;
      subtopicId?: string;
      subtopicName?: string;
      difficulty?: 'Easy' | 'Medium' | 'Hard';
      status?: 'unsolved' | 'attempted' | 'solved' | 'revision';
      confidenceRating?: number;
      personalDifficulty?: 'Easy' | 'Medium' | 'Hard';
      approach?: string;
      algorithmExplanation?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
      notes?: string;
      importantEdgeCases?: string;
      tags?: string[];
      companies?: string[];
    }
  ): Promise<void> {
    try {
      const now = Date.now();
      const updates: string[] = [];
      const values: any[] = [];

      if (data.title !== undefined) {
        updates.push('title = ?');
        values.push(data.title.trim());
      }
      if (data.problemStatement !== undefined) {
        updates.push('problem_statement = ?');
        values.push(data.problemStatement);
      }
      if (data.problemIdExt !== undefined) {
        updates.push('problem_id_ext = ?');
        values.push(data.problemIdExt);
      }
      if (data.platform !== undefined) {
        updates.push('platform = ?');
        values.push(data.platform);
      }
      if (data.externalUrl !== undefined) {
        updates.push('external_url = ?');
        values.push(data.externalUrl);
      }
      if (data.topicId !== undefined) {
        updates.push('topic_id = ?');
        values.push(data.topicId);
      }
      if (data.topicName !== undefined) {
        updates.push('topic_name = ?');
        values.push(data.topicName.trim());
      }
      if (data.subtopicId !== undefined) {
        updates.push('subtopic_id = ?');
        values.push(data.subtopicId);
      }
      if (data.subtopicName !== undefined) {
        updates.push('subtopic_name = ?');
        values.push(data.subtopicName);
      }
      if (data.difficulty !== undefined) {
        updates.push('difficulty = ?');
        values.push(data.difficulty);
      }
      if (data.status !== undefined) {
        updates.push('status = ?');
        values.push(data.status);
        if (data.status === 'solved') {
          updates.push('solved_at = COALESCE(solved_at, ?)');
          values.push(now);
        }
      }
      if (data.confidenceRating !== undefined) {
        updates.push('confidence_rating = ?');
        values.push(data.confidenceRating);
      }
      if (data.personalDifficulty !== undefined) {
        updates.push('personal_difficulty = ?');
        values.push(data.personalDifficulty);
      }
      if (data.approach !== undefined) {
        updates.push('approach = ?');
        values.push(data.approach);
      }
      if (data.algorithmExplanation !== undefined) {
        updates.push('algorithm_explanation = ?');
        values.push(data.algorithmExplanation);
      }
      if (data.timeComplexity !== undefined) {
        updates.push('time_complexity = ?');
        values.push(data.timeComplexity);
      }
      if (data.spaceComplexity !== undefined) {
        updates.push('space_complexity = ?');
        values.push(data.spaceComplexity);
      }
      if (data.notes !== undefined) {
        updates.push('notes = ?');
        values.push(data.notes);
      }
      if (data.importantEdgeCases !== undefined) {
        updates.push('important_edge_cases = ?');
        values.push(data.importantEdgeCases);
      }

      updates.push('updated_at = ?');
      values.push(now);
      values.push(id);

      this.rawDb.runSync(
        `UPDATE dsa_problems SET ${updates.join(', ')} WHERE id = ?;`,
        values
      );

      // Update tags if provided
      if (data.tags !== undefined) {
        this.rawDb.runSync('DELETE FROM dsa_problem_tags WHERE problem_id = ?;', [
          id,
        ]);
        for (const tag of data.tags) {
          if (tag.trim()) {
            this.rawDb.runSync(
              'INSERT INTO dsa_problem_tags (id, problem_id, tag) VALUES (?, ?, ?);',
              [generateUUID(), id, tag.trim()]
            );
          }
        }
      }

      // Update companies if provided
      if (data.companies !== undefined) {
        this.rawDb.runSync(
          'DELETE FROM dsa_problem_companies WHERE problem_id = ?;',
          [id]
        );
        for (const company of data.companies) {
          if (company.trim()) {
            this.rawDb.runSync(
              'INSERT INTO dsa_problem_companies (id, problem_id, company_name) VALUES (?, ?, ?);',
              [generateUUID(), id, company.trim()]
            );
          }
        }
      }
    } catch (error) {
      this.handleError('DsaProblemRepository.update', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.rawDb.runSync('DELETE FROM dsa_problems WHERE id = ?;', [id]);
    } catch (error) {
      this.handleError('DsaProblemRepository.delete', error);
    }
  }

  async toggleFavorite(id: string): Promise<boolean> {
    try {
      const problem = this.rawDb.getFirstSync<DsaProblem>(
        'SELECT is_favorite FROM dsa_problems WHERE id = ?;',
        [id]
      );
      if (!problem) return false;

      const newFav = problem.isFavorite === 1 ? 0 : 1;
      this.rawDb.runSync(
        'UPDATE dsa_problems SET is_favorite = ?, updated_at = ? WHERE id = ?;',
        [newFav, Date.now(), id]
      );

      if (newFav === 1) {
        this.rawDb.runSync(
          'INSERT OR IGNORE INTO dsa_favorites (id, problem_id, created_at) VALUES (?, ?, ?);',
          [generateUUID(), id, Date.now()]
        );
      } else {
        this.rawDb.runSync('DELETE FROM dsa_favorites WHERE problem_id = ?;', [
          id,
        ]);
      }

      return newFav === 1;
    } catch (error) {
      this.handleError('DsaProblemRepository.toggleFavorite', error);
    }
  }

  async markAttempted(
    id: string,
    attempt: {
      status: 'failed' | 'partially_solved' | 'solved';
      timeSpentMinutes?: number;
      approachNotes?: string;
      codeSnippet?: string;
      language?: string;
    }
  ): Promise<void> {
    try {
      const now = Date.now();
      const current = this.rawDb.getFirstSync<DsaProblem>(
        'SELECT * FROM dsa_problems WHERE id = ?;',
        [id]
      );
      if (!current) throw new Error('Problem not found');

      const attemptNumber = (current.attemptsCount || 0) + 1;
      const attemptId = generateUUID();

      this.rawDb.runSync(
        `INSERT INTO dsa_attempts (
          id, problem_id, attempt_number, status, time_spent_minutes,
          approach_notes, code_snippet, language, attempted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          attemptId,
          id,
          attemptNumber,
          attempt.status,
          attempt.timeSpentMinutes || 0,
          attempt.approachNotes || null,
          attempt.codeSnippet || null,
          attempt.language || 'Java',
          now,
        ]
      );

      const firstAttempt = current.firstAttemptedAt || now;
      let newProblemStatus = current.status;
      let solvedAt = current.solvedAt;

      if (attempt.status === 'solved') {
        newProblemStatus = 'solved';
        solvedAt = solvedAt || now;
        await dsaRevisionRepository.scheduleInitialRevision(id, now);
        this.recordDailySolveActivity();
      } else if (current.status === 'unsolved') {
        newProblemStatus = 'attempted';
      }

      this.rawDb.runSync(
        `UPDATE dsa_problems SET 
          attempts_count = ?,
          first_attempted_at = ?,
          status = ?,
          solved_at = ?,
          updated_at = ?
         WHERE id = ?;`,
        [attemptNumber, firstAttempt, newProblemStatus, solvedAt, now, id]
      );

      // Log attempt in daily activity
      const todayString = new Date().toISOString().split('T')[0];
      this.rawDb.runSync(
        `INSERT INTO dsa_daily_activity (id, date_string, problems_attempted, study_minutes, updated_at)
         VALUES (?, ?, 1, ?, ?)
         ON CONFLICT(date_string) DO UPDATE SET
           problems_attempted = problems_attempted + 1,
           study_minutes = study_minutes + ?,
           updated_at = ?;`,
        [
          generateUUID(),
          todayString,
          attempt.timeSpentMinutes || 0,
          now,
          attempt.timeSpentMinutes || 0,
          now,
        ]
      );
    } catch (error) {
      this.handleError('DsaProblemRepository.markAttempted', error);
    }
  }

  async markSolved(
    id: string,
    options?: {
      confidenceRating?: number;
      approach?: string;
      notes?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
    }
  ): Promise<void> {
    try {
      const now = Date.now();
      const current = this.rawDb.getFirstSync<DsaProblem>(
        'SELECT * FROM dsa_problems WHERE id = ?;',
        [id]
      );
      if (!current) throw new Error('Problem not found');

      const isFirstSolve = current.status !== 'solved';

      const updates: string[] = ["status = 'solved'", 'solved_at = ?'];
      const values: any[] = [now];

      if (options?.confidenceRating !== undefined) {
        updates.push('confidence_rating = ?');
        values.push(options.confidenceRating);
      }
      if (options?.approach !== undefined) {
        updates.push('approach = ?');
        values.push(options.approach);
      }
      if (options?.notes !== undefined) {
        updates.push('notes = ?');
        values.push(options.notes);
      }
      if (options?.timeComplexity !== undefined) {
        updates.push('time_complexity = ?');
        values.push(options.timeComplexity);
      }
      if (options?.spaceComplexity !== undefined) {
        updates.push('space_complexity = ?');
        values.push(options.spaceComplexity);
      }

      updates.push('updated_at = ?');
      values.push(now);
      values.push(id);

      this.rawDb.runSync(
        `UPDATE dsa_problems SET ${updates.join(', ')} WHERE id = ?;`,
        values
      );

      // Record daily solve & schedule revision if it was newly solved
      if (isFirstSolve) {
        await dsaRevisionRepository.scheduleInitialRevision(id, now);
        this.recordDailySolveActivity();
      }
    } catch (error) {
      this.handleError('DsaProblemRepository.markSolved', error);
    }
  }

  private recordDailySolveActivity(): void {
    try {
      const now = Date.now();
      const todayString = new Date().toISOString().split('T')[0];

      this.rawDb.runSync(
        `INSERT INTO dsa_daily_activity (id, date_string, problems_solved, updated_at)
         VALUES (?, ?, 1, ?)
         ON CONFLICT(date_string) DO UPDATE SET
           problems_solved = problems_solved + 1,
           updated_at = ?;`,
        [generateUUID(), todayString, now, now]
      );

      // Also increment today's daily goal solved count
      this.rawDb.runSync(
        `UPDATE dsa_daily_goals 
         SET solved_count = solved_count + 1,
             is_completed = CASE WHEN solved_count + 1 >= problem_target THEN 1 ELSE 0 END,
             updated_at = ?
         WHERE target_date = ?;`,
        [now, todayString]
      );
    } catch (e) {
      console.warn('[DsaProblemRepository] Notice updating daily solve activity:', e);
    }
  }
}

export const dsaProblemRepository = new DsaProblemRepository();
