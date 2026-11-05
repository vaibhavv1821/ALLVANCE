import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DemoState {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      isDemoMode: false, // Default is FALSE: actual app shows zero or empty states
      setDemoMode: (enabled: boolean) => set({ isDemoMode: enabled }),
      toggleDemoMode: () => set({ isDemoMode: !get().isDemoMode }),
    }),
    {
      name: 'allvance-demo-mode',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
