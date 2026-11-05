import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { initDatabase } from '@/database';
import { useAppTheme } from '@/hooks/useAppTheme';

// Prevent splash screen from auto-hiding before initialization completes
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
});

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const { isDark, colors } = useAppTheme();

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize SQLite & run migrations
        const result = initDatabase();
        if (!result.success) {
          console.warn('[ALLVANCE Init] Migration warning:', result.error);
        }
      } catch (err: any) {
        console.error('[ALLVANCE Init Error]:', err);
        setInitError(err?.message || 'Database error');
      } finally {
        setDbReady(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    }

    prepare();
  }, []);

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
