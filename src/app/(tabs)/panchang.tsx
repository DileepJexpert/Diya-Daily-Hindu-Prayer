import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Card, Divider, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { computePanchang, formatTime } from '@/lib/panchang/engine';
import { upcomingFestivals } from '@/lib/panchang/festivals';
import { LOCATION_PRESETS } from '@/lib/panchang/locations';
import { useAppStore } from '@/lib/state/store';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm }}>
      <Text variant="body" color="textSecondary">{label}</Text>
      <Text variant="subtitle">{value}</Text>
    </View>
  );
}

export default function PanchangScreen() {
  const location = useAppStore((s) => s.location);
  const setLocation = useAppStore((s) => s.setLocation);

  const today = useMemo(() => computePanchang(new Date(), location), [location]);
  const festivals = useMemo(() => upcomingFestivals(new Date(), 8, location), [location]);
  const tz = location.timeZone;

  const cycleLocation = () => {
    const i = LOCATION_PRESETS.findIndex((l) => l.label === location.label);
    setLocation(LOCATION_PRESETS[(i + 1) % LOCATION_PRESETS.length]);
  };

  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: tz }).format(d);

  return (
    <Screen>
      <Text variant="h1">Panchang</Text>

      <Pressable
        onPress={cycleLocation}
        style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm }}
      >
        <Icon name="location" size={16} color="primary" />
        <Text variant="label" color="textSecondary">{location.label}</Text>
        <Icon name="swap-horizontal" size={16} color="textMuted" />
      </Pressable>

      <Card elevated style={{ marginTop: Spacing.lg }}>
        <Text variant="overline" color="primary">{today.tithi.paksha} Paksha</Text>
        <Text variant="h2">{today.tithi.name}</Text>
        <Divider spacing={Spacing.md} />
        <Row label="Vaara" value={today.vaara} />
        <Row label="Nakshatra" value={today.nakshatra.name} />
        <Row label="Yoga" value={today.yoga.name} />
        <Row label="Karana" value={today.karana.name} />
        <Divider spacing={Spacing.md} />
        <Row label="Sunrise" value={formatTime(today.sunrise, tz)} />
        <Row label="Sunset" value={formatTime(today.sunset, tz)} />
        {today.rahuKaal && (
          <Row label="Rahu Kaal" value={`${formatTime(today.rahuKaal.start, tz)} – ${formatTime(today.rahuKaal.end, tz)}`} />
        )}
        <Divider spacing={Spacing.md} />
        <Row label="Moon" value={today.moonRashi} />
        <Row label="Sun" value={today.sunRashi} />
      </Card>

      <SectionHeader title="Upcoming festivals" actionLabel="See all" onAction={() => router.push('/festivals')} />
      {festivals.map((f) => (
        <Card key={f.festival.id} onPress={() => router.push(`/festival/${f.festival.id}`)} style={{ marginBottom: Spacing.md, flexDirection: 'row', gap: Spacing.md, alignItems: 'center' }}>
          <View style={{ alignItems: 'center', minWidth: 52 }}>
            <Text variant="h2" color="primary">{f.daysAway}</Text>
            <Text variant="caption" color="textMuted">{f.daysAway === 1 ? 'day' : 'days'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="title">
              {f.festival.name}
              {f.estimated ? ' *' : ''}
            </Text>
            <Text variant="caption" color="primary">{fmtDate(f.date)}</Text>
            <Text variant="caption" color="textMuted" numberOfLines={2} style={{ marginTop: 2 }}>
              {f.festival.description}
            </Text>
          </View>
        </Card>
      ))}

      <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.sm }}>
        * Lunisolar dates are computed offline and may shift a day — confirm against your local panchang.
      </Text>
    </Screen>
  );
}
