import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Icon, Pill, Screen, Text } from '@/components/ui';
import { StoryCard } from '@/components/content/StoryCard';
import { Catalog } from '@/lib/content/catalog';

export default function StoriesScreen() {
  const all = Catalog.stories();
  const [kidsOnly, setKidsOnly] = useState(false);
  const stories = kidsOnly ? all.filter((s) => s.ageGroup === 'kids') : all;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Stories</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
        Sacred tales (katha) to read together and share with the little ones.
      </Text>

      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg, marginBottom: Spacing.lg }}>
        <Pill label="All ages" active={!kidsOnly} onPress={() => setKidsOnly(false)} />
        <Pill label="For kids" icon="happy" active={kidsOnly} onPress={() => setKidsOnly(true)} />
      </View>

      {stories.map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}
    </Screen>
  );
}
