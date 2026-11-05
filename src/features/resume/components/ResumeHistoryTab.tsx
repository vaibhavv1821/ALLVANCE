import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  History,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ResumeDetailed, ResumeVersion } from '@/database/repositories/ResumeRepository';

interface ResumeHistoryTabProps {
  resume: ResumeDetailed;
  onCreateSnapshot: () => void;
  onRestoreSnapshot: (version: ResumeVersion) => void;
  onDeleteSnapshot: (versionId: string) => void;
}

export const ResumeHistoryTab: React.FC<ResumeHistoryTabProps> = ({
  resume,
  onCreateSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const handleConfirmRestore = (ver: ResumeVersion) => {
    Alert.alert(
      'Restore Snapshot?',
      `Restoring "${ver.versionLabel}" will replace current education, skills, projects, and sections with the snapshot state.\n\nAre you sure you want to proceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore Now',
          style: 'destructive',
          onPress: () => onRestoreSnapshot(ver),
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { padding: spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Banner & Create Snapshot */}
      <View
        style={[
          styles.topCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <History size={18} color={colors.accent} />
              <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: '700' }}>
                VERSION CONTROL & SNAPSHOTS
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 }}>
              Save immutable checkpoints before tailoring for specific companies.
            </Text>
          </View>

          <TouchableOpacity
            onPress={onCreateSnapshot}
            activeOpacity={0.8}
            style={[
              styles.snapshotBtn,
              { backgroundColor: colors.accent, borderRadius: borderRadius.md },
            ]}
          >
            <Plus size={15} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: typography.fontSizes.xs, fontWeight: '700' }}>
              Save Snapshot
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Snapshots List */}
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: typography.fontSizes.xs,
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: spacing.xs,
          letterSpacing: 0.5,
        }}
      >
        SAVED VERSIONS ({resume.versions.length})
      </Text>

      {resume.versions.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              alignItems: 'center',
            },
          ]}
        >
          <History size={32} color={colors.textMuted} />
          <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: '600', marginTop: 8 }}>
            No Snapshots Saved Yet
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, textAlign: 'center', marginTop: 4 }}>
            Tap "Save Snapshot" above to create an offline backup of your current resume.
          </Text>
        </View>
      ) : (
        resume.versions.map((ver, idx) => {
          let itemCountSummary = '';
          try {
            const data = JSON.parse(ver.snapshotData);
            const projs = data.projects?.length || 0;
            const exps = data.experience?.length || 0;
            const skills = data.skills?.length || 0;
            itemCountSummary = `${projs} projects, ${exps} roles, ${skills} skill groups`;
          } catch {
            itemCountSummary = 'Resume snapshot payload';
          }

          return (
            <View
              key={ver.id}
              style={[
                styles.versionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  marginBottom: spacing.sm,
                  padding: spacing.md,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: '700' }}>
                    {ver.versionLabel}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Clock size={11} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs }}>
                      {new Date(ver.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xxs, marginTop: 2 }}>
                    {itemCountSummary}
                  </Text>
                </View>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    onPress={() => handleConfirmRestore(ver)}
                    activeOpacity={0.7}
                    style={[
                      styles.restoreBtn,
                      {
                        backgroundColor: `${colors.accent}15`,
                        borderColor: `${colors.accent}30`,
                        borderWidth: 1,
                        borderRadius: borderRadius.sm,
                      },
                    ]}
                  >
                    <RotateCcw size={13} color={colors.accent} />
                    <Text style={{ color: colors.accent, fontSize: typography.fontSizes.xxs, fontWeight: '700' }}>
                      Restore
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onDeleteSnapshot(ver.id)}
                    style={{ padding: 6, marginLeft: 6 }}
                  >
                    <Trash2 size={14} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  topCard: {
    borderWidth: 1,
  },
  snapshotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  versionCard: {
    borderWidth: 1,
  },
  emptyCard: {
    borderWidth: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
});
