import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import {
  FolderGit2,
  Cpu,
  Database,
  Layers,
  Shield,
  Zap,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { FLAGSHIP_PROJECTS, FlagshipProjectBlueprint } from '@/database/seed/interviews/flagshipProjects';
import { interviewPrepRepository } from '@/database/repositories/InterviewPrepRepository';
import { InterviewUserProject } from '@/database/schema/interviews';

export const ProjectPrepTab: React.FC = () => {
  const { colors, typography, spacing, isDark } = useAppTheme();
  const [projects, setProjects] = useState<InterviewUserProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('servmate');
  const [resumeProjects, setResumeProjects] = useState<
    { id: string; resumeId: string; title: string; subtitle: string | null; techStack: string | null; description: string | null }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('intro');

  // Custom Q&A Modal
  const [showAddQnaModal, setShowAddQnaModal] = useState<boolean>(false);
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newAnswerText, setNewAnswerText] = useState<string>('');

  // Add Custom Project Modal
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customSubtitle, setCustomSubtitle] = useState<string>('');
  const [customTechStack, setCustomTechStack] = useState<string>('');
  const [customProblem, setCustomProblem] = useState<string>('');
  const [customArchitecture, setCustomArchitecture] = useState<string>('');
  const [customDatabase, setCustomDatabase] = useState<string>('');
  const [customApis, setCustomApis] = useState<string>('');
  const [customChallenges, setCustomChallenges] = useState<string>('');
  const [customDecisions, setCustomDecisions] = useState<string>('');
  const [customScalability, setCustomScalability] = useState<string>('');
  const [customSecurity, setCustomSecurity] = useState<string>('');
  const [customFuture, setCustomFuture] = useState<string>('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const dbProjects = await interviewPrepRepository.getProjects();
      setProjects(dbProjects);

      const rProjects = await interviewPrepRepository.getResumeProjects();
      setResumeProjects(rProjects);

      if (dbProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(dbProjects[0].id);
      }
    } catch (e) {
      console.error('Failed to load project data', e);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) ||
    FLAGSHIP_PROJECTS.find((p) => p.id === selectedProjectId) ||
    FLAGSHIP_PROJECTS[0];

  // Parse questions (predefined + custom)
  let parsedQuestions: Array<{ id: string; question: string; answer: string; isCustom?: boolean }> = [];
  try {
    if (activeProject && 'customQuestions' in activeProject && activeProject.customQuestions) {
      parsedQuestions = JSON.parse(activeProject.customQuestions);
    } else if (activeProject && 'curatedQuestions' in activeProject && activeProject.curatedQuestions) {
      parsedQuestions = (activeProject as any).curatedQuestions;
    }
  } catch {
    parsedQuestions = [];
  }

  const handleAddQnA = async () => {
    if (!newQuestionText.trim() || !newAnswerText.trim()) {
      Alert.alert('Validation Error', 'Please provide both question and answer text.');
      return;
    }
    try {
      await interviewPrepRepository.addCustomProjectQuestion(
        activeProject.id,
        newQuestionText.trim(),
        newAnswerText.trim()
      );
      setNewQuestionText('');
      setNewAnswerText('');
      setShowAddQnaModal(false);
      await loadData();
    } catch (e) {
      Alert.alert('Error', 'Failed to save question.');
    }
  };

  const handleDeleteQnA = async (qId: string) => {
    Alert.alert('Delete Question', 'Are you sure you want to delete this custom question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await interviewPrepRepository.deleteCustomProjectQuestion(activeProject.id, qId);
          await loadData();
        },
      },
    ]);
  };

  const handleSaveCustomProject = async () => {
    if (!customTitle.trim()) {
      Alert.alert('Validation Error', 'Project title is required.');
      return;
    }

    try {
      const newId = await interviewPrepRepository.saveCustomProject({
        title: customTitle.trim(),
        subtitle: customSubtitle.trim(),
        techStack: customTechStack.trim(),
        problemStatement: customProblem.trim(),
        architecture: customArchitecture.trim(),
        databaseDesign: customDatabase.trim(),
        apis: customApis.trim(),
        challenges: customChallenges.trim(),
        technicalDecisions: customDecisions.trim(),
        scalability: customScalability.trim(),
        security: customSecurity.trim(),
        futureImprovements: customFuture.trim(),
      });

      setShowAddProjectModal(false);
      resetProjectForm();
      await loadData();
      setSelectedProjectId(newId);
    } catch (e) {
      Alert.alert('Error', 'Failed to save custom project.');
    }
  };

  const handleImportResumeProject = async (rProj: (typeof resumeProjects)[0]) => {
    try {
      const newId = await interviewPrepRepository.saveCustomProject({
        title: rProj.title,
        subtitle: rProj.subtitle || 'Imported from Resume Manager',
        techStack: rProj.techStack || '',
        problemStatement: rProj.description || '',
        architecture: '',
        databaseDesign: '',
        apis: '',
        challenges: '',
        technicalDecisions: '',
        scalability: '',
        security: '',
        futureImprovements: '',
      });
      await loadData();
      setSelectedProjectId(newId);
      Alert.alert('Success', `Imported "${rProj.title}" into Interview Prep!`);
    } catch (e) {
      Alert.alert('Error', 'Failed to import resume project.');
    }
  };

  const resetProjectForm = () => {
    setCustomTitle('');
    setCustomSubtitle('');
    setCustomTechStack('');
    setCustomProblem('');
    setCustomArchitecture('');
    setCustomDatabase('');
    setCustomApis('');
    setCustomChallenges('');
    setCustomDecisions('');
    setCustomScalability('');
    setCustomSecurity('');
    setCustomFuture('');
  };

  const isPredefined =
    'isPredefined' in activeProject ? (activeProject as any).isPredefined === 1 : true;
  const introductionText =
    'introduction' in activeProject
      ? (activeProject as any).introduction
      : activeProject.problemStatement;

  const BLUEPRINT_SECTIONS = [
    { id: 'intro', title: '1. Project Overview & Introduction', icon: FileText, content: introductionText },
    { id: 'problem', title: '2. Problem Statement & Motivation', icon: AlertCircle, content: activeProject.problemStatement },
    { id: 'arch', title: '3. System Architecture & Components', icon: Layers, content: activeProject.architecture },
    { id: 'db', title: '4. Database Design & Schemas', icon: Database, content: activeProject.databaseDesign },
    { id: 'apis', title: '5. APIs & Network Contracts', icon: Cpu, content: activeProject.apis },
    { id: 'challenges', title: '6. Engineering Challenges & Solutions', icon: Zap, content: activeProject.challenges },
    { id: 'decisions', title: '7. Technical Decisions & Tradeoffs', icon: Sparkles, content: activeProject.technicalDecisions },
    { id: 'scale', title: '8. Scalability & Performance Bottlenecks', icon: TrendingUp, content: activeProject.scalability },
    { id: 'sec', title: '9. Security & Access Control', icon: Shield, content: activeProject.security },
    { id: 'future', title: '10. Future Improvements & Roadmap', icon: FolderGit2, content: activeProject.futureImprovements },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* 1. Projects Carousel */}
      <View style={[styles.projectsPickerWrapper, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectsScroll}>
          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <TouchableOpacity
                key={proj.id}
                onPress={() => setSelectedProjectId(proj.id)}
                style={[
                  styles.projectChip,
                  {
                    backgroundColor: isSelected ? '#818CF8' : isDark ? '#1E293B' : '#F1F5F9',
                    borderColor: isSelected ? '#818CF8' : colors.border,
                  },
                ]}
              >
                <FolderGit2 size={15} color={isSelected ? '#FFFFFF' : colors.textSecondary} />
                <Text
                  style={[
                    styles.projectChipText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {proj.title}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => setShowAddProjectModal(true)}
            style={[styles.addProjectChip, { borderColor: '#818CF8' }]}
          >
            <Plus size={15} color="#818CF8" />
            <Text style={styles.addProjectChipText}>Custom Project</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 2. Resume Manager Integration Banner */}
      {resumeProjects.length > 0 && (
        <View style={[styles.resumeBanner, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
          <View style={styles.resumeBannerHeader}>
            <FileText size={16} color="#818CF8" />
            <Text style={[styles.resumeBannerTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
              Saved Resume Projects ({resumeProjects.length})
            </Text>
          </View>
          <Text style={[styles.resumeBannerDesc, { color: colors.textSecondary }]}>
            Import projects directly from your saved resumes into interview preparation:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.resumeScroll}>
            {resumeProjects.map((rp) => (
              <TouchableOpacity
                key={rp.id}
                onPress={() => handleImportResumeProject(rp)}
                style={[styles.resumeProjectCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
              >
                <Text style={[styles.resumeProjectName, { color: colors.textPrimary, fontWeight: '600' }]} numberOfLines={1}>
                  {rp.title}
                </Text>
                {rp.techStack && (
                  <Text style={[styles.resumeProjectTech, { color: colors.textSecondary }]} numberOfLines={1}>
                    {rp.techStack}
                  </Text>
                )}
                <View style={styles.importPill}>
                  <Plus size={11} color="#818CF8" />
                  <Text style={styles.importPillText}>Prepare Interview</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 3. Selected Project Hero Details */}
      <View style={[styles.heroCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.heroTitleRow}>
          <Text style={[styles.projectTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
            {activeProject.title}
          </Text>
          {isPredefined && (
            <View style={styles.flagshipBadge}>
              <Sparkles size={12} color="#818CF8" />
              <Text style={styles.flagshipBadgeText}>Flagship</Text>
            </View>
          )}
        </View>

        {activeProject.subtitle && (
          <Text style={[styles.projectSubtitle, { color: colors.textSecondary }]}>
            {activeProject.subtitle}
          </Text>
        )}

        {activeProject.techStack && (
          <View style={styles.techStackWrap}>
            {activeProject.techStack.split(',').map((tech, idx) => (
              <View key={idx} style={[styles.techChip, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}>
                <Text style={[styles.techChipText, { color: '#818CF8' }]}>{tech.trim()}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 4. 10-Point Architectural Blueprint Accordion */}
      <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Layers size={18} color="#818CF8" />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
            10-Point Architectural Blueprint
          </Text>
        </View>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Structured technical points to articulate fluently during panel interviews.
        </Text>

        <View style={styles.blueprintList}>
          {BLUEPRINT_SECTIONS.map((sec) => {
            const isExpanded = expandedSection === sec.id;
            const Icon = sec.icon;
            return (
              <TouchableOpacity
                key={sec.id}
                onPress={() => setExpandedSection(isExpanded ? null : sec.id)}
                style={[
                  styles.blueprintItem,
                  { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.blueprintItemHeader}>
                  <View style={styles.blueprintIconTitleRow}>
                    <Icon size={16} color="#818CF8" />
                    <Text style={[styles.blueprintItemTitle, { color: colors.textPrimary, fontWeight: '600' }]}>
                      {sec.title}
                    </Text>
                  </View>
                  {isExpanded ? (
                    <ChevronUp size={16} color={colors.textSecondary} />
                  ) : (
                    <ChevronDown size={16} color={colors.textSecondary} />
                  )}
                </View>

                {isExpanded && (
                  <View style={styles.blueprintContentWrap}>
                    <Text style={[styles.blueprintContentText, { color: colors.textSecondary }]}>
                      {sec.content || 'No details provided yet. You can edit this in custom project settings.'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 5. Project Interview Q&A Practice Bank */}
      <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
        <View style={styles.qaHeaderRow}>
          <View style={styles.sectionHeaderRow}>
            <HelpCircle size={18} color="#10B981" />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
              Interview Q&A Practice Bank ({parsedQuestions.length})
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddQnaModal(true)}
            style={styles.addQaBtn}
            activeOpacity={0.8}
          >
            <Plus size={14} color="#FFFFFF" />
            <Text style={styles.addQaBtnText}>Add Q&A</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.qnaList}>
          {parsedQuestions.map((q, idx) => (
            <View
              key={q.id || idx}
              style={[styles.qnaCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
            >
              <View style={styles.qnaCardHeader}>
                <View style={styles.qnaNumberPill}>
                  <Text style={styles.qnaNumberText}>Q{idx + 1}</Text>
                </View>
                <Text style={[styles.qnaQuestionText, { color: colors.textPrimary, fontWeight: '700' }]}>
                  {q.question}
                </Text>
                {q.isCustom && (
                  <TouchableOpacity onPress={() => handleDeleteQnA(q.id)} style={styles.deleteIconBtn}>
                    <Trash2 size={14} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={[styles.qnaAnswerBox, { borderTopColor: colors.border }]}>
                <Text style={[styles.qnaAnswerLabel, { color: '#10B981' }]}>MODEL EXPLANATION:</Text>
                <Text style={[styles.qnaAnswerText, { color: colors.textSecondary }]}>{q.answer}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Add Q&A Modal */}
      <Modal visible={showAddQnaModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
                Add Project Question
              </Text>
              <TouchableOpacity onPress={() => setShowAddQnaModal(false)}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Interview Question</Text>
            <TextInput
              value={newQuestionText}
              onChangeText={setNewQuestionText}
              placeholder="e.g. How does your cache invalidation strategy work?"
              placeholderTextColor={colors.textSecondary}
              style={[styles.textInput, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
            />

            <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 12 }]}>Model Answer</Text>
            <TextInput
              multiline
              numberOfLines={4}
              value={newAnswerText}
              onChangeText={setNewAnswerText}
              placeholder="Explain technical approach, tradeoff considerations, and results..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.textArea, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
            />

            <View style={styles.modalActionsRow}>
              <TouchableOpacity onPress={() => setShowAddQnaModal(false)} style={[styles.cancelBtn, { borderColor: colors.border }]}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddQnA} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Save Question</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Custom Project Modal */}
      <Modal visible={showAddProjectModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.largeModalScroll}>
            <View style={[styles.largeModalCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: colors.border }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.textPrimary, fontWeight: '700' }]}>
                  Add Custom Project
                </Text>
                <TouchableOpacity onPress={() => setShowAddProjectModal(false)}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Project Title *</Text>
              <TextInput
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholder="e.g. CloudSync Pro"
                placeholderTextColor={colors.textSecondary}
                style={[styles.textInput, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
              />

              <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 10 }]}>Subtitle / One-liner</Text>
              <TextInput
                value={customSubtitle}
                onChangeText={setCustomSubtitle}
                placeholder="e.g. Distributed file synchronization engine"
                placeholderTextColor={colors.textSecondary}
                style={[styles.textInput, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
              />

              <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 10 }]}>Tech Stack (Comma separated)</Text>
              <TextInput
                value={customTechStack}
                onChangeText={setCustomTechStack}
                placeholder="e.g. React Native, Go, PostgreSQL, Redis, gRPC"
                placeholderTextColor={colors.textSecondary}
                style={[styles.textInput, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
              />

              <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 10 }]}>Problem Statement</Text>
              <TextInput
                multiline
                value={customProblem}
                onChangeText={setCustomProblem}
                placeholder="What core problem does this solve?"
                placeholderTextColor={colors.textSecondary}
                style={[styles.textArea, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
              />

              <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 10 }]}>Architecture</Text>
              <TextInput
                multiline
                value={customArchitecture}
                onChangeText={setCustomArchitecture}
                placeholder="Components, client-server design, message queues..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.textArea, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
              />

              <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 10 }]}>Database Design</Text>
              <TextInput
                multiline
                value={customDatabase}
                onChangeText={setCustomDatabase}
                placeholder="Relational vs NoSQL, main tables, indexing, transactions..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.textArea, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
              />

              <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 10 }]}>Key Engineering Challenges</Text>
              <TextInput
                multiline
                value={customChallenges}
                onChangeText={setCustomChallenges}
                placeholder="Concurrency issues, data synchronization, race conditions..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.textArea, { color: colors.textPrimary, backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: colors.border }]}
              />

              <View style={styles.modalActionsRow}>
                <TouchableOpacity onPress={() => setShowAddProjectModal(false)} style={[styles.cancelBtn, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textSecondary }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveCustomProject} style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>Create Project</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  projectsPickerWrapper: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  projectsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  projectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  projectChipText: {
    fontSize: 13,
  },
  addProjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addProjectChipText: {
    fontSize: 12,
    color: '#818CF8',
    fontWeight: '600',
  },
  resumeBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  resumeBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  resumeBannerTitle: {
    fontSize: 14,
  },
  resumeBannerDesc: {
    fontSize: 11,
    marginBottom: 10,
  },
  resumeScroll: {
    gap: 10,
  },
  resumeProjectCard: {
    width: 170,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  resumeProjectName: {
    fontSize: 12,
    marginBottom: 2,
  },
  resumeProjectTech: {
    fontSize: 10,
    marginBottom: 8,
  },
  importPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#818CF820',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  importPillText: {
    fontSize: 10,
    color: '#818CF8',
    fontWeight: '600',
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  projectTitle: {
    fontSize: 22,
  },
  flagshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  flagshipBadgeText: {
    fontSize: 11,
    color: '#818CF8',
    fontWeight: '700',
  },
  projectSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  techStackWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  techChipText: {
    fontSize: 11,
    fontWeight: '600',
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
  sectionSubtitle: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  blueprintList: {
    gap: 8,
  },
  blueprintItem: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  blueprintItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blueprintIconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  blueprintItemTitle: {
    fontSize: 13,
  },
  blueprintContentWrap: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  blueprintContentText: {
    fontSize: 12,
    lineHeight: 19,
  },
  qaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  addQaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addQaBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  qnaList: {
    gap: 12,
  },
  qnaCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  qnaCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  qnaNumberPill: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  qnaNumberText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  qnaQuestionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  deleteIconBtn: {
    padding: 4,
  },
  qnaAnswerBox: {
    paddingTop: 8,
    borderTopWidth: 1,
  },
  qnaAnswerLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  qnaAnswerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  largeModalScroll: {
    paddingVertical: 24,
  },
  largeModalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  textArea: {
    minHeight: 80,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  submitBtn: {
    backgroundColor: '#818CF8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
