import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '@/theme/tokens';

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      toggleTheme: () => {
        const current = get().themeMode;
        const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
        set({ themeMode: next });
      },
    }),
    {
      name: 'allvance-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
