import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Card, Divider, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { TrackRow } from '@/components/content/TrackRow';
import { Catalog } from '@/lib/content/catalog';
import { useOpenTrack } from '@/lib/audio/useOpenTrack';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DeityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const deity = id ? Catalog.deity(id) : undefined;
  const open = useOpenTrack();

  if (!deity) {
    return (
      <Screen>
        <Text variant="title">Deity not found</Text>
      </Screen>
    );
  }

  const tracks = Catalog.tracksByDeity(deity.id);
  const queue = tracks.map((t) => t.id);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>

      <View style={{ alignItems: 'center', gap: Spacing.xs }}>
        <DeityAvatar deity={deity} size={96} />
        <Text variant="h1" style={{ marginTop: Spacing.sm }}>{deity.name}</Text>
        <Text variant="sanskrit" color="textSecondary">{deity.devanagari}</Text>
        <Text variant="label" color="primary">{deity.epithet}</Text>
      </View>

      <Card style={{ marginTop: Spacing.xl }}>
        <Text variant="bodyLg">{deity.description}</Text>
        <Divider spacing={Spacing.lg} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text variant="overline" color="textMuted">Auspicious days</Text>
            <Text variant="subtitle">{deity.auspiciousDays.map((d) => DAYS[d]).join(', ')}</Text>
          </View>
          {deity.mantraSeed && (
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="overline" color="textMuted">Beeja</Text>
              <Text variant="sanskrit">{deity.mantraSeed}</Text>
            </View>
          )}
        </View>
      </Card>

      <SectionHeader title="Practices" />
      <Card>
        {tracks.length === 0 ? (
          <Text variant="body" color="textMuted" style={{ paddingVertical: Spacing.md }}>
            Recitations for {deity.name} are coming soon.
          </Text>
        ) : (
          tracks.map((t) => <TrackRow key={t.id} track={t} onPress={() => open(t, queue)} />)
        )}
      </Card>
    </Screen>
  );
}
