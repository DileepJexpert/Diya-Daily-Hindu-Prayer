import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { Text } from '@/components/ui';
import { useAppStore } from '@/lib/state/store';
import type { Journey } from '@/lib/content/types';

export function JourneyCard({ journey, wide }: { journey: Journey; wide?: boolean }) {
  const done = useAppStore((s) => s.journeyProgress[journey.id]?.length ?? 0);
  const total = journey.days.length;
  const pct = total ? done / total : 0;

  return (
    <Pressable onPress={() => router.push(`/journey/${journey.id}`)} style={{ width: wide ? '100%' : 260, marginBottom: wide ? Spacing.md : 0 }}>
      <LinearGradient
        colors={journey.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: Radius.lg, padding: Spacing.lg, minHeight: 150, justifyContent: 'space-between', ...Shadow.card }}
      >
        <View>
          <Text variant="overline" style={{ color: 'rgba(255,255,255,0.85)' }}>{journey.subtitle}</Text>
          <Text variant="h2" style={{ color: '#FFFFFF', marginTop: 4 }}>{journey.title}</Text>
        </View>
        <View>
          <View style={{ height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <View style={{ width: `${pct * 100}%`, height: 5, borderRadius: 3, backgroundColor: '#FFFFFF' }} />
          </View>
          <Text variant="caption" style={{ color: 'rgba(255,255,255,0.95)', marginTop: 6 }}>
            {done > 0 ? `${done}/${total} days · continue` : `${total} days · start`}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
