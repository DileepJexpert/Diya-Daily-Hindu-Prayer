import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { Button, Card, Icon, Screen, Text } from '@/components/ui';
import { TrackRow } from '@/components/content/TrackRow';
import { useColors } from '@/hooks/use-theme';
import { Catalog } from '@/lib/content/catalog';
import { useAppStore } from '@/lib/state/store';
import { useOpenTrack } from '@/lib/audio/useOpenTrack';
import { resolveChallenge } from '@/lib/panchang/challenges';

const NO_DAYS: number[] = [];

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const challenge = id ? Catalog.challenge(id) : undefined;
  const location = useAppStore((s) => s.location);
  const doneRaw = useAppStore((s) => (id ? s.journeyProgress[id] : undefined));
  const done = doneRaw ?? NO_DAYS;
  const completeDay = useAppStore((s) => s.completeJourneyDay);
  const open = useOpenTrack();

  const win = useMemo(
    () => (challenge ? resolveChallenge(challenge, new Date(), location) : null),
    [challenge, location],
  );

  if (!challenge) {
    return (
      <Screen>
        <Text variant="title">Challenge not found</Text>
      </Screen>
    );
  }

  const len = challenge.days.length;
  const status = win?.status ?? 'active';
  const dayIndex = win?.dayIndex ?? -1;
  // Past missed days can be backfilled; future days stay locked until they arrive.
  const openUpTo = status === 'active' ? dayIndex : status === 'past' || !win ? len - 1 : -1;

  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: location.timeZone }).format(d);
  const dayDate = (i: number) => (win ? new Date(win.startDate.getTime() + i * 86400000) : null);

  const countdown =
    status === 'upcoming'
      ? `Begins in ${win!.daysUntilStart} ${win!.daysUntilStart === 1 ? 'day' : 'days'} · ${fmtDate(win!.startDate)}`
      : status === 'active'
        ? `Day ${dayIndex + 1} of ${len} · live now`
        : win
          ? `Ended ${fmtDate(win.endDate)}`
          : `${len} days`;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>

      <LinearGradient
        colors={challenge.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: Radius.lg, padding: Spacing.xl, marginBottom: Spacing.lg, ...Shadow.card }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <Icon name="flame" size={16} color="onPrimary" />
          <Text variant="overline" style={{ color: 'rgba(255,255,255,0.9)' }}>{countdown}</Text>
        </View>
        <Text variant="h1" style={{ color: '#FFFFFF', marginTop: 4 }}>{challenge.title}</Text>
        <Text variant="caption" style={{ color: 'rgba(255,255,255,0.95)', marginTop: Spacing.sm }}>
          {done.length}/{len} days complete
        </Text>
      </LinearGradient>

      <Text variant="body" color="textSecondary">{challenge.description}</Text>
      {win?.estimated && (
        <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.sm }}>
          Dates are estimated from the panchang — confirm the festival locally.
        </Text>
      )}

      {challenge.days.map((day, i) => {
        const isDone = done.includes(i);
        const isToday = status === 'active' && i === dayIndex;
        const locked = i > openUpTo;
        const tracks = Catalog.tracksById(day.trackIds);
        const date = dayDate(i);
        return (
          <Card
            key={i}
            style={{
              marginTop: Spacing.lg,
              borderColor: isToday ? colors.primary : colors.border,
              borderWidth: isToday ? 2 : 1,
              opacity: locked ? 0.6 : 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.sm }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                  <Text variant="overline" color="primary">Day {i + 1}</Text>
                  {isToday && (
                    <View style={{ paddingVertical: 2, paddingHorizontal: Spacing.sm, borderRadius: Radius.pill, backgroundColor: colors.primary }}>
                      <Text variant="caption" style={{ color: colors.onPrimary, fontWeight: '700' }}>TODAY</Text>
                    </View>
                  )}
                  {date && <Text variant="caption" color="textMuted">{fmtDate(date)}</Text>}
                </View>
                <Text variant="title" style={{ marginTop: 2 }}>{day.title}</Text>
              </View>
              <Icon
                name={isDone ? 'checkmark-circle' : locked ? 'lock-closed' : 'ellipse-outline'}
                size={24}
                color={isDone ? 'success' : locked ? 'textMuted' : 'textMuted'}
              />
            </View>

            <Text variant="transliteration" color="textSecondary" style={{ marginTop: Spacing.sm }}>
              “{day.intention}”
            </Text>

            {!locked && (
              <>
                <View style={{ marginTop: Spacing.sm }}>
                  {tracks.map((t) => (
                    <TrackRow key={t.id} track={t} onPress={() => open(t, day.trackIds)} />
                  ))}
                </View>
                <Button
                  label={isDone ? 'Completed' : 'Mark day complete'}
                  icon={isDone ? 'checkmark' : 'checkmark-circle-outline'}
                  variant={isDone ? 'secondary' : 'primary'}
                  full
                  style={{ marginTop: Spacing.md }}
                  onPress={() => completeDay(challenge.id, i)}
                />
              </>
            )}
            {locked && date && (
              <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.sm }}>
                Unlocks {fmtDate(date)}
              </Text>
            )}
          </Card>
        );
      })}
    </Screen>
  );
}
