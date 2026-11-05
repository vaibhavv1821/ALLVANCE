import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';
import {
  darkColors,
  lightColors,
  ColorPalette,
  typography,
  spacing,
  borderRadius,
  shadows,
  ThemeMode,
} from '@/theme/tokens';

export interface AppTheme {
  colors: ColorPalette;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
}

export function useAppTheme(): AppTheme {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode, toggleTheme } = useThemeStore();

  const isDark =
    themeMode === 'dark'
      ? true
      : themeMode === 'light'
      ? false
      : systemColorScheme === 'dark';

  const colors = isDark ? darkColors : lightColors;

  return {
    colors,
    isDark,
    themeMode,
    setThemeMode,
    toggleTheme,
    typography,
    spacing,
    borderRadius,
    shadows,
  };
}
