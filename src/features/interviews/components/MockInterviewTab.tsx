import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Eye,
  Star,
  Flame,
  FileEdit,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  mockInterviewRepository,
  MockSessionWithQuestions,
  MockReportSummary,
  MockInterview,
} from '@/database/repositories/MockInterviewRepository';
import { CategoryWithStats } from '@/database/repositories/InterviewPrepRepository';
import { SEED_COMPANIES } from '@/database/seed/interviews/companyData';

interface MockInterviewTabProps {
  categories: CategoryWithStats[];
  initialCompany?: string | null;
  onNavigateToRevision?: () => void;
}

export const MockInterviewTab: React.FC<MockInterviewTabProps> = ({
  categories,
  initialCompany,
  onNavigateToRevision,
}) => {
  const { colors, typography, spacing, isDark } = useAppTheme();

  // Mode: setup | active | report
  const [mode, setMode] = useState<'setup' | 'active' | 'report'>('setup');

  // Setup Form State
  const [selectedCompany, setSelectedCompany] = useState<string>(initialCompany || 'General');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timerMinutesPerQuestion, setTimerMinutesPerQuestion] = useState<number>(2); // 0 = untimed
  const [pastSessions, setPastSessions] = useState<MockInterview[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);

  // Active Session State
  const [currentSession, setCurrentSession] = useState<MockSessionWithQuestions | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userScratchpad, setUserScratchpad] = useState<string>('');
  const [isModelAnswerRevealed, setIsModelAnswerRevealed] = useState<boolean>(false);
  const [selectedSelfRating, setSelectedSelfRating] = useState<number>(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(120);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [totalSessionElapsedSeconds, setTotalSessionElapsedSeconds] = useState<number>(0);

  // Report State
  const [reportSummary, setReportSummary] = useState<MockReportSummary | null>(null);

  // Timer Ref
  const timerRef = useRef<any>(null);

  const loadPastSessions = useCallback(async () => {
    try {
      const history = await mockInterviewRepository.getMockHistory();
      setPastSessions(history);
    } catch (e) {
      console.error('Failed to load past mock sessions', e);
    }
  }, []);

  useEffect(() => {
    loadPastSessions();
  }, [loadPastSessions]);

  useEffect(() => {
    if (initialCompany) {
      setSelectedCompany(initialCompany);
    }
  }, [initialCompany]);

  // Handle Timer for Active Mode
  useEffect(() => {
    if (mode === 'active' && timerMinutesPerQuestion > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
        setTotalSessionElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [mode, timerMinutesPerQuestion, currentQuestionIndex]);

  const handleStartSession = async () => {
    setIsCreatingSession(true);
    try {
      const mockId = await mockInterviewRepository.createMockSession({
        company: selectedCompany,
        categoryId: selectedCategory,
        difficulty: selectedDifficulty,
        questionCount,
        timeLimitSeconds: timerMinutesPerQuestion * 60,
      });

      const session = await mockInterviewRepository.getMockSessionById(mockId);
      if (!session || session.questions.length === 0) {
        Alert.alert('Notice', 'No questions found matching your filter criteria. Try broader filters.');
        setIsCreatingSession(false);
        return;
      }

      setCurrentSession(session);
      setCurrentQuestionIndex(0);
      setUserScratchpad('');
      setIsModelAnswerRevealed(false);
      setSelectedSelfRating(0);
      setTimeRemainingSeconds(timerMinutesPerQuestion * 60);
      setQuestionStartTime(Date.now());
      setTotalSessionElapsedSeconds(0);
      setMode('active');
    } catch (e) {
      Alert.alert('Error', 'Failed to generate mock interview session.');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleNextOrFinish = async () => {
    if (!currentSession) return;

    const currentQ = currentSession.questions[currentQuestionIndex];
    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

    // Save answer
    await mockInterviewRepository.saveMockQuestionAnswer(currentSession.id, currentQ.questionId, {
      userAnswer: userScratchpad.trim(),
      selfRating: selectedSelfRating,
      isCorrect: selectedSelfRating >= 3,
      timeSpentSeconds: timeSpent,
    });

    if (currentQuestionIndex + 1 < currentSession.questions.length) {
      // Advance to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserScratchpad('');
      setIsModelAnswerRevealed(false);
      setSelectedSelfRating(0);
      setTimeRemainingSeconds(timerMinutesPerQuestion * 60);
      setQuestionStartTime(Date.now());
    } else {
      // Finish Session
      if (timerRef.current) clearInterval(timerRef.current);
      const summary = await mockInterviewRepository.completeMockSession(
        currentSession.id,
        totalSessionElapsedSeconds + timeSpent
      );
      setReportSummary(summary);
      setMode('report');
      await loadPastSessions();
    }
  };

  const handleQuitSession = () => {
    Alert.alert('Quit Interview', 'Are you sure you want to exit? Your progress will be discarded.', [
      { text: 'Continue Interview', style: 'cancel' },
      {
        text: 'Quit',
        style: 'destructive',
        onPress: () => {
          if (timerRef.current) clearInterval(timerRef.current);
          setMode('setup');
        },
      },
    ]);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ----------------------------------------------------
  // RENDER 1: SETUP MODE
  // ----------------------------------------------------
  if (mode === 'setup') {
    const COMPANY_OPTIONS = [
      'General',
      ...SEED_COMPANIES.map((c) => c.name),
    ];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[styles.heroCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconBox}>
              <Play size={22} color="#818CF8" fill="#818CF8" />
            </View>
            <View style={styles.bannerTextCol}>
              <Text style={[styles.bannerTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
                Offline Mock Interview Engine
              </Text>
              <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
                Practice realistic company rounds, evaluate your answers, and auto-diagnose weak topics.
              </Text>
            </View>
          </View>
        </View>

        {/* Configuration Card */}
        <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
          <Text style={[styles.configGroupTitle, { color: colors.textPrimary }]}>Target Company</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {COMPANY_OPTIONS.map((comp) => {
              const isSelected = selectedCompany === comp;
              return (
                <TouchableOpacity
                  key={comp}
                  onPress={() => setSelectedCompany(comp)}
                  style={[
                    styles.configChip,
                    {
                      backgroundColor: isSelected ? '#818CF8' : isDark ? '#0F172A' : '#F1F5F9',
                      borderColor: isSelected ? '#818CF8' : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.configChipText, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>
                    {comp}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.configGroupTitle, { color: colors.textPrimary, marginTop: 14 }]}>Focus Subject</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            <TouchableOpacity
              onPress={() => setSelectedCategory('ALL')}
              style={[
                styles.configChip,
                {
                  backgroundColor: selectedCategory === 'ALL' ? '#818CF8' : isDark ? '#0F172A' : '#F1F5F9',
                  borderColor: selectedCategory === 'ALL' ? '#818CF8' : colors.border,
                },
              ]}
            >
              <Text style={[styles.configChipText, { color: selectedCategory === 'ALL' ? '#FFFFFF' : colors.textPrimary }]}>
                All Subjects
              </Text>
            </TouchableOpacity>
            {categories.slice(0, 10).map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.configChip,
                    {
                      backgroundColor: isSelected ? '#818CF8' : isDark ? '#0F172A' : '#F1F5F9',
                      borderColor: isSelected ? '#818CF8' : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.configChipText, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.configGroupTitle, { color: colors.textPrimary, marginTop: 14 }]}>Difficulty Level</Text>
          <View style={styles.buttonGroupRow}>
            {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((diff) => {
              const isSelected = selectedDifficulty === diff;
              return (
                <TouchableOpacity
                  key={diff}
                  onPress={() => setSelectedDifficulty(diff)}
                  style={[
                    styles.groupOptionBtn,
                    {
                      backgroundColor: isSelected ? '#818CF8' : isDark ? '#0F172A' : '#F1F5F9',
                      borderColor: isSelected ? '#818CF8' : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.groupOptionText, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>
                    {diff === 'ALL' ? 'Any' : diff.charAt(0) + diff.slice(1).toLowerCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.configGroupTitle, { color: colors.textPrimary, marginTop: 14 }]}>Number of Questions</Text>
          <View style={styles.buttonGroupRow}>
            {[5, 10, 15].map((cnt) => {
              const isSelected = questionCount === cnt;
              return (
                <TouchableOpacity
                  key={cnt}
                  onPress={() => setQuestionCount(cnt)}
                  style={[
                    styles.groupOptionBtn,
                    {
                      backgroundColor: isSelected ? '#818CF8' : isDark ? '#0F172A' : '#F1F5F9',
                      borderColor: isSelected ? '#818CF8' : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.groupOptionText, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>
                    {cnt} Questions
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.configGroupTitle, { color: colors.textPrimary, marginTop: 14 }]}>Time per Question</Text>
          <View style={styles.buttonGroupRow}>
            {[
              { label: 'Untimed', val: 0 },
              { label: '2 Mins', val: 2 },
              { label: '3 Mins', val: 3 },
              { label: '5 Mins', val: 5 },
            ].map((t) => {
              const isSelected = timerMinutesPerQuestion === t.val;
              return (
                <TouchableOpacity
                  key={t.val}
                  onPress={() => setTimerMinutesPerQuestion(t.val)}
                  style={[
                    styles.groupOptionBtn,
                    {
                      backgroundColor: isSelected ? '#818CF8' : isDark ? '#0F172A' : '#F1F5F9',
                      borderColor: isSelected ? '#818CF8' : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.groupOptionText, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Launch Button */}
          <TouchableOpacity
            onPress={handleStartSession}
            disabled={isCreatingSession}
            style={[styles.startSessionBtn, { opacity: isCreatingSession ? 0.6 : 1 }]}
            activeOpacity={0.85}
          >
            <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.startSessionBtnText}>
              {isCreatingSession ? 'Generating Session...' : 'Start Mock Interview'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Mock History */}
        {pastSessions.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Award size={18} color="#818CF8" />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
                Recent Mock History
              </Text>
            </View>

            <View style={styles.historyList}>
              {pastSessions.map((session) => (
                <View
                  key={session.id}
                  style={[styles.historyItem, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
                >
                  <View style={styles.historyLeft}>
                    <Text style={[styles.historyTitle, { color: colors.textPrimary, fontWeight: '600' }]}>
                      {session.title}
                    </Text>
                    <Text style={[styles.historySub, { color: colors.textSecondary }]}>
                      {session.totalQuestions} questions • {session.difficulty}
                    </Text>
                  </View>
                  <View style={styles.historyRight}>
                    <View
                      style={[
                        styles.scoreBadge,
                        {
                          backgroundColor:
                            session.score >= 70 ? '#10B98120' : session.score >= 50 ? '#F59E0B20' : '#EF444420',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.scoreBadgeText,
                          {
                            color:
                              session.score >= 70 ? '#10B981' : session.score >= 50 ? '#F59E0B' : '#EF4444',
                          },
                        ]}
                      >
                        {session.score}%
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  // ----------------------------------------------------
  // RENDER 2: ACTIVE SESSION ENGINE
  // ----------------------------------------------------
  if (mode === 'active' && currentSession) {
    const totalQ = currentSession.questions.length;
    const currentQ = currentSession.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === totalQ - 1;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQ) * 100);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Top Sticky Status Bar */}
        <View style={[styles.activeStatusBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.statusBarTopRow}>
            <View style={styles.statusLeftPill}>
              <Text style={[styles.statusCompany, { color: colors.textSecondary }]}>
                {currentSession.company}
              </Text>
              <Text style={[styles.statusCounter, { color: '#818CF8', fontWeight: '700' }]}>
                Q {currentQuestionIndex + 1} of {totalQ}
              </Text>
            </View>

            {timerMinutesPerQuestion > 0 && (
              <View
                style={[
                  styles.timerBox,
                  {
                    backgroundColor:
                      timeRemainingSeconds <= 30 ? 'rgba(239, 68, 68, 0.15)' : isDark ? '#0F172A' : '#F1F5F9',
                  },
                ]}
              >
                <Clock
                  size={14}
                  color={timeRemainingSeconds <= 30 ? '#EF4444' : '#818CF8'}
                />
                <Text
                  style={[
                    styles.timerText,
                    {
                      color: timeRemainingSeconds <= 30 ? '#EF4444' : colors.textPrimary,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {formatTimer(timeRemainingSeconds)}
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={handleQuitSession} style={styles.quitBtn}>
              <Text style={styles.quitBtnText}>Quit</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Line */}
          <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: '#818CF8' }]} />
          </View>
        </View>

        {/* Question Card */}
        <View style={[styles.activeQuestionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
          <View style={styles.questionBadgesRow}>
            <View style={[styles.catBadge, { backgroundColor: '#818CF820' }]}>
              <Text style={styles.catBadgeText}>{currentQ.categoryName || 'General'}</Text>
            </View>
            <View style={[styles.diffBadge, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
              <Text style={[styles.diffBadgeText, { color: colors.textSecondary }]}>{currentQ.questionDifficulty}</Text>
            </View>
          </View>

          <Text style={[styles.activeQuestionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
            {currentQ.questionTitle}
          </Text>
        </View>

        {/* Answer Drafting Scratchpad */}
        <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <FileEdit size={16} color="#818CF8" />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
              Your Answer / Scratchpad
            </Text>
          </View>
          <Text style={[styles.scratchpadHint, { color: colors.textSecondary }]}>
            Draft your key points or speak aloud before checking the model explanation.
          </Text>

          <TextInput
            multiline
            numberOfLines={4}
            value={userScratchpad}
            onChangeText={setUserScratchpad}
            placeholder="Type your answer, algorithm thoughts, or SQL query draft..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.scratchpadInput, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
          />
        </View>

        {/* Reveal Model Answer Button */}
        {!isModelAnswerRevealed ? (
          <TouchableOpacity
            onPress={() => setIsModelAnswerRevealed(true)}
            style={styles.revealBtn}
            activeOpacity={0.8}
          >
            <Eye size={18} color="#FFFFFF" />
            <Text style={styles.revealBtnText}>Reveal Model Answer</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <Sparkles size={18} color="#10B981" />
              <Text style={[styles.sectionTitle, { color: '#10B981', fontWeight: '700' }]}>
                Model Answer & Evaluation
              </Text>
            </View>

            <Text style={[styles.modelAnswerText, { color: colors.textPrimary }]}>
              {currentQ.modelAnswer}
            </Text>

            {currentQ.codeExample && (
              <View style={[styles.codeBox, { backgroundColor: '#090D16' }]}>
                <Text style={styles.codeText}>{currentQ.codeExample}</Text>
              </View>
            )}

            {/* Self-Assessment Rating Bar */}
            <View style={[styles.ratingSection, { borderTopColor: colors.border }]}>
              <Text style={[styles.ratingPrompt, { color: colors.textPrimary, fontWeight: '700' }]}>
                Self-Rate Your Response:
              </Text>
              <Text style={[styles.ratingSub, { color: colors.textSecondary }]}>
                Be honest with yourself to train accurate revision priorities:
              </Text>

              <View style={styles.ratingStarsRow}>
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isSelected = selectedSelfRating >= starVal;
                  return (
                    <TouchableOpacity
                      key={starVal}
                      onPress={() => setSelectedSelfRating(starVal)}
                      style={styles.starTouch}
                    >
                      <Star
                        size={32}
                        color={isSelected ? '#F59E0B' : colors.border}
                        fill={isSelected ? '#F59E0B' : 'none'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.ratingLabelText, { color: selectedSelfRating >= 3 ? '#10B981' : '#F59E0B' }]}>
                {selectedSelfRating === 1 && '1/5: Missed Core Concepts (Needs Revision)'}
                {selectedSelfRating === 2 && '2/5: Partial Understanding (Needs Revision)'}
                {selectedSelfRating === 3 && '3/5: Adequate Answer (Pass)'}
                {selectedSelfRating === 4 && '4/5: Strong Explanation (Good)'}
                {selectedSelfRating === 5 && '5/5: Flawless & Comprehensive (Mastered)'}
                {selectedSelfRating === 0 && 'Tap a star to rate yourself'}
              </Text>
            </View>
          </View>
        )}

        {/* Next Question Navigation */}
        <TouchableOpacity
          onPress={handleNextOrFinish}
          style={[styles.nextBtn, { backgroundColor: isLastQuestion ? '#10B981' : '#818CF8' }]}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {isLastQuestion ? 'Finish & Generate Report' : 'Next Question'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ----------------------------------------------------
  // RENDER 3: END-OF-SESSION REPORT
  // ----------------------------------------------------
  if (mode === 'report' && reportSummary) {
    const { scorePercentage, attempted, totalQuestions, correct, timeSpentSeconds, categoryBreakdown, weakTopics, strongTopics } = reportSummary;

    const mins = Math.floor(timeSpentSeconds / 60);
    const secs = timeSpentSeconds % 60;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Score Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
          <View style={styles.reportScoreRow}>
            <View
              style={[
                styles.largeScoreCircle,
                {
                  backgroundColor:
                    scorePercentage >= 75
                      ? 'rgba(16, 185, 129, 0.15)'
                      : scorePercentage >= 50
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  borderColor:
                    scorePercentage >= 75 ? '#10B981' : scorePercentage >= 50 ? '#F59E0B' : '#EF4444',
                },
              ]}
            >
              <Text
                style={[
                  styles.largeScoreNumber,
                  {
                    color:
                      scorePercentage >= 75 ? '#10B981' : scorePercentage >= 50 ? '#F59E0B' : '#EF4444',
                    fontWeight: '800',
                  },
                ]}
              >
                {scorePercentage}%
              </Text>
              <Text style={[styles.largeScoreLabel, { color: colors.textSecondary }]}>Overall</Text>
            </View>

            <View style={styles.reportStatsCol}>
              <Text style={[styles.reportVerdict, { color: colors.textPrimary, fontWeight: '700' }]}>
                {scorePercentage >= 80
                  ? 'Interview Ready!'
                  : scorePercentage >= 60
                  ? 'Solid Foundation'
                  : 'Needs Targeted Revision'}
              </Text>
              <Text style={[styles.reportVerdictSub, { color: colors.textSecondary }]}>
                Rule-based diagnostic assessment based on your self-ratings and attempts.
              </Text>

              <View style={styles.miniStatsRow}>
                <View style={styles.miniStatItem}>
                  <Text style={[styles.miniStatNum, { color: '#818CF8', fontWeight: '700' }]}>{attempted}/{totalQuestions}</Text>
                  <Text style={[styles.miniStatLbl, { color: colors.textSecondary }]}>Attempted</Text>
                </View>
                <View style={styles.miniStatItem}>
                  <Text style={[styles.miniStatNum, { color: '#10B981', fontWeight: '700' }]}>{correct}</Text>
                  <Text style={[styles.miniStatLbl, { color: colors.textSecondary }]}>Rated 3★+</Text>
                </View>
                <View style={styles.miniStatItem}>
                  <Text style={[styles.miniStatNum, { color: colors.textPrimary, fontWeight: '700' }]}>{mins}m {secs}s</Text>
                  <Text style={[styles.miniStatLbl, { color: colors.textSecondary }]}>Time</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Category Performance Breakdown */}
        <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <TrendingUp size={18} color="#818CF8" />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
              Category Performance
            </Text>
          </View>

          <View style={styles.breakdownList}>
            {Object.entries(categoryBreakdown).map(([catName, stats]) => {
              const catPercent = Math.round((stats.correct / stats.total) * 100);
              return (
                <View key={catName} style={styles.breakdownRow}>
                  <View style={styles.breakdownInfoRow}>
                    <Text style={[styles.breakdownCatName, { color: colors.textPrimary, fontWeight: '600' }]}>
                      {catName}
                    </Text>
                    <Text style={[styles.breakdownCatScore, { color: catPercent >= 60 ? '#10B981' : '#F59E0B' }]}>
                      {stats.correct}/{stats.total} ({catPercent}%)
                    </Text>
                  </View>
                  <View style={[styles.breakdownBarBg, { backgroundColor: isDark ? '#0F172A' : '#E2E8F0' }]}>
                    <View
                      style={[
                        styles.breakdownBarFill,
                        {
                          width: `${catPercent}%`,
                          backgroundColor: catPercent >= 60 ? '#10B981' : '#F59E0B',
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Weak Topics Enqueued for Revision */}
        {weakTopics.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
            <View style={styles.sectionHeaderRow}>
              <AlertTriangle size={18} color="#EF4444" />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
                Topics Requiring Revision
              </Text>
            </View>
            <Text style={[styles.weakTopicsDesc, { color: colors.textSecondary }]}>
              These questions were rated &lt; 3★ and have been automatically added to your Spaced Revision Queue:
            </Text>

            <View style={styles.topicsWrap}>
              {weakTopics.map((topic, idx) => (
                <View key={idx} style={[styles.topicBadgeWeak, { backgroundColor: '#EF444420' }]}>
                  <Text style={styles.topicBadgeWeakText}>{topic}</Text>
                </View>
              ))}
            </View>

            {onNavigateToRevision && (
              <TouchableOpacity
                onPress={onNavigateToRevision}
                style={[styles.revisionQueueBtn, { borderColor: '#818CF8' }]}
              >
                <Text style={styles.revisionQueueBtnText}>Go to Revision Queue</Text>
                <ChevronRight size={16} color="#818CF8" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.reportActionsRow}>
          <TouchableOpacity
            onPress={() => setMode('setup')}
            style={styles.anotherMockBtn}
            activeOpacity={0.85}
          >
            <RotateCcw size={16} color="#FFFFFF" />
            <Text style={styles.anotherMockBtnText}>Start Another Mock</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
  },
  configGroupTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  chipsScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  configChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  configChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonGroupRow: {
    flexDirection: 'row',
    gap: 8,
  },
  groupOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  startSessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#818CF8',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  startSessionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  historyLeft: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  historySub: {
    fontSize: 11,
  },
  historyRight: {
    marginLeft: 10,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  activeStatusBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  statusBarTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusLeftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusCompany: {
    fontSize: 12,
  },
  statusCounter: {
    fontSize: 14,
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 13,
  },
  quitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  quitBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
  },
  activeQuestionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  questionBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catBadgeText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '600',
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeQuestionTitle: {
    fontSize: 18,
    lineHeight: 26,
  },
  scratchpadHint: {
    fontSize: 11,
    marginBottom: 10,
  },
  scratchpadInput: {
    minHeight: 90,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 13,
    lineHeight: 19,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#818CF8',
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  revealBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modelAnswerText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  codeBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  codeText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  ratingSection: {
    paddingTop: 14,
    borderTopWidth: 1,
  },
  ratingPrompt: {
    fontSize: 14,
    marginBottom: 2,
  },
  ratingSub: {
    fontSize: 11,
    marginBottom: 10,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  starTouch: {
    padding: 4,
  },
  ratingLabelText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  reportScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  largeScoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeScoreNumber: {
    fontSize: 26,
  },
  largeScoreLabel: {
    fontSize: 10,
  },
  reportStatsCol: {
    flex: 1,
  },
  reportVerdict: {
    fontSize: 17,
    marginBottom: 2,
  },
  reportVerdictSub: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatItem: {
    alignItems: 'center',
  },
  miniStatNum: {
    fontSize: 13,
  },
  miniStatLbl: {
    fontSize: 10,
  },
  breakdownList: {
    gap: 10,
  },
  breakdownRow: {
    gap: 4,
  },
  breakdownInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownCatName: {
    fontSize: 13,
  },
  breakdownCatScore: {
    fontSize: 12,
    fontWeight: '700',
  },
  breakdownBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: 6,
    borderRadius: 3,
  },
  weakTopicsDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  topicsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  topicBadgeWeak: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  topicBadgeWeakText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  revisionQueueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  revisionQueueBtnText: {
    color: '#818CF8',
    fontSize: 13,
    fontWeight: '600',
  },
  reportActionsRow: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  anotherMockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#818CF8',
    paddingVertical: 14,
    borderRadius: 12,
  },
  anotherMockBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
