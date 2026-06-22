import { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { Card, Icon, Pill, Screen, Text } from '@/components/ui';
import { TrackRow } from '@/components/content/TrackRow';
import { Catalog, TRACK_KINDS } from '@/lib/content/catalog';
import { useOpenTrack } from '@/lib/audio/useOpenTrack';
import { useColors } from '@/hooks/use-theme';
import type { TrackKind } from '@/lib/content/types';

export default function LibraryScreen() {
  const colors = useColors();
  const open = useOpenTrack();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<TrackKind | null>(null);

  const tracks = useMemo(() => {
    let list = query.trim() ? Catalog.search(query) : Catalog.tracks();
    if (kind) list = list.filter((t) => t.kind === kind);
    return list;
  }, [query, kind]);
  const queue = tracks.map((t) => t.id);

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
          value={query}
          onChangeText={setQuery}
          placeholder="Search aarti, mantra, deity…"
          placeholderTextColor={colors.textMuted}
          style={{ flex: 1, paddingVertical: Spacing.md, color: colors.text, fontSize: 15 }}
        />
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
            Nothing matches “{query}”.
          </Text>
        )}
      </Card>
    </Screen>
  );
}
