import { BaseRepository } from './BaseRepository';
import { generateUUID } from '@/utils/uuid';
import { DsaTopic, DsaSubtopic } from '../schema/dsa';

export interface TopicWithStats extends DsaTopic {
  subtopics: DsaSubtopic[];
  totalProblems: number;
  solvedProblems: number;
  subtopicsCount: number;
  completedSubtopicsCount: number;
  progressPercent: number;
}

export class DsaTopicRepository extends BaseRepository {
  async getAllWithStats(): Promise<TopicWithStats[]> {
    try {
      const rawTopics = this.rawDb.getAllSync<DsaTopic>(
        'SELECT * FROM dsa_topics ORDER BY level ASC, order_index ASC;'
      );

      const allSubtopics = this.rawDb.getAllSync<DsaSubtopic>(
        'SELECT * FROM dsa_subtopics ORDER BY order_index ASC;'
      );

      // Aggregate problems per topic
      const problemStats = this.rawDb.getAllSync<{
        topic_name: string;
        total: number;
        solved: number;
      }>(`
        SELECT 
          topic_name,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) as solved
        FROM dsa_problems
        GROUP BY topic_name;
      `);

      const problemStatsMap = new Map<string, { total: number; solved: number }>();
      for (const row of problemStats) {
        problemStatsMap.set(row.topic_name.toLowerCase(), {
          total: row.total,
          solved: row.solved,
        });
      }

      const subtopicsByTopicId = new Map<string, DsaSubtopic[]>();
      for (const sub of allSubtopics) {
        if (!subtopicsByTopicId.has(sub.topicId)) {
          subtopicsByTopicId.set(sub.topicId, []);
        }
        subtopicsByTopicId.get(sub.topicId)!.push(sub);
      }

      return rawTopics.map((topic) => {
        const subs = subtopicsByTopicId.get(topic.id) || [];
        const completedSubs = subs.filter((s) => s.isCompleted === 1).length;
        const pStat = problemStatsMap.get(topic.title.toLowerCase()) || {
          total: 0,
          solved: 0,
        };

        let progressPercent = 0;
        if (subs.length > 0) {
          progressPercent = Math.round((completedSubs / subs.length) * 100);
        } else if (pStat.total > 0) {
          progressPercent = Math.round((pStat.solved / pStat.total) * 100);
        } else if (topic.status === 'completed') {
          progressPercent = 100;
        }

        return {
          ...topic,
          subtopics: subs,
          totalProblems: pStat.total,
          solvedProblems: pStat.solved,
          subtopicsCount: subs.length,
          completedSubtopicsCount: completedSubs,
          progressPercent,
        };
      });
    } catch (error) {
      this.handleError('DsaTopicRepository.getAllWithStats', error);
    }
  }

