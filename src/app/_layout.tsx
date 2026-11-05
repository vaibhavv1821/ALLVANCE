import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { initDatabase } from '@/database';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { AutoBackupService } from '@/services/backup/autoBackupService';

// Prevent splash screen from auto-hiding before initialization completes
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
});

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const { isDark, colors } = useAppTheme();
  const { user, isGuest, isInitialized, initAuth } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  // 1. Initialize SQLite Database, Migrations & Auth Session
  useEffect(() => {
    async function prepare() {
      try {
        // Initialize SQLite & run migrations (Phase 0 to Phase 4)
        const result = initDatabase();
        if (!result.success) {
          console.warn('[ALLVANCE Init] Migration warning:', result.error);
        }

        // Initialize Supabase Auth & SecureStore session
        await initAuth();

        // Initialize automatic background/foreground backup listener
        AutoBackupService.init();
      } catch (err: any) {
        console.error('[ALLVANCE Init Error]:', err);
        setInitError(err?.message || 'Database error');
      } finally {
        setDbReady(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    }

    prepare();
  }, [initAuth]);

  // 2. Navigation Routing Gate
  // First launch -> Welcome. Returning user or guest -> Dashboard.
  useEffect(() => {
    if (!dbReady || !isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !isGuest) {
      // First-time or signed-out user: redirect to welcome if not already in auth flow
      if (!inAuthGroup) {
        router.replace('/(auth)/welcome' as any);
      }
    } else if (user || isGuest) {
      // Authenticated or guest user: if they are in auth flow, send them to dashboard
      if (inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [dbReady, isInitialized, user, isGuest, segments, router]);

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
        <Stack.Screen name="placement" options={{ headerShown: false }} />
        <Stack.Screen name="dsa" options={{ headerShown: false }} />
        <Stack.Screen name="resume" options={{ headerShown: false }} />
        <Stack.Screen name="sql" options={{ headerShown: false }} />
        <Stack.Screen name="interviews" options={{ headerShown: false }} />
        <Stack.Screen name="aptitude" options={{ headerShown: false }} />
        <Stack.Screen name="companies" options={{ headerShown: false }} />
        <Stack.Screen name="projects" options={{ headerShown: false }} />
        <Stack.Screen name="planner" options={{ headerShown: false }} />
        <Stack.Screen name="knowledge" options={{ headerShown: false }} />
        <Stack.Screen name="ai" options={{ headerShown: false }} />
        <Stack.Screen name="analytics" options={{ headerShown: false }} />
        <Stack.Screen name="skills" options={{ headerShown: false }} />
        <Stack.Screen name="personal" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
