import { Fragment } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Card, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { Catalog } from '@/lib/content/catalog';
import { formatVerseShare, shareText } from '@/lib/share';

export default function ScriptureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scripture = id ? Catalog.scripture(id) : undefined;

  if (!scripture) {
    return (
      <Screen>
        <Text variant="title">Scripture not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>

      <Text variant="h1">{scripture.title}</Text>
      {scripture.devanagari && <Text variant="sanskrit" color="textSecondary">{scripture.devanagari}</Text>}
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.sm }}>{scripture.description}</Text>
      <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.xs }}>{scripture.attribution}</Text>

      {scripture.chapters.map((ch) => (
        <Fragment key={ch.number}>
          <SectionHeader title={`Chapter ${ch.number} · ${ch.title}`} />
          {ch.devanagari && <Text variant="sanskrit" color="textSecondary" style={{ marginBottom: Spacing.sm }}>{ch.devanagari}</Text>}
          <Text variant="body" color="textSecondary">{ch.summary}</Text>

          {ch.verses.map((v) => (
            <Card key={v.ref} style={{ marginTop: Spacing.lg }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="overline" color="primary">{scripture.title} {v.ref}</Text>
                <Pressable onPress={() => shareText(formatVerseShare(scripture.title, v.ref, v.transliteration, v.translation))} hitSlop={8}>
                  <Icon name="share-outline" size={18} color="textMuted" />
                </Pressable>
              </View>
              <Text variant="sanskrit" style={{ marginTop: Spacing.sm }}>{v.devanagari}</Text>
              <Text variant="transliteration" color="primary" style={{ marginTop: Spacing.sm }}>{v.transliteration}</Text>
              <Text variant="bodyLg" style={{ marginTop: Spacing.sm }}>{v.translation}</Text>
              {v.commentary && (
                <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.sm, fontStyle: 'italic' }}>
                  {v.commentary}
                </Text>
              )}
            </Card>
          ))}
        </Fragment>
      ))}
    </Screen>
  );
}
