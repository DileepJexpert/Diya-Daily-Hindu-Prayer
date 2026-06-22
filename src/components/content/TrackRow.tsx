import { Pressable, View } from 'react-native';
import { Spacing } from '@/constants/theme';
import { Catalog } from '@/lib/content/catalog';
import { useIsPremium } from '@/lib/subscription/subscriptionStore';
import type { Track } from '@/lib/content/types';
import { Icon, Text } from '@/components/ui';
import { DeityAvatar } from './DeityAvatar';

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function TrackRow({ track, onPress }: { track: Track; onPress: () => void }) {
  const premium = useIsPremium();
  const deity = Catalog.deity(track.deityId);
  const locked = !track.isFree && !premium;
  const kind = track.kind.charAt(0).toUpperCase() + track.kind.slice(1);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.sm,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {deity && <DeityAvatar deity={deity} size={52} />}
      <View style={{ flex: 1 }}>
        <Text variant="subtitle" numberOfLines={1}>{track.title}</Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {kind} · {track.artist}
        </Text>
      </View>
      <Text variant="caption" color="textMuted">{formatDuration(track.duration)}</Text>
      <Icon name={locked ? 'lock-closed' : 'play-circle'} size={26} color={locked ? 'textMuted' : 'primary'} />
    </Pressable>
  );
}
