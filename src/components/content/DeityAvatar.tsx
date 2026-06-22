import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui';
import type { Deity } from '@/lib/content/types';

export function DeityAvatar({ deity, size = 56 }: { deity: Deity; size?: number }) {
  return (
    <LinearGradient
      colors={deity.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ fontSize: size * 0.44 }}>{deity.glyph}</Text>
    </LinearGradient>
  );
}
