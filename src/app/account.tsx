import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  User,
  Mail,
  ShieldCheck,
  Cloud,
  CloudUpload,
  RefreshCw,
  Clock,
  HardDrive,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ChevronRight,
  Database,
  ArrowRight,
} from 'lucide-react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { useBackupStore } from '@/store/useBackupStore';
import { AppHeader, PrimaryButton, ConfirmationDialog, SectionHeader } from '@/components';
import { AutoBackupFrequency } from '@/services/backup/autoBackupService';
import { formatDate, formatTime } from '@/utils';

export default function AccountScreen() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();
  const { user, profile, isGuest, signOut, deleteAccount } = useAuthStore();
  const {
    backups,
    isLoadingBackups,
    isBackingUp,
    isRestoring,
    uploadProgress,
    lastBackupTime,
    statusMessage,
    autoBackupEnabled,
    backupFrequency,
    fetchBackups,
    performBackup,
    performRestore,
    deleteBackup,
    setAutoBackupConfig,
    clearStatusMessage,
  } = useBackupStore();

  const [restoreTargetId, setRestoreTargetId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [signOutDialog, setSignOutDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBackups();
    }
  }, [user, fetchBackups]);

  const handleBackupNow = async () => {
    await performBackup();
  };

  const handleConfirmRestore = async () => {
    if (!restoreTargetId) return;
    const bId = restoreTargetId;
    setRestoreTargetId(null);
    await performRestore(bId);
  };

  const handleConfirmDeleteBackup = async () => {
    if (!deleteTargetId) return;
    const bId = deleteTargetId;
    setDeleteTargetId(null);
    await deleteBackup(bId);
  };

  const handleConfirmSignOut = async () => {
    setSignOutDialog(false);
    await signOut();
    router.replace('/(auth)/welcome' as any);
  };

  const handleConfirmDeleteAccount = async () => {
    setDeleteAccountDialog(false);
    const res = await deleteAccount();
    if (res.success) {
      router.replace('/(auth)/welcome' as any);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppHeader
        title="Account & Backup"
        subtitle="Supabase Authentication & Cloud Sync"
        showBack={true}
        showThemeToggle={false}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing.lg, paddingBottom: spacing.huge + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Notification Toast */}
        {statusMessage && (
          <View
            style={[
              styles.statusToast,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
              },
            ]}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <CheckCircle2 size={18} color={colors.primary} style={{ marginRight: 8 }} />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.xs,
                  flex: 1,
                  lineHeight: 18,
                }}
              >
                {statusMessage}
              </Text>
            </View>
            <TouchableOpacity onPress={clearStatusMessage} style={{ paddingLeft: 8 }}>
              <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xs }}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User Identity Section */}
        <SectionHeader
          title="Account Profile"
          subtitle={user ? 'Authenticated with Supabase' : 'Offline Guest Mode'}
          icon={<User size={18} color={colors.primary} />}
        />

        <View
          style={[
            styles.cardBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.xl,
            },
          ]}
        >
          {user ? (
            <View>
              <View style={styles.profileRow}>
                <View
                  style={[
                    styles.avatarBadge,
                    {
                      backgroundColor: colors.primaryMuted,
                      borderColor: colors.primary,
                      borderRadius: borderRadius.round,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      {
                        color: colors.primary,
                        fontSize: typography.fontSizes.xl,
                        fontWeight: typography.fontWeights.bold,
                      },
                    ]}
                  >
                    {(profile?.fullName || user.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.profileDetails}>
                  <Text
                    style={[
                      styles.profileName,
                      {
                        color: colors.textPrimary,
                        fontSize: typography.fontSizes.md,
                        fontWeight: typography.fontWeights.bold,
                      },
                    ]}
                  >
                    {profile?.fullName || 'ALLVANCE User'}
                  </Text>
                  <Text
                    style={[
                      styles.profileEmail,
                      {
                        color: colors.textSecondary,
                        fontSize: typography.fontSizes.xs,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {user.email}
                  </Text>
                  <View
                    style={[
                      styles.verifiedPill,
                      {
                        backgroundColor: colors.successMuted,
                        borderRadius: borderRadius.xs,
                        marginTop: 4,
                      },
                    ]}
                  >
                    <ShieldCheck size={12} color={colors.success} style={{ marginRight: 4 }} />
                    <Text
                      style={{
                        color: colors.success,
                        fontSize: typography.fontSizes.xxs,
                        fontWeight: typography.fontWeights.semiBold,
                      }}
                    >
                      Cloud Sync Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.guestWarningRow}>
                <AlertCircle size={22} color={colors.warning} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.guestTitle,
                      {
                        color: colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: typography.fontWeights.bold,
                      },
                    ]}
                  >
                    Guest Mode (Offline Only)
                  </Text>
                  <Text
                    style={[
                      styles.guestDesc,
                      {
                        color: colors.textSecondary,
                        fontSize: typography.fontSizes.xs,
                        marginTop: 2,
                        lineHeight: 16,
                      },
                    ]}
                  >
                    Your data is stored securely in your local SQLite database. Sign in with a free account to enable encrypted cloud backups across your devices.
                  </Text>
                </View>
              </View>

              <PrimaryButton
                title="Sign In / Create Account"
                onPress={() => router.push('/(auth)/welcome' as any)}
                variant="primary"
                size="md"
                fullWidth
                icon={<ArrowRight size={16} color={isDark ? '#090D16' : '#FFFFFF'} />}
                iconPosition="right"
                style={{ marginTop: spacing.md }}
              />
            </View>
          )}
        </View>

        {/* Cloud Backup Section (Available to authenticated users) */}
        {user && (
          <View>
            <SectionHeader
              title="Cloud Backup"
              subtitle="Snapshot placement, DSA, resume & interview records"
              icon={<Cloud size={18} color={colors.accent} />}
              actionLabel="Refresh"
              onAction={fetchBackups}
            />

            <View
              style={[
                styles.cardBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  marginBottom: spacing.xl,
                },
              ]}
            >
              {/* Last Backup Info */}
              <View style={styles.lastBackupRow}>
                <View>
                  <Text
                    style={[
                      styles.backupInfoLabel,
                      { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                    ]}
                  >
                    LAST CLOUD BACKUP
                  </Text>
                  <Text
                    style={[
                      styles.backupInfoValue,
                      {
                        color: colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: typography.fontWeights.semiBold,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {lastBackupTime
                      ? `${formatDate(lastBackupTime)} at ${formatTime(lastBackupTime)}`
                      : 'Never backed up'}
                  </Text>
                </View>

                <PrimaryButton
                  title="Backup Now"
                  onPress={handleBackupNow}
                  loading={isBackingUp}
                  variant="primary"
                  size="sm"
                  icon={<CloudUpload size={16} color={isDark ? '#090D16' : '#FFFFFF'} />}
                />
              </View>

              {isBackingUp && (
                <View style={{ marginTop: spacing.md }}>
                  <Text style={{ color: colors.primary, fontSize: typography.fontSizes.xs, marginBottom: 4 }}>
                    Uploading backup ({uploadProgress}%)...
                  </Text>
                  <View
                    style={{
                      height: 4,
                      backgroundColor: colors.surfaceRaised,
                      borderRadius: borderRadius.round,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        height: '100%',
                        width: `${uploadProgress}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </View>
                </View>
              )}

              {/* Automatic Backup Configuration */}
              <View
                style={[
                  styles.autoBackupSection,
                  {
                    borderTopWidth: 1,
                    borderTopColor: colors.borderSubtle,
                    marginTop: spacing.md,
                    paddingTop: spacing.md,
                  },
                ]}
              >
                <View style={styles.switchRow}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: typography.fontWeights.semiBold,
                      }}
                    >
                      Automatic Cloud Backup
                    </Text>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: typography.fontSizes.xs,
                        marginTop: 2,
                        lineHeight: 16,
                      }}
                    >
                      Debounces meaningful database updates and uploads when online.
                    </Text>
                  </View>
                  <Switch
                    value={autoBackupEnabled}
                    onValueChange={(val) => setAutoBackupConfig(val, backupFrequency)}
                    trackColor={{ false: colors.surfaceRaised, true: colors.primary }}
                    thumbColor={autoBackupEnabled ? '#FFFFFF' : colors.textMuted}
                  />
                </View>

                {autoBackupEnabled && (
                  <View style={[styles.frequencyRow, { marginTop: spacing.md }]}>
                    {(['immediate', 'daily', 'manual'] as AutoBackupFrequency[]).map((freq) => {
                      const active = backupFrequency === freq;
                      return (
                        <TouchableOpacity
                          key={freq}
                          activeOpacity={0.7}
                          onPress={() => setAutoBackupConfig(true, freq)}
                          style={[
                            styles.freqBtn,
                            {
                              backgroundColor: active ? colors.primaryMuted : colors.surfaceRaised,
                              borderColor: active ? colors.primary : colors.border,
                              borderRadius: borderRadius.sm,
                              paddingVertical: spacing.xs + 2,
                              paddingHorizontal: spacing.sm,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: active ? colors.primary : colors.textSecondary,
                              fontSize: typography.fontSizes.xxs,
                              fontWeight: active ? typography.fontWeights.bold : typography.fontWeights.regular,
                              textTransform: 'capitalize',
                            }}
                          >
                            {freq}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>

            {/* Available Cloud Backups List */}
            <SectionHeader
              title={`Cloud Snapshots (${backups.length})`}
              subtitle="Restore points stored in Supabase"
              icon={<Database size={18} color={colors.warning} />}
            />

            <View
              style={[
                styles.cardBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  marginBottom: spacing.xl,
                },
              ]}
            >
              {isLoadingBackups ? (
                <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 8 }}>
                    Loading cloud backups...
                  </Text>
                </View>
              ) : backups.length === 0 ? (
                <View style={{ padding: spacing.lg, alignItems: 'center' }}>
                  <CloudUpload size={28} color={colors.textMuted} style={{ marginBottom: 8 }} />
                  <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semiBold }}>
                    No Cloud Backups Found
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, textAlign: 'center', marginTop: 4 }}>
                    Tap &quot;Backup Now&quot; above to create your first encrypted cloud snapshot.
                  </Text>
                </View>
              ) : (
                backups.map((b, idx) => (
                  <View
                    key={b.id}
                    style={[
                      styles.backupItem,
                      {
                        borderBottomColor: colors.borderSubtle,
                        borderBottomWidth: idx === backups.length - 1 ? 0 : 1,
                        paddingVertical: spacing.md,
                      },
                    ]}
                  >
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Smartphone size={14} color={colors.primary} style={{ marginRight: 6 }} />
                        <Text
                          style={{
                            color: colors.textPrimary,
                            fontSize: typography.fontSizes.sm,
                            fontWeight: typography.fontWeights.semiBold,
                          }}
                        >
                          {b.deviceName || 'Android Device'}
                        </Text>
                      </View>

                      <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 }}>
                        {formatDate(new Date(b.createdAt).getTime())} at {formatTime(new Date(b.createdAt).getTime())}
                      </Text>

                      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                        <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs }}>
                          Size: {formatSize(b.sizeBytes)}
                        </Text>
                        <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs }}>
                          Schema: v{b.schemaVersion}
                        </Text>
                        <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs }}>
                          SHA: {b.checksum.substring(0, 8)}...
                        </Text>
                      </View>
                    </View>

                    {/* Actions: Restore & Delete */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <TouchableOpacity
                        onPress={() => setRestoreTargetId(b.id)}
                        disabled={isRestoring}
                        activeOpacity={0.7}
                        style={[
                          styles.restoreActionBtn,
                          {
                            backgroundColor: colors.primaryMuted,
                            borderColor: colors.primary,
                            borderRadius: borderRadius.sm,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                          },
                        ]}
                      >
                        <RefreshCw size={12} color={colors.primary} style={{ marginRight: 4 }} />
                        <Text style={{ color: colors.primary, fontSize: typography.fontSizes.xs, fontWeight: typography.fontWeights.semiBold }}>
                          Restore
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setDeleteTargetId(b.id)}
                        activeOpacity={0.7}
                        style={[
                          styles.deleteActionBtn,
                          {
                            backgroundColor: colors.surfaceRaised,
                            borderRadius: borderRadius.sm,
                            padding: 6,
                          },
                        ]}
                      >
                        <Trash2 size={14} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {/* Account Actions Section */}
        {user && (
          <View>
            <SectionHeader
              title="Session & Privacy"
              subtitle="Account credentials & security controls"
              icon={<ShieldCheck size={18} color={colors.textSecondary} />}
            />

            <View
              style={[
                styles.cardBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                },
              ]}
            >
              {/* Sign Out */}
              <TouchableOpacity
                onPress={() => setSignOutDialog(true)}
                activeOpacity={0.7}
                style={[
                  styles.accountRowBtn,
                  { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, paddingVertical: spacing.md },
                ]}
              >
                <LogOut size={18} color={colors.textPrimary} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.medium }}>
                    Sign Out
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 }}>
                    Your local SQLite records will remain intact on this device.
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Delete Account */}
              <TouchableOpacity
                onPress={() => setDeleteAccountDialog(true)}
                activeOpacity={0.7}
                style={[styles.accountRowBtn, { paddingVertical: spacing.md }]}
              >
                <AlertTriangle size={18} color={colors.danger} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.danger, fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semiBold }}>
                    Delete Account
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 }}>
                    Permanently delete your Supabase account and all associated cloud backups.
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Dialog for Restore */}
      <ConfirmationDialog
        visible={!!restoreTargetId}
        title="Restore Cloud Backup?"
        message="Restoring will replace the current local application records with this cloud snapshot. A safe rollback snapshot will be taken before restoring."
        confirmText="Confirm Restore"
        cancelText="Cancel"
        isDestructive={false}
        onConfirm={handleConfirmRestore}
        onCancel={() => setRestoreTargetId(null)}
      />

      {/* Confirmation Dialog for Deleting a Single Backup */}
      <ConfirmationDialog
        visible={!!deleteTargetId}
        title="Delete Cloud Backup?"
        message="This cloud snapshot will be permanently removed from Supabase. Your local data will remain unaffected."
        confirmText="Delete Snapshot"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDeleteBackup}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Confirmation Dialog for Sign Out */}
      <ConfirmationDialog
        visible={signOutDialog}
        title="Sign Out?"
        message="You will switch to offline guest mode. Local records on this device will not be deleted."
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setSignOutDialog(false)}
      />

      {/* Confirmation Dialog for Account Deletion */}
      <ConfirmationDialog
        visible={deleteAccountDialog}
        title="Delete Supabase Account?"
        message="This action is permanent and cannot be undone. Your Supabase user account and all cloud backup snapshots will be deleted. Your local SQLite database will remain."
        confirmText="Permanently Delete"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setDeleteAccountDialog(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {},
  statusToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  cardBox: {
    borderWidth: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBadge: {
    width: 52,
    height: 52,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {},
  profileDetails: {
    flex: 1,
  },
  profileName: {},
  profileEmail: {},
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  guestWarningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guestTitle: {},
  guestDesc: {},
  lastBackupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backupInfoLabel: {
    letterSpacing: 0.6,
  },
  backupInfoValue: {},
  autoBackupSection: {},
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  freqBtn: {
    borderWidth: 1,
  },
  backupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restoreActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  deleteActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
