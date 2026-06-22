import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radius, Spacing } from '@/constants/theme';
import { Button, Icon, type IconName, Pill, Text } from '@/components/ui';
import { DiyaFlame } from '@/components/brand/DiyaFlame';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { useColors } from '@/hooks/use-theme';
import { useAppStore } from '@/lib/state/store';
import { Catalog } from '@/lib/content/catalog';
import { LOCATION_PRESETS } from '@/lib/panchang/locations';
import { scheduleDailyReminder } from '@/lib/notifications/reminders';

const SLIDES: { title: string; body: string; icon: IconName }[] = [
  { title: 'A daily light, wherever you are', body: 'Diya brings your practice home — guided sadhana, aarti and mantra, made for life far from the temple.', icon: 'flame' },
  { title: 'Learn every word', body: 'Studio-quality recitations with synced, word-by-word lyrics — Devanagari, transliteration and meaning. Slow it down and follow along.', icon: 'musical-notes' },
  { title: 'Never miss a tithi', body: 'An accurate panchang and festival calendar, computed for your own timezone.', icon: 'calendar' },
];
const REMINDER_TIMES = [{ hour: 6, minute: 0 }, { hour: 7, minute: 0 }, { hour: 8, minute: 0 }, { hour: 18, minute: 0 }, { hour: 19, minute: 0 }];
const fmtTime = (h: number, m: number) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(2020, 0, 1, h, m));

const TOTAL = 6;

export default function Onboarding() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const setNameStore = useAppStore((s) => s.setName);
  const ishta = useAppStore((s) => s.ishtaDevata);
  const setIshta = useAppStore((s) => s.setIshtaDevata);
  const location = useAppStore((s) => s.location);
  const setLocation = useAppStore((s) => s.setLocation);
  const reminders = useAppStore((s) => s.reminders);
  const setReminders = useAppStore((s) => s.setReminders);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const finish = () => {
    setNameStore(name.trim());
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  const next = () => (step >= TOTAL - 1 ? finish() : setStep((s) => s + 1));

  const toggleReminder = async (enabled: boolean) => {
    setReminders({ enabled });
    if (enabled) {
      const ok = await scheduleDailyReminder(reminders.hour, reminders.minute);
      if (!ok) setReminders({ enabled: false });
    }
  };
  const cycleReminderTime = () => {
    const idx = REMINDER_TIMES.findIndex((t) => t.hour === reminders.hour && t.minute === reminders.minute);
    const t = REMINDER_TIMES[(idx + 1) % REMINDER_TIMES.length];
    setReminders(t);
    if (reminders.enabled) scheduleDailyReminder(t.hour, t.minute);
  };

  const isIntro = step < 3;
  const last = step === TOTAL - 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.xl, paddingHorizontal: Spacing.xl }}>
      <View style={{ height: 40, justifyContent: 'center', alignItems: 'flex-end' }}>
        {!last && <Text variant="label" color="textMuted" onPress={finish}>Skip</Text>}
      </View>

      {isIntro ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl }}>
          {step === 0 ? (
            <DiyaFlame size={190} />
          ) : (
            <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={SLIDES[step].icon} size={52} color="primary" />
            </View>
          )}
          <View style={{ gap: Spacing.md, alignItems: 'center' }}>
            <Text variant="h1" center>{SLIDES[step].title}</Text>
            <Text variant="bodyLg" color="textSecondary" center>{SLIDES[step].body}</Text>
          </View>
        </View>
      ) : step === 3 ? (
        <View style={{ flex: 1, justifyContent: 'center', gap: Spacing.lg }}>
          <Text variant="h1">What may we call you?</Text>
          <Text variant="bodyLg" color="textSecondary">We’ll greet you each morning by name.</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            autoFocus
            style={{ fontSize: 22, color: colors.text, borderBottomWidth: 2, borderBottomColor: colors.primary, paddingVertical: Spacing.sm }}
          />
        </View>
      ) : step === 4 ? (
        <View style={{ flex: 1 }}>
          <Text variant="h1">Choose a deity</Text>
          <Text variant="bodyLg" color="textSecondary" style={{ marginTop: Spacing.xs, marginBottom: Spacing.lg }}>
            Pick an ishta-devata to begin with — you can change this anytime.
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.md }}>
              {Catalog.deities().map((d) => {
                const selected = ishta === d.id;
                return (
                  <Pressable
                    key={d.id}
                    onPress={() => setIshta(selected ? null : d.id)}
                    style={{ width: '30%', alignItems: 'center', paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 2, borderColor: selected ? colors.primary : 'transparent' }}
                  >
                    <DeityAvatar deity={d} size={56} />
                    <Text variant="caption" center numberOfLines={1} style={{ marginTop: 4 }}>{d.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={{ flex: 1, gap: Spacing.lg }}>
          <Text variant="h1">Where do you practice?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
            {LOCATION_PRESETS.map((l) => (
              <Pill key={l.label} label={l.label.split(',')[0]} active={location.label === l.label} onPress={() => setLocation(l)} />
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.md }}>
            <Icon name="notifications" size={22} color="primary" />
            <View style={{ flex: 1 }}>
              <Text variant="subtitle">Daily reminder</Text>
              <Pressable onPress={cycleReminderTime} disabled={!reminders.enabled}>
                <Text variant="caption" color={reminders.enabled ? 'primary' : 'textMuted'}>{fmtTime(reminders.hour, reminders.minute)} · tap to change</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => toggleReminder(!reminders.enabled)}
              style={{ width: 54, height: 32, borderRadius: 16, padding: 3, backgroundColor: reminders.enabled ? colors.primary : colors.border, alignItems: reminders.enabled ? 'flex-end' : 'flex-start' }}
            >
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff' }} />
            </Pressable>
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center', marginVertical: Spacing.xl }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <View key={i} style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 4, backgroundColor: i === step ? colors.primary : colors.border }} />
        ))}
      </View>

      <Button label={last ? 'Begin your practice' : 'Continue'} size="lg" full onPress={next} />
    </View>
  );
}
