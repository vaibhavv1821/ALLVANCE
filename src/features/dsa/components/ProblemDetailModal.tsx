import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {
  X,
  Code2,
  ExternalLink,
  Star,
  CheckCircle2,
  RotateCcw,
  Clock,
  PlayCircle,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Tag,
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  AlertTriangle,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ConfirmationDialog } from '@/components';
import {
  dsaProblemRepository,
  ProblemDetailed,
} from '@/database/repositories/DsaProblemRepository';
import { dsaRevisionRepository } from '@/database/repositories/DsaRevisionRepository';
import { dsaSolutionRepository } from '@/database/repositories/DsaSolutionRepository';
import { DsaSolution } from '@/database/schema/dsa';
import {
  DIFFICULTY_COLORS,
  STATUS_COLORS,
} from '../constants';

interface ProblemDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onRefresh: () => void;
  problem: ProblemDetailed | null;
  onEditProblem: (problem: ProblemDetailed) => void;
  onOpenAddSolution: (problemId: string, problemTitle: string, solution?: DsaSolution | null) => void;
  onOpenLogAttempt: (problemId: string, problemTitle: string) => void;
  onOpenCompleteRevision: (problemId: string) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  visible,
  onClose,
  onRefresh,
  problem,
  onEditProblem,
  onOpenAddSolution,
  onOpenLogAttempt,
  onOpenCompleteRevision,
}) => {
  const { colors, typography, spacing } = useAppTheme();

  const [activeProblem, setActiveProblem] = useState<ProblemDetailed | null>(problem);
  const [activeSection, setActiveSection] = useState<'overview' | 'solutions' | 'attempts' | 'revisions'>('overview');
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setActiveProblem(problem);
    setSelectedSolutionIndex(0);
  }, [problem, visible]);

  if (!activeProblem) return null;

  const reloadProblem = async () => {
    const updated = await dsaProblemRepository.getById(activeProblem.id);
    if (updated) {
      setActiveProblem(updated);
    }
    onRefresh();
  };

  const handleToggleFav = async () => {
    try {
      const isFav = await dsaProblemRepository.toggleFavorite(activeProblem.id);
      setActiveProblem({
        ...activeProblem,
        isFavorite: isFav ? 1 : 0,
      });
      onRefresh();
    } catch (e: any) {
      alert(e?.message || 'Failed to toggle favorite');
    }
  };

  const handleMarkSolved = async () => {
    try {
      await dsaProblemRepository.markSolved(activeProblem.id);
      await reloadProblem();
    } catch (e: any) {
      alert(e?.message || 'Failed to mark solved');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dsaProblemRepository.delete(activeProblem.id);
      setShowDeleteConfirm(false);
      onClose();
      onRefresh();
    } catch (e: any) {
      alert(e?.message || 'Failed to delete problem');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSolution = async (solId: string) => {
    try {
      await dsaSolutionRepository.delete(solId);
      await reloadProblem();
    } catch (e: any) {
      alert(e?.message || 'Failed to delete solution');
    }
  };

  const handleScheduleManualRevision = async () => {
    try {
      await dsaRevisionRepository.scheduleInitialRevision(activeProblem.id);
      await reloadProblem();
      alert('Revision scheduled successfully!');
    } catch (e: any) {
      alert(e?.message || 'Failed to schedule revision');
    }
  };

  const diffMeta =
    DIFFICULTY_COLORS[activeProblem.difficulty as 'Easy' | 'Medium' | 'Hard'] ||
    DIFFICULTY_COLORS.Medium;
  const statusMeta =
    STATUS_COLORS[activeProblem.status] || STATUS_COLORS.unsolved;

  const currentSolution = activeProblem.solutions[selectedSolutionIndex] || activeProblem.solutions[0];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.diffBadge, { backgroundColor: diffMeta.bg, borderColor: diffMeta.border }]}>
                <Text style={[styles.diffBadgeText, { color: diffMeta.color }]}>
                  {activeProblem.difficulty}
                </Text>
              </View>
              {activeProblem.problemIdExt && (
                <Text style={[styles.idExtText, { color: colors.textMuted }]}>
                  {activeProblem.problemIdExt}
                </Text>
              )}
              <Text style={[styles.platformBadge, { color: colors.textSecondary }]}>
                {activeProblem.platform}
              </Text>
            </View>

            <View style={styles.headerRight}>
              {/* Favorite Star */}
              <TouchableOpacity onPress={handleToggleFav} style={styles.headerIconBtn}>
                <Star
                  size={20}
                  color={activeProblem.isFavorite === 1 ? '#F59E0B' : colors.textMuted}
                  fill={activeProblem.isFavorite === 1 ? '#F59E0B' : 'none'}
                />
              </TouchableOpacity>

              {/* Edit */}
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  onEditProblem(activeProblem);
                }}
                style={styles.headerIconBtn}
              >
                <Edit2 size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(true)}
                style={styles.headerIconBtn}
              >
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>

              {/* Close */}
              <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceRaised }]}>
                <X size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sub Navigation Bar inside Modal */}
          <View style={[styles.subTabsRow, { borderBottomColor: colors.borderSubtle }]}>
            {(['overview', 'solutions', 'attempts', 'revisions'] as const).map((tab) => {
              const isActive = activeSection === tab;
              const countBadge =
                tab === 'solutions'
                  ? activeProblem.solutions.length
                  : tab === 'attempts'
                  ? activeProblem.attempts.length
                  : tab === 'revisions'
                  ? activeProblem.revisions.length
                  : null;

              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.subTabBtn,
                    isActive && { borderBottomColor: '#10B981', borderBottomWidth: 2 },
                  ]}
                  onPress={() => setActiveSection(tab)}
                >
                  <Text
                    style={[
                      styles.subTabBtnText,
                      {
                        color: isActive ? '#10B981' : colors.textMuted,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}
                  >
                    {tab.toUpperCase()}
                    {countBadge !== null ? ` (${countBadge})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Body Content */}
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* OVERVIEW TAB */}
            {activeSection === 'overview' && (
              <View>
                {/* Title and External URL */}
                <View style={styles.titleSection}>
                  <Text style={[styles.problemTitle, { color: colors.textPrimary }]}>
                    {activeProblem.title}
                  </Text>
                  {activeProblem.externalUrl ? (
                    <TouchableOpacity
                      style={[styles.extLinkBtn, { borderColor: '#10B981' }]}
                      onPress={() => Linking.openURL(activeProblem.externalUrl!)}
                    >
                      <Text style={[styles.extLinkText, { color: '#10B981' }]}>Open on {activeProblem.platform}</Text>
                      <ExternalLink size={14} color="#10B981" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Status & Topic Pills */}
                <View style={styles.pillsWrap}>
                  <View style={[styles.statusPill, { backgroundColor: statusMeta.bg }]}>
                    <Text style={[styles.statusPillText, { color: statusMeta.color }]}>
                      {statusMeta.label}
                    </Text>
                  </View>

                  <View style={[styles.topicPill, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                    <Text style={[styles.topicPillText, { color: colors.textSecondary }]}>
                      Topic: {activeProblem.topicName}
                    </Text>
                  </View>

                  {activeProblem.subtopicName ? (
                    <View style={[styles.subtopicPill, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                      <Text style={[styles.subtopicPillText, { color: colors.textSecondary }]}>
                        {activeProblem.subtopicName}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Company Tags */}
                {activeProblem.companies.length > 0 && (
                  <View style={styles.sectionRow}>
                    <Building2 size={16} color="#38BDF8" style={{ marginTop: 2 }} />
                    <View style={styles.chipsWrap}>
                      {activeProblem.companies.map((c) => (
                        <View
                          key={c}
                          style={[styles.compChip, { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}
                        >
                          <Text style={[styles.compChipText, { color: '#38BDF8' }]}>{c}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Pattern & Concept Tags */}
                {activeProblem.tags.length > 0 && (
                  <View style={styles.sectionRow}>
                    <Tag size={16} color="#10B981" style={{ marginTop: 2 }} />
                    <View style={styles.chipsWrap}>
                      {activeProblem.tags.map((t) => (
                        <View
                          key={t}
                          style={[styles.tagChip, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}
                        >
                          <Text style={[styles.tagChipText, { color: colors.textSecondary }]}>#{t}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Problem Statement if exists */}
                {activeProblem.problemStatement ? (
                  <View style={[styles.card, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Problem Statement</Text>
                    <Text style={[styles.cardContent, { color: colors.textSecondary }]}>
                      {activeProblem.problemStatement}
                    </Text>
                  </View>
                ) : null}

                {/* Complexity Box */}
                <View style={[styles.complexityCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                  <View style={styles.complexityItem}>
                    <Text style={[styles.complexityLabel, { color: colors.textMuted }]}>Time Complexity</Text>
                    <Text style={[styles.complexityVal, { color: '#10B981' }]}>
                      {activeProblem.timeComplexity || 'O(N)'}
                    </Text>
                  </View>
                  <View style={[styles.complexityDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.complexityItem}>
                    <Text style={[styles.complexityLabel, { color: colors.textMuted }]}>Space Complexity</Text>
                    <Text style={[styles.complexityVal, { color: '#38BDF8' }]}>
                      {activeProblem.spaceComplexity || 'O(1)'}
                    </Text>
                  </View>
                </View>

                {/* Approach & Intuition */}
                {activeProblem.approach ? (
                  <View style={[styles.card, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Core Intuition & Approach</Text>
                    <Text style={[styles.cardContent, { color: colors.textSecondary }]}>
                      {activeProblem.approach}
                    </Text>
                  </View>
                ) : null}

                {/* Edge Cases */}
                {activeProblem.importantEdgeCases ? (
                  <View style={[styles.card, { backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.25)' }]}>
                    <Text style={[styles.cardTitle, { color: '#F59E0B' }]}>Important Edge Cases</Text>
                    <Text style={[styles.cardContent, { color: colors.textPrimary }]}>
                      {activeProblem.importantEdgeCases}
                    </Text>
                  </View>
                ) : null}

                {/* Notes */}
                {activeProblem.notes ? (
                  <View style={[styles.card, { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSubtle }]}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Personal Notes</Text>
                    <Text style={[styles.cardContent, { color: colors.textSecondary }]}>
                      {activeProblem.notes}
                    </Text>
                  </View>
                ) : null}

                {/* Quick Action Buttons Row */}
                <View style={styles.actionsBar}>
                  {activeProblem.status !== 'solved' ? (
                    <TouchableOpacity
                      style={[styles.primaryActionBtn, { backgroundColor: '#10B981' }]}
                      onPress={handleMarkSolved}
                    >
                      <CheckCircle2 size={18} color="#FFFFFF" />
                      <Text style={styles.primaryActionBtnText}>Mark Solved</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.primaryActionBtn, { backgroundColor: '#818CF8' }]}
                      onPress={() => onOpenCompleteRevision(activeProblem.id)}
                    >
                      <RotateCcw size={18} color="#FFFFFF" />
                      <Text style={styles.primaryActionBtnText}>Review Problem</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.secondaryActionBtn, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
                    onPress={() => onOpenLogAttempt(activeProblem.id, activeProblem.title)}
                  >
                    <PlayCircle size={18} color="#38BDF8" />
                    <Text style={[styles.secondaryActionBtnText, { color: colors.textPrimary }]}>Log Attempt</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.secondaryActionBtn, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
                    onPress={() => onOpenAddSolution(activeProblem.id, activeProblem.title)}
                  >
                    <Plus size={18} color="#10B981" />
                    <Text style={[styles.secondaryActionBtnText, { color: colors.textPrimary }]}>Add Solution</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* SOLUTIONS TAB */}
            {activeSection === 'solutions' && (
              <View>
                <View style={styles.tabSectionHeader}>
                  <Text style={[styles.tabSectionTitle, { color: colors.textPrimary }]}>
                    Solution Notebook ({activeProblem.solutions.length})
                  </Text>
                  <TouchableOpacity
                    style={[styles.addBtnSmall, { backgroundColor: '#10B981' }]}
                    onPress={() => onOpenAddSolution(activeProblem.id, activeProblem.title)}
                  >
                    <Plus size={14} color="#FFF" />
                    <Text style={styles.addBtnSmallText}>New Solution</Text>
                  </TouchableOpacity>
                </View>

                {activeProblem.solutions.length === 0 ? (
                  <View style={[styles.emptyCard, { backgroundColor: colors.surfaceRaised }]}>
                    <Code2 size={32} color={colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Solutions Recorded</Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                      Save your clean Java, Python, C++, or JS code templates with intuition and complexity notes.
                    </Text>
                    <TouchableOpacity
                      style={[styles.emptyBtn, { backgroundColor: '#10B981' }]}
                      onPress={() => onOpenAddSolution(activeProblem.id, activeProblem.title)}
                    >
                      <Text style={styles.emptyBtnText}>+ Add First Solution</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    {/* Solution Selector Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.solutionTabsScroll}>
                      {activeProblem.solutions.map((sol, idx) => {
                        const isSelected = idx === selectedSolutionIndex;
                        return (
                          <TouchableOpacity
                            key={sol.id}
                            style={[
                              styles.solTabChip,
                              {
                                backgroundColor: isSelected ? '#10B981' : colors.surfaceRaised,
                                borderColor: isSelected ? '#10B981' : colors.border,
                              },
                            ]}
                            onPress={() => setSelectedSolutionIndex(idx)}
                          >
                            {sol.isOptimal === 1 && (
                              <Award size={12} color={isSelected ? '#FFF' : '#F59E0B'} style={{ marginRight: 4 }} />
                            )}
                            <Text
                              style={[
                                styles.solTabChipText,
                                {
                                  color: isSelected ? '#FFF' : colors.textSecondary,
                                  fontWeight: isSelected ? '700' : '500',
                                },
                              ]}
                            >
                              {sol.language}: {sol.title}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>

                    {/* Selected Solution Display */}
                    {currentSolution && (
                      <View style={[styles.solutionDetailBox, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                        {/* Header of code box */}
                        <View style={styles.codeHeader}>
                          <View style={styles.codeHeaderLeft}>
                            <Text style={[styles.solLangText, { color: '#10B981' }]}>{currentSolution.language}</Text>
                            {currentSolution.isOptimal === 1 && (
                              <View style={styles.optimalPill}>
                                <Text style={styles.optimalPillText}>OPTIMAL</Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.codeHeaderRight}>
                            <TouchableOpacity
                              onPress={() => onOpenAddSolution(activeProblem.id, activeProblem.title, currentSolution)}
                              style={styles.codeIconAction}
                            >
                              <Edit2 size={15} color={colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteSolution(currentSolution.id)}
                              style={styles.codeIconAction}
                            >
                              <Trash2 size={15} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Complexity row */}
                        <View style={styles.solComplexRow}>
                          <Text style={[styles.solComplexText, { color: colors.textSecondary }]}>
                            Time: <Text style={{ color: '#10B981', fontWeight: '700' }}>{currentSolution.timeComplexity || 'O(N)'}</Text>
                          </Text>
                          <Text style={[styles.solComplexText, { color: colors.textSecondary }]}>
                            Space: <Text style={{ color: '#38BDF8', fontWeight: '700' }}>{currentSolution.spaceComplexity || 'O(1)'}</Text>
                          </Text>
                        </View>

                        {/* Monospace Code Display */}
                        <ScrollView horizontal style={styles.codeScrollBox}>
                          <Text
                            style={[
                              styles.codeText,
                              {
                                color: colors.textPrimary,
                                fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                              },
                            ]}
                            selectable
                          >
                            {currentSolution.code}
                          </Text>
                        </ScrollView>

                        {/* Approach explanation */}
                        {currentSolution.approach ? (
                          <View style={styles.solExtraSection}>
                            <Text style={[styles.solExtraTitle, { color: colors.textMuted }]}>Approach</Text>
                            <Text style={[styles.solExtraContent, { color: colors.textPrimary }]}>
                              {currentSolution.approach}
                            </Text>
                          </View>
                        ) : null}

                        {/* Edge Cases */}
                        {currentSolution.edgeCases ? (
                          <View style={styles.solExtraSection}>
                            <Text style={[styles.solExtraTitle, { color: colors.textMuted }]}>Edge Cases</Text>
                            <Text style={[styles.solExtraContent, { color: colors.textPrimary }]}>
                              {currentSolution.edgeCases}
                            </Text>
                          </View>
                        ) : null}

                        {/* Mistakes */}
                        {currentSolution.mistakes ? (
                          <View style={styles.solExtraSection}>
                            <Text style={[styles.solExtraTitle, { color: '#EF4444' }]}>Gotchas & Mistakes</Text>
                            <Text style={[styles.solExtraContent, { color: colors.textPrimary }]}>
                              {currentSolution.mistakes}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* ATTEMPTS TAB */}
            {activeSection === 'attempts' && (
              <View>
                <View style={styles.tabSectionHeader}>
                  <Text style={[styles.tabSectionTitle, { color: colors.textPrimary }]}>
                    Attempt History ({activeProblem.attempts.length})
                  </Text>
                  <TouchableOpacity
                    style={[styles.addBtnSmall, { backgroundColor: '#38BDF8' }]}
                    onPress={() => onOpenLogAttempt(activeProblem.id, activeProblem.title)}
                  >
                    <PlayCircle size={14} color="#FFF" />
                    <Text style={styles.addBtnSmallText}>Log Attempt</Text>
                  </TouchableOpacity>
                </View>

                {activeProblem.attempts.length === 0 ? (
                  <View style={[styles.emptyCard, { backgroundColor: colors.surfaceRaised }]}>
                    <Clock size={32} color={colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Attempts Logged</Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                      Record time spent, partial attempts, and your learning curve.
                    </Text>
                    <TouchableOpacity
                      style={[styles.emptyBtn, { backgroundColor: '#38BDF8' }]}
                      onPress={() => onOpenLogAttempt(activeProblem.id, activeProblem.title)}
                    >
                      <Text style={styles.emptyBtnText}>+ Log First Attempt</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  activeProblem.attempts.map((att) => {
                    const isSolved = att.status === 'solved';
                    const isPartial = att.status === 'partially_solved';
                    const dateStr = new Date(att.attemptedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <View
                        key={att.id}
                        style={[
                          styles.attemptCard,
                          {
                            backgroundColor: colors.surfaceRaised,
                            borderColor: isSolved
                              ? 'rgba(16, 185, 129, 0.4)'
                              : isPartial
                              ? 'rgba(245, 158, 11, 0.4)'
                              : colors.border,
                          },
                        ]}
                      >
                        <View style={styles.attemptHeader}>
                          <View style={styles.attHeaderLeft}>
                            <Text style={[styles.attemptNumber, { color: colors.textPrimary }]}>
                              Attempt #{att.attemptNumber}
                            </Text>
                            <Text style={[styles.attemptDate, { color: colors.textMuted }]}>
                              {dateStr}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.attStatusPill,
                              {
                                backgroundColor: isSolved
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : isPartial
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.attStatusText,
                                {
                                  color: isSolved ? '#10B981' : isPartial ? '#F59E0B' : '#EF4444',
                                },
                              ]}
                            >
                              {att.status.replace('_', ' ').toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        {att.timeSpentMinutes ? (
                          <View style={styles.attTimeRow}>
                            <Clock size={13} color={colors.textMuted} />
                            <Text style={[styles.attTimeText, { color: colors.textSecondary }]}>
                              {att.timeSpentMinutes} minutes spent
                            </Text>
                          </View>
                        ) : null}

                        {att.approachNotes ? (
                          <Text style={[styles.attNotes, { color: colors.textSecondary }]}>
                            {att.approachNotes}
                          </Text>
                        ) : null}

                        {att.codeSnippet ? (
                          <ScrollView horizontal style={styles.attCodeBox}>
                            <Text
                              style={[
                                styles.attCodeText,
                                {
                                  color: colors.textPrimary,
                                  fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                                },
                              ]}
                            >
                              {att.codeSnippet}
                            </Text>
                          </ScrollView>
                        ) : null}
                      </View>
                    );
                  })
                )}
              </View>
            )}

            {/* REVISIONS TAB */}
            {activeSection === 'revisions' && (
              <View>
                <View style={styles.tabSectionHeader}>
                  <Text style={[styles.tabSectionTitle, { color: colors.textPrimary }]}>
                    Spaced Repetition Schedule
                  </Text>
                  <TouchableOpacity
                    style={[styles.addBtnSmall, { backgroundColor: '#818CF8' }]}
                    onPress={handleScheduleManualRevision}
                  >
                    <Plus size={14} color="#FFF" />
                    <Text style={styles.addBtnSmallText}>Schedule Revision</Text>
                  </TouchableOpacity>
                </View>

                {activeProblem.revisions.length === 0 ? (
                  <View style={[styles.emptyCard, { backgroundColor: colors.surfaceRaised }]}>
                    <RotateCcw size={32} color={colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Revisions Scheduled</Text>
                    <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                      Spaced repetition helps lock optimal algorithmic patterns into long-term memory.
                    </Text>
                    <TouchableOpacity
                      style={[styles.emptyBtn, { backgroundColor: '#818CF8' }]}
                      onPress={handleScheduleManualRevision}
                    >
                      <Text style={styles.emptyBtnText}>Schedule Initial Revision</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  activeProblem.revisions.map((rev) => {
                    const isDone = rev.completedDate !== null;
                    const schedStr = new Date(rev.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <View
                        key={rev.id}
                        style={[
                          styles.revCard,
                          {
                            backgroundColor: colors.surfaceRaised,
                            borderColor: isDone ? 'rgba(16, 185, 129, 0.4)' : colors.border,
                          },
                        ]}
                      >
                        <View style={styles.revHeader}>
                          <View style={styles.revHeaderLeft}>
                            <Text style={[styles.revStepText, { color: colors.textPrimary }]}>
                              Revision #{rev.revisionNumber}
                            </Text>
                            <Text style={[styles.revDateText, { color: colors.textMuted }]}>
                              Scheduled: {schedStr}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.revStatusPill,
                              {
                                backgroundColor: isDone
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : 'rgba(129, 140, 248, 0.15)',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.revStatusText,
                                { color: isDone ? '#10B981' : '#818CF8' },
                              ]}
                            >
                              {isDone ? 'COMPLETED' : 'UPCOMING'}
                            </Text>
                          </View>
                        </View>

                        {isDone ? (
                          <View style={styles.revDoneDetails}>
                            <Text style={[styles.recallRatingText, { color: colors.textSecondary }]}>
                              Recall Rating: <Text style={{ fontWeight: '700', color: '#10B981' }}>{rev.recallRating || 'Good'}</Text>
                            </Text>
                            {rev.notes ? (
                              <Text style={[styles.revNotesText, { color: colors.textMuted }]}>
                                {rev.notes}
                              </Text>
                            ) : null}
                          </View>
                        ) : (
                          <TouchableOpacity
                            style={[styles.reviewNowBtn, { backgroundColor: '#818CF8' }]}
                            onPress={() => onOpenCompleteRevision(activeProblem.id)}
                          >
                            <RotateCcw size={14} color="#FFF" />
                            <Text style={styles.reviewNowBtnText}>Complete This Revision</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </ScrollView>

          {/* Delete Confirmation */}
          <ConfirmationDialog
            visible={showDeleteConfirm}
            title="Delete Problem"
            message={`Are you sure you want to delete "${activeProblem.title}"? All solution notebooks, attempt logs, and revision schedules for this problem will be permanently deleted.`}
            confirmText={deleting ? 'Deleting...' : 'Delete'}
            isDestructive={true}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    height: '92%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  diffBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  idExtText: {
    fontSize: 12,
    fontWeight: '600',
  },
  platformBadge: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerIconBtn: {
    padding: 6,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  subTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  subTabBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  subTabBtnText: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleSection: {
    marginBottom: 12,
  },
  problemTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  extLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  extLinkText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  topicPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  topicPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subtopicPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  subtopicPillText: {
    fontSize: 11,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  compChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  compChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 11,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  complexityCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  complexityItem: {
    flex: 1,
    alignItems: 'center',
  },
  complexityLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  complexityVal: {
    fontSize: 15,
    fontWeight: '800',
  },
  complexityDivider: {
    width: 1,
    height: '100%',
  },
  actionsBar: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 30,
  },
  primaryActionBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryActionBtnText: {
    fontWeight: '600',
    fontSize: 12,
  },
  tabSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tabSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  addBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnSmallText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 6,
  },
  emptyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  solutionTabsScroll: {
    marginBottom: 12,
  },
  solTabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  solTabChipText: {
    fontSize: 12,
  },
  solutionDetailBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 24,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  solLangText: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  optimalPill: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  optimalPillText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '800',
  },
  codeHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeIconAction: {
    padding: 4,
  },
  solComplexRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  solComplexText: {
    fontSize: 12,
  },
  codeScrollBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 12,
    lineHeight: 18,
  },
  solExtraSection: {
    marginTop: 8,
  },
  solExtraTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  solExtraContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  attemptCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  attHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attemptNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  attemptDate: {
    fontSize: 11,
  },
  attStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  attStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  attTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  attTimeText: {
    fontSize: 12,
  },
  attNotes: {
    fontSize: 13,
    lineHeight: 17,
  },
  attCodeBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  attCodeText: {
    fontSize: 11,
  },
  revCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  revHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revHeaderLeft: {
    gap: 2,
  },
  revStepText: {
    fontSize: 14,
    fontWeight: '700',
  },
  revDateText: {
    fontSize: 12,
  },
  revStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  revStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  revDoneDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  recallRatingText: {
    fontSize: 12,
  },
  revNotesText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  reviewNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  reviewNowBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
