import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Icon, Screen, Text } from '@/components/ui';
import { StoryCard } from '@/components/content/StoryCard';
import { Catalog } from '@/lib/content/catalog';

export default function StoriesScreen() {
  const stories = Catalog.stories();
  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Stories</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs, marginBottom: Spacing.lg }}>
        Sacred tales (katha) to read together and share with the little ones.
      </Text>
      {stories.map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}
    </Screen>
  );
}
