import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { Catalog } from '@/lib/content/catalog';
import { usePlayerStore } from '@/lib/audio/playerStore';
import { useColors } from '@/hooks/use-theme';
import { Icon, Text } from '@/components/ui';
import { DeityAvatar } from '@/components/content/DeityAvatar';

/** Persistent now-playing bar. Renders nothing when nothing is loaded. */
export function MiniPlayer({ bottom = 0 }: { bottom?: number }) {
  const colors = useColors();
  const trackId = usePlayerStore((s) => s.trackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) => s.duration);
  const toggle = usePlayerStore((s) => s.toggle);

  if (!trackId) return null;
  const track = Catalog.track(trackId);
  if (!track) return null;
  const deity = Catalog.deity(track.deityId);
  const pct = duration ? Math.min(1, position / duration) : 0;

  return (
    <View style={{ position: 'absolute', left: Spacing.md, right: Spacing.md, bottom }}>
      <Pressable
        onPress={() => router.push(`/player/${trackId}`)}
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
        <Pressable onPress={toggle} hitSlop={12}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={26} color="primary" />
        </Pressable>
      </Pressable>
      <View style={{ height: 3, backgroundColor: colors.border, borderRadius: 2, marginHorizontal: Spacing.md, marginTop: 4 }}>
        <View style={{ width: `${pct * 100}%`, height: 3, backgroundColor: colors.primary, borderRadius: 2 }} />
      </View>
    </View>
  );
}
