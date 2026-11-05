import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  FileText,
  Download,
  Share2,
  Check,
  Palette,
  Eye,
  FileCheck2,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ResumeDetailed } from '@/database/repositories/ResumeRepository';
import {
  TemplateId,
  RESUME_TEMPLATES,
  generateResumePdf,
  shareResumePdf,
} from '../services/pdfGenerator';

interface ResumePreviewTabProps {
  resume: ResumeDetailed;
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
}

export const ResumePreviewTab: React.FC<ResumePreviewTabProps> = ({
  resume,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [lastPdfUri, setLastPdfUri] = useState<string | null>(null);

  const p = resume.profile;

  const handleExportPdf = async () => {
    try {
      setGenerating(true);
      const res = await generateResumePdf(resume, selectedTemplate);
      setLastPdfUri(res.uri);
      Alert.alert(
        'PDF Generated Successfully',
        `A4 Document compiled (${res.numberOfPages} pages).\nSaved to offline cache:\n${res.uri}`,
        [
          { text: 'Done', style: 'cancel' },
          { text: 'Share Now', onPress: () => handleSharePdf(res.uri) },
        ]
      );
    } catch (e: any) {
      Alert.alert('PDF Generation Failed', e?.message || 'Unknown error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSharePdf = async (uriOverride?: string) => {
    try {
      setSharing(true);
      let targetUri = uriOverride || lastPdfUri;
      if (!targetUri) {
        const res = await generateResumePdf(resume, selectedTemplate);
        targetUri = res.uri;
        setLastPdfUri(targetUri);
      }
      await shareResumePdf(targetUri, resume.title);
    } catch (e: any) {
      Alert.alert('Share Failed', e?.message || 'Could not launch native share sheet');
    } finally {
      setSharing(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { padding: spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Template Selection Pills */}
      <View style={{ marginBottom: spacing.md }}>
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginBottom: spacing.xs },
          ]}
        >
          SELECT RESUME TEMPLATE
        </Text>
        <View style={styles.templatesRow}>
          {RESUME_TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplate;
            return (
              <TouchableOpacity
                key={tmpl.id}
                onPress={() => onSelectTemplate(tmpl.id)}
                activeOpacity={0.8}
                style={[
                  styles.templatePill,
                  {
                    backgroundColor: isSelected ? `${colors.accent}20` : colors.surface,
                    borderColor: isSelected ? colors.accent : colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <View style={styles.pillTop}>
                  <Text
                    style={[
                      styles.templateName,
                      {
                        color: isSelected ? colors.accent : colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {tmpl.name}
                  </Text>
                  {isSelected && <Check size={14} color={colors.accent} />}
                </View>
                <Text
                  style={[
                    styles.templateDesc,
                    { color: colors.textMuted, fontSize: typography.fontSizes.xxs, marginTop: 2 },
                  ]}
                  numberOfLines={2}
                >
                  {tmpl.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Export / Share Floating Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={handleExportPdf}
          disabled={generating || sharing}
          activeOpacity={0.8}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          {generating ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <>
              <Download size={16} color={colors.accent} />
              <Text style={[styles.actionBtnText, { color: colors.accent, fontSize: typography.fontSizes.sm }]}>
                Compile A4 PDF
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSharePdf()}
          disabled={generating || sharing}
          activeOpacity={0.8}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.accent,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          {sharing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Share2 size={16} color="#FFFFFF" />
              <Text style={[styles.actionBtnText, { color: '#FFFFFF', fontSize: typography.fontSizes.sm }]}>
                Share PDF
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Sheet Metadata info */}
      <View
        style={[
          styles.sheetInfoBanner,
          {
            backgroundColor: `${colors.accent}12`,
            borderColor: `${colors.accent}30`,
            borderRadius: borderRadius.sm,
            marginTop: spacing.sm,
            marginBottom: spacing.md,
            padding: spacing.sm,
          },
        ]}
      >
        <FileCheck2 size={16} color={colors.accent} />
        <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, flex: 1 }}>
          Formatted strictly to standard ISO A4 paper (210 × 297mm) with vector selectable fonts.
        </Text>
      </View>

      {/* Live Visual Preview Sheet Container */}
      <View
        style={[
          styles.sheetPreview,
          {
            backgroundColor: '#FFFFFF',
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            padding: spacing.lg,
          },
        ]}
      >
        {/* Render Preview according to selected template */}
        {selectedTemplate === 'minimal' ? (
          /* Minimal ATS Preview */
          <View>
            <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#000000', textTransform: 'uppercase' }}>
                {p?.fullName || 'Full Name'}
              </Text>
              <Text style={{ fontSize: 9, color: '#333333', marginTop: 2 }}>
                {[p?.email, p?.phone, p?.location].filter(Boolean).join(' | ')}
              </Text>
            </View>

            {p?.summary ? (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.minimalHeading}>SUMMARY</Text>
                <Text style={{ fontSize: 9.5, color: '#111111', lineHeight: 14 }}>{p.summary}</Text>
              </View>
            ) : null}

            {resume.education.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.minimalHeading}>EDUCATION</Text>
                {resume.education.map((e) => (
                  <View key={e.id} style={{ marginBottom: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#000000' }}>{e.institution}</Text>
                      <Text style={{ fontSize: 8.5, color: '#444444' }}>{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</Text>
                    </View>
                    <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#333333' }}>
                      {e.degree} {e.grade ? `(${e.grade})` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {resume.skills.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.minimalHeading}>TECHNICAL SKILLS</Text>
                {resume.skills.map((s) => (
                  <Text key={s.id} style={{ fontSize: 9, color: '#111111', marginBottom: 2 }}>
                    <Text style={{ fontWeight: '700' }}>{s.category}: </Text>
                    {s.skills}
                  </Text>
                ))}
              </View>
            )}

            {resume.projects.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.minimalHeading}>PROJECTS</Text>
                {resume.projects.map((pr) => (
                  <View key={pr.id} style={{ marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#000000' }}>{pr.title}</Text>
                      <Text style={{ fontSize: 8.5, color: '#444444' }}>{[pr.startDate, pr.endDate].filter(Boolean).join(' - ')}</Text>
                    </View>
                    {pr.techStack ? (
                      <Text style={{ fontSize: 8.5, fontStyle: 'italic', color: '#444444' }}>Tech: {pr.techStack}</Text>
                    ) : null}
                    {pr.description ? (
                      <Text style={{ fontSize: 9, color: '#222222', marginTop: 1 }}>{pr.description}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : selectedTemplate === 'technical' ? (
          /* Technical Developer Preview */
          <View>
            <View style={{ backgroundColor: '#F1F5F9', padding: 10, borderRadius: 4, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#0F172A' }}>{p?.fullName || 'Full Name'}</Text>
                {p?.professionalTitle && (
                  <View style={{ backgroundColor: '#E0F2FE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 }}>
                    <Text style={{ fontSize: 8, fontWeight: '700', color: '#0284C7' }}>{p.professionalTitle}</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 8, fontFamily: 'monospace', color: '#475569', marginTop: 4 }}>
                {[p?.email, p?.phone, p?.location, p?.githubUrl].filter(Boolean).join(' | ')}
              </Text>
            </View>

            {resume.skills.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.techHeading}>// TECHNICAL EXPERTISE</Text>
                {resume.skills.map((s) => (
                  <Text key={s.id} style={{ fontSize: 8.5, color: '#334155', marginBottom: 2 }}>
                    <Text style={{ fontWeight: '700', color: '#0F172A' }}>{s.category}: </Text>
                    {s.skills}
                  </Text>
                ))}
              </View>
            )}

            {resume.projects.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.techHeading}>// CORE ENGINEERING PROJECTS</Text>
                {resume.projects.map((pr) => (
                  <View key={pr.id} style={{ marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#0F172A' }}>{pr.title}</Text>
                      <Text style={{ fontSize: 8, color: '#64748B' }}>{[pr.startDate, pr.endDate].filter(Boolean).join(' - ')}</Text>
                    </View>
                    {pr.techStack && (
                      <Text style={{ fontSize: 8, fontFamily: 'monospace', color: '#0284C7' }}>[ {pr.techStack} ]</Text>
                    )}
                    {pr.description ? (
                      <Text style={{ fontSize: 8.5, color: '#334155', marginTop: 1 }}>{pr.description}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          /* Modern Professional Preview */
          <View>
            <View style={{ borderBottomWidth: 2, borderBottomColor: '#4F46E5', paddingBottom: 8, marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>{p?.fullName || 'Full Name'}</Text>
              {p?.professionalTitle ? (
                <Text style={{ fontSize: 10, fontWeight: '600', color: '#4F46E5', marginTop: 1 }}>
                  {p.professionalTitle}
                </Text>
              ) : null}
              <Text style={{ fontSize: 8.5, color: '#64748B', marginTop: 4 }}>
                {[p?.email, p?.phone, p?.location, p?.linkedinUrl].filter(Boolean).join(' • ')}
              </Text>
            </View>

            {p?.summary ? (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.modernHeading}>PROFESSIONAL SUMMARY</Text>
                <Text style={{ fontSize: 9, color: '#334155', lineHeight: 13 }}>{p.summary}</Text>
              </View>
            ) : null}

            {resume.education.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.modernHeading}>EDUCATION</Text>
                {resume.education.map((e) => (
                  <View key={e.id} style={{ marginBottom: 4 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 9.5, fontWeight: '600', color: '#0F172A' }}>{e.institution}</Text>
                      <Text style={{ fontSize: 8, color: '#64748B' }}>{[e.startDate, e.endDate].filter(Boolean).join(' - ')}</Text>
                    </View>
                    <Text style={{ fontSize: 8.5, color: '#475569' }}>
                      {e.degree} {e.grade ? `| ${e.grade}` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {resume.skills.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.modernHeading}>TECHNICAL SKILLS</Text>
                {resume.skills.map((s) => (
                  <Text key={s.id} style={{ fontSize: 8.5, color: '#334155', marginBottom: 2 }}>
                    <Text style={{ fontWeight: '700', color: '#1E293B' }}>{s.category}: </Text>
                    {s.skills}
                  </Text>
                ))}
              </View>
            )}

            {resume.projects.length > 0 && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.modernHeading}>PROJECTS</Text>
                {resume.projects.map((pr) => (
                  <View key={pr.id} style={{ marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 9.5, fontWeight: '600', color: '#0F172A' }}>{pr.title}</Text>
                      <Text style={{ fontSize: 8, color: '#64748B' }}>{[pr.startDate, pr.endDate].filter(Boolean).join(' - ')}</Text>
                    </View>
                    {pr.techStack && (
                      <Text style={{ fontSize: 8, fontWeight: '600', color: '#4F46E5' }}>Tech: {pr.techStack}</Text>
                    )}
                    {pr.description ? (
                      <Text style={{ fontSize: 8.5, color: '#334155', marginTop: 1 }}>{pr.description}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 60,
  },
  sectionLabel: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  templatesRow: {
    gap: 8,
  },
  templatePill: {
    padding: 10,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  pillTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateName: {},
  templateDesc: {},
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
  },
  actionBtnText: {
    fontWeight: '600',
  },
  sheetInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  sheetPreview: {
    minHeight: 400,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  minimalHeading: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 1,
    marginBottom: 3,
  },
  modernHeading: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#4F46E5',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 1,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  techHeading: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 1,
    marginBottom: 3,
    fontFamily: 'monospace',
  },
});
