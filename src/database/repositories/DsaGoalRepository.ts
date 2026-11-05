import { BaseRepository } from './BaseRepository';
import { generateUUID } from '@/utils/uuid';
import { DsaDailyGoal, DsaStudySession, DsaDailyActivity } from '../schema/dsa';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // problems solved + attempted
  studyMinutes: number;
  level: 0 | 1 | 2 | 3 | 4; // intensity level for heatmap UI
}

export interface WeeklyProgressDay {
  dayName: string; // Mon, Tue, etc.
  date: string;
  solved: number;
  target: number;
}

export class DsaGoalRepository extends BaseRepository {
  private getLocalDateString(d: Date = new Date()): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getOrCreateTodayGoal(): Promise<DsaDailyGoal> {
    try {
      const today = this.getLocalDateString();
      let goal = this.rawDb.getFirstSync<DsaDailyGoal>(
        'SELECT * FROM dsa_daily_goals WHERE target_date = ? LIMIT 1;',
        [today]
      );

      if (!goal) {
        // Fetch most recent goal to carry over user-customized targets
        const lastGoal = this.rawDb.getFirstSync<DsaDailyGoal>(
          'SELECT * FROM dsa_daily_goals ORDER BY target_date DESC LIMIT 1;'
        );

        const problemTarget = lastGoal?.problemTarget ?? 3;
        const durationTarget = lastGoal?.durationTargetMinutes ?? 60;
        const weeklyTarget = lastGoal?.weeklyProblemTarget ?? 20;
        const preferredDiff = lastGoal?.preferredDifficulty ?? 'All';

        // Count problems actually solved today so far
        const todaySolvedRow = this.rawDb.getFirstSync<{ count: number }>(`
          SELECT COUNT(*) as count 
          FROM dsa_problems 
          WHERE solved_at IS NOT NULL 
            AND date(solved_at / 1000, 'unixepoch', 'localtime') = ?;
        `, [today]);
        const initialSolved = todaySolvedRow?.count || 0;

        const id = generateUUID();
        const now = Date.now();

        this.rawDb.runSync(
          `INSERT INTO dsa_daily_goals (
            id, target_date, problem_target, duration_target_minutes,
            weekly_problem_target, preferred_difficulty, preferred_topics,
            solved_count, study_duration_minutes, is_completed, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, null, ?, 0, ?, ?, ?);`,
          [
            id,
            today,
            problemTarget,
            durationTarget,
            weeklyTarget,
            preferredDiff,
            initialSolved,
            initialSolved >= problemTarget ? 1 : 0,
            now,
            now,
          ]
        );

        goal = this.rawDb.getFirstSync<DsaDailyGoal>(
          'SELECT * FROM dsa_daily_goals WHERE id = ?;',
          [id]
        );
      }

      return goal!;
    } catch (error) {
      this.handleError('DsaGoalRepository.getOrCreateTodayGoal', error);
    }
  }

