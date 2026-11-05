import { AppState, AppStateStatus } from 'react-native';
import * as Network from 'expo-network';
import { CloudBackupService } from './cloudBackupService';
import { isSupabaseConfigured } from '@/services/supabase/client';

export type AutoBackupFrequency = 'immediate' | 'daily' | 'manual';

export class AutoBackupService {
  private static debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private static retryTimer: ReturnType<typeof setTimeout> | null = null;
  private static hasPendingChanges = false;
  private static isBackingUp = false;
  private static retryAttempts = 0;
  private static maxRetries = 3;
  private static frequency: AutoBackupFrequency = 'immediate';
  private static enabled = true;
  private static statusListeners: Array<(status: string, error?: string) => void> = [];

  /**
   * Initializes AppState and network listeners for automatic foreground & connectivity backups.
   */
  static init() {
    // Listen for app coming to the foreground
    AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        this.onAppForeground();
      }
    });
  }

  static addStatusListener(listener: (status: string, error?: string) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private static notify(status: string, error?: string) {
    for (const listener of this.statusListeners) {
      try {
        listener(status, error);
      } catch (e) {
        console.warn('[AutoBackupService] Listener error:', e);
      }
    }
  }

  static setConfig(enabled: boolean, frequency: AutoBackupFrequency) {
    this.enabled = enabled;
    this.frequency = frequency;
  }

  /**
   * Marks that meaningful user data was written in SQLite.
   * Debounces the cloud upload so rapid writes don't flood the network.
   */
  static markDataChanged() {
    this.hasPendingChanges = true;

    if (!this.enabled || this.frequency === 'manual') {
      return;
    }

    if (this.frequency === 'daily') {
      const lastBackup = CloudBackupService.getLastBackupTimestamp();
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (lastBackup && lastBackup > oneDayAgo) {
        // Daily target already satisfied for today
        return;
      }
    }

    // Debounce for 20 seconds
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.executeAutoBackup();
    }, 20000);
  }

  /**
   * Called when app enters foreground.
   * Mobile background workers are not guaranteed by Android/iOS,
   * so checking pending changes on foreground is the gold-standard baseline.
   */
  static async onAppForeground() {
    if (!this.enabled || !this.hasPendingChanges || this.isBackingUp) {
      return;
    }

    const net = await Network.getNetworkStateAsync();
    if (net.isConnected && net.isInternetReachable !== false) {
      this.executeAutoBackup();
    }
  }

  /**
   * Checks network connectivity and executes the cloud backup.
   */
  static async executeAutoBackup() {
    if (this.isBackingUp || !this.hasPendingChanges) {
      return;
    }

    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      const net = await Network.getNetworkStateAsync();
      if (!net.isConnected || net.isInternetReachable === false) {
        this.notify('offline', 'Network is offline. Backup queued for when connection returns.');
        this.scheduleRetry(60000); // Check again in 1 minute
        return;
      }

      this.isBackingUp = true;
      this.notify('backing_up');

      const result = await CloudBackupService.uploadBackup();

      this.isBackingUp = false;

      if (result.success) {
        this.hasPendingChanges = false;
        this.retryAttempts = 0;
        this.notify('success');
      } else {
        console.warn('[AutoBackupService] Backup failed:', result.error);
        this.notify('failed', result.error);
        this.handleFailure();
      }
    } catch (err: any) {
      this.isBackingUp = false;
      this.notify('failed', err?.message);
      this.handleFailure();
    }
  }

  private static handleFailure() {
    if (this.retryAttempts < this.maxRetries) {
      this.retryAttempts++;
      const delay = Math.min(30000 * Math.pow(2, this.retryAttempts), 300000); // 1m, 2m, 4m max
      this.scheduleRetry(delay);
    }
  }

  private static scheduleRetry(delayMs: number) {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    this.retryTimer = setTimeout(() => {
      this.executeAutoBackup();
    }, delayMs);
  }
}
