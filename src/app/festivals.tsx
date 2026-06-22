import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Radius, Spacing } from '@/constants/theme';
import { Card, Icon, Screen, Text } from '@/components/ui';
import { upcomingFestivals } from '@/lib/panchang/festivals';
import { useAppStore } from '@/lib/state/store';
import { useColors } from '@/hooks/use-theme';

export default function FestivalsScreen() {
  const colors = useColors();
  const location = useAppStore((s) => s.location);
  const list = useMemo(() => upcomingFestivals(new Date(), 50, location), [location]);
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: location.timeZone }).format(d);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Festivals</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
        The year ahead, computed for {location.label.split(',')[0]}.
      </Text>

      {list.map((f) => (
        <Card key={f.festival.id} onPress={() => router.push(`/festival/${f.festival.id}`)} style={{ marginTop: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View style={{ alignItems: 'center', minWidth: 52 }}>
            <Text variant="h2" color="primary">{f.daysAway}</Text>
            <Text variant="caption" color="textMuted">{f.daysAway === 1 ? 'day' : 'days'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="title">{f.festival.name}{f.estimated ? ' *' : ''}</Text>
            <Text variant="caption" color="primary">{fmt(f.date)}</Text>
            <View style={{ alignSelf: 'flex-start', marginTop: 4, backgroundColor: colors.surfaceElevated, borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: 2 }}>
              <Text variant="caption" color="textMuted">{f.festival.kind}</Text>
            </View>
          </View>
          <Icon name="chevron-forward" color="textMuted" />
        </Card>
      ))}

      <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.lg }}>
        * Lunisolar dates are computed offline and may shift a day — confirm against your local panchang.
      </Text>
    </Screen>
  );
}
