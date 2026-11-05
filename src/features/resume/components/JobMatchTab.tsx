import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Briefcase,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Building2,
  Trash2,
  History,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ResumeDetailed } from '@/database/repositories/ResumeRepository';
import { matchJobDescription, JobMatchResult } from '../services/jobMatcher';
import { resumeRepository } from '@/database/repositories/ResumeRepository';

interface JobMatchTabProps {
  resume: ResumeDetailed;
  onRefreshResume: () => void;
}

export const JobMatchTab: React.FC<JobMatchTabProps> = ({
  resume,
  onRefreshResume,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState(resume.targetRole || 'Software Development Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<JobMatchResult | null>(null);

  const handleRunAnalysis = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      Alert.alert(
        'Input Required',
        'Please paste the job description text (at least 30 characters) to analyze matching keywords.'
      );
      return;
    }

    try {
      setAnalyzing(true);
      const result = matchJobDescription(resume, jobDescription, jobTitle);
      setCurrentMatch(result);

      // Save match to database
      await resumeRepository.saveJobMatch(resume.id, {
        companyName,
        jobTitle,
        jobDescription,
        matchScore: result.matchScore,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords,
        recommendations: result.recommendations,
      });

      onRefreshResume();
    } catch (e: any) {
      Alert.alert('Analysis Failed', e?.message || 'Error parsing job description');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteHistory = async (matchId: string) => {
    await resumeRepository.deleteJobMatch(matchId);
    onRefreshResume();
  };

  const scoreColor =
    !currentMatch
      ? colors.accent
      : currentMatch.matchScore >= 80
      ? colors.success
      : currentMatch.matchScore >= 60
      ? colors.accent
      : currentMatch.matchScore >= 40
      ? colors.warning
      : colors.danger;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { padding: spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Job Input Card */}
      <View
        style={[
          styles.inputCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Target size={18} color={colors.accent} />
          <Text
            style={[
              styles.cardTitle,
              { color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: '700' },
            ]}
          >
            TARGET JOB DESCRIPTION MATCHER
          </Text>
        </View>

        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2, marginBottom: spacing.sm }}>
          Paste any job posting or description to calculate offline keyword coverage against this resume.
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xxs }]}>
              COMPANY NAME (OPTIONAL)
            </Text>
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="e.g. Google, Microsoft, Infosys"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderRadius: borderRadius.sm,
                  fontSize: typography.fontSizes.xs,
                  padding: spacing.sm,
                },
              ]}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xxs }]}>
              TARGET ROLE TITLE
            </Text>
            <TextInput
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholder="e.g. SDE-1, React Native Dev"
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  borderRadius: borderRadius.sm,
                  fontSize: typography.fontSizes.xs,
                  padding: spacing.sm,
                },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.inputLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.xxs }]}>
          PASTE JOB DESCRIPTION TEXT
        </Text>
        <TextInput
          value={jobDescription}
          onChangeText={setJobDescription}
          placeholder="Paste requirements, tech stack, responsibilities from the job listing here..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={[
            styles.textArea,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              color: colors.textPrimary,
              borderRadius: borderRadius.sm,
              fontSize: typography.fontSizes.xs,
              padding: spacing.sm,
              minHeight: 110,
            },
          ]}
        />

        <TouchableOpacity
          onPress={handleRunAnalysis}
          disabled={analyzing}
          activeOpacity={0.8}
          style={[
            styles.matchButton,
            {
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
              marginTop: spacing.md,
            },
          ]}
        >
          {analyzing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Sparkles size={16} color="#FFFFFF" />
              <Text style={[styles.matchButtonText, { color: '#FFFFFF', fontSize: typography.fontSizes.sm }]}>
                Analyze Match & Keywords
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. Analysis Results Display (if run) */}
      {currentMatch && (
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
              marginBottom: spacing.md,
            },
          ]}
        >
          {/* Match Score Row */}
          <View style={styles.scoreRow}>
            <View
              style={[
                styles.scoreBadge,
                {
                  borderColor: scoreColor,
                  backgroundColor: `${scoreColor}15`,
                },
              ]}
            >
              <Text style={[styles.matchScoreText, { color: scoreColor }]}>
                {currentMatch.matchScore}%
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs }}>
                MATCH
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.md, fontWeight: '700' }}>
                {currentMatch.grade} Alignment
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginTop: 2 }}>
                {currentMatch.matchedKeywords.length} matching skills, {currentMatch.missingKeywords.length} missing keywords found.
              </Text>
            </View>
          </View>

          {/* Matched Keywords */}
          <View style={{ marginTop: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.xs }}>
              <CheckCircle2 size={15} color={colors.success} />
              <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.xs, fontWeight: '700' }}>
                Matched Keywords ({currentMatch.matchedKeywords.length})
              </Text>
            </View>

            <View style={styles.tagsContainer}>
              {currentMatch.matchedKeywords.length === 0 ? (
                <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xs, fontStyle: 'italic' }}>
                  No exact matching keywords found.
                </Text>
              ) : (
                currentMatch.matchedKeywords.map((kw, i) => (
                  <View
                    key={i}
                    style={[
                      styles.kwChip,
                      { backgroundColor: `${colors.success}18`, borderRadius: borderRadius.xs },
                    ]}
                  >
                    <Text style={{ color: colors.success, fontSize: typography.fontSizes.xxs, fontWeight: '600' }}>
                      ✓ {kw}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* Missing Keywords */}
          {currentMatch.missingKeywords.length > 0 && (
            <View style={{ marginTop: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.xs }}>
                <XCircle size={15} color={colors.warning} />
                <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.xs, fontWeight: '700' }}>
                  Missing Keywords in Resume ({currentMatch.missingKeywords.length})
                </Text>
              </View>

              <View style={styles.tagsContainer}>
                {currentMatch.missingKeywords.map((kw, i) => (
                  <View
                    key={i}
                    style={[
                      styles.kwChip,
                      { backgroundColor: `${colors.warning}18`, borderRadius: borderRadius.xs },
                    ]}
                  >
                    <Text style={{ color: colors.warning, fontSize: typography.fontSizes.xxs, fontWeight: '600' }}>
                      + {kw}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recommendations */}
          {currentMatch.recommendations.length > 0 && (
            <View style={{ marginTop: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.xs }}>
                <Lightbulb size={15} color={colors.accent} />
                <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.xs, fontWeight: '700' }}>
                  Role Tailoring Recommendations
                </Text>
              </View>

              {currentMatch.recommendations.map((rec, i) => (
                <View
                  key={i}
                  style={[
                    styles.recItem,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderRadius: borderRadius.sm,
                      marginBottom: spacing.xs,
                      padding: spacing.sm,
                    },
                  ]}
                >
                  <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs }}>
                    • {rec}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 3. History of Previous Matches */}
      {resume.jobMatches.length > 0 && (
        <View
          style={[
            styles.historyCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              padding: spacing.md,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm }}>
            <History size={16} color={colors.textSecondary} />
            <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.sm, fontWeight: '700' }}>
              Saved Job Matches ({resume.jobMatches.length})
            </Text>
          </View>

          {resume.jobMatches.map((m) => (
            <View
              key={m.id}
              style={[
                styles.historyItem,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.borderSubtle,
                  borderRadius: borderRadius.md,
                  marginBottom: spacing.xs,
                  padding: spacing.sm,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.textPrimary, fontSize: typography.fontSizes.xs, fontWeight: '700' }}>
                    {m.companyName ? `${m.companyName} • ` : ''}{m.jobTitle || 'Role'}
                  </Text>
                  <Text style={{ color: colors.accent, fontSize: typography.fontSizes.xs, fontWeight: '800' }}>
                    {m.matchScore}%
                  </Text>
                </View>
                <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xxs, marginTop: 2 }}>
                  {new Date(m.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteHistory(m.id)}
                style={{ padding: 6, marginLeft: 8 }}
              >
                <Trash2 size={14} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  inputCard: {
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    letterSpacing: 0.5,
  },
  inputLabel: {
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
  },
  textArea: {
    borderWidth: 1,
  },
  matchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
  },
  matchButtonText: {
    fontWeight: '600',
  },
  resultCard: {
    borderWidth: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchScoreText: {
    fontSize: 20,
    fontWeight: '800',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  kwChip: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  recItem: {},
  historyCard: {
    borderWidth: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
