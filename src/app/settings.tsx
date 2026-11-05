import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  Moon,
  Sun,
  Smartphone,
  Database,
  ShieldCheck,
  Info,
  RefreshCw,
  Trash2,
  Check,
} from 'lucide-react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useDemoStore } from '@/store/useDemoStore';
import { AppHeader, ConfirmationDialog, SectionHeader } from '@/components';
import { getRawDb } from '@/database/client';
import { ThemeMode } from '@/theme/tokens';

export default function SettingsScreen() {
  const { colors, typography, spacing, borderRadius, isDark, themeMode, setThemeMode } = useAppTheme();
  const { isDemoMode, setDemoMode } = useDemoStore();

  const [dbStats, setDbStats] = useState({
    userVersion: 1,
    tableCount: 7,
    settingsCount: 0,
  });

  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    try {
      const rawDb = getRawDb();
      const versionRow = rawDb.getFirstSync<{ user_version: number }>('PRAGMA user_version;');
      const tables = rawDb.getAllSync<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
      );
      const settingsRow = rawDb.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM settings;'
      );

      setDbStats({
        userVersion: versionRow?.user_version ?? 1,
        tableCount: tables.length,
        settingsCount: settingsRow?.count ?? 0,
      });
    } catch (e) {
      console.warn('Failed to fetch DB stats:', e);
    }
  }, [resetSuccess]);

  const handleResetDb = () => {
    try {
      const rawDb = getRawDb();
      // Clear data tables but keep schema
      rawDb.execSync(`
        DELETE FROM applications;
        DELETE FROM dsa_problems;
        DELETE FROM tasks;
        DELETE FROM notes;
        DELETE FROM activity_logs;
      `);
      setResetSuccess(true);
      setResetDialogVisible(false);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (e) {
      console.error('Error resetting DB:', e);
      setResetDialogVisible(false);
    }
  };

  const themeOptions: { label: string; mode: ThemeMode; icon: React.ReactNode }[] = [
    { label: 'Dark', mode: 'dark', icon: <Moon size={16} color={colors.primary} /> },
    { label: 'Light', mode: 'light', icon: <Sun size={16} color={colors.warning} /> },
    { label: 'System', mode: 'system', icon: <Smartphone size={16} color={colors.accent} /> },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppHeader
        title="Settings"
        subtitle="Preferences, Themes & Database Control"
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
        {/* Appearance & Themes */}
        <SectionHeader
          title="Theme & Appearance"
          subtitle="Choose your preferred visual style"
          icon={<Moon size={18} color={colors.primary} />}
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
          <View style={styles.themeOptionsRow}>
            {themeOptions.map((opt) => {
              const active = themeMode === opt.mode;
              return (
                <TouchableOpacity
                  key={opt.mode}
                  activeOpacity={0.7}
                  onPress={() => setThemeMode(opt.mode)}
                  style={[
                    styles.themeOptionBtn,
                    {
                      backgroundColor: active ? colors.primaryMuted : colors.surfaceRaised,
                      borderColor: active ? colors.primary : colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <View style={styles.themeIconWrapper}>{opt.icon}</View>
                  <Text
                    style={[
                      styles.themeOptionText,
                      {
                        color: active ? colors.primary : colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: active
                          ? typography.fontWeights.semiBold
                          : typography.fontWeights.regular,
                        marginTop: 4,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {active && (
                    <View
                      style={[
                        styles.activeCheck,
                        { backgroundColor: colors.primary, borderRadius: borderRadius.round },
                      ]}
                    >
                      <Check size={10} color={isDark ? '#090D16' : '#FFFFFF'} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Development Demo Mode */}
        <SectionHeader
          title="Developer Demo Mode"
          subtitle="Toggle placeholder values to preview rich visualizations"
          icon={<Smartphone size={18} color={colors.accent} />}
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
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text
                style={[
                  styles.switchTitle,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.fontSizes.md,
                    fontWeight: typography.fontWeights.semiBold,
                  },
                ]}
              >
                Sample Data Preview
              </Text>
              <Text
                style={[
                  styles.switchDesc,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.xs,
                    marginTop: 2,
                  },
                ]}
              >
                {isDemoMode
                  ? 'Showing sample applications, tasks, and progress'
                  : 'Showing real offline database state (zero/empty)'}
              </Text>
            </View>
            <Switch
              value={isDemoMode}
              onValueChange={setDemoMode}
              trackColor={{ false: colors.surfaceRaised, true: colors.primary }}
              thumbColor={isDemoMode ? '#FFFFFF' : colors.textMuted}
            />
          </View>
        </View>

        {/* Offline Database Foundation */}
        <SectionHeader
          title="Offline Database"
          subtitle="Local SQLite with Drizzle ORM"
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
          <View style={styles.dbInfoRow}>
            <Text style={[styles.dbInfoLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.sm }]}>
              Database Engine
            </Text>
            <Text style={[styles.dbInfoVal, { color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semiBold }]}>
              SQLite (WAL Mode)
            </Text>
          </View>
          <View style={[styles.dbInfoRow, { borderTopWidth: 1, borderTopColor: colors.borderSubtle }]}>
            <Text style={[styles.dbInfoLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.sm }]}>
              ORM Layer
            </Text>
            <Text style={[styles.dbInfoVal, { color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semiBold }]}>
              Drizzle ORM
            </Text>
          </View>
          <View style={[styles.dbInfoRow, { borderTopWidth: 1, borderTopColor: colors.borderSubtle }]}>
            <Text style={[styles.dbInfoLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.sm }]}>
              Schema Version
            </Text>
            <Text style={[styles.dbInfoVal, { color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semiBold }]}>
              v{dbStats.userVersion}
            </Text>
          </View>
          <View style={[styles.dbInfoRow, { borderTopWidth: 1, borderTopColor: colors.borderSubtle }]}>
            <Text style={[styles.dbInfoLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.sm }]}>
              Active Tables
            </Text>
            <Text style={[styles.dbInfoVal, { color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semiBold }]}>
              {dbStats.tableCount} tables ready
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setResetDialogVisible(true)}
            style={[
              styles.resetBtn,
              {
                borderColor: colors.danger,
                borderRadius: borderRadius.md,
                padding: spacing.sm + 2,
                marginTop: spacing.md,
              },
            ]}
          >
            <Trash2 size={16} color={colors.danger} style={{ marginRight: 6 }} />
            <Text
              style={[
                styles.resetBtnText,
                { color: colors.danger, fontSize: typography.fontSizes.xs, fontWeight: typography.fontWeights.semiBold },
              ]}
            >
              Reset Local Table Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Application Identity & Privacy */}
        <SectionHeader
          title="About ALLVANCE"
          subtitle="Your Personal Growth Ecosystem"
          icon={<Info size={18} color={colors.info} />}
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
          <View style={styles.aboutRow}>
            <ShieldCheck size={20} color={colors.success} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.aboutTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.semiBold },
                ]}
              >
                100% Offline & Private
              </Text>
              <Text
                style={[
                  styles.aboutDesc,
                  { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 },
                ]}
              >
                No cloud backends, no tracking, and no paid subscriptions. All your placement records, notes, and goals stay securely on your Android device.
              </Text>
            </View>
          </View>

          <View style={[styles.versionBadge, { marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderSubtle, paddingTop: spacing.sm }]}>
            <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs, textAlign: 'center' }}>
              ALLVANCE v1.0.0 • Phase 0 Application Foundation
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Dialog for DB reset */}
      <ConfirmationDialog
        visible={resetDialogVisible}
        title="Reset Local Data?"
        message="This will clear your local application, task, and problem records. Database schemas and settings will remain intact."
        confirmText="Reset Data"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleResetDb}
        onCancel={() => setResetDialogVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {},
  cardBox: {
    borderWidth: 1,
  },
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOptionBtn: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  themeIconWrapper: {},
  themeOptionText: {},
  activeCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextCol: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {},
  switchDesc: {},
  dbInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dbInfoLabel: {},
  dbInfoVal: {},
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  resetBtnText: {},
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aboutTitle: {},
  aboutDesc: {
    lineHeight: 18,
  },
  versionBadge: {},
});
