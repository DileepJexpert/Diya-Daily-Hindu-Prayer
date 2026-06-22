import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Card, Icon, Screen, Text } from '@/components/ui';
import { Catalog } from '@/lib/content/catalog';

export default function ScriptureIndexScreen() {
  const scriptures = Catalog.scriptures();
  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Scripture</Text>

      {scriptures.map((s) => (
        <Card key={s.id} onPress={() => router.push(`/scripture/${s.id}`)} style={{ marginTop: Spacing.lg }}>
          <Text variant="h2">{s.title}</Text>
          {s.devanagari && <Text variant="sanskrit" color="textSecondary">{s.devanagari}</Text>}
          <Text variant="label" color="primary" style={{ marginTop: Spacing.xs }}>{s.subtitle}</Text>
          <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.sm }}>{s.description}</Text>
          <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.sm }}>
            {s.chapters.length} chapter{s.chapters.length === 1 ? '' : 's'} · {s.attribution}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}
