import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Code2, Database, Calculator, MessagesSquare } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppHeader, ModuleCard, SectionHeader, StatCard, EmptyState } from '@/components';
import { useDemoStore } from '@/store/useDemoStore';
import { dsaDashboardRepository } from '@/database/repositories/DsaDashboardRepository';

export default function PracticeTab() {
  const router = useRouter();
  const { colors, typography, spacing, isDark } = useAppTheme();
  const { isDemoMode } = useDemoStore();
  const [realDsaSolved, setRealDsaSolved] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const stats = await dsaDashboardRepository.getLiveHomeMetrics();
        if (isMounted) {
          setRealDsaSolved(stats.dsaSolved);
        }
      } catch (e) {
        // Fallback
      }
    }
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [isDemoMode]);

  const practiceModules = [
    {
      title: 'DSA Practice',
      description: 'Topic-wise problems (Arrays, DP, Graphs, Trees) with difficulty tags and revision intervals.',
      icon: <Code2 size={22} color="#10B981" />,
      accentColor: '#10B981',
      badge: 'Core',
      route: '/dsa',
    },
    {
      title: 'SQL Studio',
      description: 'Hands-on queries, complex joins, subqueries, indexing, and real database interview problems.',
      icon: <Database size={22} color="#F59E0B" />,
      accentColor: '#F59E0B',
      badge: 'Database',
      route: '/sql',
    },
    {
      title: 'Aptitude & Reasoning',
      description: 'Quantitative formulas, speed math shortcuts, logical puzzles, and pattern recognition.',
      icon: <Calculator size={22} color="#06B6D4" />,
      accentColor: '#06B6D4',
      badge: 'Aptitude',
      route: '/aptitude',
    },
    {
      title: 'Interview Preparation',
      description: 'Behavioral questions with STAR frameworks, core CS revision, and mock session templates.',
      icon: <MessagesSquare size={22} color="#EC4899" />,
      accentColor: '#EC4899',
      badge: 'Interview',
      route: '/interviews',
    },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppHeader
        title="Practice Arena"
        subtitle="Master DSA, SQL, Aptitude & Interviews"
        showBack={false}
        showThemeToggle
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing.lg, paddingBottom: spacing.huge + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Practice Stats Overview */}
        <View style={[styles.statsRow, { marginBottom: spacing.lg }]}>
          <StatCard
            label="DSA Solved"
            value={isDemoMode ? 142 : realDsaSolved}
            subtext={isDemoMode ? 'Target: 250' : realDsaSolved > 0 ? `${realDsaSolved} problems solved` : 'No problems solved yet'}
            accentColor="#10B981"
            icon={<Code2 size={16} color="#10B981" />}
            onPress={() => router.push('/dsa')}
            style={styles.halfCard}
          />
          <StatCard
            label="SQL Solved"
            value={isDemoMode ? 48 : 0}
            subtext={isDemoMode ? 'Target: 80' : 'No queries solved'}
            accentColor="#F59E0B"
            icon={<Database size={16} color="#F59E0B" />}
            onPress={() => router.push('/sql')}
            style={styles.halfCard}
          />
        </View>

        <SectionHeader
          title="Practice Disciplines"
          subtitle="Choose an area to practice and hone your skills"
        />

        <View style={styles.cardsList}>
          {practiceModules.map((item, idx) => (
            <ModuleCard
              key={idx}
              title={item.title}
              description={item.description}
              icon={item.icon}
              accentColor={item.accentColor}
              badge={item.badge}
              onPress={() => router.push(item.route as any)}
              style={{ marginBottom: spacing.md }}
            />
          ))}
        </View>

        {!isDemoMode && (
          <EmptyState
            icon={<Code2 size={28} color={colors.textMuted} />}
            title="Zero Practice Logs Recorded"
            description="Toggle 'DEMO' on the Home dashboard to view sample practice metrics, or select a discipline above."
            style={{ marginTop: spacing.md }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {},
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  cardsList: {},
});
