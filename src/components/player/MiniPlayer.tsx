import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useAudioPlayerStatus } from 'expo-audio';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { Catalog } from '@/lib/content/catalog';
import { usePlayerStore } from '@/lib/audio/playerStore';
import { audioTogglePlay, getAudioPlayer } from '@/lib/audio/audioEngine';
import { useColors } from '@/hooks/use-theme';
import { Icon, Text } from '@/components/ui';
import { DeityAvatar } from '@/components/content/DeityAvatar';

/** Persistent now-playing bar. Controls the global audio engine for real-audio
 *  tracks; for text-to-speech tracks it just reopens the player. */
export function MiniPlayer({ bottom = 0 }: { bottom?: number }) {
  const colors = useColors();
  const trackId = usePlayerStore((s) => s.trackId);
  const status = useAudioPlayerStatus(getAudioPlayer());

  if (!trackId) return null;
  const track = Catalog.track(trackId);
  if (!track) return null;
  const deity = Catalog.deity(track.deityId);
  const isAudio = !!track.audio;
  const playing = isAudio ? status.playing : false;
  const pct = isAudio && status.duration > 0 ? Math.min(1, status.currentTime / status.duration) : 0;

  const openPlayer = () => router.push(`/player/${trackId}`);

  return (
    <View style={{ position: 'absolute', left: Spacing.md, right: Spacing.md, bottom }}>
      <Pressable
        onPress={openPlayer}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          backgroundColor: colors.surfaceElevated,
          borderRadius: Radius.lg,
          padding: Spacing.sm,
          paddingRight: Spacing.lg,
          borderWidth: 1,
          borderColor: colors.border,
          ...Shadow.floating,
        }}
      >
        {deity && <DeityAvatar deity={deity} size={44} />}
        <View style={{ flex: 1 }}>
          <Text variant="label" numberOfLines={1}>{track.title}</Text>
          <Text variant="caption" color="textMuted" numberOfLines={1}>{track.artist}</Text>
        </View>
        <Pressable onPress={isAudio ? audioTogglePlay : openPlayer} hitSlop={12}>
          <Icon name={playing ? 'pause' : 'play'} size={26} color="primary" />
        </Pressable>
      </Pressable>
      <View style={{ height: 3, backgroundColor: colors.border, borderRadius: 2, marginHorizontal: Spacing.md, marginTop: 4 }}>
        <View style={{ width: `${pct * 100}%`, height: 3, backgroundColor: colors.primary, borderRadius: 2 }} />
      </View>
    </View>
  );
}
