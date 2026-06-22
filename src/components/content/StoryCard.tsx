import { View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Card, Text } from '@/components/ui';
import type { Story } from '@/lib/content/types';

export function StoryCard({ story }: { story: Story }) {
  return (
    <Card
      onPress={() => router.push(`/story/${story.id}`)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md }}
    >
      <Text style={{ fontSize: 34 }}>{story.glyph}</Text>
      <View style={{ flex: 1 }}>
        <Text variant="subtitle" numberOfLines={1}>{story.title}</Text>
        <Text variant="caption" color="textMuted" numberOfLines={2}>{story.summary}</Text>
        <Text variant="caption" color="primary" style={{ marginTop: 2 }}>
          {story.readingMinutes} min · {story.ageGroup === 'kids' ? 'For kids' : 'All ages'}
        </Text>
      </View>
    </Card>
  );
}