  async updateTodayGoal(updates: {
    problemTarget?: number;
    durationTargetMinutes?: number;
    weeklyProblemTarget?: number;
    preferredDifficulty?: string;
  }): Promise<void> {
    try {
      const todayGoal = await this.getOrCreateTodayGoal();
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.problemTarget !== undefined) {
        fields.push('problem_target = ?');
        values.push(updates.problemTarget);
      }
      if (updates.durationTargetMinutes !== undefined) {
        fields.push('duration_target_minutes = ?');
        values.push(updates.durationTargetMinutes);
      }
      if (updates.weeklyProblemTarget !== undefined) {
        fields.push('weekly_problem_target = ?');
        values.push(updates.weeklyProblemTarget);
      }
      if (updates.preferredDifficulty !== undefined) {
        fields.push('preferred_difficulty = ?');
        values.push(updates.preferredDifficulty);
      }

      if (fields.length === 0) return;

      fields.push('updated_at = ?');
      values.push(Date.now());
      values.push(todayGoal.id);

      this.rawDb.runSync(
        `UPDATE dsa_daily_goals SET ${fields.join(', ')} WHERE id = ?;`,
        values
      );

      // Recalculate is_completed
      this.rawDb.runSync(
        `UPDATE dsa_daily_goals 
         SET is_completed = CASE WHEN solved_count >= problem_target THEN 1 ELSE 0 END 
         WHERE id = ?;`,
        [todayGoal.id]
      );
    } catch (error) {
      this.handleError('DsaGoalRepository.updateTodayGoal', error);
    }
  }

  async getStreak(): Promise<StreakInfo> {
    try {
      const rows = this.rawDb.getAllSync<{ date_string: string; total_activity: number }>(`
        SELECT 
          date_string,
          (problems_solved + problems_attempted + revisions_completed) as total_activity
        FROM dsa_daily_activity
        WHERE (problems_solved > 0 OR problems_attempted > 0 OR revisions_completed > 0 OR study_minutes >= 10)
        ORDER BY date_string DESC;
      `);

      if (rows.length === 0) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null,
          isActiveToday: false,
        };
      }

      const activeDates = new Set(rows.map((r) => r.date_string));
      const today = this.getLocalDateString();
      const isActiveToday = activeDates.has(today);

      // Check current streak starting from today or yesterday
      let checkDate = new Date();
      if (!isActiveToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      let currentStreak = 0;
      while (true) {
        const dStr = this.getLocalDateString(checkDate);
        if (activeDates.has(dStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate longest streak historically
      const sortedAscDates = Array.from(activeDates).sort();
      let longestStreak = 0;
      let tempStreak = 0;
      let prevTimestamp = 0;

      for (const dStr of sortedAscDates) {
        const parts = dStr.split('-').map(Number);
        const currTime = new Date(parts[0], parts[1] - 1, parts[2]).getTime();

        if (tempStreak === 0) {
          tempStreak = 1;
        } else {
          const diffDays = Math.round((currTime - prevTimestamp) / (24 * 60 * 60 * 1000));
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
        }

        prevTimestamp = currTime;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      }

      return {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        lastActiveDate: rows[0]?.date_string || null,
        isActiveToday,
      };
    } catch (error) {
      this.handleError('DsaGoalRepository.getStreak', error);
    }
  }

  async getWeeklyProgress(): Promise<WeeklyProgressDay[]> {
    try {
      const todayGoal = await this.getOrCreateTodayGoal();
      const result: WeeklyProgressDay[] = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = this.getLocalDateString(d);
        const dayName = dayNames[d.getDay()];

        const activity = this.rawDb.getFirstSync<DsaDailyActivity>(
          'SELECT * FROM dsa_daily_activity WHERE date_string = ? LIMIT 1;',
          [dStr]
        );

        result.push({
          dayName,
          date: dStr,
          solved: activity?.problemsSolved || 0,
          target: todayGoal.problemTarget,
        });
      }

      return result;
    } catch (error) {
      this.handleError('DsaGoalRepository.getWeeklyProgress', error);
    }
  }

  async getCalendarHeatmap(daysCount: number = 60): Promise<HeatmapDay[]> {
    try {
      const result: HeatmapDay[] = [];
      const rows = this.rawDb.getAllSync<DsaDailyActivity>(
        'SELECT * FROM dsa_daily_activity ORDER BY date_string DESC LIMIT ?;',
        [daysCount]
      );

      const activityMap = new Map<string, DsaDailyActivity>();
      for (const r of rows) {
        activityMap.set(r.dateString, r);
      }

      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = this.getLocalDateString(d);
        const act = activityMap.get(dStr);

        const count = (act?.problemsSolved || 0) + (act?.problemsAttempted || 0);
        const studyMinutes = act?.studyMinutes || 0;

        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (count >= 5 || studyMinutes >= 120) {
          level = 4;
        } else if (count >= 3 || studyMinutes >= 60) {
          level = 3;
        } else if (count >= 2 || studyMinutes >= 30) {
          level = 2;
        } else if (count >= 1 || studyMinutes >= 10) {
          level = 1;
        }

        result.push({
          date: dStr,
          count,
          studyMinutes,
          level,
        });
      }

      return result;
    } catch (error) {
      this.handleError('DsaGoalRepository.getCalendarHeatmap', error);
    }
  }

  async recordStudySession(data: {
    durationMinutes: number;
    topicId?: string;
    problemsSolved?: number;
    notes?: string;
  }): Promise<string> {
    try {
      const id = generateUUID();
      const now = Date.now();
      const today = this.getLocalDateString();

      this.rawDb.runSync(
        `INSERT INTO dsa_study_sessions (
          id, start_time, end_time, duration_minutes, topic_id,
          problems_solved, notes, date_string, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          id,
          now - data.durationMinutes * 60 * 1000,
          now,
          data.durationMinutes,
          data.topicId || null,
          data.problemsSolved || 0,
          data.notes || null,
          today,
          now,
        ]
      );

      // Update daily activity
      this.rawDb.runSync(
        `INSERT INTO dsa_daily_activity (id, date_string, study_minutes, problems_solved, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(date_string) DO UPDATE SET
           study_minutes = study_minutes + ?,
           problems_solved = problems_solved + ?,
           updated_at = ?;`,
        [
          generateUUID(),
          today,
          data.durationMinutes,
          data.problemsSolved || 0,
          now,
          data.durationMinutes,
          data.problemsSolved || 0,
          now,
        ]
      );

      // Update today goal study minutes
      this.rawDb.runSync(
        `UPDATE dsa_daily_goals 
         SET study_duration_minutes = study_duration_minutes + ?,
             updated_at = ?
         WHERE target_date = ?;`,
        [data.durationMinutes, now, today]
      );

      return id;
    } catch (error) {
      this.handleError('DsaGoalRepository.recordStudySession', error);
    }
  }

  async getTotalStudyHours(): Promise<number> {
    try {
      const row = this.rawDb.getFirstSync<{ total_minutes: number }>(
        'SELECT SUM(study_minutes) as total_minutes FROM dsa_daily_activity;'
      );
      const minutes = row?.total_minutes || 0;
      return Math.round((minutes / 60) * 10) / 10;
    } catch (error) {
      return 0;
    }
  }
}

export const dsaGoalRepository = new DsaGoalRepository();
