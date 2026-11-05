export interface ColorPalette {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceHighlight: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryMuted: string;
  accent: string;
  accentMuted: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
  info: string;
  infoMuted: string;
  cardGradientStart: string;
  cardGradientEnd: string;
  tabBackground: string;
  tabBorder: string;
  tabActive: string;
  tabInactive: string;
}

export const darkColors: ColorPalette = {
  background: '#090D16',
  surface: '#0F172A',
  surfaceRaised: '#1E293B',
  surfaceHighlight: '#334155',
  border: '#1E293B',
  borderSubtle: '#141E33',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#38BDF8',
  primaryMuted: 'rgba(56, 189, 248, 0.15)',
  accent: '#818CF8',
  accentMuted: 'rgba(129, 140, 248, 0.15)',
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.15)',
  info: '#0EA5E9',
  infoMuted: 'rgba(14, 165, 233, 0.15)',
  cardGradientStart: '#0F172A',
  cardGradientEnd: '#1E293B',
  tabBackground: '#0B1120',
  tabBorder: '#1E293B',
  tabActive: '#38BDF8',
  tabInactive: '#64748B',
};

export const lightColors: ColorPalette = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceRaised: '#F1F5F9',
  surfaceHighlight: '#E2E8F0',
  border: '#E2E8F0',
  borderSubtle: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#0284C7',
  primaryMuted: 'rgba(2, 132, 199, 0.12)',
  accent: '#6366F1',
  accentMuted: 'rgba(99, 102, 241, 0.12)',
  success: '#059669',
  successMuted: 'rgba(5, 150, 105, 0.12)',
  warning: '#D97706',
  warningMuted: 'rgba(217, 119, 6, 0.12)',
  danger: '#DC2626',
  dangerMuted: 'rgba(220, 38, 38, 0.12)',
  info: '#0284C7',
  infoMuted: 'rgba(2, 132, 199, 0.12)',
  cardGradientStart: '#FFFFFF',
  cardGradientEnd: '#F8FAFC',
  tabBackground: '#FFFFFF',
  tabBorder: '#E2E8F0',
  tabActive: '#0284C7',
  tabInactive: '#94A3B8',
};

export const typography = {
  fontSizes: {
    xxs: 10,
    xs: 12,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 34,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};

export type ThemeType = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'system';
