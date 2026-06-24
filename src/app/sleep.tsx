import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { Icon, Text } from '@/components/ui';
import { Catalog } from '@/lib/content/catalog';
import { usePlayerStore } from '@/lib/audio/playerStore';
import { AMBIENCE } from '@/lib/audio/ambience';
import { currentAmbience, setAmbience, setAmbienceTimer } from '@/lib/audio/ambienceEngine';

// This screen is intentionally always-dark (a nighttime surface), independent of theme.
const C = {
  bg: Palette.night,
  surface: Palette.nightSurface,
  surfaceActive: Palette.nightElevated,
  text: Palette.moon,
  muted: Palette.ash,
  faint: Palette.smoke,
  accent: Palette.saffronSoft,
  border: '#2C2238',
};

const TIMERS = [0, 15, 30, 45, 60];
const CHANTS = ['om-namah-shivaya', 'hare-krishna-maha-mantra', 'gayatri-mantra'];

export default function SleepScreen() {
  const insets = useSafeAreaInsets();
  const [timerMin, setTimerMin] = useState(0);
  const [sound, setSound] = useState<string | null>(() => currentAmbience());

  const sounds = AMBIENCE.filter((a) => a.id !== 'none');

  const toggleSound = (id: string) => {
    if (sound === id) {
      setAmbience('none');
      setSound(null);
    } else {
      setAmbience(id);
      setAmbienceTimer(timerMin);
      setSound(id);
    }
  };

  const changeTimer = (m: number) => {
    setTimerMin(m);
    if (sound) setAmbienceTimer(m);
  };

  const openForSleep = (trackId: string) => {
    const p = usePlayerStore.getState();
    p.load(trackId, [trackId]);
    usePlayerStore.setState({ rate: 0.75 });
    if (timerMin > 0) p.setSleepTimer(timerMin);
    router.push(`/player/${trackId}`);
  };

  const yogaNidra = Catalog.track('yoga-nidra-sleep');
  const chants = CHANTS.map((id) => Catalog.track(id)).filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top + Spacing.sm }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: insets.bottom + Spacing.xxl }}
      >
        <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
          <Icon name="chevron-down" size={28} color={C.muted} />
        </Pressable>

        <Text variant="h1" color={C.text}>Sleep</Text>
        <Text variant="body" color={C.muted} style={{ marginTop: Spacing.xs }}>
          Drift off to a soft soundscape or a slow chant. Set a timer and let it fade.
        </Text>

        {/* Sleep timer */}
        <Text variant="overline" color={C.faint} style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm }}>
          Sleep timer
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {TIMERS.map((m) => {
            const active = timerMin === m;
            return (
              <Pressable
                key={m}
                onPress={() => changeTimer(m)}
                style={{
                  paddingVertical: Spacing.sm,
                  paddingHorizontal: Spacing.lg,
                  borderRadius: Radius.pill,
                  backgroundColor: active ? C.accent : C.surface,
                  borderWidth: 1,
                  borderColor: active ? C.accent : C.border,
                }}
              >
                <Text variant="label" color={active ? '#2A1206' : C.muted}>{m === 0 ? 'Off' : `${m} min`}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Sleep sounds */}
        <Text variant="overline" color={C.faint} style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm }}>
          Sleep sounds
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md }}>
          {sounds.map((a) => {
            const active = sound === a.id;
            return (
              <Pressable
                key={a.id}
                onPress={() => toggleSound(a.id)}
                style={{
                  width: '47%',
                  flexGrow: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.md,
                  padding: Spacing.lg,
                  borderRadius: Radius.lg,
                  backgroundColor: active ? C.surfaceActive : C.surface,
                  borderWidth: 1,
                  borderColor: active ? C.accent : C.border,
                }}
              >
                <Icon name={active ? 'pause' : a.icon} size={22} color={active ? C.accent : C.muted} />
                <Text variant="subtitle" color={C.text}>{a.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {sound && (
          <Text variant="caption" color={C.faint} style={{ marginTop: Spacing.md }}>
            Playing softly{timerMin > 0 ? ` · stops in ${timerMin} min` : ' · tap again to stop'}.
          </Text>
        )}

        {/* Yoga Nidra */}
        {yogaNidra && (
          <>
            <Text variant="overline" color={C.faint} style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm }}>
              Guided
            </Text>
            <Pressable
              onPress={() => openForSleep(yogaNidra.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
                padding: Spacing.lg,
                borderRadius: Radius.lg,
                backgroundColor: C.surface,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Icon name="moon" size={24} color={C.accent} />
              <View style={{ flex: 1 }}>
                <Text variant="subtitle" color={C.text}>{yogaNidra.title}</Text>
                <Text variant="caption" color={C.muted}>A slow body-scan to release the day</Text>
              </View>
              <Icon name="play-circle" size={28} color={C.accent} />
            </Pressable>
          </>
        )}

        {/* Wind-down chants */}
        <Text variant="overline" color={C.faint} style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm }}>
          Wind-down chants
        </Text>
        <View style={{ gap: Spacing.md }}>
          {chants.map((t) => (
            <Pressable
              key={t!.id}
              onPress={() => openForSleep(t!.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
                padding: Spacing.lg,
                borderRadius: Radius.lg,
                backgroundColor: C.surface,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Icon name="musical-notes" size={20} color={C.muted} />
              <View style={{ flex: 1 }}>
                <Text variant="subtitle" color={C.text}>{t!.title}</Text>
                <Text variant="caption" color={C.muted}>{t!.artist}</Text>
              </View>
              <Icon name="play-circle" size={28} color={C.accent} />
            </Pressable>
          ))}
        </View>
        <Text variant="caption" color={C.faint} style={{ marginTop: Spacing.md }}>
          Chants open at a slow 0.75× pace. Mix one with a sleep sound for a fuller soundscape.
        </Text>
      </ScrollView>
    </View>
  );
}
