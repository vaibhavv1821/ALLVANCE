import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const val = await AsyncStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('[storageService] Failed to set item:', e);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('[storageService] Failed to remove item:', e);
    }
  },
};
