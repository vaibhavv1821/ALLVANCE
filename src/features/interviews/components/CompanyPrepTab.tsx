import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Building2,
  CheckCircle2,
  Circle,
  HelpCircle,
  Code,
  Database,
  Users,
  FolderGit2,
  ShieldAlert,
  Play,
  Lightbulb,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SEED_COMPANIES, CompanyPrepProfile } from '@/database/seed/interviews/companyData';
import { interviewPrepRepository } from '@/database/repositories/InterviewPrepRepository';

interface CompanyPrepTabProps {
  onStartCompanyMock?: (companyName: string) => void;
  onOpenQuestionSearch?: (query: string) => void;
}

export const CompanyPrepTab: React.FC<CompanyPrepTabProps> = ({
  onStartCompanyMock,
  onOpenQuestionSearch,
}) => {
  const { colors, typography, spacing, isDark } = useAppTheme();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(SEED_COMPANIES[0].id);
  const [checklist, setChecklist] = useState<{ id: string; key: string; text: string; isCompleted: boolean }[]>([]);
  const [loadingChecklist, setLoadingChecklist] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'all' | 'technical' | 'coding' | 'sql' | 'hr' | 'projects'>('all');
  const [expandedRound, setExpandedRound] = useState<number | null>(0);

  const selectedCompany: CompanyPrepProfile =
    SEED_COMPANIES.find((c) => c.id === selectedCompanyId) || SEED_COMPANIES[0];

  const loadChecklist = useCallback(async (companyName: string) => {
    setLoadingChecklist(true);
    try {
      const items = await interviewPrepRepository.getCompanyChecklist(companyName);
      setChecklist(items);
    } catch (e) {
      console.error('Failed to load company checklist', e);
    } finally {
      setLoadingChecklist(false);
    }
  }, []);

  useEffect(() => {
    loadChecklist(selectedCompany.name);
  }, [selectedCompany.name, loadChecklist]);

  const handleToggleChecklist = async (id: string) => {
    // Optimistic UI update
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
    await interviewPrepRepository.toggleCompanyChecklistItem(id);
  };

  const completedChecklistCount = checklist.filter((i) => i.isCompleted).length;
  const checklistPercent =
    checklist.length > 0 ? Math.round((completedChecklistCount / checklist.length) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* 1. Company Picker Horizontal Carousel */}
      <View style={[styles.companyPickerWrapper, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.companyScroll}>
          {SEED_COMPANIES.map((company) => {
            const isSelected = company.id === selectedCompanyId;
            return (
              <TouchableOpacity
                key={company.id}
                onPress={() => setSelectedCompanyId(company.id)}
                style={[
                  styles.companyChip,
                  {
                    backgroundColor: isSelected ? '#818CF8' : isDark ? '#1E293B' : '#F1F5F9',
                    borderColor: isSelected ? '#818CF8' : colors.border,
                  },
                ]}
              >
                <Building2 size={15} color={isSelected ? '#FFFFFF' : colors.textSecondary} />
                <Text
                  style={[
                    styles.companyChipText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {company.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. Company Overview Hero Card */}
      <View style={[styles.heroCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.heroHeader}>
          <View style={styles.heroTitleGroup}>
            <Text style={[styles.companyTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
              {selectedCompany.name}
            </Text>
            <Text style={[styles.companyTagline, { color: colors.textSecondary }]}>
              {selectedCompany.tagline}
            </Text>
          </View>
          <View style={[styles.tierBadge, { backgroundColor: isDark ? 'rgba(129, 140, 248, 0.15)' : '#EEF2FF' }]}>
            <Text style={styles.tierText}>{selectedCompany.tier}</Text>
          </View>
        </View>

        <Text style={[styles.overviewText, { color: colors.textSecondary }]}>
          {selectedCompany.overview}
        </Text>

        {/* Common Subjects Badges */}
        <View style={styles.subjectsContainer}>
          <Text style={[styles.sectionSubtitle, { color: colors.textPrimary }]}>Common Focus Areas:</Text>
          <View style={styles.badgeWrap}>
            {selectedCompany.commonSubjects.map((sub, idx) => (
              <View key={idx} style={[styles.subjectBadge, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
                <Text style={[styles.subjectBadgeText, { color: colors.textSecondary }]}>{sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action: Launch Company Mock */}
        {onStartCompanyMock && (
          <TouchableOpacity
            onPress={() => onStartCompanyMock(selectedCompany.name)}
            style={styles.mockLaunchButton}
            activeOpacity={0.85}
          >
            <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.mockLaunchButtonText}>Launch {selectedCompany.name} Mock Interview</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 3. Disclaimer Banner */}
      <View style={[styles.disclaimerCard, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7', borderColor: '#F59E0B' }]}>
        <ShieldAlert size={18} color="#F59E0B" />
        <Text style={[styles.disclaimerText, { color: isDark ? '#FDE68A' : '#92400E' }]}>
          {selectedCompany.disclaimer}
        </Text>
      </View>

      {/* 4. Hiring Rounds & Test Structure */}
      <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Briefcase size={18} color="#818CF8" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
            Selection Process & Test Pattern
          </Text>
        </View>

        <View style={[styles.testPatternBox, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
          <Text style={[styles.testPatternLabel, { color: '#818CF8' }]}>ONLINE TEST / EXAM PATTERN</Text>
          <Text style={[styles.testPatternText, { color: colors.textPrimary }]}>{selectedCompany.testStructure}</Text>
        </View>

        <View style={styles.roundsList}>
          {selectedCompany.hiringRounds.map((round, idx) => {
            const isExpanded = expandedRound === idx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setExpandedRound(isExpanded ? null : idx)}
                style={[
                  styles.roundItem,
                  { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border },
                ]}
              >
                <View style={styles.roundHeaderRow}>
                  <View style={styles.roundNumberBadge}>
                    <Text style={styles.roundNumberText}>R{idx + 1}</Text>
                  </View>
                  <Text style={[styles.roundName, { color: colors.textPrimary }]}>{round.roundName}</Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color={colors.textSecondary} />
                  ) : (
                    <ChevronDown size={18} color={colors.textSecondary} />
                  )}
                </View>
                {isExpanded && (
                  <View style={styles.roundExpandedContent}>
                    <Text style={[styles.roundDescription, { color: colors.textSecondary }]}>
                      {round.description}
                    </Text>
                    <View style={styles.roundSkillsWrap}>
                      {round.keySkillsTested.map((skill, sIdx) => (
                        <View key={sIdx} style={[styles.skillChip, { backgroundColor: '#818CF820' }]}>
                          <Text style={styles.skillChipText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 5. Company Checklist with Interactive Persistence */}
      <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.checklistHeader}>
          <View style={styles.sectionHeaderRow}>
            <CheckCircle2 size={18} color="#10B981" />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
              Preparation Checklist
            </Text>
          </View>
          <View style={styles.checklistProgressBadge}>
            <Text style={styles.checklistProgressText}>
              {completedChecklistCount}/{checklist.length} ({checklistPercent}%)
            </Text>
          </View>
        </View>

        {loadingChecklist ? (
          <ActivityIndicator size="small" color="#818CF8" style={{ marginVertical: 16 }} />
        ) : (
          <View style={styles.checklistItems}>
            {checklist.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleToggleChecklist(item.id)}
                style={[
                  styles.checklistItemRow,
                  { borderColor: colors.border },
                  item.isCompleted && { backgroundColor: isDark ? '#052E1640' : '#ECFDF5' },
                ]}
                activeOpacity={0.7}
              >
                {item.isCompleted ? (
                  <CheckCircle2 size={20} color="#10B981" />
                ) : (
                  <Circle size={20} color={colors.textSecondary} />
                )}
                <Text
                  style={[
                    styles.checklistItemText,
                    {
                      color: item.isCompleted ? colors.textSecondary : colors.textPrimary,
                      textDecorationLine: item.isCompleted ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* 6. Interview Preparation Tips */}
      <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Lightbulb size={18} color="#F59E0B" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
            Preparation Tips & Strategy
          </Text>
        </View>

        <Text style={[styles.tipCategoryHeader, { color: '#818CF8' }]}>Technical Tips:</Text>
        {selectedCompany.technicalTips.map((tip, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{tip}</Text>
          </View>
        ))}

        <Text style={[styles.tipCategoryHeader, { color: '#10B981', marginTop: 12 }]}>HR & Behavioral Tips:</Text>
        {selectedCompany.hrTips.map((tip, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* 7. Curated Practice Question Bank Filter Tabs */}
      <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <HelpCircle size={18} color="#818CF8" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
            Reported Practice Questions
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabsScroll}>
          {[
            { id: 'all', label: 'All' },
            { id: 'technical', label: 'Technical' },
            { id: 'coding', label: 'Coding' },
            { id: 'sql', label: 'SQL' },
            { id: 'hr', label: 'HR' },
            { id: 'projects', label: 'Projects' },
          ].map((tab) => {
            const isTabActive = activeSection === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveSection(tab.id as any)}
                style={[
                  styles.filterTabChip,
                  {
                    backgroundColor: isTabActive ? '#818CF8' : isDark ? '#0F172A' : '#F1F5F9',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterTabChipText,
                    { color: isTabActive ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Question Lists based on active filter */}
        <View style={styles.questionsList}>
          {(activeSection === 'all' || activeSection === 'technical') && (
            <View style={styles.questionCategoryGroup}>
              <View style={styles.questionGroupHeader}>
                <Code size={16} color="#818CF8" />
                <Text style={[styles.questionGroupTitle, { color: colors.textPrimary }]}>Technical Interview Questions</Text>
              </View>
              {selectedCompany.curatedTechnicalQuestions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onOpenQuestionSearch && onOpenQuestionSearch(q)}
                  style={[styles.questionCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
                >
                  <Text style={[styles.questionCardNumber, { color: '#818CF8' }]}>Q{idx + 1}</Text>
                  <Text style={[styles.questionCardText, { color: colors.textPrimary }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {(activeSection === 'all' || activeSection === 'coding') && (
            <View style={styles.questionCategoryGroup}>
              <View style={styles.questionGroupHeader}>
                <Code size={16} color="#EC4899" />
                <Text style={[styles.questionGroupTitle, { color: colors.textPrimary }]}>Coding & Problem Solving</Text>
              </View>
              {selectedCompany.curatedCodingQuestions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onOpenQuestionSearch && onOpenQuestionSearch(q)}
                  style={[styles.questionCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
                >
                  <Text style={[styles.questionCardNumber, { color: '#EC4899' }]}>Q{idx + 1}</Text>
                  <Text style={[styles.questionCardText, { color: colors.textPrimary }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {(activeSection === 'all' || activeSection === 'sql') && (
            <View style={styles.questionCategoryGroup}>
              <View style={styles.questionGroupHeader}>
                <Database size={16} color="#06B6D4" />
                <Text style={[styles.questionGroupTitle, { color: colors.textPrimary }]}>SQL & Database Questions</Text>
              </View>
              {selectedCompany.curatedSqlQuestions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onOpenQuestionSearch && onOpenQuestionSearch(q)}
                  style={[styles.questionCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
                >
                  <Text style={[styles.questionCardNumber, { color: '#06B6D4' }]}>Q{idx + 1}</Text>
                  <Text style={[styles.questionCardText, { color: colors.textPrimary }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {(activeSection === 'all' || activeSection === 'hr') && (
            <View style={styles.questionCategoryGroup}>
              <View style={styles.questionGroupHeader}>
                <Users size={16} color="#10B981" />
                <Text style={[styles.questionGroupTitle, { color: colors.textPrimary }]}>HR & Behavioral Practice</Text>
              </View>
              {selectedCompany.curatedHrQuestions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onOpenQuestionSearch && onOpenQuestionSearch(q)}
                  style={[styles.questionCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
                >
                  <Text style={[styles.questionCardNumber, { color: '#10B981' }]}>Q{idx + 1}</Text>
                  <Text style={[styles.questionCardText, { color: colors.textPrimary }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {(activeSection === 'all' || activeSection === 'projects') && (
            <View style={styles.questionCategoryGroup}>
              <View style={styles.questionGroupHeader}>
                <FolderGit2 size={16} color="#F59E0B" />
                <Text style={[styles.questionGroupTitle, { color: colors.textPrimary }]}>Project Discussion Questions</Text>
              </View>
              {selectedCompany.curatedProjectQuestions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => onOpenQuestionSearch && onOpenQuestionSearch(q)}
                  style={[styles.questionCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
                >
                  <Text style={[styles.questionCardNumber, { color: '#F59E0B' }]}>Q{idx + 1}</Text>
                  <Text style={[styles.questionCardText, { color: colors.textPrimary }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  companyPickerWrapper: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  companyScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  companyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  companyChipText: {
    fontSize: 13,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heroTitleGroup: {
    flex: 1,
    marginRight: 8,
  },
  companyTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  companyTagline: {
    fontSize: 12,
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierText: {
    fontSize: 11,
    color: '#818CF8',
    fontWeight: '600',
  },
  overviewText: {
    fontSize: 13,
    lineHeight: 19,
    marginVertical: 10,
  },
  subjectsContainer: {
    marginTop: 8,
    marginBottom: 14,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  badgeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subjectBadgeText: {
    fontSize: 11,
  },
  mockLaunchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#818CF8',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  mockLaunchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
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
  },
  sectionTitle: {
    fontSize: 16,
  },
  testPatternBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  testPatternLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  testPatternText: {
    fontSize: 12,
    lineHeight: 18,
  },
  roundsList: {
    marginTop: 12,
    gap: 8,
  },
  roundItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  roundHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundNumberBadge: {
    backgroundColor: '#818CF8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roundNumberText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  roundName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  roundExpandedContent: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  roundDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  roundSkillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillChipText: {
    fontSize: 10,
    color: '#818CF8',
    fontWeight: '600',
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checklistProgressBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  checklistProgressText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  checklistItems: {
    gap: 8,
  },
  checklistItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  checklistItemText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  tipCategoryHeader: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bulletDot: {
    color: '#818CF8',
    fontSize: 14,
    lineHeight: 18,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  filterTabsScroll: {
    gap: 8,
    marginTop: 12,
    marginBottom: 14,
  },
  filterTabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  filterTabChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionsList: {
    gap: 16,
  },
  questionCategoryGroup: {
    gap: 8,
  },
  questionGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  questionGroupTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  questionCardNumber: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  questionCardText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
});
