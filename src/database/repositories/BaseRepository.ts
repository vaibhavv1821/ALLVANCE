import { getDb, getRawDb } from '../client';

export abstract class BaseRepository {
  protected get db() {
    return getDb();
  }

  protected get rawDb() {
    return getRawDb();
  }

  protected handleError(context: string, error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[BaseRepository Error - ${context}]:`, error);
    throw new Error(`Database error in ${context}: ${message}`);
  }
}
