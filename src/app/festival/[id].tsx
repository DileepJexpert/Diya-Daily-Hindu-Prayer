import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Card, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { TrackRow } from '@/components/content/TrackRow';
import { Catalog } from '@/lib/content/catalog';
import { useAppStore } from '@/lib/state/store';
import { useOpenTrack } from '@/lib/audio/useOpenTrack';
import { upcomingFestivals } from '@/lib/panchang/festivals';

export default function FestivalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const festival = id ? Catalog.festival(id) : undefined;
  const location = useAppStore((s) => s.location);
  const open = useOpenTrack();

  const resolved = useMemo(
    () => (id ? upcomingFestivals(new Date(), 50, location).find((f) => f.festival.id === id) : undefined),
    [id, location],
  );

  if (!festival) {
    return (
      <Screen>
        <Text variant="title">Festival not found</Text>
      </Screen>
    );
  }

  const deity = festival.deityId ? Catalog.deity(festival.deityId) : undefined;
  const tracks = festival.deityId ? Catalog.tracksByDeity(festival.deityId) : [];
  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: location.timeZone }).format(d);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>

      <Text variant="h1">{festival.name}</Text>
      {festival.devanagari && <Text variant="sanskrit" color="textSecondary">{festival.devanagari}</Text>}

      {resolved && (
        <Card elevated style={{ marginTop: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View style={{ alignItems: 'center', minWidth: 52 }}>
            <Text variant="h2" color="primary">{resolved.daysAway}</Text>
            <Text variant="caption" color="textMuted">{resolved.daysAway === 1 ? 'day' : 'days'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="subtitle">{fmtDate(resolved.date)}</Text>
            {resolved.estimated && <Text variant="caption" color="textMuted">estimated · confirm locally</Text>}
          </View>
          {deity && <DeityAvatar deity={deity} size={48} />}
        </Card>
      )}

      <Text variant="bodyLg" style={{ marginTop: Spacing.lg }}>{festival.description}</Text>

      {festival.significance && (
        <Card style={{ marginTop: Spacing.lg }}>
          <Text variant="overline" color="primary">Significance</Text>
          <Text variant="body" style={{ marginTop: Spacing.xs }}>{festival.significance}</Text>
        </Card>
      )}

      {festival.observances && festival.observances.length > 0 && (
        <Card style={{ marginTop: Spacing.lg }}>
          <Text variant="overline" color="primary">How it’s observed</Text>
          <View style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
            {festival.observances.map((o, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Icon name="ellipse" size={6} color="primary" />
                <Text variant="body">{o}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {deity && tracks.length > 0 && (
        <>
          <SectionHeader title={`Practices for ${deity.name}`} />
          <Card>
            {tracks.map((t) => (
              <TrackRow key={t.id} track={t} onPress={() => open(t, tracks.map((x) => x.id))} />
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}
