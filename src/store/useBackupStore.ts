import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CloudBackupService, CloudBackupItem } from '@/services/backup/cloudBackupService';
import { AutoBackupService, AutoBackupFrequency } from '@/services/backup/autoBackupService';

interface BackupState {
  backups: CloudBackupItem[];
  isLoadingBackups: boolean;
  isBackingUp: boolean;
  isRestoring: boolean;
  uploadProgress: number;
  lastBackupTime: number | null;
  status: 'idle' | 'backing_up' | 'restoring' | 'success' | 'failed' | 'offline';
  statusMessage: string | null;

  // Settings
  autoBackupEnabled: boolean;
  backupFrequency: AutoBackupFrequency;

  // Actions
  fetchBackups: () => Promise<void>;
  performBackup: () => Promise<{ success: boolean; error?: string }>;
  performRestore: (backupId: string) => Promise<{ success: boolean; error?: string }>;
  deleteBackup: (backupId: string) => Promise<{ success: boolean; error?: string }>;
  setAutoBackupConfig: (enabled: boolean, frequency: AutoBackupFrequency) => void;
  refreshLastBackupTime: () => void;
  clearStatusMessage: () => void;
}

export const useBackupStore = create<BackupState>()(
  persist(
    (set, get) => ({
      backups: [],
      isLoadingBackups: false,
      isBackingUp: false,
      isRestoring: false,
      uploadProgress: 0,
      lastBackupTime: CloudBackupService.getLastBackupTimestamp(),
      status: 'idle',
      statusMessage: null,

      autoBackupEnabled: true,
      backupFrequency: 'immediate',

      fetchBackups: async () => {
        set({ isLoadingBackups: true });
        const res = await CloudBackupService.listBackups();
        if (res.success && res.data) {
          set({ backups: res.data, isLoadingBackups: false });
        } else {
          set({ isLoadingBackups: false });
        }
      },

      performBackup: async () => {
        set({
          isBackingUp: true,
          uploadProgress: 0,
          status: 'backing_up',
          statusMessage: 'Creating consistent local snapshot...',
        });

        const res = await CloudBackupService.uploadBackup((percent) => {
          set({ uploadProgress: percent });
        });

        if (res.success && res.data) {
          const updatedTime = Date.now();
          set({
            isBackingUp: false,
            uploadProgress: 100,
            status: 'success',
            statusMessage: 'Cloud backup created successfully.',
            lastBackupTime: updatedTime,
          });

          // Refresh backups list
          get().fetchBackups();
          return { success: true };
        } else {
          set({
            isBackingUp: false,
            uploadProgress: 0,
            status: 'failed',
            statusMessage: res.error || 'Failed to complete cloud backup.',
          });
          return { success: false, error: res.error };
        }
      },

      performRestore: async (backupId: string) => {
        set({
          isRestoring: true,
          status: 'restoring',
          statusMessage: 'Validating and restoring cloud backup...',
        });

        const res = await CloudBackupService.restoreBackup(backupId);

        if (res.success) {
          set({
            isRestoring: false,
            status: 'success',
            statusMessage: `Restored ${res.data?.restoredRecords ?? 0} records across ${res.data?.restoredTables ?? 0} modules successfully.`,
          });
          return { success: true };
        } else {
          set({
            isRestoring: false,
            status: 'failed',
            statusMessage: res.error || 'Failed to restore backup.',
          });
          return { success: false, error: res.error };
        }
      },

      deleteBackup: async (backupId: string) => {
        const res = await CloudBackupService.deleteBackup(backupId);
        if (res.success) {
          set((state) => ({
            backups: state.backups.filter((b) => b.id !== backupId),
          }));
          return { success: true };
        }
        return { success: false, error: res.error };
      },

      setAutoBackupConfig: (enabled: boolean, frequency: AutoBackupFrequency) => {
        set({ autoBackupEnabled: enabled, backupFrequency: frequency });
        AutoBackupService.setConfig(enabled, frequency);
      },

      refreshLastBackupTime: () => {
        set({ lastBackupTime: CloudBackupService.getLastBackupTimestamp() });
      },

      clearStatusMessage: () => set({ statusMessage: null }),
    }),
    {
      name: 'allvance-backup-config',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        autoBackupEnabled: state.autoBackupEnabled,
        backupFrequency: state.backupFrequency,
      }),
    }
  )
);
