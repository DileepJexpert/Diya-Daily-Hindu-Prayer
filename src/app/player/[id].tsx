import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radius, Spacing } from '@/constants/theme';
import { Button, Icon, Pill, Text } from '@/components/ui';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { LyricsView } from '@/components/player/LyricsView';
import { Catalog } from '@/lib/content/catalog';
import { usePlayerStore } from '@/lib/audio/playerStore';
import { useActiveLyric } from '@/lib/audio/useActiveLyric';
import { useIsPremium } from '@/lib/subscription/subscriptionStore';
import { useAppStore } from '@/lib/state/store';
import { useColors } from '@/hooks/use-theme';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const premium = useIsPremium();

  const track = id ? Catalog.track(id) : undefined;
  const deity = track ? Catalog.deity(track.deityId) : undefined;
  const locked = !!track && !track.isFree && !premium;

  const {
    trackId, isPlaying, position, duration, rate, repeat,
    load, toggle, seek, cycleRate, cycleRepeat, next, prev,
    sleepTimerEndsAt, setSleepTimer,
  } = usePlayerStore();
  const isFavorite = useAppStore((s) => (id ? s.favorites.includes(id) : false));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const [showDeva, setShowDeva] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  const [barWidth, setBarWidth] = useState(1);
  const [sleepMin, setSleepMin] = useState(0);

  const SLEEPS = [0, 10, 20, 30];
  const cycleSleep = () => {
    const nextMin = SLEEPS[(SLEEPS.indexOf(sleepMin) + 1) % SLEEPS.length];
    setSleepMin(nextMin);
    setSleepTimer(nextMin);
  };

  useEffect(() => {
    if (track && !locked && trackId !== track.id) load(track.id, [track.id]);
  }, [track, locked, trackId, load]);

  const { index: activeIndex } = useActiveLyric(track?.lyrics ?? [], position, duration);

  if (!track) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text variant="title">Track not found</Text>
        <Button label="Go back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm }}>
      {/* Top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Icon name="chevron-down" size={28} color="textSecondary" />
        </Pressable>
        <Text variant="overline" color="textMuted">{track.kind.toUpperCase()}</Text>
        <Pressable onPress={() => toggleFavorite(track.id)} hitSlop={12}>
          <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? 'accent' : 'textSecondary'} />
        </Pressable>
      </View>

      {/* Header */}
      <View style={{ alignItems: 'center', paddingHorizontal: Spacing.xl, marginTop: Spacing.md }}>
        {deity && <DeityAvatar deity={deity} size={64} />}
        <Text variant="h2" center style={{ marginTop: Spacing.sm }}>{track.title}</Text>
        {track.devanagari && <Text variant="sanskrit" center color="textSecondary">{track.devanagari}</Text>}
        <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.xs }}>{track.artist}</Text>
      </View>

      {locked ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md }}>
          <Icon name="lock-closed" size={40} color="primary" />
          <Text variant="title" center>A Diya membership unlocks this</Text>
          <Text variant="body" color="textSecondary" center>
            Full guided practices, the complete library and offline downloads.
          </Text>
          <Button label="See membership" icon="sparkles" onPress={() => router.push('/paywall')} />
        </View>
      ) : (
        <>
          {/* Synced lyrics */}
          <View style={{ flex: 1, paddingHorizontal: Spacing.xl }}>
            <LyricsView
              lyrics={track.lyrics}
              activeIndex={activeIndex}
              showDevanagari={showDeva}
              showTranslation={showTrans}
              onPressLine={(i) => seek(track.lyrics[i].t)}
            />
          </View>

          {/* Controls */}
          <View
            style={{
              paddingHorizontal: Spacing.xl,
              paddingBottom: insets.bottom + Spacing.lg,
              paddingTop: Spacing.md,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              gap: Spacing.md,
            }}
          >
            <View style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' }}>
              <Pill
                label={repeat === 'one' ? 'Repeat 1' : repeat === 'all' ? 'Repeat all' : 'Repeat'}
                icon="repeat"
                active={repeat !== 'off'}
                onPress={cycleRepeat}
              />
              <Pill label={sleepMin ? `Sleep ${sleepMin}m` : 'Sleep'} icon="moon" active={!!sleepTimerEndsAt} onPress={cycleSleep} />
              <Pill label="Learn" icon="school" onPress={() => router.push(`/learn/${track.id}`)} />
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' }}>
              <Pill label="अ Devanagari" active={showDeva} onPress={() => setShowDeva((v) => !v)} />
              <Pill label="A Translation" active={showTrans} onPress={() => setShowTrans((v) => !v)} />
            </View>

            {/* Seek bar */}
            <View>
              <Pressable
                onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
                onPress={(e) => seek((e.nativeEvent.locationX / barWidth) * duration)}
                style={{ paddingVertical: Spacing.sm }}
              >
                <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.border }}>
                  <View style={{ width: `${duration ? (position / duration) * 100 : 0}%`, height: 4, borderRadius: 2, backgroundColor: colors.primary }} />
                </View>
              </Pressable>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="caption" color="textMuted">{fmt(position)}</Text>
                <Text variant="caption" color="textMuted">{fmt(duration)}</Text>
              </View>
            </View>

            {/* Transport */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable onPress={cycleRate} hitSlop={8} style={{ width: 56 }}>
                <Text variant="label" color="textSecondary">{rate}×</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xl }}>
                <Pressable onPress={prev} hitSlop={10}><Icon name="play-skip-back" size={28} color="text" /></Pressable>
                <Pressable
                  onPress={toggle}
                  style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="onPrimary" />
                </Pressable>
                <Pressable onPress={next} hitSlop={10}><Icon name="play-skip-forward" size={28} color="text" /></Pressable>
              </View>
              <View style={{ width: 56, alignItems: 'flex-end' }}>
                {track.audio === null && <Text variant="caption" color="textMuted">follow</Text>}
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
