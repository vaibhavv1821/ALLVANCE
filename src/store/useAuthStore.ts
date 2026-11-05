import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Session } from '@supabase/supabase-js';
import { authService, UserProfile } from '@/services/supabase/authService';
import { supabase } from '@/services/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isGuest: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  authError: string | null;

  // Actions
  initAuth: () => Promise<void>;
  continueAsGuest: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; needsVerification: boolean; error?: string }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  clearAuthError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isGuest: false,
      isInitialized: false,
      isLoading: false,
      authError: null,

      initAuth: async () => {
        try {
          set({ isLoading: true });

          // Check if Supabase client is configured
          if (!authService.isConfigured()) {
            set({ isInitialized: true, isLoading: false });
            return;
          }

          // Check for active session in SecureStore
          const session = await authService.getSession();
          if (session?.user) {
            const profile = await authService.getProfile(session.user.id);
            set({
              session,
              user: session.user,
              profile,
              isGuest: false,
              isInitialized: true,
              isLoading: false,
            });
          } else {
            set({
              session: null,
              user: null,
              profile: null,
              isInitialized: true,
              isLoading: false,
            });
          }

          // Listen for Supabase auth state changes (e.g. token refreshed, signed out externally)
          supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession?.user) {
              const profile = await authService.getProfile(currentSession.user.id);
              set({
                session: currentSession,
                user: currentSession.user,
                profile,
                isGuest: false,
              });
            } else if (event === 'SIGNED_OUT') {
              set({
                session: null,
                user: null,
                profile: null,
              });
            }
          });
        } catch (error: any) {
          console.warn('[useAuthStore.initAuth] Failed to initialize:', error);
          set({ isInitialized: true, isLoading: false });
        }
      },

      continueAsGuest: () => {
        set({
          isGuest: true,
          user: null,
          session: null,
          profile: null,
          authError: null,
        });
      },

      signIn: async (email, password) => {
        set({ isLoading: true, authError: null });
        const res = await authService.signIn(email, password);

        if (res.error) {
          set({ isLoading: false, authError: res.error });
          return { success: false, error: res.error };
        }

        if (res.data?.user && res.data?.session) {
          const profile = await authService.getProfile(res.data.user.id);
          set({
            user: res.data.user,
            session: res.data.session,
            profile,
            isGuest: false,
            isLoading: false,
            authError: null,
          });
          return { success: true };
        }

        set({ isLoading: false });
        return { success: false, error: 'Sign in failed.' };
      },

      signUp: async (email, password, fullName) => {
        set({ isLoading: true, authError: null });
        const res = await authService.signUp(email, password, fullName);

        if (res.error) {
          set({ isLoading: false, authError: res.error });
          return { success: false, needsVerification: false, error: res.error };
        }

        if (res.data?.session && res.data?.user) {
          // Auto signed-in (confirm email was disabled)
          const profile = await authService.getProfile(res.data.user.id);
          set({
            user: res.data.user,
            session: res.data.session,
            profile,
            isGuest: false,
            isLoading: false,
            authError: null,
          });
          return { success: true, needsVerification: false };
        }

        // Email confirmation required
        set({ isLoading: false, authError: null });
        return {
          success: true,
          needsVerification: res.data?.emailConfirmationRequired ?? true,
        };
      },

      signOut: async () => {
        set({ isLoading: true });
        await authService.signOut();
        set({
          user: null,
          session: null,
          profile: null,
          isGuest: false,
          isLoading: false,
          authError: null,
        });
      },

      deleteAccount: async () => {
        set({ isLoading: true });
        const res = await authService.deleteAccount();
        if (res.error) {
          set({ isLoading: false, authError: res.error });
          return { success: false, error: res.error };
        }

        set({
          user: null,
          session: null,
          profile: null,
          isGuest: false,
          isLoading: false,
          authError: null,
        });
        return { success: true };
      },

      refreshProfile: async () => {
        const { user } = get();
        if (!user) return;
        const profile = await authService.getProfile(user.id);
        if (profile) {
          set({ profile });
        }
      },

      clearAuthError: () => set({ authError: null }),
    }),
    {
      name: 'allvance-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isGuest: state.isGuest,
      }),
    }
  )
);