  async getById(id: string): Promise<TopicWithStats | null> {
    try {
      const topic = this.rawDb.getFirstSync<DsaTopic>(
        'SELECT * FROM dsa_topics WHERE id = ? LIMIT 1;',
        [id]
      );
      if (!topic) return null;

      const subtopics = this.rawDb.getAllSync<DsaSubtopic>(
        'SELECT * FROM dsa_subtopics WHERE topic_id = ? ORDER BY order_index ASC;',
        [id]
      );

      const pStat = this.rawDb.getFirstSync<{ total: number; solved: number }>(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) as solved
        FROM dsa_problems 
        WHERE topic_id = ? OR LOWER(topic_name) = LOWER(?);`,
        [id, topic.title]
      ) || { total: 0, solved: 0 };

      const completedSubs = subtopics.filter((s) => s.isCompleted === 1).length;
      let progressPercent = 0;
      if (subtopics.length > 0) {
        progressPercent = Math.round((completedSubs / subtopics.length) * 100);
      } else if (pStat.total > 0) {
        progressPercent = Math.round((pStat.solved / pStat.total) * 100);
      } else if (topic.status === 'completed') {
        progressPercent = 100;
      }

      return {
        ...topic,
        subtopics,
        totalProblems: pStat.total,
        solvedProblems: pStat.solved,
        subtopicsCount: subtopics.length,
        completedSubtopicsCount: completedSubs,
        progressPercent,
      };
    } catch (error) {
      this.handleError('DsaTopicRepository.getById', error);
    }
  }

  async create(data: {
    title: string;
    level: number;
    levelName: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    mastery?: 'weak' | 'average' | 'strong';
    notes?: string;
  }): Promise<string> {
    try {
      const id = generateUUID();
      const now = Date.now();

      // Find highest order index for this level
      const maxOrderRow = this.rawDb.getFirstSync<{ max_order: number }>(
        'SELECT MAX(order_index) as max_order FROM dsa_topics WHERE level = ?;',
        [data.level]
      );
      const nextOrder = (maxOrderRow?.max_order ?? 0) + 1;

      this.rawDb.runSync(
        `INSERT INTO dsa_topics (
          id, level, level_name, title, order_index, description, priority, status, mastery, notes, is_custom, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'not_started', ?, ?, 1, ?, ?);`,
        [
          id,
          data.level,
          data.levelName,
          data.title.trim(),
          nextOrder,
          data.description || null,
          data.priority || 'medium',
          data.mastery || 'average',
          data.notes || null,
          now,
          now,
        ]
      );

      return id;
    } catch (error) {
      this.handleError('DsaTopicRepository.create', error);
    }
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      status?: 'not_started' | 'in_progress' | 'completed';
      mastery?: 'weak' | 'average' | 'strong';
      notes?: string;
    }
  ): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.title !== undefined) {
        updates.push('title = ?');
        values.push(data.title.trim());
      }
      if (data.description !== undefined) {
        updates.push('description = ?');
        values.push(data.description);
      }
      if (data.priority !== undefined) {
        updates.push('priority = ?');
        values.push(data.priority);
      }
      if (data.status !== undefined) {
        updates.push('status = ?');
        values.push(data.status);
      }
      if (data.mastery !== undefined) {
        updates.push('mastery = ?');
        values.push(data.mastery);
      }
      if (data.notes !== undefined) {
        updates.push('notes = ?');
        values.push(data.notes);
      }

      if (updates.length === 0) return;

      updates.push('updated_at = ?');
      values.push(Date.now());
      values.push(id);

      this.rawDb.runSync(
        `UPDATE dsa_topics SET ${updates.join(', ')} WHERE id = ?;`,
        values
      );
    } catch (error) {
      this.handleError('DsaTopicRepository.update', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.rawDb.runSync('DELETE FROM dsa_topics WHERE id = ?;', [id]);
    } catch (error) {
      this.handleError('DsaTopicRepository.delete', error);
    }
  }

  async addSubtopic(topicId: string, title: string): Promise<string> {
    try {
      const id = generateUUID();
      const now = Date.now();

      const maxOrder = this.rawDb.getFirstSync<{ max_order: number }>(
        'SELECT MAX(order_index) as max_order FROM dsa_subtopics WHERE topic_id = ?;',
        [topicId]
      );
      const nextOrder = (maxOrder?.max_order ?? 0) + 1;

      this.rawDb.runSync(
        `INSERT INTO dsa_subtopics (id, topic_id, title, order_index, is_completed, created_at, updated_at)
         VALUES (?, ?, ?, ?, 0, ?, ?);`,
        [id, topicId, title.trim(), nextOrder, now, now]
      );

      return id;
    } catch (error) {
      this.handleError('DsaTopicRepository.addSubtopic', error);
    }
  }

  async toggleSubtopic(id: string, isCompleted: boolean): Promise<void> {
    try {
      this.rawDb.runSync(
        'UPDATE dsa_subtopics SET is_completed = ?, updated_at = ? WHERE id = ?;',
        [isCompleted ? 1 : 0, Date.now(), id]
      );
    } catch (error) {
      this.handleError('DsaTopicRepository.toggleSubtopic', error);
    }
  }

  async deleteSubtopic(id: string): Promise<void> {
    try {
      this.rawDb.runSync('DELETE FROM dsa_subtopics WHERE id = ?;', [id]);
    } catch (error) {
      this.handleError('DsaTopicRepository.deleteSubtopic', error);
    }
  }
}

export const dsaTopicRepository = new DsaTopicRepository();
