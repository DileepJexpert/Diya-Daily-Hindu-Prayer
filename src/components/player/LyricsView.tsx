import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Spacing, Typography } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import type { LyricLine } from '@/lib/content/types';
import { Text } from '@/components/ui';

/** Index of the active word within a line, given seconds elapsed in that line. */
export function activeWordIndex(line: LyricLine, secondsInLine: number): number {
  if (!line.words?.length) return -1;
  let idx = -1;
  for (let i = 0; i < line.words.length; i++) {
    if (secondsInLine >= line.words[i].t) idx = i;
    else break;
  }
  return idx;
}

/**
 * Synced lyrics. Highlights the active line and auto-scrolls to keep it
 * centered. When a line carries word-level timings, the active line is rendered
 * word-by-word with the current word lit — the karaoke "follow every syllable"
 * experience. Tap a line to seek to it.
 */
export function LyricsView({
  lyrics,
  activeIndex,
  position,
  showDevanagari = true,
  showTransliteration = true,
  showTranslation = true,
  onPressLine,
}: {
  lyrics: LyricLine[];
  activeIndex: number;
  position?: number;
  showDevanagari?: boolean;
  showTransliteration?: boolean;
  showTranslation?: boolean;
  onPressLine?: (index: number) => void;
}) {
  const colors = useColors();
  const scrollRef = useRef<ScrollView>(null);
  const ys = useRef<number[]>([]);

  useEffect(() => {
    if (activeIndex >= 0 && ys.current[activeIndex] != null) {
      scrollRef.current?.scrollTo({ y: Math.max(0, ys.current[activeIndex] - 140), animated: true });
    }
  }, [activeIndex]);

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: Spacing.xxl }}
    >
      {lyrics.map((line, i) => {
        const active = i === activeIndex;
        const past = i < activeIndex;
        const useWords = active && !!line.words?.length && position !== undefined;
        const wIdx = useWords ? activeWordIndex(line, (position as number) - line.t) : -1;
        // Always keep some text visible: show the Roman line if it's enabled OR
        // there's no Devanagari to fall back on.
        const showRoman = showTransliteration || !(showDevanagari && line.devanagari);

        return (
          <Pressable
            key={i}
            onPress={() => onPressLine?.(i)}
            onLayout={(e) => {
              ys.current[i] = e.nativeEvent.layout.y;
            }}
            style={{ marginBottom: Spacing.xl, opacity: active ? 1 : past ? 0.4 : 0.6 }}
          >
            {line.section && active && (
              <Text variant="overline" color="primary" style={{ marginBottom: Spacing.xs }}>
                {line.section}
              </Text>
            )}
            {showDevanagari && line.devanagari && (
              <Text variant="sanskrit" style={{ color: active ? colors.text : colors.textSecondary }}>
                {line.devanagari}
              </Text>
            )}

            {showRoman && (useWords ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: line.devanagari ? Spacing.xs : 0 }}>
                {line.words!.map((w, wi) => (
                  <Text
                    key={wi}
                    style={[
                      Typography.transliteration,
                      { color: wi === wIdx ? colors.primary : wi < wIdx ? colors.text : colors.textSecondary },
                      wi === wIdx && { fontWeight: '700' },
                    ]}
                  >
                    {w.text}{wi < line.words!.length - 1 ? ' ' : ''}
                  </Text>
                ))}
              </View>
            ) : (
              <Text
                variant="transliteration"
                style={{ color: active ? colors.primary : colors.textSecondary, marginTop: line.devanagari ? Spacing.xs : 0 }}
              >
                {line.transliteration}
              </Text>
            ))}

            {showTranslation && (
              <Text variant="translation" color="textMuted" style={{ marginTop: Spacing.xs }}>
                {line.translation}
              </Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
