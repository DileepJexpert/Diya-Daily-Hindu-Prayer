import { Pressable, Switch, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Radius, Spacing } from '@/constants/theme';
import { Button, Card, Divider, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { useAppStore, type ScriptPref, type ThemeMode } from '@/lib/state/store';
import { MEMBERSHIP_ENABLED, useIsPremium, useSubscriptionStore } from '@/lib/subscription/subscriptionStore';
import { LOCATION_PRESETS } from '@/lib/panchang/locations';
import { cancelReminders, scheduleDailyReminder } from '@/lib/notifications/reminders';
import { PracticeHeatmap } from '@/components/brand/PracticeHeatmap';
import { Catalog } from '@/lib/content/catalog';
import { useDownloadsStore } from '@/lib/audio/downloads';

const THEME_MODES: { id: ThemeMode; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];
const SCRIPTS: { id: ScriptPref; label: string }[] = [
  { id: 'both', label: 'Both' },
  { id: 'roman', label: 'Roman (abc)' },
  { id: 'deva', label: 'देव' },
];
const REMINDER_TIMES = [
  { hour: 6, minute: 0 },
  { hour: 7, minute: 0 },
  { hour: 8, minute: 0 },
  { hour: 18, minute: 0 },
  { hour: 19, minute: 0 },
];
const fmtTime = (h: number, m: number) =>
  new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(2020, 0, 1, h, m));

function SettingRow({ icon, label, value, onPress }: { icon: Parameters<typeof Icon>[0]['name']; label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md }}>
      <Icon name={icon} size={20} color="textSecondary" />
      <Text variant="body" style={{ flex: 1 }}>{label}</Text>
      {value && <Text variant="label" color="textMuted">{value}</Text>}
      {onPress && <Icon name="chevron-forward" size={16} color="textMuted" />}
    </Pressable>
  );
}

