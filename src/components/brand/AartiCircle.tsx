import { useRef, useState } from 'react';
import { PanResponder, Platform, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/use-theme';
import { DiyaFlame } from '@/components/brand/DiyaFlame';

/**
 * Interactive aarti — drag the diya in circles around the deity, the way one
 * waves the lamp during worship. Each full revolution rings a beat (haptic);
 * completing `rounds` finishes the offering. The signature craft moment.
 */
export function AartiCircle({
  size = 300,
  rounds = 3,
  onRound,
  onComplete,
  children,
}: {
  size?: number;
  rounds?: number;
  onRound?: (round: number) => void;
  onComplete?: () => void;
  children?: React.ReactNode;
}) {
  const colors = useColors();
  const radius = size * 0.36;
  const center = size / 2;

  const containerRef = useRef<View>(null);
  const origin = useRef({ x: 0, y: 0 });
  const [angle, setAngle] = useState(-Math.PI / 2);
  const totalAngle = useRef(0);
  const lastAngle = useRef<number | null>(null);
  const roundsDone = useRef(0);
  const completed = useRef(false);

  const measure = () => {
    containerRef.current?.measureInWindow((x, y) => {
      origin.current = { x, y };
    });
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastAngle.current = null;
      },
      onPanResponderMove: (e) => {
        const px = e.nativeEvent.pageX - origin.current.x - center;
        const py = e.nativeEvent.pageY - origin.current.y - center;
        const a = Math.atan2(py, px);
        setAngle(a);
        if (lastAngle.current !== null) {
          let delta = a - lastAngle.current;
          if (delta > Math.PI) delta -= 2 * Math.PI;
          if (delta < -Math.PI) delta += 2 * Math.PI;
          totalAngle.current += delta;
          const done = Math.floor(Math.abs(totalAngle.current) / (2 * Math.PI));
          if (done > roundsDone.current) {
            roundsDone.current = done;
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            onRound?.(done);
            if (done >= rounds && !completed.current) {
              completed.current = true;
              if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
              onComplete?.();
            }
          }
        }
        lastAngle.current = a;
      },
    }),
  ).current;

  const diyaX = center + radius * Math.cos(angle);
  const diyaY = center + radius * Math.sin(angle);

  return (
    <View
      ref={containerRef}
      onLayout={measure}
      {...pan.panHandlers}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          width: radius * 2 + 56,
          height: radius * 2 + 56,
          borderRadius: size,
          borderWidth: 1.5,
          borderColor: colors.border,
          borderStyle: 'dashed',
        }}
      />
      <View style={{ pointerEvents: 'none' }}>{children}</View>
      <View style={{ pointerEvents: 'none', position: 'absolute', left: diyaX - 28, top: diyaY - 28 }}>
        <DiyaFlame size={56} />
      </View>
    </View>
  );
}
