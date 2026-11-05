import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import { getRawDb } from '@/database/client';
import { generateUUID } from '@/utils/uuid';

export const BACKUP_FORMAT_VERSION = '1.0.0';
export const CURRENT_SCHEMA_VERSION = 5;

export interface BackupSummary {
  totalTables: number;
  totalRecords: number;
  companiesCount: number;
  applicationsCount: number;
  dsaProblemsCount: number;
  resumesCount: number;
  interviewQuestionsCount: number;
  mockInterviewsCount: number;
  tasksCount: number;
  notesCount: number;
}

export interface BackupMetadata {
  id?: string;
  backupVersion: string;
  schemaVersion: number;
  appVersion: string;
  deviceId: string;
  deviceName: string;
  createdAt: number;
  checksum: string;
  sizeBytes: number;
  summary: BackupSummary;
}

export interface BackupPayload {
  metadata: BackupMetadata;
  tables: Record<string, any[]>;
}

export class BackupSerializer {
  /**
   * Retrieves or creates a persistent unique device ID stored in SQLite settings.
   */
  static getDeviceId(): string {
    try {
      const rawDb = getRawDb();
      const row = rawDb.getFirstSync<{ value: string }>(
        "SELECT value FROM settings WHERE key = 'allvance_device_id';"
      );
      if (row?.value) {
        return row.value;
      }
      const newId = generateUUID();
      rawDb.runSync(
        "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES ('allvance_device_id', ?, ?);",
        [newId, Date.now()]
      );
      return newId;
    } catch {
      return generateUUID();
    }
  }

  /**
   * Generates a device name label for display.
   */
  static getDeviceName(): string {
    const os = Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : 'Web';
    return `${os} Device (ALLVANCE)`;
  }

  /**
   * Creates a consistent serialized snapshot of all user-owned tables in SQLite.
   */
  static async createSnapshot(): Promise<BackupPayload> {
    const rawDb = getRawDb();

    // Discover all existing user tables in SQLite
    const tablesQuery = rawDb.getAllSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'schema_migrations';"
    );

    const tables: Record<string, any[]> = {};
    let totalRecords = 0;

    for (const t of tablesQuery) {
      try {
        const rows = rawDb.getAllSync(`SELECT * FROM ${t.name};`);
        tables[t.name] = rows;
        totalRecords += rows.length;
      } catch (err) {
        console.warn(`[BackupSerializer] Could not serialize table ${t.name}:`, err);
        tables[t.name] = [];
      }
    }

    // Build human-readable summary counts
    const summary: BackupSummary = {
      totalTables: tablesQuery.length,
      totalRecords,
      companiesCount: tables['companies']?.length ?? 0,
      applicationsCount: tables['applications']?.length ?? 0,
      dsaProblemsCount: tables['dsa_problems']?.length ?? 0,
      resumesCount: tables['resumes']?.length ?? 0,
      interviewQuestionsCount: tables['interview_prep_questions']?.length ?? 0,
      mockInterviewsCount: tables['mock_interviews']?.length ?? 0,
      tasksCount: tables['tasks']?.length ?? 0,
      notesCount: tables['notes']?.length ?? 0,
    };

    const payloadString = JSON.stringify(tables);
    const sizeBytes = new Blob([payloadString]).size;

    // Cryptographic SHA-256 checksum for tamper & corruption detection
    const checksum = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      payloadString
    );

    const metadata: BackupMetadata = {
      backupVersion: BACKUP_FORMAT_VERSION,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      appVersion: '1.0.0',
      deviceId: this.getDeviceId(),
      deviceName: this.getDeviceName(),
      createdAt: Date.now(),
      checksum,
      sizeBytes,
      summary,
    };

    return {
      metadata,
      tables,
    };
  }

  /**
   * Validates the integrity and schema compatibility of a backup payload before restoring.
   */
  static async validatePayload(payload: BackupPayload): Promise<{ valid: boolean; error?: string }> {
    if (!payload || !payload.metadata || !payload.tables) {
      return { valid: false, error: 'Malformed backup structure: metadata or tables missing.' };
    }

    const { metadata, tables } = payload;

    // Check schema compatibility
    if (metadata.schemaVersion > CURRENT_SCHEMA_VERSION) {
      return {
        valid: false,
        error: `Incompatible backup schema (v${metadata.schemaVersion}). Please update ALLVANCE to the latest version to restore this backup.`,
      };
    }

    // Verify SHA-256 Checksum
    try {
      const payloadString = JSON.stringify(tables);
      const computedChecksum = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        payloadString
      );

      if (computedChecksum !== metadata.checksum) {
        return {
          valid: false,
          error: 'Integrity check failed: Checksum mismatch. The backup payload may be corrupted.',
        };
      }
    } catch (err: any) {
      return { valid: false, error: `Failed to compute integrity checksum: ${err?.message}` };
    }

    return { valid: true };
  }
}
