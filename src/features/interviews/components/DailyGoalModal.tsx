import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { X, Target, Check } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface DailyGoalModalProps {
  visible: boolean;
  currentTarget: number;
  onClose: () => void;
  onSaveTarget: (target: number) => void;
}

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({
  visible,
  currentTarget,
  onClose,
  onSaveTarget,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const [selectedTarget, setSelectedTarget] = useState(currentTarget || 5);

  const TARGET_OPTIONS = [3, 5, 8, 10, 15, 20];

  const handleSave = () => {
    onSaveTarget(selectedTarget);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Target size={20} color="#818CF8" />
              <Text style={[styles.title, { color: colors.textPrimary }]}>Daily Question Target</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceRaised }]}>
              <X size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            How many interview questions do you aim to complete and master each day?
          </Text>

          <View style={styles.optionsGrid}>
            {TARGET_OPTIONS.map((val) => {
              const isSelected = selectedTarget === val;
              return (
                <TouchableOpacity
                  key={val}
                  onPress={() => setSelectedTarget(val)}
                  style={[
                    styles.optionChip,
                    {
                      backgroundColor: isSelected ? '#818CF8' : colors.surfaceRaised,
                      borderColor: isSelected ? '#818CF8' : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.optionNum, { color: isSelected ? '#FFFFFF' : colors.textPrimary }]}>
                    {val}
                  </Text>
                  <Text style={[styles.optionLabel, { color: isSelected ? '#E0E7FF' : colors.textMuted }]}>
                    questions/day
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={onClose} style={[styles.cancelBtn, { backgroundColor: colors.surfaceRaised }]}>
              <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: '#818CF8' }]}>
              <Check size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Save Target</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  optionChip: {
    width: '30%',
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
