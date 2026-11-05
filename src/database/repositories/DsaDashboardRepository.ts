import { BaseRepository } from './BaseRepository';
import { dsaGoalRepository, StreakInfo } from './DsaGoalRepository';
import { dsaRevisionRepository } from './DsaRevisionRepository';

export interface DsaDashboardMetrics {
  totalProblems: number;
  solvedProblems: number;
  attemptedProblems: number;
  unsolvedProblems: number;
  pendingRevisions: number;
  totalCodingHours: number;
  streak: StreakInfo;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  dailyGoal: {
    target: number;
    completed: number;
    remaining: number;
    percentage: number;
  };
  recentSolved: Array<{
    id: string;
    title: string;
    difficulty: string;
    topicName: string;
    platform: string;
    solvedAt: number;
  }>;
  recentAttempted: Array<{
    id: string;
    title: string;
    difficulty: string;
    topicName: string;
    status: string;
    updatedAt: number;
  }>;
  recentRevised: Array<{
    id: string;
    problemTitle: string;
    difficulty: string;
    recallRating: string | null;
    completedDate: number;
  }>;
}

export interface DsaAnalyticsMetrics {
  totalSolved: number;
  totalProblems: number;
  solveRate: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  attemptToSolveRatio: number;
  avgAttemptsPerSolved: number;
  totalCodingHours: number;
  revisionCompletionRate: number;
  weakestTopics: Array<{ topic: string; solved: number; total: number; percent: number }>;
  strongestTopics: Array<{ topic: string; solved: number; total: number; percent: number }>;
  monthlyActivity: Array<{ date: string; count: number }>;
}

