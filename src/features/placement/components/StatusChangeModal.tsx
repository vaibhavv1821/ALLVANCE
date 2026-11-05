import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, ArrowRightCircle } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { ApplicationStatus, APPLICATION_STATUS_METADATA } from '../types';

interface StatusChangeModalProps {
  visible: boolean;
  currentStatus: ApplicationStatus;
  companyName: string;
  roleTitle: string;
  onClose: () => void;
  onSubmit: (newStatus: ApplicationStatus, notes?: string) => Promise<void>;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'WISHLIST',
  'APPLIED',
  'ASSESSMENT',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN',
  'ON_HOLD',
];

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  visible,
  currentStatus,
  companyName,
  roleTitle,
  onClose,
  onSubmit,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(currentStatus);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await onSubmit(selectedStatus, notes.trim() || undefined);
      setNotes('');
      onClose();
    } catch (e) {
      console.error('Update status error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.xl,
              padding: spacing.lg,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.md },
                ]}
              >
                Change Application Stage
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
                ]}
              >
                {companyName} • {roleTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.statusList} showsVerticalScrollIndicator={false}>
            {ALL_STATUSES.map((st) => {
              const meta = APPLICATION_STATUS_METADATA[st];
              const isSelected = selectedStatus === st;
              const isCurrent = currentStatus === st;

              return (
                <TouchableOpacity
                  key={st}
                  activeOpacity={0.7}
                  onPress={() => setSelectedStatus(st)}
                  style={[
                    styles.statusOption,
                    {
                      backgroundColor: isSelected
                        ? meta.bgColor
                        : colors.surfaceRaised,
                      borderColor: isSelected ? meta.color : colors.border,
                      borderRadius: borderRadius.md,
                      padding: spacing.sm,
                      marginBottom: spacing.xs,
                    },
                  ]}
                >
                  <View style={styles.statusOptionLeft}>
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: meta.color },
                      ]}
                    />
                    <View>
                      <View style={styles.statusLabelRow}>
                        <Text
                          style={[
                            styles.statusLabel,
                            {
                              color: isSelected ? meta.color : colors.textPrimary,
                              fontSize: typography.fontSizes.sm,
                            },
                          ]}
                        >
                          {meta.label}
                        </Text>
                        {isCurrent && (
                          <Text
                            style={[
                              styles.currentTag,
                              { color: colors.textMuted, fontSize: typography.fontSizes.xxs },
                            ]}
                          >
                            (Current)
                          </Text>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.statusDesc,
                          { color: colors.textSecondary, fontSize: typography.fontSizes.xxs },
                        ]}
                      >
                        {meta.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Transition Notes */}
          <Text
            style={[
              styles.notesLabel,
              { color: colors.textSecondary, fontSize: typography.fontSizes.xs },
            ]}
          >
            Transition Note / Milestone (Optional)
          </Text>
          <TextInput
            style={[
              styles.notesInput,
              {
                backgroundColor: colors.surfaceRaised,
                color: colors.textPrimary,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
            placeholder="e.g. Cleared online coding test with 100% test cases"
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
          />

          <View style={{ marginTop: spacing.md }}>
            <PrimaryButton
              title="Update Stage"
              onPress={handleSubmit}
              loading={submitting}
              icon={<ArrowRightCircle size={18} color="#FFFFFF" />}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  statusList: {
    maxHeight: 260,
    marginVertical: 8,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  statusOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusLabel: {
    fontWeight: '700',
  },
  currentTag: {
    fontStyle: 'italic',
  },
  statusDesc: {
    marginTop: 2,
  },
  notesLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 6,
  },
  notesInput: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
});
