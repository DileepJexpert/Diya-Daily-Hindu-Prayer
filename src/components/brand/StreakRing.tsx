import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';

/**
 * Weekly streak ring. Fills toward the next 7-day milestone and shows the live
 * streak count — the retention loop that makes a "daily" app sticky.
 */
export function StreakRing({ count, size = 84 }: { count: number; size?: number }) {
  const colors = useColors();
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = count === 0 ? 0 : ((count - 1) % 7) / 7 + 1 / 7;
  const dash = circumference * Math.min(1, progress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.border} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text variant="h2" color="primary">{count}</Text>
      <Text variant="caption" color="textMuted">day{count === 1 ? '' : 's'}</Text>
    </View>
  );
}
