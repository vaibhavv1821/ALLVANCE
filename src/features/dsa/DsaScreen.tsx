import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  Layers,
  Code2,
  RotateCcw,
  TrendingUp,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppHeader, LoadingIndicator } from '@/components';
import {
  dsaDashboardRepository,
  DsaDashboardMetrics,
} from '@/database/repositories/DsaDashboardRepository';
import {
  dsaTopicRepository,
  TopicWithStats,
} from '@/database/repositories/DsaTopicRepository';
import {
  dsaProblemRepository,
  ProblemDetailed,
  ProblemFilterOptions,
} from '@/database/repositories/DsaProblemRepository';
import {
  dsaRevisionRepository,
  RevisionWithProblem,
} from '@/database/repositories/DsaRevisionRepository';
import { dsaCompanyRepository } from '@/database/repositories/DsaCompanyRepository';
import { DsaSolution } from '@/database/schema/dsa';
import { DsaTabType } from './types';

// Tab & Modal Components
import {
  DsaDashboardTab,
  DsaRoadmapTab,
  DsaProblemListTab,
  DsaRevisionTab,
  DsaAnalyticsTab,
  DailyGoalModal,
  StudySessionModal,
  CompleteRevisionModal,
  SolutionFormModal,
  LogAttemptModal,
  TopicFormModal,
  TopicDetailModal,
  ProblemFormModal,
  ProblemDetailModal,
} from './components';

interface DsaScreenProps {
  showBack?: boolean;
}

