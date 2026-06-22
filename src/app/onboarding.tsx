import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { Button, Icon, Text } from '@/components/ui';
import { DiyaFlame } from '@/components/brand/DiyaFlame';
import { useColors } from '@/hooks/use-theme';
import { useAppStore } from '@/lib/state/store';
import type { IconName } from '@/components/ui';

const SLIDES: { title: string; body: string; icon: IconName }[] = [
  {
    title: 'A daily light, wherever you are',
    body: 'Diya brings your practice home — guided sadhana, aarti and mantra, designed for life far from the temple.',
    icon: 'flame',
  },
  {
    title: 'Learn every word',
    body: 'Studio-quality recitations with synced lyrics — Devanagari, phonetic transliteration and meaning. Slow it down and follow along.',
    icon: 'musical-notes',
  },
  {
    title: 'Never miss a tithi',
    body: 'An accurate panchang and festival calendar, computed for your own timezone — so you always know when to celebrate.',
    icon: 'calendar',
  },
];

export default function Onboarding() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const [step, setStep] = useState(0);

  const finish = () => {
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.xl, paddingHorizontal: Spacing.xl }}>
      <View style={{ alignItems: 'flex-end', height: 40, justifyContent: 'center' }}>
        {!last && (
          <Text variant="label" color="textMuted" onPress={finish}>
            Skip
          </Text>
        )}
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl }}>
        {step === 0 ? (
          <DiyaFlame size={200} />
        ) : (
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={slide.icon} size={52} color="primary" />
          </View>
        )}
        <View style={{ gap: Spacing.md, alignItems: 'center' }}>
          <Text variant="h1" center>{slide.title}</Text>
          <Text variant="bodyLg" color="textSecondary" center>{slide.body}</Text>
        </View>
      </View>

      {/* Dots */}
      <View style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center', marginBottom: Spacing.xl }}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === step ? 22 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === step ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>

      <Button
        label={last ? 'Begin your practice' : 'Continue'}
        size="lg"
        full
        onPress={() => (last ? finish() : setStep((s) => s + 1))}
      />
    </View>
  );
}
