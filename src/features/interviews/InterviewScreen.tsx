import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  Code2,
  Building2,
  Users,
  FolderGit2,
  Play,
  RotateCcw,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppHeader, LoadingIndicator } from '@/components';
import {
  interviewPrepRepository,
  CategoryWithStats,
  QuestionWithMetadata,
  InterviewDashboardMetrics,
  QuestionFilterOptions,
} from '@/database/repositories/InterviewPrepRepository';
import { InterviewTabType } from './types';
import {
  DashboardTab,
  TechnicalPrepTab,
  CompanyPrepTab,
  HrPrepTab,
  ProjectPrepTab,
  MockInterviewTab,
  RevisionTab,
  QuestionDetailModal,
  DailyGoalModal,
} from './components';

interface InterviewScreenProps {
  showBack?: boolean;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({ showBack = true }) => {
  const { colors, typography, spacing, isDark } = useAppTheme();

  // Active Tab
  const [activeTab, setActiveTab] = useState<InterviewTabType>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);

  // Core Data
  const [metrics, setMetrics] = useState<InterviewDashboardMetrics | null>(null);
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [questions, setQuestions] = useState<QuestionWithMetadata[]>([]);

  // Filter States for Technical Prep
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [filterOptions, setFilterOptions] = useState<QuestionFilterOptions>({
    categoryId: 'ALL',
    difficulty: 'ALL',
    status: 'all',
    search: '',
  });

  // Mock Interview Pre-fill Company
  const [mockPrefillCompany, setMockPrefillCompany] = useState<string | null>(null);

  // Modals
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionWithMetadata | null>(null);
  const [showDailyGoalModal, setShowDailyGoalModal] = useState<boolean>(false);

  // Load All Core Data
  const loadData = useCallback(async () => {
    try {
      const [m, cats, qs] = await Promise.all([
        interviewPrepRepository.getDashboardMetrics(),
        interviewPrepRepository.getCategories(),
        interviewPrepRepository.getQuestions(filterOptions),
      ]);

      setMetrics(m);
      setCategories(cats);
      setQuestions(qs);
    } catch (e) {
      console.error('Failed to load interview preparation data', e);
    } finally {
      setLoading(false);
    }
  }, [filterOptions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Question Completion / Bookmark / Difficult Toggles
  const handleToggleBookmark = async (qId: string) => {
    await interviewPrepRepository.toggleBookmark(qId);
    await loadData();
    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion((prev) => (prev ? { ...prev, isBookmarked: prev.isBookmarked === 1 ? 0 : 1 } : null));
    }
  };

  const handleToggleCompleted = async (qId: string) => {
    await interviewPrepRepository.toggleCompleted(qId);
    await loadData();
    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion((prev) => (prev ? { ...prev, isCompleted: prev.isCompleted === 1 ? 0 : 1 } : null));
    }
  };