export default function MoreScreen() {
  const colors = useColors();
  const premium = useIsPremium();
  const usingRealSDK = useSubscriptionStore((s) => s.usingRealSDK);

  const streak = useAppStore((s) => s.streak);
  const completedCount = useAppStore((s) => s.completedCount);
  const favorites = useAppStore((s) => s.favorites);
  const practiceLog = useAppStore((s) => s.practiceLog);
  const downloadCount = useDownloadsStore((s) => Object.keys(s.downloads).length);
  const removeAllDownloads = useDownloadsStore((s) => s.removeAll);
  const name = useAppStore((s) => s.name);
  const setName = useAppStore((s) => s.setName);
  const ishta = useAppStore((s) => s.ishtaDevata);
  const ishtaName = ishta ? Catalog.deity(ishta)?.name ?? 'Choose' : 'Choose';
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const script = useAppStore((s) => s.script);
  const setScript = useAppStore((s) => s.setScript);
  const location = useAppStore((s) => s.location);
  const setLocation = useAppStore((s) => s.setLocation);
  const reminders = useAppStore((s) => s.reminders);
  const setReminders = useAppStore((s) => s.setReminders);

  const toggleReminder = async (enabled: boolean) => {
    setReminders({ enabled });
    if (enabled) {
      const ok = await scheduleDailyReminder(reminders.hour, reminders.minute);
      if (!ok) setReminders({ enabled: false });
    } else {
      await cancelReminders();
    }
  };

  const cycleReminderTime = () => {
    const idx = REMINDER_TIMES.findIndex((t) => t.hour === reminders.hour && t.minute === reminders.minute);
    const next = REMINDER_TIMES[(idx + 1) % REMINDER_TIMES.length];
    setReminders(next);
    if (reminders.enabled) scheduleDailyReminder(next.hour, next.minute);
  };

  const cycleLocation = () => {
    const idx = LOCATION_PRESETS.findIndex((l) => l.label === location.label);
    setLocation(LOCATION_PRESETS[(idx + 1) % LOCATION_PRESETS.length]);
  };

  return (
    <Screen>
      <Text variant="h1">You</Text>

      {/* Stats */}
      <Card elevated style={{ marginTop: Spacing.lg, flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ alignItems: 'center' }}>
          <Text variant="h2" color="primary">{streak.count}</Text>
          <Text variant="caption" color="textMuted">streak</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text variant="h2" color="primary">{streak.longest}</Text>
          <Text variant="caption" color="textMuted">longest</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text variant="h2" color="primary">{completedCount}</Text>
          <Text variant="caption" color="textMuted">practices</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text variant="h2" color="primary">{favorites.length}</Text>
          <Text variant="caption" color="textMuted">saved</Text>
        </View>
      </Card>

      {/* Practice history */}
      <SectionHeader title="Your practice" />
      <Card>
        <PracticeHeatmap log={practiceLog} />
      </Card>

      {/* Explore */}
      <SectionHeader title="Explore" />
      <Card>
        <SettingRow icon="heart" label="Saved & recent" onPress={() => router.push('/saved')} />
        <SettingRow icon="map" label="Journeys" onPress={() => router.push('/journeys')} />
        <SettingRow icon="book" label="Stories for the family" onPress={() => router.push('/stories')} />
        <SettingRow icon="repeat" label="Japa counter" onPress={() => router.push('/japa')} />
        <SettingRow icon="flower" label="Daily darshan" onPress={() => router.push('/darshan')} />
        <SettingRow icon="moon" label="Sleep" onPress={() => router.push('/sleep')} />
        <SettingRow icon="sparkles" label="Sankalpa journal" onPress={() => router.push('/sankalpa')} />
        <SettingRow icon="calendar" label="All festivals" onPress={() => router.push('/festivals')} />
        <SettingRow icon="cloud-upload" label="Creator Studio" onPress={() => router.push('/studio')} />
        <SettingRow icon="cloud-done" label="Downloads" value={`${downloadCount}`} onPress={() => router.push('/saved')} />
        {downloadCount > 0 && <SettingRow icon="trash" label="Remove all downloads" onPress={removeAllDownloads} />}
      </Card>

      {/* Membership — hidden while MEMBERSHIP_ENABLED is false */}
      {MEMBERSHIP_ENABLED && (
        <>
          <SectionHeader title="Membership" />
          <Card style={{ borderColor: premium ? colors.gold : colors.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Icon name={premium ? 'sparkles' : 'sparkles-outline'} size={24} color={premium ? 'gold' : 'primary'} />
              <View style={{ flex: 1 }}>
                <Text variant="title">{premium ? 'Diya Member' : 'Free plan'}</Text>
                <Text variant="caption" color="textMuted">
                  {premium ? 'Thank you for supporting the project 🪔' : 'Unlock the full library & guided sadhana'}
                </Text>
              </View>
            </View>
            {!premium && (
              <Button label="See membership" icon="arrow-forward" full style={{ marginTop: Spacing.md }} onPress={() => router.push('/paywall')} />
            )}
            {premium && !usingRealSDK && (
              <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.sm }}>
                Dev mode — entitlement granted locally (RevenueCat not configured).
              </Text>
            )}
          </Card>
        </>
      )}

      {/* Preferences */}
      <SectionHeader title="Preferences" />
      <Card>
        <Text variant="overline" color="textMuted">Your name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Add your name"
          placeholderTextColor={colors.textMuted}
          style={{ fontSize: 16, color: colors.text, paddingVertical: Spacing.sm }}
        />
        <Divider spacing={Spacing.sm} />
        <SettingRow icon="flower" label="My deity" value={ishtaName} onPress={() => router.push(ishta ? `/deity/${ishta}` : '/mandir')} />
        <Divider spacing={Spacing.sm} />
        <Text variant="overline" color="textMuted">Theme</Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, marginBottom: Spacing.sm }}>
          {THEME_MODES.map((m) => {
            const active = themeMode === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => setThemeMode(m.id)}
                style={{
                  flex: 1,
                  paddingVertical: Spacing.sm,
                  borderRadius: Radius.md,
                  alignItems: 'center',
                  backgroundColor: active ? colors.primary : colors.surfaceElevated,
                  borderWidth: 1,
                  borderColor: active ? colors.primary : colors.border,
                }}
              >
                <Text variant="label" style={{ color: active ? colors.onPrimary : colors.textSecondary }}>{m.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Divider spacing={Spacing.sm} />
        <Text variant="overline" color="textMuted">Prayer script</Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          {SCRIPTS.map((sopt) => {
            const active = script === sopt.id;
            return (
              <Pressable
                key={sopt.id}
                onPress={() => setScript(sopt.id)}
                style={{
                  flex: 1,
                  paddingVertical: Spacing.sm,
                  borderRadius: Radius.md,
                  alignItems: 'center',
                  backgroundColor: active ? colors.primary : colors.surfaceElevated,
                  borderWidth: 1,
                  borderColor: active ? colors.primary : colors.border,
                }}
              >
                <Text variant="label" style={{ color: active ? colors.onPrimary : colors.textSecondary }}>{sopt.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.sm }}>
          Roman shows prayers in English letters — read along without Devanagari.
        </Text>
        <Divider spacing={Spacing.sm} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md }}>
          <Icon name="notifications" size={20} color="textSecondary" />
          <View style={{ flex: 1 }}>
            <Text variant="body">Daily reminder</Text>
            <Pressable onPress={cycleReminderTime} disabled={!reminders.enabled}>
              <Text variant="caption" color={reminders.enabled ? 'primary' : 'textMuted'}>
                {fmtTime(reminders.hour, reminders.minute)} · tap to change
              </Text>
            </Pressable>
          </View>
          <Switch
            value={reminders.enabled}
            onValueChange={toggleReminder}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
        <Divider spacing={Spacing.sm} />
        <SettingRow icon="location" label="Location" value={location.label.split(',')[0]} onPress={cycleLocation} />
      </Card>

      {/* About */}
      <SectionHeader title="About" />
      <Card>
        <Text variant="body" color="textSecondary">
          Diya is a labour of devotion — a calm, ad-free home for daily Hindu practice, made for families near and far from the temple.
        </Text>
        <Divider spacing={Spacing.lg} />
        <Text variant="caption" color="textMuted">
          Sacred texts are traditional/public-domain; transliterations and translations are rendered for clarity and are pending review by recognised scholars. Recitation audio will be originally commissioned. Found an error in a text? We want to fix it.
        </Text>
      </Card>
    </Screen>
  );
}
