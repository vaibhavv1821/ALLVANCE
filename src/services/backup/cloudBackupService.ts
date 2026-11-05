import { supabase, isSupabaseConfigured } from '@/services/supabase/client';
import { BackupSerializer, BackupPayload, BackupMetadata } from './backupSerializer';
import { getRawDb } from '@/database/client';

export interface CloudBackupItem {
  id: string;
  userId: string;
  backupVersion: string;
  schemaVersion: number;
  appVersion: string;
  deviceId: string;
  deviceName: string;
  checksum: string;
  sizeBytes: number;
  summary: any;
  createdAt: string;
}

export interface BackupOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class CloudBackupService {
  /**
   * Generates a local snapshot and uploads it to Supabase under the authenticated user's ID.
   */
  static async uploadBackup(
    onProgress?: (percent: number) => void
  ): Promise<BackupOperationResult<CloudBackupItem>> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase credentials are not configured.' };
      }

      onProgress?.(10);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User is not authenticated. Please sign in to backup.' };
      }

      onProgress?.(30);
      // Create full SQLite snapshot
      const snapshot = await BackupSerializer.createSnapshot();

      onProgress?.(60);
      // Insert into user_backups table
      const { data, error } = await supabase
        .from('user_backups')
        .insert({
          user_id: user.id,
          backup_version: snapshot.metadata.backupVersion,
          schema_version: snapshot.metadata.schemaVersion,
          app_version: snapshot.metadata.appVersion,
          device_id: snapshot.metadata.deviceId,
          device_name: snapshot.metadata.deviceName,
          checksum: snapshot.metadata.checksum,
          size_bytes: snapshot.metadata.sizeBytes,
          summary: snapshot.metadata.summary,
          payload: snapshot.tables,
          created_at: new Date(snapshot.metadata.createdAt).toISOString(),
        })
        .select('id, user_id, backup_version, schema_version, app_version, device_id, device_name, checksum, size_bytes, summary, created_at')
        .single();

      if (error) {
        console.error('[CloudBackupService.uploadBackup] Supabase insert error:', error);
        return { success: false, error: error.message };
      }

      onProgress?.(90);
      // Update local last backup timestamp
      const rawDb = getRawDb();
      rawDb.runSync(
        "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('last_cloud_backup_time', ?, ?);",
        [String(snapshot.metadata.createdAt), Date.now()]
      );

      onProgress?.(100);
      return {
        success: true,
        data: {
          id: data.id,
          userId: data.user_id,
          backupVersion: data.backup_version,
          schemaVersion: data.schema_version,
          appVersion: data.app_version,
          deviceId: data.device_id,
          deviceName: data.device_name,
          checksum: data.checksum,
          sizeBytes: data.size_bytes,
          summary: data.summary,
          createdAt: data.created_at,
        },
      };
    } catch (err: any) {
      console.error('[CloudBackupService.uploadBackup] Exception:', err);
      return { success: false, error: err?.message || 'Failed to upload cloud backup.' };
    }
  }

  /**
   * Fetches the list of all available cloud backups for the authenticated user.
   */
  static async listBackups(): Promise<BackupOperationResult<CloudBackupItem[]>> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase is not configured.' };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Please sign in to view cloud backups.' };
      }

      const { data, error } = await supabase
        .from('user_backups')
        .select('id, user_id, backup_version, schema_version, app_version, device_id, device_name, checksum, size_bytes, summary, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      const items: CloudBackupItem[] = (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        backupVersion: row.backup_version,
        schemaVersion: row.schema_version,
        appVersion: row.app_version,
        deviceId: row.device_id,
        deviceName: row.device_name,
        checksum: row.checksum,
        sizeBytes: row.size_bytes,
        summary: row.summary,
        createdAt: row.created_at,
      }));

      return { success: true, data: items };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to list backups.' };
    }
  }

  /**
   * Deletes a specific cloud backup.
   */
  static async deleteBackup(backupId: string): Promise<BackupOperationResult<void>> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase is not configured.' };
      }

      const { error } = await supabase
        .from('user_backups')
        .delete()
        .eq('id', backupId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete backup.' };
    }
  }

  /**
   * Downloads and safely restores a cloud backup into the local SQLite database.
   * Includes schema check, checksum integrity validation, and atomic transactional rollback on failure.
   */
  static async restoreBackup(backupId: string): Promise<BackupOperationResult<{ restoredTables: number; restoredRecords: number }>> {
    const rawDb = getRawDb();

    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase is not configured.' };
      }

      // 1. Fetch full backup record including payload
      const { data, error } = await supabase
        .from('user_backups')
        .select('*')
        .eq('id', backupId)
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Backup not found in cloud storage.' };
      }

      const payload: BackupPayload = {
        metadata: {
          id: data.id,
          backupVersion: data.backup_version,
          schemaVersion: data.schema_version,
          appVersion: data.app_version,
          deviceId: data.device_id,
          deviceName: data.device_name,
          createdAt: new Date(data.created_at).getTime(),
          checksum: data.checksum,
          sizeBytes: data.size_bytes,
          summary: data.summary,
        },
        tables: data.payload,
      };

      // 2. Validate payload structure and SHA-256 checksum
      const validation = await BackupSerializer.validatePayload(payload);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // 3. Take in-memory rollback snapshot of all current tables before touching DB
      const currentTables = rawDb.getAllSync<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'schema_migrations';"
      );

      const rollbackSnapshot: Record<string, any[]> = {};
      for (const t of currentTables) {
        try {
          rollbackSnapshot[t.name] = rawDb.getAllSync(`SELECT * FROM ${t.name};`);
        } catch {
          rollbackSnapshot[t.name] = [];
        }
      }

      // 4. Execute atomic SQLite restoration in a transaction
      let restoredTablesCount = 0;
      let restoredRecordsCount = 0;

      rawDb.execSync('PRAGMA foreign_keys = OFF;');
      rawDb.execSync('BEGIN TRANSACTION;');

      try {
        for (const [tableName, rows] of Object.entries(payload.tables)) {
          // Check if table exists in current SQLite schema
          const tableExists = rawDb.getFirstSync(
            "SELECT name FROM sqlite_master WHERE type='table' AND name = ?;",
            [tableName]
          );

          if (!tableExists) {
            console.warn(`[restoreBackup] Skipping table ${tableName} as it does not exist in local schema.`);
            continue;
          }

          // Clear table contents
          rawDb.execSync(`DELETE FROM ${tableName};`);

          if (Array.isArray(rows) && rows.length > 0) {
            const columns = Object.keys(rows[0]);
            const placeholders = columns.map(() => '?').join(', ');
            const insertSql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders});`;
            const stmt = rawDb.prepareSync(insertSql);

            try {
              for (const row of rows) {
                const values = columns.map((col) => row[col] !== undefined ? row[col] : null);
                stmt.executeSync(values);
                restoredRecordsCount++;
              }
            } finally {
              stmt.finalizeSync();
            }
          }

          restoredTablesCount++;
        }

        rawDb.execSync('COMMIT;');
        rawDb.execSync('PRAGMA foreign_keys = ON;');

        // Record restore event in local settings
        rawDb.runSync(
          "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('last_cloud_restore_time', ?, ?);",
          [String(Date.now()), Date.now()]
        );

        return {
          success: true,
          data: {
            restoredTables: restoredTablesCount,
            restoredRecords: restoredRecordsCount,
          },
        };
      } catch (dbErr: any) {
        console.error('[restoreBackup] Transaction failed, initiating rollback:', dbErr);
        rawDb.execSync('ROLLBACK;');
        rawDb.execSync('PRAGMA foreign_keys = ON;');

        // Emergency rollback using in-memory snapshot
        try {
          rawDb.execSync('PRAGMA foreign_keys = OFF;');
          rawDb.execSync('BEGIN TRANSACTION;');
          for (const [tName, tRows] of Object.entries(rollbackSnapshot)) {
            rawDb.execSync(`DELETE FROM ${tName};`);
            if (tRows.length > 0) {
              const cols = Object.keys(tRows[0]);
              const q = cols.map(() => '?').join(', ');
              const rStmt = rawDb.prepareSync(`INSERT INTO ${tName} (${cols.join(', ')}) VALUES (${q});`);
              try {
                for (const r of tRows) {
                  rStmt.executeSync(cols.map((c) => r[c] !== undefined ? r[c] : null));
                }
              } finally {
                rStmt.finalizeSync();
              }
            }
          }
          rawDb.execSync('COMMIT;');
          rawDb.execSync('PRAGMA foreign_keys = ON;');
        } catch (rollbackErr) {
          console.error('[restoreBackup] Catastrophic rollback error:', rollbackErr);
        }

        return {
          success: false,
          error: `Restore transaction aborted. Local database was safely preserved. Error: ${dbErr?.message}`,
        };
      }
    } catch (outerErr: any) {
      console.error('[restoreBackup] Exception:', outerErr);
      return { success: false, error: outerErr?.message || 'Failed to restore backup.' };
    }
  }

  /**
   * Reads the timestamp of the last successful cloud backup from local settings.
   */
  static getLastBackupTimestamp(): number | null {
    try {
      const rawDb = getRawDb();
      const row = rawDb.getFirstSync<{ value: string }>(
        "SELECT value FROM settings WHERE key = 'last_cloud_backup_time';"
      );
      if (row?.value) {
        const val = parseInt(row.value, 10);
        return isNaN(val) ? null : val;
      }
      return null;
    } catch {
      return null;
    }
  }
}
