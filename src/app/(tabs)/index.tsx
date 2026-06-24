import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { Button, Card, Icon, type IconName, Screen, SectionHeader, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { liveChallenges } from '@/lib/panchang/challenges';
import { DiyaFlame } from '@/components/brand/DiyaFlame';
import { StreakRing } from '@/components/brand/StreakRing';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { TrackRow } from '@/components/content/TrackRow';
import { JourneyCard } from '@/components/content/JourneyCard';
import { StoryCard } from '@/components/content/StoryCard';
import { Catalog } from '@/lib/content/catalog';
import { getDailyPlan } from '@/lib/content/daily';
import { usePlayerStore } from '@/lib/audio/playerStore';
import { useIsPremium } from '@/lib/subscription/subscriptionStore';
import { useAppStore, isPracticedToday, todaySankalpa } from '@/lib/state/store';
import { nextFestival } from '@/lib/panchang/festivals';
import { formatVerseShare, shareText } from '@/lib/share';
import type { Track } from '@/lib/content/types';

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const QUICK: { icon: IconName; label: string; href: string }[] = [
  { icon: 'flower', label: 'Darshan', href: '/darshan' },
  { icon: 'moon', label: 'Sleep', href: '/sleep' },
  { icon: 'repeat', label: 'Japa', href: '/japa' },
  { icon: 'map', label: 'Journeys', href: '/journeys' },
  { icon: 'book', label: 'Stories', href: '/stories' },
  { icon: 'heart', label: 'Saved', href: '/saved' },
];

export default function TodayScreen() {
  const colors = useColors();
  const premium = useIsPremium();
  const streak = useAppStore((s) => s.streak);
  const practiced = useAppStore(isPracticedToday);
  const sankalpa = useAppStore(todaySankalpa);
  const name = useAppStore((s) => s.name);
  const load = usePlayerStore((s) => s.load);

  const plan = useMemo(() => getDailyPlan(), []);
  const location = useAppStore((s) => s.location);
  const festival = useMemo(() => nextFestival(location), [location]);
  const liveCh = useMemo(() => liveChallenges(new Date(), location)[0], [location]);

  const deity = Catalog.deity(plan.deityOfDay);
  const planTracks = plan.items
    .map((i) => Catalog.track(i.trackId))
    .filter((t): t is Track => !!t);
  const queue = planTracks.map((t) => t.id);
  const journeys = Catalog.journeys();
  const stories = Catalog.stories();

  const verse = useMemo(() => {
    const s = Catalog.scripture(plan.verse.scriptureId);
    const ch = s?.chapters.find((c) => c.number === plan.verse.chapter);
    return ch?.verses.find((v) => v.ref === plan.verse.ref);
  }, [plan]);

  const now = new Date();

  const openTrack = (track: Track) => {
    if (!track.isFree && !premium) {
      router.push('/paywall');
      return;
    }
    load(track.id, queue);
    router.push(`/player/${track.id}`);
  };

  const startDaily = () => {
    const first = planTracks[0];
    if (first) openTrack(first);
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.md }}>
        <View style={{ flex: 1 }}>
          <Text variant="overline" color="primary">
            {WEEKDAY[now.getDay()]} · {MONTH[now.getMonth()]} {now.getDate()}
          </Text>
          <Text variant="h1" style={{ marginTop: Spacing.xs }}>{name ? `Namaste, ${name}` : plan.greeting}</Text>
          {name ? <Text variant="body" color="textSecondary" style={{ marginTop: 2 }}>{plan.greeting}</Text> : null}
        </View>
        <Pressable
          onPress={() => router.push('/library?focus=1')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Search prayers"
          style={{
            width: 44,
            height: 44,
            borderRadius: Radius.pill,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surfaceElevated,
            borderWidth: 1,
            borderColor: colors.border,
            marginTop: Spacing.xs,
          }}
        >
          <Icon name="search" size={20} color="textSecondary" />
        </Pressable>
      </View>

      {/* Hero */}
      <Card elevated style={{ marginTop: Spacing.lg, alignItems: 'center', paddingVertical: Spacing.xl }}>
        <DiyaFlame size={150} lit={practiced} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xl, marginTop: Spacing.sm }}>
          <StreakRing count={streak.count} />
          <View style={{ flex: 1 }}>
            <Text variant="subtitle">{practiced ? 'Your diya is lit today' : 'Light your diya'}</Text>
            <Text variant="body" color="textSecondary" style={{ marginVertical: Spacing.xs }}>
              {practiced
                ? 'Beautiful. Return any time to sit longer.'
                : 'Complete one practice to keep your streak alive.'}
            </Text>
            <Button label={practiced ? 'Practice again' : 'Begin'} icon="play" onPress={startDaily} />
          </View>
        </View>
      </Card>

      {/* Live festival challenge */}
      {liveCh && (
        <Pressable onPress={() => router.push(`/challenge/${liveCh.challenge.id}`)} style={{ marginTop: Spacing.lg }}>
          <LinearGradient
            colors={liveCh.challenge.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Icon name="flame" size={14} color="#FFFFFF" />
              <Text variant="overline" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {liveCh.status === 'active'
                  ? `Live · day ${liveCh.dayIndex + 1} of ${liveCh.challenge.days.length}`
                  : `Starts in ${liveCh.daysUntilStart} ${liveCh.daysUntilStart === 1 ? 'day' : 'days'}`}
              </Text>
            </View>
            <Text variant="title" style={{ color: '#FFFFFF', marginTop: 4 }}>{liveCh.challenge.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm }}>
              <Text variant="caption" style={{ color: 'rgba(255,255,255,0.95)' }}>{liveCh.challenge.subtitle}</Text>
              <Text variant="label" style={{ color: '#FFFFFF' }}>{liveCh.status === 'active' ? 'Continue →' : 'Join →'}</Text>
            </View>
          </LinearGradient>
        </Pressable>
      )}

      {/* Quick tools */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm, marginTop: Spacing.lg }}>
        {QUICK.map((a) => (
          <Card key={a.label} onPress={() => router.push(a.href)} style={{ width: 88, alignItems: 'center', paddingVertical: Spacing.md }}>
            <Icon name={a.icon} size={22} color="primary" />
            <Text variant="caption" style={{ marginTop: 4 }}>{a.label}</Text>
          </Card>
        ))}
      </ScrollView>

      {/* Deity of the day */}
      {deity && (
        <Card onPress={() => router.push(`/deity/${deity.id}`)} style={{ marginTop: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <DeityAvatar deity={deity} size={56} />
          <View style={{ flex: 1 }}>
            <Text variant="overline" color="textMuted">Deity of the day</Text>
            <Text variant="title">{deity.name}</Text>
            <Text variant="caption" color="textSecondary">{deity.epithet}</Text>
          </View>
          <Icon name="chevron-forward" color="textMuted" />
        </Card>
      )}

      {/* Sankalpa */}
      <Card onPress={() => router.push('/sankalpa')} style={{ marginTop: Spacing.lg, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
        <Icon name="sparkles" size={22} color="gold" />
        <View style={{ flex: 1 }}>
          <Text variant="overline" color="textMuted">Today’s intention</Text>
          <Text variant="body" numberOfLines={1}>{sankalpa || 'Set a sankalpa for today'}</Text>
        </View>
        <Icon name="chevron-forward" color="textMuted" />
      </Card>

      {/* Today's practice */}
      <SectionHeader title="Today’s practice" />
      <Card>
        {planTracks.map((t) => (
          <TrackRow key={t.id} track={t} onPress={() => openTrack(t)} />
        ))}
      </Card>

      {/* Journeys */}
      <SectionHeader title="Continue your journey" actionLabel="All" onAction={() => router.push('/journeys')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.md, paddingRight: Spacing.xl }}>
        {journeys.map((j) => (
          <JourneyCard key={j.id} journey={j} />
        ))}
      </ScrollView>

      {/* Stories for the family */}
      <SectionHeader title="For the family" actionLabel="All stories" onAction={() => router.push('/stories')} />
      {stories.slice(0, 3).map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}

      {/* Verse of the day */}
      {verse && (
        <>
          <SectionHeader title="Verse of the day" actionLabel="Read Gita" onAction={() => router.push('/scripture')} />
          <Card onPress={() => router.push(`/scripture/${plan.verse.scriptureId}`)}>
            {verse.devanagari && (
              <Text variant="sanskrit" style={{ marginBottom: Spacing.sm }}>{verse.devanagari.split('\n')[0]}</Text>
            )}
            <Text variant="transliteration" color="primary">{verse.transliteration.split('\n')[0]}</Text>
            <Text variant="bodyLg" style={{ marginTop: Spacing.sm }}>{verse.translation}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm }}>
              <Text variant="caption" color="textMuted">Bhagavad Gita {verse.ref}</Text>
              <Pressable
                onPress={() => shareText(formatVerseShare('Bhagavad Gita', verse.ref, verse.transliteration, verse.translation))}
                hitSlop={8}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <Icon name="share-outline" size={16} color="primary" />
                <Text variant="label" color="primary">Share</Text>
              </Pressable>
            </View>
          </Card>
        </>
      )}

      {/* Upcoming festival */}
      {festival && (
        <>
          <SectionHeader title="Coming up" actionLabel="Calendar" onAction={() => router.push('/panchang')} />
          <Card onPress={() => router.push(`/festival/${festival.festival.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View style={{ alignItems: 'center', minWidth: 52 }}>
              <Text variant="h2" color="primary">{festival.daysAway}</Text>
              <Text variant="caption" color="textMuted">{festival.daysAway === 1 ? 'day' : 'days'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="title">{festival.festival.name}</Text>
              <Text variant="caption" color="textSecondary" numberOfLines={2}>{festival.festival.description}</Text>
            </View>
            <Icon name="chevron-forward" color="textMuted" />
          </Card>
        </>
      )}
    </Screen>
  );
}
