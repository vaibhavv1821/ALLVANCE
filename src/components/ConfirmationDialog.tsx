import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PrimaryButton } from './PrimaryButton';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: borderRadius.xl,
                  padding: spacing.xl,
                },
              ]}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                    fontSize: typography.fontSizes.lg,
                    fontWeight: typography.fontWeights.bold,
                  },
                ]}
              >
                {title}
              </Text>
              <Text
                style={[
                  styles.message,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSizes.sm,
                    marginTop: spacing.xs,
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                {message}
              </Text>

              <View style={styles.buttonRow}>
                <PrimaryButton
                  title={cancelText}
                  onPress={onCancel}
                  variant="secondary"
                  size="sm"
                  style={styles.cancelButton}
                />
                <PrimaryButton
                  title={confirmText}
                  onPress={onConfirm}
                  variant={isDestructive ? 'danger' : 'primary'}
                  size="sm"
                  style={styles.confirmButton}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
  },
  title: {},
  message: {
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    minWidth: 80,
  },
  confirmButton: {
    minWidth: 80,
  },
});
