import React, { useState, useEffect } from 'react';
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
  Users,
  Award,
  Sparkles,
  HelpCircle,
  FileEdit,
  Save,
  CheckCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HR_QUESTIONS } from '@/database/seed/interviews/hrQuestions';
import { interviewPrepRepository } from '@/database/repositories/InterviewPrepRepository';
import { SeedInterviewQuestion } from '@/database/seed/interviews/types';

interface HrPrepTabProps {
  onStartHrMock?: () => void;
}

export const HrPrepTab: React.FC<HrPrepTabProps> = ({ onStartHrMock }) => {
  const { colors, typography, spacing, isDark } = useAppTheme();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(HR_QUESTIONS[0].id);
  const [userCustomAnswer, setUserCustomAnswer] = useState<string>('');
  const [isSavingAnswer, setIsSavingAnswer] = useState<boolean>(false);
  const [savedNotification, setSavedNotification] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'essential' | 'behavioral' | 'situational' | 'career'>('all');
  const [showStarGuide, setShowStarGuide] = useState<boolean>(false);

  const currentQuestion: SeedInterviewQuestion =
    HR_QUESTIONS.find((q) => q.id === selectedQuestionId) || HR_QUESTIONS[0];

  // Load user's saved answer for current question
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const saved = await interviewPrepRepository.getHrAnswer(currentQuestion.id);
        if (isMounted) {
          setUserCustomAnswer(saved || '');
          setSavedNotification(false);
        }
      } catch (e) {
        console.error('Failed to load HR answer', e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [currentQuestion.id]);

  const handleSaveAnswer = async () => {
    setIsSavingAnswer(true);
    try {
      await interviewPrepRepository.saveHrAnswer(currentQuestion.id, userCustomAnswer);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2500);
    } catch (e) {
      Alert.alert('Error', 'Failed to save personal answer');
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const getFilteredQuestions = () => {
    switch (activeFilter) {
      case 'essential':
        return HR_QUESTIONS.slice(0, 5);
      case 'behavioral':
        return HR_QUESTIONS.filter(
          (q) => q.tags.includes('Teamwork') || q.tags.includes('Leadership') || q.tags.includes('STAR Method')
        );
      case 'situational':
        return HR_QUESTIONS.filter(
          (q) => q.tags.includes('Pressure') || q.tags.includes('Flexibility') || q.tags.includes('Conflict Resolution')
        );
      case 'career':
        return HR_QUESTIONS.filter(
          (q) => q.tags.includes('Career Goals') || q.tags.includes('Salary') || q.tags.includes('Candidate Questions')
        );
      default:
        return HR_QUESTIONS;
    }
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* 1. Header Banner & STAR Method Toggle */}
      <View style={[styles.headerBanner, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.bannerRow}>
          <View style={styles.bannerIconBox}>
            <Users size={22} color="#10B981" />
          </View>
          <View style={styles.bannerTextCol}>
            <Text style={[styles.bannerTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
              HR & Behavioral Mastery
            </Text>
            <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
              Master standard frameworks, model answers, and draft your custom elevator pitch.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowStarGuide(!showStarGuide)}
          style={[styles.starGuideToggle, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}
        >
          <View style={styles.starToggleLeft}>
            <Award size={16} color="#818CF8" />
            <Text style={[styles.starToggleText, { color: colors.textPrimary }]}>STAR Answering Formula Guide</Text>
          </View>
          {showStarGuide ? <ChevronUp size={16} color={colors.textSecondary} /> : <ChevronDown size={16} color={colors.textSecondary} />}
        </TouchableOpacity>

        {showStarGuide && (
          <View style={[styles.starGuideContent, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
            <View style={styles.starStepRow}>
              <View style={[styles.starLetterBadge, { backgroundColor: '#818CF8' }]}>
                <Text style={styles.starLetterText}>S</Text>
              </View>
              <View style={styles.starStepInfo}>
                <Text style={[styles.starStepTitle, { color: colors.textPrimary }]}>Situation (15%)</Text>
                <Text style={[styles.starStepDesc, { color: colors.textSecondary }]}>
                  Set the scene: what project, role, or team challenge were you facing?
                </Text>
              </View>
            </View>

            <View style={styles.starStepRow}>
              <View style={[styles.starLetterBadge, { backgroundColor: '#EC4899' }]}>
                <Text style={styles.starLetterText}>T</Text>
              </View>
              <View style={styles.starStepInfo}>
                <Text style={[styles.starStepTitle, { color: colors.textPrimary }]}>Task (15%)</Text>
                <Text style={[styles.starStepDesc, { color: colors.textSecondary }]}>
                  Identify your direct responsibility or target deliverable.
                </Text>
              </View>
            </View>

            <View style={styles.starStepRow}>
              <View style={[styles.starLetterBadge, { backgroundColor: '#10B981' }]}>
                <Text style={styles.starLetterText}>A</Text>
              </View>
              <View style={styles.starStepInfo}>
                <Text style={[styles.starStepTitle, { color: colors.textPrimary }]}>Action (50%)</Text>
                <Text style={[styles.starStepDesc, { color: colors.textSecondary }]}>
                  Explain step-by-step what actions you took, how you collaborated, and how you solved it.
                </Text>
              </View>
            </View>

            <View style={styles.starStepRow}>
              <View style={[styles.starLetterBadge, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.starLetterText}>R</Text>
              </View>
              <View style={styles.starStepInfo}>
                <Text style={[styles.starStepTitle, { color: colors.textPrimary }]}>Result (20%)</Text>
                <Text style={[styles.starStepDesc, { color: colors.textSecondary }]}>
                  Quantify the outcome (e.g. latency reduced by 30%, shipped on time) and lessons learned.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 2. Filter Pills */}
      <View style={styles.filterPillsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'All HR Questions' },
            { id: 'essential', label: 'Top 5 Essentials' },
            { id: 'behavioral', label: 'Behavioral & STAR' },
            { id: 'situational', label: 'Situational & Pressure' },
            { id: 'career', label: 'Career & Goals' },
          ].map((pill) => {
            const isSelected = activeFilter === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                onPress={() => setActiveFilter(pill.id as any)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? '#10B981' : isDark ? '#1E293B' : '#F1F5F9',
                    borderColor: isSelected ? '#10B981' : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Horizontal Carousel for Quick Question Selection */}
      <View style={styles.questionSelectorSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.questionCarousel}>
          {filteredQuestions.map((q, idx) => {
            const isSelected = q.id === currentQuestion.id;
            return (
              <TouchableOpacity
                key={q.id}
                onPress={() => setSelectedQuestionId(q.id)}
                style={[
                  styles.questionSelectCard,
                  {
                    backgroundColor: isSelected ? '#818CF8' : isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isSelected ? '#818CF8' : colors.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.questionSelectNum,
                    { color: isSelected ? 'rgba(255, 255, 255, 0.8)' : '#818CF8' },
                  ]}
                >
                  #{idx + 1}
                </Text>
                <Text
                  style={[
                    styles.questionSelectTitle,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: '600',
                    },
                  ]}
                  numberOfLines={2}
                >
                  {q.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Active Question Full Deep-Dive */}
      <View style={[styles.mainCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.questionHeader}>
          <View style={styles.tagsRow}>
            {currentQuestion.tags.map((tag, tIdx) => (
              <View key={tIdx} style={[styles.tagBadge, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
                <Text style={[styles.tagBadgeText, { color: colors.textSecondary }]}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.questionMainTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
            {currentQuestion.title}
          </Text>
        </View>

        {/* Answer Structure & Strategy */}
        <View style={[styles.subSection, { borderTopColor: colors.border }]}>
          <View style={styles.subHeaderRow}>
            <Sparkles size={16} color="#818CF8" />
            <Text style={[styles.subSectionTitle, { color: colors.textPrimary }]}>Recommended Framework & Strategy</Text>
          </View>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
            {currentQuestion.answer}
          </Text>
        </View>

        {/* Sample Model Answer */}
        {currentQuestion.example && (
          <View style={[styles.subSection, { borderTopColor: colors.border }]}>
            <View style={styles.subHeaderRow}>
              <Award size={16} color="#10B981" />
              <Text style={[styles.subSectionTitle, { color: '#10B981' }]}>Sample High-Impact Answer</Text>
            </View>
            <View style={[styles.sampleAnswerBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}>
              <Text style={[styles.sampleAnswerText, { color: colors.textPrimary }]}>
                {currentQuestion.example}
              </Text>
            </View>
          </View>
        )}

        {/* Key Points to Mention */}
        {currentQuestion.keyPoints && currentQuestion.keyPoints.length > 0 && (
          <View style={[styles.subSection, { borderTopColor: colors.border }]}>
            <View style={styles.subHeaderRow}>
              <Lightbulb size={16} color="#F59E0B" />
              <Text style={[styles.subSectionTitle, { color: colors.textPrimary }]}>Key Points to Mention</Text>
            </View>
            {currentQuestion.keyPoints.map((point, pIdx) => (
              <View key={pIdx} style={styles.bulletRow}>
                <CheckCircle size={14} color="#10B981" style={{ marginTop: 2 }} />
                <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Follow-up Questions from Interviewers */}
        {currentQuestion.followUps && currentQuestion.followUps.length > 0 && (
          <View style={[styles.subSection, { borderTopColor: colors.border }]}>
            <View style={styles.subHeaderRow}>
              <HelpCircle size={16} color="#818CF8" />
              <Text style={[styles.subSectionTitle, { color: colors.textPrimary }]}>Potential Follow-Up Questions</Text>
            </View>
            {currentQuestion.followUps.map((f, fIdx) => (
              <View key={fIdx} style={[styles.followUpCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
                <Text style={[styles.followUpQ, { color: colors.textPrimary }]}>
                  &ldquo;{f.question}&rdquo;
                </Text>
                <Text style={[styles.followUpA, { color: colors.textSecondary }]}>{f.answer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 5. Personal Answer Script Editor */}
        <View style={[styles.editorSection, { borderTopColor: colors.border }]}>
          <View style={styles.editorHeaderRow}>
            <View style={styles.editorTitleWrap}>
              <FileEdit size={16} color="#818CF8" />
              <Text style={[styles.subSectionTitle, { color: colors.textPrimary }]}>Your Personal Script</Text>
            </View>
            {savedNotification && (
              <View style={styles.savedPill}>
                <CheckCircle size={12} color="#10B981" />
                <Text style={styles.savedPillText}>Saved locally</Text>
              </View>
            )}
          </View>
          <Text style={[styles.editorHint, { color: colors.textSecondary }]}>
            Write your personalized response tailored to your background, projects, and career story.
          </Text>

          <TextInput
            multiline
            numberOfLines={5}
            value={userCustomAnswer}
            onChangeText={setUserCustomAnswer}
            placeholder="Type your tailored answer script here... (e.g. My name is... I built ALLVANCE...)"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.textInput,
              {
                color: colors.textPrimary,
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                borderColor: colors.border,
              },
            ]}
          />

          <View style={styles.editorActionsRow}>
            <TouchableOpacity
              onPress={handleSaveAnswer}
              disabled={isSavingAnswer}
              style={[styles.saveBtn, { opacity: isSavingAnswer ? 0.6 : 1 }]}
              activeOpacity={0.8}
            >
              <Save size={15} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>{isSavingAnswer ? 'Saving...' : 'Save Answer'}</Text>
            </TouchableOpacity>

            {userCustomAnswer.trim().length > 0 && (
              <TouchableOpacity
                onPress={() => setUserCustomAnswer('')}
                style={[styles.clearBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.clearBtnText, { color: colors.textSecondary }]}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerBanner: {
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
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
  starGuideToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  starToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starToggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  starGuideContent: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  starStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  starLetterBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starLetterText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  starStepInfo: {
    flex: 1,
  },
  starStepTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  starStepDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  filterPillsRow: {
    marginTop: 14,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
  },
  questionSelectorSection: {
    marginTop: 14,
  },
  questionCarousel: {
    paddingHorizontal: 16,
    gap: 10,
  },
  questionSelectCard: {
    width: 180,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
    height: 80,
  },
  questionSelectNum: {
    fontSize: 10,
    fontWeight: '700',
  },
  questionSelectTitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  mainCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  questionHeader: {
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 11,
  },
  questionMainTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  subSection: {
    paddingTop: 14,
    marginTop: 14,
    borderTopWidth: 1,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  sampleAnswerBox: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  sampleAnswerText: {
    fontSize: 13,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  followUpCard: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  followUpQ: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  followUpA: {
    fontSize: 12,
    lineHeight: 17,
  },
  editorSection: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  editorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  editorTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  savedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  savedPillText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  editorHint: {
    fontSize: 11,
    marginBottom: 10,
  },
  textInput: {
    minHeight: 110,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    textAlignVertical: 'top',
    fontSize: 13,
    lineHeight: 19,
  },
  editorActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#818CF8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 13,
  },
});
