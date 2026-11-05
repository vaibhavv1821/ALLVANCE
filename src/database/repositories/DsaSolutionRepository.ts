import { BaseRepository } from './BaseRepository';
import { generateUUID } from '@/utils/uuid';
import { DsaSolution } from '../schema/dsa';

export class DsaSolutionRepository extends BaseRepository {
  async getSolutionsForProblem(problemId: string): Promise<DsaSolution[]> {
    try {
      return this.rawDb.getAllSync<DsaSolution>(
        'SELECT * FROM dsa_solutions WHERE problem_id = ? ORDER BY is_optimal DESC, created_at DESC;',
        [problemId]
      );
    } catch (error) {
      this.handleError('DsaSolutionRepository.getSolutionsForProblem', error);
    }
  }

  async getById(id: string): Promise<DsaSolution | null> {
    try {
      return (
        this.rawDb.getFirstSync<DsaSolution>(
          'SELECT * FROM dsa_solutions WHERE id = ? LIMIT 1;',
          [id]
        ) || null
      );
    } catch (error) {
      this.handleError('DsaSolutionRepository.getById', error);
    }
  }

  async create(data: {
    problemId: string;
    title: string;
    language: string;
    code: string;
    approach?: string;
    explanation?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    edgeCases?: string;
    mistakes?: string;
    isOptimal?: boolean;
  }): Promise<string> {
    try {
      const id = generateUUID();
      const now = Date.now();

      // If marked optimal, unmark existing
      if (data.isOptimal) {
        this.rawDb.runSync(
          'UPDATE dsa_solutions SET is_optimal = 0 WHERE problem_id = ?;',
          [data.problemId]
        );
      }

      this.rawDb.runSync(
        `INSERT INTO dsa_solutions (
          id, problem_id, title, language, code, approach, explanation,
          time_complexity, space_complexity, edge_cases, mistakes, is_optimal,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          id,
          data.problemId,
          data.title.trim(),
          data.language || 'Java',
          data.code,
          data.approach || null,
          data.explanation || null,
          data.timeComplexity || null,
          data.spaceComplexity || null,
          data.edgeCases || null,
          data.mistakes || null,
          data.isOptimal ? 1 : 0,
          now,
          now,
        ]
      );

      // Update parent problem timestamp
      this.rawDb.runSync('UPDATE dsa_problems SET updated_at = ? WHERE id = ?;', [
        now,
        data.problemId,
      ]);

      return id;
    } catch (error) {
      this.handleError('DsaSolutionRepository.create', error);
    }
  }

  async update(
    id: string,
    data: {
      title?: string;
      language?: string;
      code?: string;
      approach?: string;
      explanation?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
      edgeCases?: string;
      mistakes?: string;
      isOptimal?: boolean;
    }
  ): Promise<void> {
    try {
      const existing = await this.getById(id);
      if (!existing) return;

      if (data.isOptimal) {
        this.rawDb.runSync(
          'UPDATE dsa_solutions SET is_optimal = 0 WHERE problem_id = ?;',
          [existing.problemId]
        );
      }

      const updates: string[] = [];
      const values: any[] = [];

      if (data.title !== undefined) {
        updates.push('title = ?');
        values.push(data.title.trim());
      }
      if (data.language !== undefined) {
        updates.push('language = ?');
        values.push(data.language);
      }
      if (data.code !== undefined) {
        updates.push('code = ?');
        values.push(data.code);
      }
      if (data.approach !== undefined) {
        updates.push('approach = ?');
        values.push(data.approach);
      }
      if (data.explanation !== undefined) {
        updates.push('explanation = ?');
        values.push(data.explanation);
      }
      if (data.timeComplexity !== undefined) {
        updates.push('time_complexity = ?');
        values.push(data.timeComplexity);
      }
      if (data.spaceComplexity !== undefined) {
        updates.push('space_complexity = ?');
        values.push(data.spaceComplexity);
      }
      if (data.edgeCases !== undefined) {
        updates.push('edge_cases = ?');
        values.push(data.edgeCases);
      }
      if (data.mistakes !== undefined) {
        updates.push('mistakes = ?');
        values.push(data.mistakes);
      }
      if (data.isOptimal !== undefined) {
        updates.push('is_optimal = ?');
        values.push(data.isOptimal ? 1 : 0);
      }

      if (updates.length === 0) return;

      updates.push('updated_at = ?');
      values.push(Date.now());
      values.push(id);

      this.rawDb.runSync(
        `UPDATE dsa_solutions SET ${updates.join(', ')} WHERE id = ?;`,
        values
      );
    } catch (error) {
      this.handleError('DsaSolutionRepository.update', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.rawDb.runSync('DELETE FROM dsa_solutions WHERE id = ?;', [id]);
    } catch (error) {
      this.handleError('DsaSolutionRepository.delete', error);
    }
  }
}

export const dsaSolutionRepository = new DsaSolutionRepository();
