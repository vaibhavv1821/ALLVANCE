import { supabase, isSupabaseConfigured } from './client';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse<T = any> {
  data: T | null;
  error: string | null;
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async getSession(): Promise<Session | null> {
    try {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (err) {
      console.warn('[authService.getSession] Error:', err);
      return null;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      if (!isSupabaseConfigured()) return null;
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (err) {
      console.warn('[authService.getUser] Error:', err);
      return null;
    }
  },

  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse<{ user: User | null; session: Session | null; emailConfirmationRequired: boolean }>> {
    try {
      if (!isSupabaseConfigured()) {
        return {
          data: null,
          error: 'Supabase credentials not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        return { data: null, error: error.message };
      }

      const emailConfirmationRequired = !data.session && Boolean(data.user);

      return {
        data: {
          user: data.user,
          session: data.session,
          emailConfirmationRequired,
        },
        error: null,
      };
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'An unexpected error occurred during sign up.',
      };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    try {
      if (!isSupabaseConfigured()) {
        return {
          data: null,
          error: 'Supabase credentials not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return {
        data: {
          user: data.user,
          session: data.session,
        },
        error: null,
      };
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'An unexpected error occurred during sign in.',
      };
    }
  },

  async signOut(): Promise<AuthResponse<void>> {
    try {
      if (!isSupabaseConfigured()) {
        return { data: undefined, error: null };
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        return { data: null, error: error.message };
      }

      return { data: undefined, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'Failed to sign out.',
      };
    }
  },

  async resetPasswordForEmail(email: string, redirectTo?: string): Promise<AuthResponse<void>> {
    try {
      if (!isSupabaseConfigured()) {
        return {
          data: null,
          error: 'Supabase credentials not configured. Cloud password reset unavailable.',
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectTo || 'allvance://reset-password',
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: undefined, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'Failed to send password reset email.',
      };
    }
  },

  async updatePassword(newPassword: string): Promise<AuthResponse<void>> {
    try {
      if (!isSupabaseConfigured()) {
        return {
          data: null,
          error: 'Supabase credentials not configured.',
        };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: undefined, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'Failed to update password.',
      };
    }
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      if (!isSupabaseConfigured()) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[authService.getProfile] Error:', error.message);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        fullName: data.full_name || 'ALLVANCE User',
        email: data.email || '',
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      console.warn('[authService.getProfile] Exception:', err);
      return null;
    }
  },

  async deleteAccount(): Promise<AuthResponse<void>> {
    try {
      if (!isSupabaseConfigured()) {
        return {
          data: null,
          error: 'Supabase credentials not configured.',
        };
      }

      // Call the security definer RPC function created in our migration
      const { error: rpcError } = await supabase.rpc('delete_user_account');
      if (rpcError) {
        return { data: null, error: rpcError.message };
      }

      await supabase.auth.signOut();
      return { data: undefined, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: err?.message || 'Failed to delete account.',
      };
    }
  },
};
