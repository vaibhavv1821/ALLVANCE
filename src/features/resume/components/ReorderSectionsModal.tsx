import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, ArrowUp, ArrowDown, Eye, EyeOff, Layers, Check } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from '@/components';
import { ResumeSection } from '@/database/schema/resume';

interface ReorderSectionsModalProps {
  visible: boolean;
  sections: ResumeSection[];
  onClose: () => void;
  onSave: (
    updatedSections: { sectionKey: string; title: string; orderIndex: number; isVisible: number }[]
  ) => Promise<void>;
}

export const ReorderSectionsModal: React.FC<ReorderSectionsModalProps> = ({
  visible,
  sections,
  onClose,
  onSave,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [items, setItems] = useState<ResumeSection[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      const sorted = [...sections].sort((a, b) => a.orderIndex - b.orderIndex);
      setItems(sorted);
    }
  }, [visible, sections]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
  };

  const toggleVisibility = (index: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      isVisible: newItems[index].isVisible === 1 ? 0 : 1,
    };
    setItems(newItems);
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      const payload = items.map((item, idx) => ({
        sectionKey: item.sectionKey,
        title: item.title,
        orderIndex: idx,
        isVisible: item.isVisible,
      }));
      await onSave(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
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
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Layers size={20} color={colors.accent} />
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.textPrimary, fontSize: typography.fontSizes.lg, fontWeight: '700' },
                ]}
              >
                Reorder Resume Sections
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={{ color: colors.textSecondary, fontSize: typography.fontSizes.xs, marginBottom: spacing.sm }}>
              Use arrows to arrange sections in your preferred order for PDF export and visual preview:
            </Text>

            {items.map((sec, idx) => {
              const isHidden = sec.isVisible === 0;

              return (
                <View
                  key={sec.sectionKey}
                  style={[
                    styles.sectionRow,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: colors.borderSubtle,
                      borderRadius: borderRadius.md,
                      marginBottom: spacing.xs,
                      padding: spacing.sm,
                      opacity: isHidden ? 0.6 : 1,
                    },
                  ]}
                >
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: colors.textMuted, fontSize: typography.fontSizes.xs, fontWeight: '700', width: 20 }}>
                      #{idx + 1}
                    </Text>
                    <Text
                      style={{
                        color: isHidden ? colors.textMuted : colors.textPrimary,
                        fontSize: typography.fontSizes.sm,
                        fontWeight: '600',
                      }}
                    >
                      {sec.title}
                    </Text>
                  </View>

                  <View style={styles.controlsRow}>
                    <TouchableOpacity
                      onPress={() => toggleVisibility(idx)}
                      style={styles.iconBtn}
                    >
                      {isHidden ? (
                        <EyeOff size={16} color={colors.textMuted} />
                      ) : (
                        <Eye size={16} color={colors.accent} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => moveUp(idx)}
                      disabled={idx === 0}
                      style={[styles.iconBtn, { opacity: idx === 0 ? 0.3 : 1 }]}
                    >
                      <ArrowUp size={16} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => moveDown(idx)}
                      disabled={idx === items.length - 1}
                      style={[styles.iconBtn, { opacity: idx === items.length - 1 ? 0.3 : 1 }]}
                    >
                      <ArrowDown size={16} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, padding: spacing.md }]}>
            <PrimaryButton
              title="Save Section Order"
              onPress={handleSave}
              loading={submitting}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '80%',
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
  },
  modalTitle: {},
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  footer: {
    borderTopWidth: 1,
  },
});
