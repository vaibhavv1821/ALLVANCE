import { runMigrations } from './migrations';
import { getDb, getRawDb } from './client';

export * from './client';
export * as schema from './schema';
export * from './repositories';

export interface DatabaseInitResult {
  success: boolean;
  appliedCount: number;
  userVersion: number;
  error?: string;
}

export function initDatabase(): DatabaseInitResult {
  try {
    const rawDb = getRawDb();
    const migrationResult = runMigrations();

    const versionRow = rawDb.getFirstSync<{ user_version: number }>(
      'PRAGMA user_version;'
    );
    const userVersion = versionRow?.user_version ?? 0;

    return {
      success: migrationResult.success,
      appliedCount: migrationResult.appliedCount,
      userVersion,
      error: migrationResult.error,
    };
  } catch (error: any) {
    console.error('[ALLVANCE Database] Initialization failure:', error);
    return {
      success: false,
      appliedCount: 0,
      userVersion: 0,
      error: error?.message || 'Database init failed',
    };
  }
}
