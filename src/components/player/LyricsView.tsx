import { useEffect, useRef } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import type { LyricLine } from '@/lib/content/types';
import { Text } from '@/components/ui';

/**
 * Synced lyrics. Highlights the active line and auto-scrolls to keep it
 * centered — the karaoke-style "learn the words" experience. Devanagari and
 * English translation are independently toggleable; tap a line to seek to it.
 */
export function LyricsView({
  lyrics,
  activeIndex,
  showDevanagari = true,
  showTranslation = true,
  onPressLine,
}: {
  lyrics: LyricLine[];
  activeIndex: number;
  showDevanagari?: boolean;
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
            <Text
              variant="transliteration"
              style={{ color: active ? colors.primary : colors.textSecondary, marginTop: line.devanagari ? Spacing.xs : 0 }}
            >
              {line.transliteration}
            </Text>
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
