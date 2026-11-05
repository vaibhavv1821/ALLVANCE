import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Cloud, ShieldCheck, ArrowRight, User } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { useBackupStore } from '@/store/useBackupStore';
import { AppHeader, SearchInput } from '@/components';
import { ALL_MODULES, ModuleDefinition } from '@/constants/modules';
import { getModuleIcon } from '@/utils/iconMap';

export default function MoreTab() {
  const router = useRouter();
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();
  const { user, profile } = useAuthStore();
  const { lastBackupTime } = useBackupStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Group modules by category
  const categories: ModuleDefinition['category'][] = [
    'Career & Placement',
    'Technical Practice',
    'Productivity & Planning',
    'Intelligence & Growth',
    'System',
  ];

  const filteredModules = ALL_MODULES.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppHeader
        title="All Modules"
        subtitle="15 Dedicated Productivity & Learning Pillars"
        showBack={false}
        showThemeToggle
      />

      <View style={[styles.searchWrapper, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search modules (e.g. DSA, Resume, SQL)..."
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing.lg, paddingBottom: spacing.huge + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Account & Cloud Backup Banner Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/account' as any)}
          style={[
            styles.accountBanner,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              marginBottom: spacing.lg,
            },
          ]}
        >
          <View style={styles.accountBannerLeft}>
            <View
              style={[
                styles.accountIconBox,
                {
                  backgroundColor: user ? colors.primaryMuted : colors.accentMuted,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              {user ? (
                <ShieldCheck size={22} color={colors.primary} />
              ) : (
                <Cloud size={22} color={colors.accent} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.sm,
                  fontWeight: typography.fontWeights.bold,
                }}
              >
                {user ? (profile?.fullName || user.email) : 'Cloud Backup (Guest Mode)'}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.xs,
                  marginTop: 2,
                }}
              >
                {user
                  ? lastBackupTime
                    ? 'Cloud backup synced • Tap to manage'
                    : 'Authenticated • Tap to create first backup'
                  : 'Sign in to enable cross-device cloud sync'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.accountActionPill,
              {
                backgroundColor: colors.surfaceRaised,
                borderRadius: borderRadius.sm,
                paddingHorizontal: 8,
                paddingVertical: 5,
              },
            ]}
          >
            <Text
              style={{
                color: user ? colors.primary : colors.accent,
                fontSize: typography.fontSizes.xxs,
                fontWeight: typography.fontWeights.semiBold,
              }}
            >
              {user ? 'Manage' : 'Sign In'}
            </Text>
            <ChevronRight size={14} color={user ? colors.primary : colors.accent} style={{ marginLeft: 2 }} />
          </View>
        </TouchableOpacity>
        {searchQuery.trim().length > 0 ? (
          /* Filtered search results */
          <View>
            <Text
              style={[
                styles.categoryTitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.xs,
                  fontWeight: typography.fontWeights.semiBold,
                  marginBottom: spacing.sm,
                  textTransform: 'uppercase',
                },
              ]}
            >
              Search Results ({filteredModules.length})
            </Text>
            <View style={styles.gridContainer}>
              {filteredModules.map((mod) => (
                <TouchableOpacity
                  key={mod.id}
                  activeOpacity={0.7}
                  onPress={() => router.push(mod.route as any)}
                  style={[
                    styles.gridCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderRadius: borderRadius.lg,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: `${mod.accentColor}18`,
                        borderRadius: borderRadius.md,
                      },
                    ]}
                  >
                    {getModuleIcon(mod.iconName, mod.accentColor, 22)}
                  </View>
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        color: colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: typography.fontWeights.semiBold,
                        marginTop: spacing.sm,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {mod.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDesc,
                      {
                        color: colors.textSecondary,
                        fontSize: typography.fontSizes.xxs,
                        marginTop: 2,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {mod.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* Categorized view of all modules */
          categories.map((cat) => {
            const catModules = ALL_MODULES.filter((m) => m.category === cat);
            if (catModules.length === 0) return null;

            return (
              <View key={cat} style={{ marginBottom: spacing.xl }}>
                <Text
                  style={[
                    styles.categoryTitle,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.fontSizes.xs,
                      fontWeight: typography.fontWeights.bold,
                      marginBottom: spacing.sm,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                    },
                  ]}
                >
                  {cat}
                </Text>

                <View style={styles.gridContainer}>
                  {catModules.map((mod) => (
                    <TouchableOpacity
                      key={mod.id}
                      activeOpacity={0.7}
                      onPress={() => router.push(mod.route as any)}
                      style={[
                        styles.gridCard,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          borderRadius: borderRadius.lg,
                          padding: spacing.md,
                        },
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <View
                          style={[
                            styles.iconBox,
                            {
                              backgroundColor: `${mod.accentColor}18`,
                              borderRadius: borderRadius.md,
                            },
                          ]}
                        >
                          {getModuleIcon(mod.iconName, mod.accentColor, 22)}
                        </View>
                        {mod.badge && (
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor: `${mod.accentColor}25`,
                                borderRadius: borderRadius.xs,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.badgeText,
                                {
                                  color: mod.accentColor,
                                  fontSize: typography.fontSizes.xxs - 1,
                                  fontWeight: typography.fontWeights.bold,
                                },
                              ]}
                            >
                              {mod.badge}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={[
                          styles.cardTitle,
                          {
                            color: colors.textPrimary,
                            fontSize: typography.fontSizes.sm,
                            fontWeight: typography.fontWeights.semiBold,
                            marginTop: spacing.sm,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {mod.title}
                      </Text>

                      <Text
                        style={[
                          styles.cardDesc,
                          {
                            color: colors.textSecondary,
                            fontSize: typography.fontSizes.xxs,
                            marginTop: 2,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {mod.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  accountBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  accountIconBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchWrapper: {
    paddingBottom: 4,
  },
  scrollContent: {},
  categoryTitle: {},
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {},
  cardTitle: {},
  cardDesc: {
    lineHeight: 14,
  },
});
