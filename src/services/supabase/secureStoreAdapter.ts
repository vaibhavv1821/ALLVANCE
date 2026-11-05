import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Custom storage adapter for Supabase authentication sessions.
 * Uses Expo SecureStore for encrypted hardware-backed storage on iOS & Android.
 * Falls back safely to in-memory/null on unsupported platforms.
 */
export const secureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStoreAdapter] Failed to get item for key "${key}":`, error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn(`[SecureStoreAdapter] Failed to set item for key "${key}":`, error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStoreAdapter] Failed to delete item for key "${key}":`, error);
    }
  },
};
