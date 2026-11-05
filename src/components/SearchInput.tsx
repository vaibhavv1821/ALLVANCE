import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  style,
  inputStyle,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceRaised,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          paddingHorizontal: spacing.md,
        },
        style,
      ]}
    >
      <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSizes.sm,
            paddingVertical: spacing.sm,
          },
          inputStyle,
        ]}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearButton}
        >
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  clearButton: {
    marginLeft: 6,
    padding: 2,
  },
});