export const DsaScreen: React.FC<DsaScreenProps> = ({ showBack = true }) => {
  const { colors, typography, spacing, isDark } = useAppTheme();

  const [activeTab, setActiveTab] = useState<DsaTabType>('overview');
  const [loading, setLoading] = useState(true);

  // Core Data
  const [metrics, setMetrics] = useState<DsaDashboardMetrics | null>(null);
  const [topics, setTopics] = useState<TopicWithStats[]>([]);
  const [problems, setProblems] = useState<ProblemDetailed[]>([]);
  const [revisions, setRevisions] = useState<RevisionWithProblem[]>([]);
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);

  // Filter States
  const [filterOptions, setFilterOptions] = useState<ProblemFilterOptions>({
    difficulty: 'ALL',
    status: 'ALL',
    sortBy: 'recently_added',
  });
  const [activeRevisionFilter, setActiveRevisionFilter] = useState<
    'all' | 'due' | 'overdue' | 'upcoming' | 'completed'
  >('due');

  // Modals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicWithStats | null>(null);
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<TopicWithStats | null>(null);

  const [showProblemForm, setShowProblemForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProblemDetailed | null>(null);
  const [selectedProblemDetail, setSelectedProblemDetail] = useState<ProblemDetailed | null>(null);
  const [prefillTopicForProblem, setPrefillTopicForProblem] = useState<{ title: string; id: string } | null>(null);

  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [activeSolutionProblem, setActiveSolutionProblem] = useState<{ id: string; title: string } | null>(null);
  const [editingSolution, setEditingSolution] = useState<DsaSolution | null>(null);

  const [showLogAttemptModal, setShowLogAttemptModal] = useState(false);
  const [activeAttemptProblem, setActiveAttemptProblem] = useState<{ id: string; title: string } | null>(null);

  const [showCompleteRevisionModal, setShowCompleteRevisionModal] = useState(false);
  const [activeRevisionToComplete, setActiveRevisionToComplete] = useState<RevisionWithProblem | null>(null);

  // Load All Data
  const loadData = useCallback(async () => {
    try {
      const [m, t, p, r, c] = await Promise.all([
        dsaDashboardRepository.getDashboardMetrics(),
        dsaTopicRepository.getAllWithStats(),
        dsaProblemRepository.getAll(filterOptions),
        dsaRevisionRepository.getAllWithProblem(activeRevisionFilter),
        dsaCompanyRepository.getPopularCompanies(),
      ]);

      setMetrics(m);
      setTopics(t);
      setProblems(p);
      setRevisions(r);
      setAvailableCompanies(c);
    } catch (e) {
      console.error('[DsaScreen] Error loading data:', e);
    } finally {
      setLoading(false);
    }
  }, [filterOptions, activeRevisionFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (updates: Partial<ProblemFilterOptions>) => {
    setFilterOptions((prev) => ({ ...prev, ...updates }));
  };

  const handleToggleFavorite = async (problemId: string) => {
    await dsaProblemRepository.toggleFavorite(problemId);
    loadData();
  };

  const handleSelectProblemById = async (problemId: string) => {
    const full = await dsaProblemRepository.getById(problemId);
    if (full) {
      setSelectedProblemDetail(full);
    }
  };

  const handleOpenRevisionCompleteByProblemId = async (problemId: string) => {
    const allRevs = await dsaRevisionRepository.getAllWithProblem('all');
    const match = allRevs.find((r) => r.problemId === problemId && !r.completedDate);
    if (match) {
      setActiveRevisionToComplete(match);
      setShowCompleteRevisionModal(true);
    } else {
      alert('No pending revisions found for this problem.');
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'roadmap' as const, label: 'Roadmap', icon: Layers },
    { id: 'problems' as const, label: 'Problems', icon: Code2 },
    { id: 'revision' as const, label: 'Revision', icon: RotateCcw },
    { id: 'analytics' as const, label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* App Header */}
      <AppHeader
        title="DSA Practice"
        subtitle="Data Structures & Algorithms Mastery"
        showBack={showBack}
        showThemeToggle={true}
      />

      {/* Navigation Sub-Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabBtn,
                isActive && { borderBottomColor: '#10B981', borderBottomWidth: 2.5 },
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Icon size={18} color={isActive ? '#10B981' : colors.textMuted} />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? '#10B981' : colors.textMuted,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Main Tab Screen Area */}
      {loading ? (
        <LoadingIndicator message="Loading DSA Arena..." />
      ) : (
        <View style={styles.content}>
          {activeTab === 'overview' && (
            <DsaDashboardTab
              metrics={metrics}
              topics={topics}
              onOpenAddProblem={() => {
                setEditingProblem(null);
                setPrefillTopicForProblem(null);
                setShowProblemForm(true);
              }}
              onOpenSetGoal={() => setShowGoalModal(true)}
              onOpenStudySession={() => setShowSessionModal(true)}
              onNavigateToTab={(t) => setActiveTab(t)}
              onSelectProblem={handleSelectProblemById}
            />
          )}

          {activeTab === 'roadmap' && (
            <DsaRoadmapTab
              topics={topics}
              onSelectTopic={(t) => setSelectedTopicDetail(t)}
              onOpenAddTopic={() => {
                setEditingTopic(null);
                setShowTopicForm(true);
              }}
            />
          )}

          {activeTab === 'problems' && (
            <DsaProblemListTab
              problems={problems}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onSelectProblem={(p) => setSelectedProblemDetail(p)}
              onToggleFavorite={handleToggleFavorite}
              onOpenAddProblem={() => {
                setEditingProblem(null);
                setPrefillTopicForProblem(null);
                setShowProblemForm(true);
              }}
              availableCompanies={availableCompanies}
            />
          )}

          {activeTab === 'revision' && (
            <DsaRevisionTab
              revisions={revisions}
              activeFilter={activeRevisionFilter}
              onFilterChange={(f) => setActiveRevisionFilter(f)}
              onOpenCompleteModal={(rev) => {
                setActiveRevisionToComplete(rev);
                setShowCompleteRevisionModal(true);
              }}
              onSelectProblem={handleSelectProblemById}
            />
          )}

          {activeTab === 'analytics' && <DsaAnalyticsTab />}
        </View>
      )}

      {/* Modals */}
      <DailyGoalModal
        visible={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSaved={loadData}
        currentGoal={null}
      />

      <StudySessionModal
        visible={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onSaved={loadData}
        topics={topics}
      />

      <TopicFormModal
        visible={showTopicForm}
        onClose={() => setShowTopicForm(false)}
        onSaved={loadData}
        topicToEdit={editingTopic}
      />

      <TopicDetailModal
        visible={!!selectedTopicDetail}
        topic={selectedTopicDetail}
        onClose={() => setSelectedTopicDetail(null)}
        onRefresh={loadData}
        onEditTopic={(t) => {
          setEditingTopic(t);
          setShowTopicForm(true);
        }}
        onViewProblemsInTopic={(topicTitle) => {
          setFilterOptions((prev) => ({ ...prev, topic: topicTitle }));
          setActiveTab('problems');
        }}
        onAddProblemToTopic={(topicTitle, tId) => {
          setPrefillTopicForProblem({ title: topicTitle, id: tId });
          setEditingProblem(null);
          setShowProblemForm(true);
        }}
      />

      <ProblemFormModal
        visible={showProblemForm}
        onClose={() => {
          setShowProblemForm(false);
          setEditingProblem(null);
          setPrefillTopicForProblem(null);
        }}
        onSaved={(id) => {
          loadData();
          handleSelectProblemById(id);
        }}
        problemToEdit={editingProblem}
        topics={topics}
        initialTopicTitle={prefillTopicForProblem?.title}
        initialTopicId={prefillTopicForProblem?.id}
      />

      <ProblemDetailModal
        visible={!!selectedProblemDetail}
        problem={selectedProblemDetail}
        onClose={() => setSelectedProblemDetail(null)}
        onRefresh={loadData}
        onEditProblem={(p) => {
          setSelectedProblemDetail(null);
          setEditingProblem(p);
          setShowProblemForm(true);
        }}
        onOpenAddSolution={(pId, pTitle, sol) => {
          setActiveSolutionProblem({ id: pId, title: pTitle });
          setEditingSolution(sol || null);
          setShowSolutionModal(true);
        }}
        onOpenLogAttempt={(pId, pTitle) => {
          setActiveAttemptProblem({ id: pId, title: pTitle });
          setShowLogAttemptModal(true);
        }}
        onOpenCompleteRevision={(pId) => {
          handleOpenRevisionCompleteByProblemId(pId);
        }}
      />

      {activeSolutionProblem && (
        <SolutionFormModal
          visible={showSolutionModal}
          onClose={() => {
            setShowSolutionModal(false);
            setActiveSolutionProblem(null);
            setEditingSolution(null);
          }}
          onSaved={() => {
            loadData();
            if (selectedProblemDetail) {
              handleSelectProblemById(selectedProblemDetail.id);
            }
          }}
          problemId={activeSolutionProblem.id}
          problemTitle={activeSolutionProblem.title}
          solutionToEdit={editingSolution}
        />
      )}

      {activeAttemptProblem && (
        <LogAttemptModal
          visible={showLogAttemptModal}
          onClose={() => {
            setShowLogAttemptModal(false);
            setActiveAttemptProblem(null);
          }}
          onLogged={() => {
            loadData();
            if (selectedProblemDetail) {
              handleSelectProblemById(selectedProblemDetail.id);
            }
          }}
          problemId={activeAttemptProblem.id}
          problemTitle={activeAttemptProblem.title}
        />
      )}

      {activeRevisionToComplete && (
        <CompleteRevisionModal
          visible={showCompleteRevisionModal}
          onClose={() => {
            setShowCompleteRevisionModal(false);
            setActiveRevisionToComplete(null);
          }}
          onCompleted={() => {
            loadData();
            if (selectedProblemDetail) {
              handleSelectProblemById(selectedProblemDetail.id);
            }
          }}
          revision={activeRevisionToComplete}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
  },
  content: {
    flex: 1,
  },
});
