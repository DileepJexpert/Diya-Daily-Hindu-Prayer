import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Radius, Spacing } from '@/constants/theme';
import { Card, Icon, Pill, Screen, SectionHeader, Text } from '@/components/ui';
import { TrackRow } from '@/components/content/TrackRow';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { StoryCard } from '@/components/content/StoryCard';
import { Catalog, TRACK_KINDS } from '@/lib/content/catalog';
import { useOpenTrack } from '@/lib/audio/useOpenTrack';
import { useColors } from '@/hooks/use-theme';
import type { TrackKind } from '@/lib/content/types';

export default function LibraryScreen() {
  const colors = useColors();
  const open = useOpenTrack();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<TrackKind | null>(null);
  const q = query.trim().toLowerCase();

  // Auto-focus the search box when opened from the Home search button (?focus=1).
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (focus !== '1') return;
    const id = setTimeout(() => {
      inputRef.current?.focus();
      router.setParams({ focus: '' });
    }, 350);
    return () => clearTimeout(id);
  }, [focus]);

  const tracks = useMemo(() => {
    let list = q ? Catalog.search(q) : Catalog.tracks();
    if (kind) list = list.filter((t) => t.kind === kind);
    return list;
  }, [q, kind]);
  const queue = tracks.map((t) => t.id);

  const deityHits = useMemo(
    () => (q ? Catalog.deities().filter((d) => `${d.name} ${d.epithet} ${d.devanagari} ${d.tradition}`.toLowerCase().includes(q)) : []),
    [q],
  );
  const storyHits = useMemo(
    () => (q ? Catalog.stories().filter((s) => `${s.title} ${s.summary}`.toLowerCase().includes(q)) : []),
    [q],
  );

  return (
    <Screen>
      <Text variant="h1">Library</Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
          backgroundColor: colors.surfaceElevated,
          borderRadius: Radius.pill,
          paddingHorizontal: Spacing.lg,
          marginTop: Spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Icon name="search" size={18} color="textMuted" />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search practices, deities, stories…"
          placeholderTextColor={colors.textMuted}
          style={{ flex: 1, paddingVertical: Spacing.md, color: colors.text, fontSize: 15 }}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Icon name="close-circle" size={18} color="textMuted" />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: Spacing.sm, paddingVertical: Spacing.lg }}
      >
        <Pill label="All" active={kind === null} onPress={() => setKind(null)} />
        {TRACK_KINDS.map((k) => (
          <Pill key={k.kind} label={k.label} active={kind === k.kind} onPress={() => setKind(k.kind)} />
        ))}
      </ScrollView>

      <Card>
        {tracks.map((t) => (
          <TrackRow key={t.id} track={t} onPress={() => open(t, queue)} />
        ))}
        {tracks.length === 0 && (
          <Text variant="body" color="textMuted" style={{ paddingVertical: Spacing.lg }}>
            No practices match “{query}”.
          </Text>
        )}
      </Card>

      {deityHits.length > 0 && (
        <>
          <SectionHeader title="Deities" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.lg }}>
            {deityHits.map((d) => (
              <Pressable key={d.id} onPress={() => router.push(`/deity/${d.id}`)} style={{ alignItems: 'center', width: 76 }}>
                <DeityAvatar deity={d} size={56} />
                <Text variant="caption" center numberOfLines={1} style={{ marginTop: 4 }}>{d.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      {storyHits.length > 0 && (
        <>
          <SectionHeader title="Stories" />
          {storyHits.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </>
      )}
    </Screen>
  );
}
