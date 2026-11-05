import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileText,
  Edit3,
  Eye,
  Sparkles,
  Target,
  History,
  Layers,
  RefreshCw,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppHeader, LoadingIndicator, ConfirmationDialog } from '@/components';
import {
  resumeRepository,
  ResumeSummary,
  ResumeDetailed,
} from '@/database/repositories/ResumeRepository';
import { ResumeTabType } from './types';
import { TemplateId } from './services/pdfGenerator';
import { pickAndImportResumeDocument } from './services/resumeImporter';

// Tabs & Modals
import {
  ResumesListTab,
  ResumeEditorTab,
  ResumePreviewTab,
  AtsAnalyzerTab,
  JobMatchTab,
  ResumeHistoryTab,
  ResumeFormModal,
  ProfileEditModal,
  EducationModal,
  ExperienceModal,
  ProjectModal,
  SkillModal,
  CertificationModal,
  AchievementModal,
  ReorderSectionsModal,
  SnapshotModal,
} from './components';
import {
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
  ResumeCertification,
  ResumeAchievement,
} from '@/database/schema/resume';

interface ResumeScreenProps {
  showBack?: boolean;
}

export const ResumeScreen: React.FC<ResumeScreenProps> = ({ showBack = true }) => {
  const { colors, typography, spacing, borderRadius, isDark } = useAppTheme();

  // Primary State
  const [activeTab, setActiveTab] = useState<ResumeTabType>('editor');
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [activeResume, setActiveResume] = useState<ResumeDetailed | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals Visibility & Payloads
  const [resumeFormVisible, setResumeFormVisible] = useState(false);
  const [editingResumeSummary, setEditingResumeSummary] = useState<ResumeSummary | null>(null);

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const [educationModalVisible, setEducationModalVisible] = useState(false);
  const [editingEducation, setEditingEducation] = useState<ResumeEducation | null>(null);

  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ResumeExperience | null>(null);
  const [isInternshipDefault, setIsInternshipDefault] = useState(0);

  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<ResumeProject | null>(null);

  const [skillModalVisible, setSkillModalVisible] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ResumeSkill | null>(null);
  const [isSoftSkillDefault, setIsSoftSkillDefault] = useState(0);

  const [certModalVisible, setCertModalVisible] = useState(false);
  const [editingCert, setEditingCert] = useState<ResumeCertification | null>(null);

  const [achievementModalVisible, setAchievementModalVisible] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<ResumeAchievement | null>(null);
  const [achievementTypeDefault, setAchievementTypeDefault] = useState<'achievement' | 'extracurricular'>('achievement');

  const [reorderModalVisible, setReorderModalVisible] = useState(false);
  const [snapshotModalVisible, setSnapshotModalVisible] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ResumeSummary | null>(null);

  // Load all resumes
  const loadResumes = useCallback(async (preferResumeId?: string) => {
    try {
      setLoading(true);
      const list = await resumeRepository.getAllResumes();
      setResumes(list);

      let targetId = preferResumeId || activeResumeId;
      if (!targetId || !list.some((r) => r.id === targetId)) {
        const defaultResume = list.find((r) => r.isDefault === 1);
        targetId = defaultResume ? defaultResume.id : list[0]?.id || null;
      }

      setActiveResumeId(targetId);

      if (targetId) {
        const detailed = await resumeRepository.getResumeDetailed(targetId);
        setActiveResume(detailed);
        if (detailed?.templateId) {
          setSelectedTemplate(detailed.templateId as TemplateId);
        }
      } else {
        setActiveResume(null);
      }
    } catch (e) {
      console.error('[ResumeScreen] Failed to load resumes:', e);
    } finally {
      setLoading(false);
    }
  }, [activeResumeId]);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const handleSelectResume = async (id: string) => {
    setActiveResumeId(id);
    setLoading(true);
    try {
      const detailed = await resumeRepository.getResumeDetailed(id);
      setActiveResume(detailed);
      if (detailed?.templateId) {
        setSelectedTemplate(detailed.templateId as TemplateId);
      }
      setActiveTab('editor');
    } finally {
      setLoading(false);
    }
  };

  // Create Resume
  const handleCreateResume = async (data: { title: string; targetRole?: string; templateId?: string }) => {
    if (editingResumeSummary) {
      await resumeRepository.updateResume(editingResumeSummary.id, {
        title: data.title,
        targetRole: data.targetRole,
        templateId: data.templateId,
      });
      await loadResumes(editingResumeSummary.id);
    } else {
      const newId = await resumeRepository.createResume(data);
      await loadResumes(newId);
      setActiveTab('editor');
    }
  };

  // Duplicate Resume
  const handleDuplicateResume = async (resSummary: ResumeSummary) => {
    try {
      setLoading(true);
      const newTitle = `${resSummary.title} (Copy)`;
      const newId = await resumeRepository.duplicateResume(resSummary.id, newTitle);
      await loadResumes(newId);
      Alert.alert('Resume Duplicated', `Created "${newTitle}". Opened in Editor.`);
      setActiveTab('editor');
    } catch (e: any) {
      Alert.alert('Duplication Error', e?.message || 'Could not duplicate resume');
    } finally {
      setLoading(false);
    }
  };

  // Delete Resume
  const confirmDeleteResume = async () => {
    if (!deleteTarget) return;
    try {
      setLoading(true);
      await resumeRepository.deleteResume(deleteTarget.id);
      setDeleteTarget(null);
      await loadResumes();
    } catch (e: any) {
      Alert.alert('Delete Error', e?.message || 'Could not delete resume');
    } finally {
      setLoading(false);
    }
  };

  // Set Default
  const handleSetDefault = async (id: string) => {
    await resumeRepository.setDefaultResume(id);
    await loadResumes(id);
  };

  // Import Document (PDF / JSON)
  const handleImportDocument = async () => {
    try {
      setLoading(true);
      const res = await pickAndImportResumeDocument();
      if (!res) return;
      if (res.success && res.resumeId) {
        await loadResumes(res.resumeId);
        setActiveTab('editor');
        Alert.alert('Import Complete', res.message);
      } else {
        Alert.alert('Import Failed', res.message || 'Could not import file');
      }
    } catch (e: any) {
      Alert.alert('Import Failed', e?.message || 'Error importing file');
    } finally {
      setLoading(false);
    }
  };

  // Template switch
  const handleSelectTemplate = async (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    if (activeResumeId) {
      await resumeRepository.updateResume(activeResumeId, { templateId });
    }
  };

  // Tabs navigation item metadata
  const TABS: { key: ResumeTabType; label: string; icon: React.ReactNode }[] = [
    { key: 'editor', label: 'Editor', icon: <Edit3 size={15} color={activeTab === 'editor' ? colors.accent : colors.textSecondary} /> },
    { key: 'preview', label: 'Preview & PDF', icon: <Eye size={15} color={activeTab === 'preview' ? colors.accent : colors.textSecondary} /> },
    { key: 'ats', label: 'ATS Score', icon: <Sparkles size={15} color={activeTab === 'ats' ? colors.accent : colors.textSecondary} /> },
    { key: 'jobMatch', label: 'Job Match', icon: <Target size={15} color={activeTab === 'jobMatch' ? colors.accent : colors.textSecondary} /> },
    { key: 'history', label: 'Snapshots', icon: <History size={15} color={activeTab === 'history' ? colors.accent : colors.textSecondary} /> },
    { key: 'resumes', label: 'All Resumes', icon: <FileText size={15} color={activeTab === 'resumes' ? colors.accent : colors.textSecondary} /> },
  ];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* App Header */}
      <AppHeader
        title="Resume Manager"
        subtitle={activeResume ? `${activeResume.title} • ${activeResume.targetRole || 'General'}` : 'Offline ATS Resumes'}
        showBack={showBack}
        showThemeToggle
      />

      {/* Navigation Tabs Bar */}
      <View style={[styles.tabsBarWrapper, { borderBottomColor: colors.borderSubtle }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.tabsScrollContent, { paddingHorizontal: spacing.md }]}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
                style={[
                  styles.tabButton,
                  {
                    borderBottomColor: isActive ? colors.accent : 'transparent',
                    borderBottomWidth: 2,
                    paddingHorizontal: spacing.md,
                    paddingVertical: 10,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {tab.icon}
                  <Text
                    style={[
                      styles.tabButtonText,
                      {
                        color: isActive ? colors.accent : colors.textSecondary,
                        fontSize: typography.fontSizes.xs,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content Area */}
      {loading ? (
        <LoadingIndicator message="Loading resume modules..." />
      ) : activeTab === 'resumes' ? (
        <ResumesListTab
          resumes={resumes}
          activeResumeId={activeResumeId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectResume={handleSelectResume}
          onCreateResume={() => {
            setEditingResumeSummary(null);
            setResumeFormVisible(true);
          }}
          onImportResume={handleImportDocument}
          onDuplicateResume={handleDuplicateResume}
          onRenameResume={(r) => {
            setEditingResumeSummary(r);
            setResumeFormVisible(true);
          }}
          onDeleteResume={(r) => setDeleteTarget(r)}
          onSetDefaultResume={handleSetDefault}
        />
      ) : activeResume ? (
        activeTab === 'editor' ? (
          <ResumeEditorTab
            resume={activeResume}
            onEditProfile={() => setProfileModalVisible(true)}
            onReorderSections={() => setReorderModalVisible(true)}
            // Education
            onAddEducation={() => {
              setEditingEducation(null);
              setEducationModalVisible(true);
            }}
            onEditEducation={(edu) => {
              setEditingEducation(edu);
              setEducationModalVisible(true);
            }}
            onDeleteEducation={async (id) => {
              await resumeRepository.deleteEducation(id);
              loadResumes(activeResume.id);
            }}
            // Experience
            onAddExperience={(isInternship) => {
              setEditingExperience(null);
              setIsInternshipDefault(isInternship);
              setExperienceModalVisible(true);
            }}
            onEditExperience={(exp) => {
              setEditingExperience(exp);
              setIsInternshipDefault(exp.isInternship);
              setExperienceModalVisible(true);
            }}
            onDeleteExperience={async (id) => {
              await resumeRepository.deleteExperience(id);
              loadResumes(activeResume.id);
            }}
            // Projects
            onAddProject={() => {
              setEditingProject(null);
              setProjectModalVisible(true);
            }}
            onEditProject={(proj) => {
              setEditingProject(proj);
              setProjectModalVisible(true);
            }}
            onDeleteProject={async (id) => {
              await resumeRepository.deleteProject(id);
              loadResumes(activeResume.id);
            }}
            // Skills
            onAddSkill={(isSoft) => {
              setEditingSkill(null);
              setIsSoftSkillDefault(isSoft);
              setSkillModalVisible(true);
            }}
            onEditSkill={(skill) => {
              setEditingSkill(skill);
              setIsSoftSkillDefault(skill.isSoftSkill);
              setSkillModalVisible(true);
            }}
            onDeleteSkill={async (id) => {
              await resumeRepository.deleteSkill(id);
              loadResumes(activeResume.id);
            }}
            // Certifications
            onAddCertification={() => {
              setEditingCert(null);
              setCertModalVisible(true);
            }}
            onEditCertification={(cert) => {
              setEditingCert(cert);
              setCertModalVisible(true);
            }}
            onDeleteCertification={async (id) => {
              await resumeRepository.deleteCertification(id);
              loadResumes(activeResume.id);
            }}
            // Achievements
            onAddAchievement={(type) => {
              setEditingAchievement(null);
              setAchievementTypeDefault(type);
              setAchievementModalVisible(true);
            }}
            onEditAchievement={(ach) => {
              setEditingAchievement(ach);
              setAchievementTypeDefault((ach.type as 'achievement' | 'extracurricular') || 'achievement');
              setAchievementModalVisible(true);
            }}
            onDeleteAchievement={async (id) => {
              await resumeRepository.deleteAchievement(id);
              loadResumes(activeResume.id);
            }}
          />
        ) : activeTab === 'preview' ? (
          <ResumePreviewTab
            resume={activeResume}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
          />
        ) : activeTab === 'ats' ? (
          <AtsAnalyzerTab resume={activeResume} />
        ) : activeTab === 'jobMatch' ? (
          <JobMatchTab
            resume={activeResume}
            onRefreshResume={() => loadResumes(activeResume.id)}
          />
        ) : activeTab === 'history' ? (
          <ResumeHistoryTab
            resume={activeResume}
            onCreateSnapshot={() => setSnapshotModalVisible(true)}
            onRestoreSnapshot={async (ver) => {
              try {
                setLoading(true);
                await resumeRepository.restoreSnapshot(ver.id);
                await loadResumes(activeResume.id);
                Alert.alert('Snapshot Restored', `Restored "${ver.versionLabel}".`);
                setActiveTab('editor');
              } catch (e: any) {
                Alert.alert('Restore Failed', e?.message || 'Error restoring snapshot');
              } finally {
                setLoading(false);
              }
            }}
            onDeleteSnapshot={async (verId) => {
              await resumeRepository.deleteSnapshot(verId);
              loadResumes(activeResume.id);
            }}
          />
        ) : null
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.md, fontWeight: '700' }}>
            No Resume Selected
          </Text>
          <TouchableOpacity
            onPress={() => setActiveTab('resumes')}
            style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.accent, borderRadius: borderRadius.md }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Select or Create Resume</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Resume Create / Edit Modal */}
      <ResumeFormModal
        visible={resumeFormVisible}
        initialData={editingResumeSummary}
        onClose={() => setResumeFormVisible(false)}
        onSubmit={handleCreateResume}
      />

      {/* 2. Profile Modal */}
      <ProfileEditModal
        visible={profileModalVisible}
        initialData={activeResume?.profile}
        onClose={() => setProfileModalVisible(false)}
        onSubmit={async (profileData) => {
          if (!activeResume) return;
          await resumeRepository.updateProfile(activeResume.id, profileData);
          await loadResumes(activeResume.id);
        }}
      />

      {/* 3. Education Modal */}
      <EducationModal
        visible={educationModalVisible}
        initialData={editingEducation}
        onClose={() => setEducationModalVisible(false)}
        onSubmit={async (data) => {
          if (!activeResume) return;
          if (editingEducation) {
            await resumeRepository.updateEducation(editingEducation.id, data);
          } else {
            await resumeRepository.addEducation(activeResume.id, data);
          }
          await loadResumes(activeResume.id);
        }}
      />

      {/* 4. Experience Modal */}
      <ExperienceModal
        visible={experienceModalVisible}
        isInternshipDefault={isInternshipDefault}
        initialData={editingExperience}
        onClose={() => setExperienceModalVisible(false)}
        onSubmit={async (data) => {
          if (!activeResume) return;
          if (editingExperience) {
            await resumeRepository.updateExperience(editingExperience.id, data);
          } else {
            await resumeRepository.addExperience(activeResume.id, data);
          }
          await loadResumes(activeResume.id);
        }}
      />

      {/* 5. Project Modal */}
      <ProjectModal
        visible={projectModalVisible}
        initialData={editingProject}
        onClose={() => setProjectModalVisible(false)}
        onSubmit={async (data) => {
          if (!activeResume) return;
          if (editingProject) {
            await resumeRepository.updateProject(editingProject.id, data);
          } else {
            await resumeRepository.addProject(activeResume.id, data);
          }
          await loadResumes(activeResume.id);
        }}
      />

      {/* 6. Skill Modal */}
      <SkillModal
        visible={skillModalVisible}
        isSoftSkillDefault={isSoftSkillDefault}
        initialData={editingSkill}
        onClose={() => setSkillModalVisible(false)}
        onSubmit={async (data) => {
          if (!activeResume) return;
          if (editingSkill) {
            await resumeRepository.updateSkill(editingSkill.id, data);
          } else {
            await resumeRepository.addSkill(activeResume.id, data);
          }
          await loadResumes(activeResume.id);
        }}
      />

      {/* 7. Certification Modal */}
      <CertificationModal
        visible={certModalVisible}
        initialData={editingCert}
        onClose={() => setCertModalVisible(false)}
        onSubmit={async (data) => {
          if (!activeResume) return;
          if (editingCert) {
            await resumeRepository.updateCertification(editingCert.id, data);
          } else {
            await resumeRepository.addCertification(activeResume.id, data);
          }
          await loadResumes(activeResume.id);
        }}
      />

      {/* 8. Achievement Modal */}
      <AchievementModal
        visible={achievementModalVisible}
        typeDefault={achievementTypeDefault}
        initialData={editingAchievement}
        onClose={() => setAchievementModalVisible(false)}
        onSubmit={async (data) => {
          if (!activeResume) return;
          if (editingAchievement) {
            await resumeRepository.updateAchievement(editingAchievement.id, data);
          } else {
            await resumeRepository.addAchievement(activeResume.id, data);
          }
          await loadResumes(activeResume.id);
        }}
      />

      {/* 9. Reorder Sections Modal */}
      <ReorderSectionsModal
        visible={reorderModalVisible}
        sections={activeResume?.sections || []}
        onClose={() => setReorderModalVisible(false)}
        onSave={async (sections) => {
          if (!activeResume) return;
          await resumeRepository.updateSectionsOrderAndVisibility(activeResume.id, sections);
          await loadResumes(activeResume.id);
        }}
      />

      {/* 10. Snapshot Modal */}
      <SnapshotModal
        visible={snapshotModalVisible}
        onClose={() => setSnapshotModalVisible(false)}
        onSubmit={async (label) => {
          if (!activeResume) return;
          await resumeRepository.createSnapshot(activeResume.id, label);
          await loadResumes(activeResume.id);
          Alert.alert('Snapshot Saved', `Created version snapshot: "${label}".`);
        }}
      />

      {/* Confirmation Dialog for Delete Resume */}
      <ConfirmationDialog
        visible={Boolean(deleteTarget)}
        title="Delete Resume"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This will delete all associated sections, projects, and version history.`}
        confirmText="Delete Resume"
        isDestructive={true}
        onConfirm={confirmDeleteResume}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsBarWrapper: {
    borderBottomWidth: 1,
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabButton: {},
  tabButtonText: {},
});
