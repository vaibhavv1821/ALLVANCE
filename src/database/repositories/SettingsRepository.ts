import { eq } from 'drizzle-orm';
import { BaseRepository } from './BaseRepository';
import { settings, Setting, NewSetting } from '../schema/settings';

export class SettingsRepository extends BaseRepository {
  async get(key: string): Promise<string | null> {
    try {
      const result = await this.db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .limit(1);

      return result.length > 0 ? result[0].value : null;
    } catch (error) {
      this.handleError(`getSetting(${key})`, error);
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      const now = Date.now();
      const existing = await this.get(key);

      if (existing !== null) {
        await this.db
          .update(settings)
          .set({ value, updatedAt: now })
          .where(eq(settings.key, key));
      } else {
        const newSetting: NewSetting = {
          key,
          value,
          updatedAt: now,
        };
        await this.db.insert(settings).values(newSetting);
      }
    } catch (error) {
      this.handleError(`setSetting(${key})`, error);
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const val = await this.get(key);
      if (!val) return null;
      return JSON.parse(val) as T;
    } catch {
      return null;
    }
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    await this.set(key, JSON.stringify(value));
  }

  async getAll(): Promise<Setting[]> {
    try {
      return await this.db.select().from(settings);
    } catch (error) {
      this.handleError('getAllSettings', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.db.delete(settings).where(eq(settings.key, key));
    } catch (error) {
      this.handleError(`deleteSetting(${key})`, error);
    }
  }
}

export const settingsRepository = new SettingsRepository();
