import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Marcellus_400Regular } from '@expo-google-fonts/marcellus';
import {
  NotoSansDevanagari_400Regular,
  NotoSansDevanagari_700Bold,
} from '@expo-google-fonts/noto-sans-devanagari';
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useScheme } from '@/hooks/use-theme';
import { useAppStore } from '@/lib/state/store';
import { PlayerProvider } from '@/lib/audio/PlayerProvider';
import { AudioBridge } from '@/lib/audio/AudioBridge';
import { initSubscriptions } from '@/lib/subscription/entitlements';
import { hydrateContent } from '@/lib/content/source';

SplashScreen.preventAutoHideAsync().catch(() => {});

/** Routes the user to onboarding until it's complete, and away from it after. */
function useOnboardingGate(ready: boolean) {
  const onboarded = useAppStore((s) => s.onboarded);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboarded && !inOnboarding) router.replace('/onboarding');
    else if (onboarded && inOnboarding) router.replace('/(tabs)');
  }, [ready, onboarded, segments, router]);
}

export default function RootLayout() {
  const scheme = useScheme();
  const hydrated = useAppStore((s) => s.hydrated);
  const [fontsLoaded] = useFonts({
    Marcellus_400Regular,
    NotoSansDevanagari_400Regular,
    NotoSansDevanagari_700Bold,
  });

  const [contentReady, setContentReady] = useState(false);
  const ready = fontsLoaded && hydrated && contentReady;

  useEffect(() => {
    initSubscriptions();
    hydrateContent().finally(() => setContentReady(true));
  }, []);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  useOnboardingGate(ready);

  if (!fontsLoaded) return null;

  const navTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          value={{
            ...navTheme,
            colors: { ...navTheme.colors, background: colors.background, card: colors.surface, primary: colors.primary },
          }}
        >
          <PlayerProvider>
            <AudioBridge />
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
              <Stack.Screen name="player/[id]" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="deity/[id]" />
              <Stack.Screen name="scripture/index" />
              <Stack.Screen name="scripture/[id]" />
              <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="japa" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="learn/[id]" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="darshan" options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="sankalpa" />
            </Stack>
          </PlayerProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
