import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { JourneyCard } from '@/components/content/JourneyCard';
import { Catalog } from '@/lib/content/catalog';
import { useAppStore } from '@/lib/state/store';
import { allChallengeWindows, type ChallengeWindow } from '@/lib/panchang/challenges';

const label = (w: ChallengeWindow) =>
  w.status === 'active'
    ? `Live · day ${w.dayIndex + 1} of ${w.challenge.days.length}`
    : w.status === 'upcoming'
      ? `Starts in ${w.daysUntilStart} ${w.daysUntilStart === 1 ? 'day' : 'days'}`
      : `${w.challenge.days.length} days`;

export default function JourneysScreen() {
  const journeys = Catalog.journeys();
  const location = useAppStore((s) => s.location);
  const challenges = useMemo(() => allChallengeWindows(new Date(), location), [location]);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Journeys</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
        Guided programs to build a steady daily practice, one day at a time.
      </Text>

      {challenges.length > 0 && (
        <>
          <SectionHeader title="Festival challenges" />
          <View style={{ gap: Spacing.md }}>
            {challenges.map((w) => (
              <Pressable key={w.challenge.id} onPress={() => router.push(`/challenge/${w.challenge.id}`)}>
                <LinearGradient
                  colors={w.challenge.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                    <Icon name="flame" size={14} color="#FFFFFF" />
                    <Text variant="overline" style={{ color: 'rgba(255,255,255,0.9)' }}>{label(w)}</Text>
                  </View>
                  <Text variant="title" style={{ color: '#FFFFFF', marginTop: 4 }}>{w.challenge.title}</Text>
                  <Text variant="caption" style={{ color: 'rgba(255,255,255,0.95)', marginTop: Spacing.xs }}>
                    {w.challenge.subtitle}
                  </Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <SectionHeader title="All journeys" />
      <View>
        {journeys.map((j) => (
          <JourneyCard key={j.id} journey={j} wide />
        ))}
      </View>
    </Screen>
  );
}
