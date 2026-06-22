import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Button, Card, Icon, Screen, Text } from '@/components/ui';
import { StoryQuiz } from '@/components/content/StoryQuiz';
import { Catalog } from '@/lib/content/catalog';
import { formatStoryShare, shareText } from '@/lib/share';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const story = id ? Catalog.story(id) : undefined;

  if (!story) {
    return (
      <Screen>
        <Text variant="title">Story not found</Text>
      </Screen>
    );
  }

  const deity = story.deityId ? Catalog.deity(story.deityId) : undefined;
  const quiz = Catalog.storyQuiz(story.id);
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>

      <View style={{ alignItems: 'center', gap: Spacing.xs }}>
        <Text style={{ fontSize: 56 }}>{story.glyph}</Text>
        <Text variant="h1" center>{story.title}</Text>
        <Text variant="caption" color="primary">
          {story.readingMinutes} min · {story.ageGroup === 'kids' ? 'For kids' : 'All ages'}
        </Text>
      </View>

      {story.body.map((p, i) => (
        <Text key={i} variant="bodyLg" style={{ marginTop: Spacing.lg }}>{p}</Text>
      ))}

      {story.moral && (
        <Card elevated style={{ marginTop: Spacing.xl }}>
          <Text variant="overline" color="primary">The lesson</Text>
          <Text variant="bodyLg" style={{ marginTop: Spacing.xs }}>{story.moral}</Text>
        </Card>
      )}

      {deity && (
        <Button
          label={`Practices for ${deity.name}`}
          icon="musical-notes"
          variant="secondary"
          full
          style={{ marginTop: Spacing.xl }}
          onPress={() => router.push(`/deity/${deity.id}`)}
        />
      )}

      {quiz.length > 0 && (
        <View style={{ marginTop: Spacing.xl }}>
          {!showQuiz ? (
            <Button label="Test what you learned" icon="help-circle" variant="secondary" full onPress={() => setShowQuiz(true)} />
          ) : (
            <>
              <Text variant="title" style={{ marginBottom: Spacing.md }}>Little quiz</Text>
              <StoryQuiz questions={quiz} />
            </>
          )}
        </View>
      )}

      <Button
        label="Share this story"
        icon="share-outline"
        variant="ghost"
        full
        style={{ marginTop: Spacing.lg }}
        onPress={() => shareText(formatStoryShare(story.title, story.moral))}
      />

      {story.attribution && (
        <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.lg }}>{story.attribution}</Text>
      )}
    </Screen>
  );
}
