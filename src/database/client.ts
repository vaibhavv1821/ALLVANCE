import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const DB_NAME = 'allvance.db';

let sqliteDbInstance: SQLite.SQLiteDatabase | null = null;
let drizzleDbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getRawDb(): SQLite.SQLiteDatabase {
  if (!sqliteDbInstance) {
    sqliteDbInstance = SQLite.openDatabaseSync(DB_NAME);
    // Enforce foreign key constraints and enable WAL mode for performance & safety
    sqliteDbInstance.execSync('PRAGMA foreign_keys = ON;');
    sqliteDbInstance.execSync('PRAGMA journal_mode = WAL;');
  }
  return sqliteDbInstance;
}

export function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!drizzleDbInstance) {
    const rawDb = getRawDb();
    drizzleDbInstance = drizzle(rawDb, { schema });
  }
  return drizzleDbInstance;
}