export class DsaDashboardRepository extends BaseRepository {
  async getDashboardMetrics(): Promise<DsaDashboardMetrics> {
    try {
      // 1. Problem counts
      const countsRow = this.rawDb.getFirstSync<{
        total: number;
        solved: number;
        attempted: number;
        unsolved: number;
        easySolved: number;
        easyTotal: number;
        mediumSolved: number;
        mediumTotal: number;
        hardSolved: number;
        hardTotal: number;
      }>(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) as solved,
          SUM(CASE WHEN status = 'attempted' THEN 1 ELSE 0 END) as attempted,
          SUM(CASE WHEN status = 'unsolved' THEN 1 ELSE 0 END) as unsolved,
          SUM(CASE WHEN difficulty = 'Easy' AND status = 'solved' THEN 1 ELSE 0 END) as easySolved,
          SUM(CASE WHEN difficulty = 'Easy' THEN 1 ELSE 0 END) as easyTotal,
          SUM(CASE WHEN difficulty = 'Medium' AND status = 'solved' THEN 1 ELSE 0 END) as mediumSolved,
          SUM(CASE WHEN difficulty = 'Medium' THEN 1 ELSE 0 END) as mediumTotal,
          SUM(CASE WHEN difficulty = 'Hard' AND status = 'solved' THEN 1 ELSE 0 END) as hardSolved,
          SUM(CASE WHEN difficulty = 'Hard' THEN 1 ELSE 0 END) as hardTotal
        FROM dsa_problems;
      `);

      // 2. Pending revisions (due today or overdue)
      const revStats = await dsaRevisionRepository.getRevisionStats();
      const pendingRevisions = revStats.dueToday + revStats.overdue;

      // 3. Coding hours & Streak
      const totalCodingHours = await dsaGoalRepository.getTotalStudyHours();
      const streak = await dsaGoalRepository.getStreak();

      // 4. Daily Goal
      const todayGoal = await dsaGoalRepository.getOrCreateTodayGoal();
      const remaining = Math.max(0, todayGoal.problemTarget - todayGoal.solvedCount);
      const percentage =
        todayGoal.problemTarget > 0
          ? Math.min(100, Math.round((todayGoal.solvedCount / todayGoal.problemTarget) * 100))
          : 0;

      // 5. Recent Solved
      const recentSolved = this.rawDb.getAllSync<any>(`
        SELECT id, title, difficulty, topic_name as topicName, platform, solved_at as solvedAt
        FROM dsa_problems 
        WHERE status = 'solved' AND solved_at IS NOT NULL
        ORDER BY solved_at DESC LIMIT 5;
      `);

      // 6. Recent Attempted
      const recentAttempted = this.rawDb.getAllSync<any>(`
        SELECT id, title, difficulty, topic_name as topicName, status, updated_at as updatedAt
        FROM dsa_problems 
        WHERE attempts_count > 0
        ORDER BY updated_at DESC LIMIT 5;
      `);

      // 7. Recent Revised
      const recentRevised = this.rawDb.getAllSync<any>(`
        SELECT 
          r.id,
          p.title as problemTitle,
          p.difficulty,
          r.recall_rating as recallRating,
          r.completed_date as completedDate
        FROM dsa_revisions r
        JOIN dsa_problems p ON r.problem_id = p.id
        WHERE r.completed_date IS NOT NULL
        ORDER BY r.completed_date DESC LIMIT 5;
      `);

      return {
        totalProblems: countsRow?.total || 0,
        solvedProblems: countsRow?.solved || 0,
        attemptedProblems: countsRow?.attempted || 0,
        unsolvedProblems: countsRow?.unsolved || 0,
        pendingRevisions,
        totalCodingHours,
        streak,
        easySolved: countsRow?.easySolved || 0,
        easyTotal: countsRow?.easyTotal || 0,
        mediumSolved: countsRow?.mediumSolved || 0,
        mediumTotal: countsRow?.mediumTotal || 0,
        hardSolved: countsRow?.hardSolved || 0,
        hardTotal: countsRow?.hardTotal || 0,
        dailyGoal: {
          target: todayGoal.problemTarget,
          completed: todayGoal.solvedCount,
          remaining,
          percentage,
        },
        recentSolved,
        recentAttempted,
        recentRevised,
      };
    } catch (error) {
      this.handleError('DsaDashboardRepository.getDashboardMetrics', error);
    }
  }

  async getAnalyticsMetrics(): Promise<DsaAnalyticsMetrics> {
    try {
      const countsRow = this.rawDb.getFirstSync<any>(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) as solved,
          SUM(CASE WHEN difficulty = 'Easy' AND status = 'solved' THEN 1 ELSE 0 END) as easySolved,
          SUM(CASE WHEN difficulty = 'Medium' AND status = 'solved' THEN 1 ELSE 0 END) as mediumSolved,
          SUM(CASE WHEN difficulty = 'Hard' AND status = 'solved' THEN 1 ELSE 0 END) as hardSolved,
          SUM(attempts_count) as totalAttempts
        FROM dsa_problems;
      `);

      const total = countsRow?.total || 0;
      const solved = countsRow?.solved || 0;
      const totalAttempts = countsRow?.totalAttempts || 0;
      const solveRate = total > 0 ? Math.round((solved / total) * 100) : 0;
      const attemptToSolveRatio = solved > 0 ? Math.round((totalAttempts / solved) * 10) / 10 : 0;

      // Avg attempts per solved question
      const avgSolvedRow = this.rawDb.getFirstSync<{ avg_attempts: number }>(`
        SELECT AVG(attempts_count) as avg_attempts FROM dsa_problems WHERE status = 'solved';
      `);
      const avgAttemptsPerSolved =
        avgSolvedRow?.avg_attempts ? Math.round(avgSolvedRow.avg_attempts * 10) / 10 : 1;

      // Revisions completion rate
      const revStats = await dsaRevisionRepository.getRevisionStats();
      const revisionCompletionRate =
        revStats.total > 0 ? Math.round((revStats.completed / revStats.total) * 100) : 0;

      // Total coding hours
      const totalCodingHours = await dsaGoalRepository.getTotalStudyHours();

      // Topic performance breakdown
      const topicStats = this.rawDb.getAllSync<{
        topic_name: string;
        total: number;
        solved: number;
      }>(`
        SELECT 
          topic_name,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'solved' THEN 1 ELSE 0 END) as solved
        FROM dsa_problems
        GROUP BY topic_name
        HAVING total > 0
        ORDER BY (CAST(solved AS REAL) / total) ASC;
      `);

      const formattedTopics = topicStats.map((t) => ({
        topic: t.topic_name,
        solved: t.solved || 0,
        total: t.total || 0,
        percent: t.total > 0 ? Math.round(((t.solved || 0) / t.total) * 100) : 0,
      }));

      const weakestTopics = formattedTopics.slice(0, 5);
      const strongestTopics = [...formattedTopics]
        .sort((a, b) => b.percent - a.percent)
        .slice(0, 5);

      // Monthly activity (last 30 days)
      const monthlyRows = this.rawDb.getAllSync<{ date_string: string; count: number }>(`
        SELECT date_string, (problems_solved + problems_attempted) as count
        FROM dsa_daily_activity
        ORDER BY date_string DESC LIMIT 30;
      `);

      const monthlyActivity = monthlyRows.map((r) => ({
        date: r.date_string,
        count: r.count,
      }));

      return {
        totalSolved: solved,
        totalProblems: total,
        solveRate,
        easySolved: countsRow?.easySolved || 0,
        mediumSolved: countsRow?.mediumSolved || 0,
        hardSolved: countsRow?.hardSolved || 0,
        attemptToSolveRatio,
        avgAttemptsPerSolved,
        totalCodingHours,
        revisionCompletionRate,
        weakestTopics,
        strongestTopics,
        monthlyActivity,
      };
    } catch (error) {
      this.handleError('DsaDashboardRepository.getAnalyticsMetrics', error);
    }
  }

  async getLiveHomeMetrics(): Promise<{
    dsaSolved: number;
    dsaTarget: number;
    dsaDailyProgressPercent: number;
    revisionDueCount: number;
    currentStreak: number;
  }> {
    try {
      const solvedRow = this.rawDb.getFirstSync<{ solved: number }>(
        "SELECT COUNT(*) as solved FROM dsa_problems WHERE status = 'solved';"
      );
      const todayGoal = await dsaGoalRepository.getOrCreateTodayGoal();
      const revStats = await dsaRevisionRepository.getRevisionStats();
      const streak = await dsaGoalRepository.getStreak();

      const dsaSolved = solvedRow?.solved || 0;
      const dsaTarget = todayGoal.problemTarget || 3;
      const dsaDailyProgressPercent =
        dsaTarget > 0 ? Math.min(100, Math.round((todayGoal.solvedCount / dsaTarget) * 100)) : 0;
      const revisionDueCount = revStats.dueToday + revStats.overdue;

      return {
        dsaSolved,
        dsaTarget,
        dsaDailyProgressPercent,
        revisionDueCount,
        currentStreak: streak.currentStreak,
      };
    } catch (error) {
      return {
        dsaSolved: 0,
        dsaTarget: 3,
        dsaDailyProgressPercent: 0,
        revisionDueCount: 0,
        currentStreak: 0,
      };
    }
  }
}

export const dsaDashboardRepository = new DsaDashboardRepository();
