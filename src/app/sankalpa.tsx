import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Radius, Spacing } from '@/constants/theme';
import { Button, Card, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { todaySankalpa, useAppStore } from '@/lib/state/store';

const SUGGESTIONS = ['Practice patience', 'Serve with joy', 'Let go of anger', 'Speak kindly', 'Be present', 'Give thanks'];

export default function SankalpaScreen() {
  const colors = useColors();
  const sankalpas = useAppStore((s) => s.sankalpas);
  const setSankalpa = useAppStore((s) => s.setSankalpa);
  const today = useAppStore(todaySankalpa);

  const [text, setText] = useState(today);
  const [saved, setSaved] = useState(false);

  const todayKey = new Date().toISOString().slice(0, 10);
  const past = Object.entries(sankalpas)
    .filter(([d]) => d !== todayKey)
    .sort((a, b) => b[0].localeCompare(a[0]));

  const save = () => {
    setSankalpa(text.trim());
    setSaved(true);
  };

  const fmt = (iso: string) =>
    new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(iso));

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Sankalpa</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
        A sankalpa is a heartfelt intention. Set one for today and let your practice carry it.
      </Text>

      <Card elevated style={{ marginTop: Spacing.lg }}>
        <Text variant="overline" color="primary">Today</Text>
        <TextInput
          value={text}
          onChangeText={(t) => { setText(t); setSaved(false); }}
          placeholder="Today, I intend to…"
          placeholderTextColor={colors.textMuted}
          multiline
          style={{ color: colors.text, fontSize: 17, lineHeight: 24, minHeight: 64, marginTop: Spacing.sm, textAlignVertical: 'top' }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm }}>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => { setText(s); setSaved(false); }}
              style={{ paddingVertical: 6, paddingHorizontal: Spacing.md, borderRadius: Radius.pill, backgroundColor: colors.surfaceElevated, borderWidth: 1, borderColor: colors.border }}
            >
              <Text variant="caption" color="textSecondary">{s}</Text>
            </Pressable>
          ))}
        </View>
        <Button
          label={saved ? 'Saved ✓' : 'Set intention'}
          icon={saved ? 'checkmark' : 'sparkles'}
          variant={saved ? 'secondary' : 'primary'}
          full
          style={{ marginTop: Spacing.lg }}
          onPress={save}
        />
      </Card>

      {past.length > 0 && (
        <>
          <SectionHeader title="Past intentions" />
          <Card>
            {past.map(([d, t], i) => (
              <View key={d} style={{ paddingVertical: Spacing.sm, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border }}>
                <Text variant="caption" color="textMuted">{fmt(d)}</Text>
                <Text variant="body">{t}</Text>
              </View>
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}
