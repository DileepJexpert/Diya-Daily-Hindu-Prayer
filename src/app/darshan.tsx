import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Spacing } from '@/constants/theme';
import { Button, Icon, Pill, Text } from '@/components/ui';
import { AartiCircle } from '@/components/brand/AartiCircle';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { useColors } from '@/hooks/use-theme';
import { Catalog } from '@/lib/content/catalog';
import { getDailyPlan } from '@/lib/content/daily';
import { useAppStore } from '@/lib/state/store';
import { useOpenTrack } from '@/lib/audio/useOpenTrack';
import { AMBIENCE } from '@/lib/audio/ambience';
import { setAmbience as playAmbience, stopAmbience } from '@/lib/audio/ambienceEngine';

export default function DarshanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const ishta = useAppStore((s) => s.ishtaDevata);
  const recordPractice = useAppStore((s) => s.recordPractice);
  const open = useOpenTrack();

  const deity = useMemo(
    () => (ishta ? Catalog.deity(ishta) : Catalog.deity(getDailyPlan().deityOfDay)),
    [ishta],
  );

  const [rounds, setRounds] = useState(0);
  const [done, setDone] = useState(false);
  const [flowers, setFlowers] = useState(0);
  const [ambience, setAmbience] = useState('none');

  useEffect(() => () => stopAmbience(), []);

  if (!deity) return null;
  const aarti = Catalog.tracksByDeity(deity.id).find((t) => t.kind === 'aarti' || t.kind === 'chalisa');

  const buzz = (style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(style).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Icon name="chevron-down" size={28} color="textSecondary" />
        </Pressable>
        <Text variant="overline" color="textMuted">DARSHAN</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={{ alignItems: 'center', marginTop: Spacing.sm }}>
        <Text variant="overline" color="primary">{done ? 'Darshan complete' : 'Offer your aarti'}</Text>
        <Text variant="h1">{deity.name}</Text>
        <Text variant="sanskrit" color="textSecondary">{deity.devanagari}</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <AartiCircle
          rounds={3}
          onRound={(r) => setRounds(r)}
          onComplete={() => {
            setDone(true);
            recordPractice();
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <DeityAvatar deity={deity} size={150} />
            {flowers > 0 && <Text style={{ fontSize: 22, marginTop: 6 }}>{'🌼'.repeat(Math.min(flowers, 6))}</Text>}
          </View>
        </AartiCircle>

        <Text variant="body" color="textSecondary" center style={{ marginTop: Spacing.lg, paddingHorizontal: Spacing.xl }}>
          {done
            ? `May ${deity.name}’s grace be with you and your home.`
            : `Drag the diya around ${deity.name} — ${Math.max(0, 3 - rounds)} more ${rounds === 2 ? 'circle' : 'circles'}`}
        </Text>
      </View>

      <View style={{ paddingHorizontal: Spacing.xl, paddingBottom: insets.bottom + Spacing.lg, gap: Spacing.md }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
          {AMBIENCE.map((a) => (
            <Pill
              key={a.id}
              label={a.label}
              icon={a.icon}
              active={ambience === a.id}
              onPress={() => { setAmbience(a.id); playAmbience(a.id); }}
            />
          ))}
        </ScrollView>
        {ambience !== 'none' && !AMBIENCE.find((a) => a.id === ambience)?.uri && (
          <Text variant="caption" color="textMuted">Ambient sound — audio coming soon.</Text>
        )}

        <View style={{ flexDirection: 'row', gap: Spacing.md, justifyContent: 'center' }}>
          <Button label="Ring bell" icon="notifications" variant="secondary" onPress={() => buzz(Haptics.ImpactFeedbackStyle.Heavy)} />
          <Button
            label="Offer flower"
            icon="flower"
            variant="secondary"
            onPress={() => { setFlowers((f) => f + 1); buzz(Haptics.ImpactFeedbackStyle.Light); }}
          />
        </View>

        {done && aarti && (
          <Button label={`Sing ${aarti.title}`} icon="musical-notes" full onPress={() => open(aarti)} />
        )}
      </View>
    </View>
  );
}