  const handleToggleDifficult = async (qId: string) => {
    await interviewPrepRepository.toggleDifficult(qId);
    await loadData();
    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion((prev) => (prev ? { ...prev, isDifficult: prev.isDifficult === 1 ? 0 : 1 } : null));
    }
  };

  const handleSaveNotes = async (qId: string, noteText: string) => {
    await interviewPrepRepository.saveQuestionNote(qId, noteText);
    await loadData();
    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion((prev) => (prev ? { ...prev, noteText } : null));
    }
  };

  // Tab navigation helpers
  const handleNavigateTab = (tab: InterviewTabType, catId?: string) => {
    if (catId) {
      setSelectedCategoryId(catId);
      setFilterOptions((prev) => ({ ...prev, categoryId: catId }));
    }
    setActiveTab(tab);
  };

  const handleStartCompanyMock = (companyName: string) => {
    setMockPrefillCompany(companyName);
    setActiveTab('mock');
  };

  const handleOpenQuestionSearch = (query: string) => {
    setFilterOptions((prev) => ({ ...prev, search: query, categoryId: 'ALL' }));
    setSelectedCategoryId('ALL');
    setActiveTab('technical');
  };

  const handleContinueLearning = () => {
    // Find first uncompleted question
    const uncompleted = questions.find((q) => q.isCompleted === 0);
    if (uncompleted) {
      setSelectedQuestion(uncompleted);
    } else if (questions.length > 0) {
      setSelectedQuestion(questions[0]);
    }
  };

  const handleQuickPractice = () => {
    setFilterOptions((prev) => ({ ...prev, status: 'uncompleted' }));
    setActiveTab('technical');
  };

  const tabs: Array<{ id: InterviewTabType; label: string; icon: React.FC<{ size: number; color: string }> }> = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'technical', label: 'Technical', icon: Code2 },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'hr', label: 'HR & STAR', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'mock', label: 'Mock Mode', icon: Play },
    { id: 'revision', label: 'Revision', icon: RotateCcw },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* App Header */}
      <AppHeader
        title="Interview Preparation"
        subtitle="Offline Placement & Technical Mastery"
        showBack={showBack}
        showThemeToggle={true}
      />

      {/* Navigation Sub-Tabs Horizontal Carousel */}
      <View style={[styles.tabBarWrapper, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContainer}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabBtn,
                  isActive && { borderBottomColor: '#818CF8', borderBottomWidth: 2.5 },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Icon size={17} color={isActive ? '#818CF8' : colors.textMuted} />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? '#818CF8' : colors.textMuted,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Tab Screen Area */}
      {loading ? (
        <LoadingIndicator message="Loading Interview Arena..." />
      ) : (
        <View style={styles.content}>
          {activeTab === 'dashboard' && (
            <DashboardTab
              metrics={metrics}
              onNavigateTab={handleNavigateTab}
              onOpenDailyGoalModal={() => setShowDailyGoalModal(true)}
              onContinueLearning={handleContinueLearning}
              onQuickPractice={handleQuickPractice}
            />
          )}

          {activeTab === 'technical' && (
            <TechnicalPrepTab
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={(cId) => {
                setSelectedCategoryId(cId);
                setFilterOptions((prev) => ({ ...prev, categoryId: cId }));
              }}
              questions={questions}
              onSelectQuestion={(q) => setSelectedQuestion(q)}
              onToggleBookmark={handleToggleBookmark}
              onToggleCompleted={handleToggleCompleted}
              onToggleDifficult={handleToggleDifficult}
              filterOptions={filterOptions}
              onFilterChange={setFilterOptions}
            />
          )}

          {activeTab === 'companies' && (
            <CompanyPrepTab
              onStartCompanyMock={handleStartCompanyMock}
              onOpenQuestionSearch={handleOpenQuestionSearch}
            />
          )}

          {activeTab === 'hr' && (
            <HrPrepTab onStartHrMock={() => setActiveTab('mock')} />
          )}

          {activeTab === 'projects' && <ProjectPrepTab />}

          {activeTab === 'mock' && (
            <MockInterviewTab
              categories={categories}
              initialCompany={mockPrefillCompany}
              onNavigateToRevision={() => setActiveTab('revision')}
            />
          )}

          {activeTab === 'revision' && (
            <RevisionTab
              categories={categories}
              onSelectQuestion={(q) => setSelectedQuestion(q)}
              onNavigateToCategory={(catId) => {
                setSelectedCategoryId(catId);
                setFilterOptions((prev) => ({ ...prev, categoryId: catId }));
                setActiveTab('technical');
              }}
            />
          )}
        </View>
      )}

      {/* Global Question Detail Modal */}
      <QuestionDetailModal
        visible={!!selectedQuestion}
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        onToggleBookmark={handleToggleBookmark}
        onToggleCompleted={handleToggleCompleted}
        onToggleDifficult={handleToggleDifficult}
        onNoteUpdated={loadData}
      />

      {/* Daily Goal Customizer Modal */}
      <DailyGoalModal
        visible={showDailyGoalModal}
        currentTarget={metrics?.todayTarget || 5}
        onClose={() => setShowDailyGoalModal(false)}
        onSaveTarget={async (target: number) => {
          await interviewPrepRepository.updateDailyTarget(target);
          setShowDailyGoalModal(false);
          await loadData();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarWrapper: {
    borderBottomWidth: 1,
  },
  tabScrollContainer: {
    paddingHorizontal: 12,
    gap: 4,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tabLabel: {
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
});
