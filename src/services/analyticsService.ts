import { getRawDb } from '@/database/client';

export const analyticsService = {
  logActivity(action: string, module: string, details?: string): void {
    try {
      const rawDb = getRawDb();
      rawDb.runSync(
        'INSERT INTO activity_logs (action, module, details, timestamp) VALUES (?, ?, ?, ?);',
        [action, module, details || null, Date.now()]
      );
    } catch (e) {
      console.warn('[analyticsService] Failed to log activity:', e);
    }
  },

  getRecentActivities(limit = 10): Array<{ id: number; action: string; module: string; details: string | null; timestamp: number }> {
    try {
      const rawDb = getRawDb();
      return rawDb.getAllSync(
        'SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT ?;',
        [limit]
      );
    } catch (e) {
      console.warn('[analyticsService] Failed to fetch activities:', e);
      return [];
    }
  },
};
