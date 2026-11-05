import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import {
  X,
  Building2,
  MapPin,
  Globe,
  GraduationCap,
  Banknote,
  Edit2,
  Trash2,
  Plus,
  Briefcase,
  CheckCircle,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ConfirmationDialog } from '@/components';
import { CompanyWithCounts } from '@/database/repositories/CompanyRepository';

interface CompanyDetailModalProps {
  visible: boolean;
  company: CompanyWithCounts | null;
  onClose: () => void;
  onEdit: (company: CompanyWithCounts) => void;
  onDelete: (companyId: string) => Promise<void>;
  onAddApplication: (company: CompanyWithCounts) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  visible,
  company,
  onClose,
  onEdit,
  onDelete,
  onAddApplication,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!company) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(company.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (e) {
      console.error('Delete company error:', e);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenWebsite = () => {
    if (!company.website) return;
    let url = company.website.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    Linking.openURL(url).catch((err) => console.log('Cannot open URL:', err));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
            },
          ]}
        >
          {/* Top Bar */}
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.border, padding: spacing.md },
            ]}
          >
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: 'rgba(56, 189, 248, 0.15)' },
                ]}
              >
                <Building2 size={20} color="#38BDF8" />
              </View>
              <View style={styles.headerTitleWrap}>
                <Text
                  style={[
                    styles.companyName,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.lg },
                  ]}
                  numberOfLines={1}
                >
                  {company.name}
                </Text>
                <Text
                  style={[
                    styles.companyIndustry,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  {company.industry || 'General Industry'}
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => onEdit(company)}
                style={[
                  styles.iconActionBtn,
                  { backgroundColor: colors.surfaceRaised },
                ]}
              >
                <Edit2 size={16} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(true)}
                style={[
                  styles.iconActionBtn,
                  { backgroundColor: colors.dangerMuted },
                ]}
              >
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.iconActionBtn}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={[styles.body, { padding: spacing.md }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Meta tags: Location & Website */}
            <View style={styles.metaRow}>
              {company.location ? (
                <View style={styles.metaItem}>
                  <MapPin size={14} color={colors.textMuted} />
                  <Text
                    style={[
                      styles.metaText,
                      { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                    ]}
                  >
                    {company.location}
                  </Text>
                </View>
              ) : null}

              {company.website ? (
                <TouchableOpacity
                  onPress={handleOpenWebsite}
                  style={styles.metaItem}
                >
                  <Globe size={14} color={colors.primary} />
                  <Text
                    style={[
                      styles.metaText,
                      { color: colors.primary, fontSize: typography.fontSizes.xs },
                    ]}
                  >
                    Careers Portal
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Key Criteria Cards */}
            <View style={styles.criteriaGrid}>
              <View
                style={[
                  styles.criteriaCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.borderSubtle,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                  },
                ]}
              >
                <View style={styles.criteriaTop}>
                  <Banknote size={14} color="#10B981" />
                  <Text
                    style={[
                      styles.criteriaLabel,
                      { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
                    ]}
                  >
                    Package Range
                  </Text>
                </View>
                <Text
                  style={[
                    styles.criteriaValue,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                  ]}
                >
                  {company.packageRange || 'Competitive'}
                </Text>
              </View>

              <View
                style={[
                  styles.criteriaCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.borderSubtle,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                  },
                ]}
              >
                <View style={styles.criteriaTop}>
                  <GraduationCap size={14} color="#38BDF8" />
                  <Text
                    style={[
                      styles.criteriaLabel,
                      { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
                    ]}
                  >
                    Min CGPA
                  </Text>
                </View>
                <Text
                  style={[
                    styles.criteriaValue,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                  ]}
                >
                  {company.minCgpa ? `${company.minCgpa} CGPA` : 'No Cutoff'}
                </Text>
              </View>

              <View
                style={[
                  styles.criteriaCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: colors.borderSubtle,
                    borderRadius: borderRadius.md,
                    padding: spacing.sm,
                  },
                ]}
              >
                <View style={styles.criteriaTop}>
                  <Briefcase size={14} color="#A855F7" />
                  <Text
                    style={[
                      styles.criteriaLabel,
                      { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
                    ]}
                  >
                    Applications
                  </Text>
                </View>
                <Text
                  style={[
                    styles.criteriaValue,
                    { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                  ]}
                >
                  {company.applicationCount} Applied
                </Text>
              </View>
            </View>

            {/* Eligible Branches */}
            {company.eligibleBranches ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionHeader,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Eligible Branches
                </Text>
                <View
                  style={[
                    styles.contentBox,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.contentText,
                      { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                    ]}
                  >
                    {company.eligibleBranches}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Hiring Process */}
            {company.hiringProcess ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionHeader,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Hiring Process & Rounds
                </Text>
                <View
                  style={[
                    styles.contentBox,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.contentText,
                      { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                    ]}
                  >
                    {company.hiringProcess}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Eligibility Criteria */}
            {company.eligibilityCriteria ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionHeader,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Detailed Eligibility Criteria
                </Text>
                <View
                  style={[
                    styles.contentBox,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.contentText,
                      { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                    ]}
                  >
                    {company.eligibilityCriteria}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Description */}
            {company.description ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionHeader,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  About the Company
                </Text>
                <View
                  style={[
                    styles.contentBox,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.contentText,
                      { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                    ]}
                  >
                    {company.description}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Personal Notes */}
            {company.notes ? (
              <View style={styles.section}>
                <Text
                  style={[
                    styles.sectionHeader,
                    { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                  ]}
                >
                  Personal Notes & Recruiter Contacts
                </Text>
                <View
                  style={[
                    styles.contentBox,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.contentText,
                      { color: colors.textPrimary, fontSize: typography.fontSizes.sm },
                    ]}
                  >
                    {company.notes}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Action to create application */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onAddApplication(company)}
              style={[
                styles.addAppBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginTop: spacing.md,
                  marginBottom: spacing.xl,
                },
              ]}
            >
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.addAppBtnText}>
                Apply to {company.name}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Delete confirmation dialog */}
          <ConfirmationDialog
            visible={showDeleteConfirm}
            title={`Delete ${company.name}?`}
            message="This will permanently remove this company profile and all associated applications, rounds, and offers. This action cannot be undone."
            confirmText="Delete Company"
            cancelText="Keep Company"
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '92%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrap: {
    flex: 1,
  },
  companyName: {
    fontWeight: '800',
  },
  companyIndustry: {
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    paddingBottom: 32,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontWeight: '600',
  },
  criteriaGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  criteriaCard: {
    flex: 1,
    borderWidth: 1,
  },
  criteriaTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  criteriaLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  criteriaValue: {
    fontWeight: '800',
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  contentBox: {
    borderWidth: 1,
  },
  contentText: {
    lineHeight: 20,
  },
  addAppBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addAppBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
