import { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { Icon, Pill, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { useAppStore } from '@/lib/state/store';

const TARGETS = [27, 54, 108];

export default function JapaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const recordPractice = useAppStore((s) => s.recordPractice);

  const [target, setTarget] = useState(108);
  const [count, setCount] = useState(0);
  const [rounds, setRounds] = useState(0);

  const size = 264;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (count / target);

  const tap = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setCount((c) => {
      const n = c + 1;
      if (n >= target) {
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setRounds((x) => x + 1);
        recordPractice();
        return 0;
      }
      return n;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Icon name="chevron-down" size={28} color="textSecondary" />
        </Pressable>
        <Text variant="overline" color="textMuted">JAPA MALA</Text>
        <Pressable onPress={() => { setCount(0); setRounds(0); }} hitSlop={12}>
          <Icon name="refresh" size={22} color="textSecondary" />
        </Pressable>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.xl }}>
        <Text variant="sanskrit" color="textSecondary">॥ ॐ ॥</Text>

        <Pressable onPress={tap} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={size} height={size} style={{ position: 'absolute' }}>
            <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surfaceElevated} strokeWidth={stroke} fill="none" />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={colors.primary}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${dash} ${circ}`}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="display" style={{ fontSize: 72, lineHeight: 78 }} color="primary">{count}</Text>
            <Text variant="label" color="textMuted">of {target}</Text>
          </View>
        </Pressable>

        <Text variant="body" color="textSecondary">Tap the circle with each repetition</Text>
        <Text variant="title">{rounds} {rounds === 1 ? 'mala' : 'malas'} completed</Text>

        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          {TARGETS.map((t) => (
            <Pill key={t} label={`${t}`} active={target === t} onPress={() => { setTarget(t); setCount(0); }} />
          ))}
        </View>
      </View>
    </View>
  );
}
