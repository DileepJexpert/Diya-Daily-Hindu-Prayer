import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Card, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { TrackRow } from '@/components/content/TrackRow';
import { Catalog } from '@/lib/content/catalog';
import { useAppStore } from '@/lib/state/store';
import { useOpenTrack } from '@/lib/audio/useOpenTrack';
import { useDownloadsStore } from '@/lib/audio/downloads';

export default function SavedScreen() {
  const favorites = useAppStore((s) => s.favorites);
  const recent = useAppStore((s) => s.recentlyPlayed);
  const downloads = useDownloadsStore((s) => s.downloads);
  const removeDownload = useDownloadsStore((s) => s.remove);
  const open = useOpenTrack();

  const favTracks = Catalog.tracksById(favorites);
  const recentTracks = Catalog.tracksById(recent);
  const downloadIds = Object.keys(downloads);
  const downloadedTracks = Catalog.tracksById(downloadIds);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Saved</Text>

      <SectionHeader title="Favorites" />
      <Card>
        {favTracks.length ? (
          favTracks.map((t) => <TrackRow key={t.id} track={t} onPress={() => open(t, favorites)} />)
        ) : (
          <Text variant="body" color="textMuted" style={{ paddingVertical: Spacing.md }}>
            Tap the ♥ on any practice to save it here.
          </Text>
        )}
      </Card>

      <SectionHeader title="Downloaded" />
      <Card>
        {downloadedTracks.length ? (
          downloadedTracks.map((t) => (
            <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <TrackRow track={t} onPress={() => open(t, downloadIds)} />
              </View>
              <Pressable onPress={() => removeDownload(t.id)} hitSlop={10} style={{ paddingLeft: Spacing.sm }}>
                <Icon name="trash-outline" size={20} color="textMuted" />
              </Pressable>
            </View>
          ))
        ) : (
          <Text variant="body" color="textMuted" style={{ paddingVertical: Spacing.md }}>
            Tap the cloud icon on a track to save it for offline listening.
          </Text>
        )}
      </Card>

      <SectionHeader title="Recently played" />
      <Card>
        {recentTracks.length ? (
          recentTracks.map((t) => <TrackRow key={t.id} track={t} onPress={() => open(t, recent)} />)
        ) : (
          <Text variant="body" color="textMuted" style={{ paddingVertical: Spacing.md }}>
            Your recent practices will appear here.
          </Text>
        )}
      </Card>
    </Screen>
  );
}
