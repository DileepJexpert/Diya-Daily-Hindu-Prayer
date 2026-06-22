import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { Button, Card, Icon, Screen, Text } from '@/components/ui';
import { TrackRow } from '@/components/content/TrackRow';
import { Catalog } from '@/lib/content/catalog';
import { useAppStore } from '@/lib/state/store';
import { useOpenTrack } from '@/lib/audio/useOpenTrack';

const NO_DAYS: number[] = [];

export default function JourneyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const journey = id ? Catalog.journey(id) : undefined;
  const doneRaw = useAppStore((s) => (id ? s.journeyProgress[id] : undefined));
  const done = doneRaw ?? NO_DAYS;
  const completeDay = useAppStore((s) => s.completeJourneyDay);
  const open = useOpenTrack();

  if (!journey) {
    return (
      <Screen>
        <Text variant="title">Journey not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>

      <LinearGradient
        colors={journey.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: Radius.lg, padding: Spacing.xl, marginBottom: Spacing.lg, ...Shadow.card }}
      >
        <Text variant="overline" style={{ color: 'rgba(255,255,255,0.85)' }}>{journey.subtitle}</Text>
        <Text variant="h1" style={{ color: '#FFFFFF', marginTop: 4 }}>{journey.title}</Text>
        <Text variant="caption" style={{ color: 'rgba(255,255,255,0.95)', marginTop: Spacing.sm }}>
          {done.length}/{journey.days.length} days complete
        </Text>
      </LinearGradient>

      <Text variant="body" color="textSecondary">{journey.description}</Text>

      {journey.days.map((day, i) => {
        const isDone = done.includes(i);
        const tracks = Catalog.tracksById(day.trackIds);
        const verse = day.verse;
        return (
          <Card key={i} style={{ marginTop: Spacing.lg }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text variant="overline" color="primary">Day {i + 1}</Text>
                <Text variant="title">{day.title}</Text>
              </View>
              <Icon name={isDone ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={isDone ? 'success' : 'textMuted'} />
            </View>

            <Text variant="transliteration" color="textSecondary" style={{ marginTop: Spacing.sm }}>
              “{day.intention}”
            </Text>

            <View style={{ marginTop: Spacing.sm }}>
              {tracks.map((t) => (
                <TrackRow key={t.id} track={t} onPress={() => open(t, day.trackIds)} />
              ))}
            </View>

            {verse && (
              <Pressable
                onPress={() => router.push(`/scripture/${verse.scriptureId}`)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm }}
              >
                <Icon name="book" size={16} color="primary" />
                <Text variant="label" color="primary">Read Gita {verse.ref}</Text>
              </Pressable>
            )}

            <Button
              label={isDone ? 'Completed' : 'Mark day complete'}
              icon={isDone ? 'checkmark' : 'checkmark-circle-outline'}
              variant={isDone ? 'secondary' : 'primary'}
              full
              style={{ marginTop: Spacing.md }}
              onPress={() => completeDay(journey.id, i)}
            />
          </Card>
        );
      })}
    </Screen>
  );
}
