import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { Button, Icon, Pill, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { Catalog } from '@/lib/content/catalog';
import { usePlayerStore } from '@/lib/audio/playerStore';
import { activeWordIndex } from '@/components/player/LyricsView';
import { speakLine, stopSpeaking } from '@/lib/audio/speech';
import { useAppStore } from '@/lib/state/store';

/**
 * Learn mode — step through a chant one line at a time. The line loops
 * continuously (via the player's loopRange) so you can repeat it until it sticks,
 * with reveal-on-demand translation and slow-down. Directly answers the top
 * beginner request: "teach me the words."
 */
export default function LearnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const track = id ? Catalog.track(id) : undefined;
  const script = useAppStore((s) => s.script);

  const trackId = usePlayerStore((s) => s.trackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const position = usePlayerStore((s) => s.position);
  const rate = usePlayerStore((s) => s.rate);
  const load = usePlayerStore((s) => s.load);
  const toggle = usePlayerStore((s) => s.toggle);
  const seek = usePlayerStore((s) => s.seek);
  const cycleRate = usePlayerStore((s) => s.cycleRate);
  const setLoopRange = usePlayerStore((s) => s.setLoopRange);

  const lines = track?.lyrics ?? [];
  const dur = track?.duration ?? 0;
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(true);

  useEffect(() => {
    if (track && trackId !== track.id) load(track.id, [track.id]);
  }, [track, trackId, load]);

  useEffect(() => {
    if (!lines.length) return;
    const start = lines[index].t;
    const end = lines[index + 1]?.t ?? dur;
    setLoopRange({ start, end });
    seek(start);
  }, [index, lines.length, dur, setLoopRange, seek]);

  useEffect(() => () => { setLoopRange(null); stopSpeaking(); }, [setLoopRange]);

  if (!track || !lines.length) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: Spacing.md }}>
        <Text variant="title">Nothing to learn here yet</Text>
        <Button label="Go back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const line = lines[index];
  const start = line.t;
  const end = lines[index + 1]?.t ?? dur;
  const lineProgress = Math.max(0, Math.min(1, (position - start) / Math.max(0.001, end - start)));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Icon name="chevron-down" size={28} color="textSecondary" />
        </Pressable>
        <Text variant="overline" color="textMuted">LEARN · {track.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }}>
          <Pressable onPress={() => speakLine(line, { rate })} hitSlop={12}>
            <Icon name="volume-high" size={22} color="primary" />
          </Pressable>
          <Pressable onPress={() => setReveal((v) => !v)} hitSlop={12}>
            <Icon name={reveal ? 'eye' : 'eye-off'} size={22} color={reveal ? 'primary' : 'textSecondary'} />
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.md }}>
        <Text variant="overline" color="primary">{line.section ?? `Line ${index + 1}`}</Text>
        {script !== 'roman' && line.devanagari && (
          <Text variant="sanskrit" center style={{ fontSize: 30, lineHeight: 50 }}>{line.devanagari}</Text>
        )}
        {(script !== 'deva' || !line.devanagari) && (line.words?.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {line.words.map((w, wi) => {
              const wActive = wi === activeWordIndex(line, position - line.t);
              return (
                <Text
                  key={wi}
                  variant="transliteration"
                  style={{ fontSize: 22, lineHeight: 34, color: wActive ? colors.primary : colors.textSecondary, fontWeight: wActive ? '700' : '400' }}
                >
                  {w.text}{wi < line.words!.length - 1 ? ' ' : ''}
                </Text>
              );
            })}
          </View>
        ) : (
          <Text variant="transliteration" center color="primary" style={{ fontSize: 21, lineHeight: 32 }}>
            {line.transliteration}
          </Text>
        ))}
        {reveal && (
          <Text variant="bodyLg" center color="textSecondary" style={{ marginTop: Spacing.sm }}>{line.translation}</Text>
        )}
      </View>

      <View style={{ paddingHorizontal: Spacing.xl, paddingBottom: insets.bottom + Spacing.lg, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: colors.border, gap: Spacing.lg }}>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.border }}>
          <View style={{ width: `${lineProgress * 100}%`, height: 4, borderRadius: 2, backgroundColor: colors.primary }} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xxl }}>
          <Pressable onPress={() => setIndex((i) => Math.max(0, i - 1))} hitSlop={10} disabled={index === 0}>
            <Icon name="chevron-back" size={30} color={index === 0 ? 'textMuted' : 'text'} />
          </Pressable>
          <Pressable
            onPress={toggle}
            style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="onPrimary" />
          </Pressable>
          <Pressable onPress={() => setIndex((i) => Math.min(lines.length - 1, i + 1))} hitSlop={10} disabled={index === lines.length - 1}>
            <Icon name="chevron-forward" size={30} color={index === lines.length - 1 ? 'textMuted' : 'text'} />
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill label={`${rate}× speed`} onPress={cycleRate} />
          <Text variant="label" color="textMuted">{index + 1} / {lines.length}</Text>
          <Pill label="🔁 Looping" active />
        </View>
      </View>
    </View>
  );
}
