import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Palette } from '@/constants/theme';

/**
 * The Diya — a softly flickering oil lamp. The brand's emotional centerpiece,
 * used on the Today hero, the splash and the player. Pure vector + Reanimated,
 * so it scales crisply and animates on the UI thread.
 */
export function DiyaFlame({ size = 160, lit = true }: { size?: number; lit?: boolean }) {
  const flicker = useSharedValue(1);
  const glow = useSharedValue(0.6);
  const sway = useSharedValue(0);

  useEffect(() => {
    if (!lit) return;
    flicker.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 480, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.94, { duration: 360, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.02, { duration: 420, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    glow.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true);
    sway.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [lit, flicker, glow, sway]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: (sway.value - 0.5) * size * 0.03 },
      { scaleY: flicker.value },
      { scaleX: 2 - flicker.value },
    ],
    opacity: lit ? 1 : 0.15,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: lit ? 0.35 + glow.value * 0.3 : 0,
    transform: [{ scale: 0.9 + glow.value * 0.2 }],
  }));

  const flameW = size * 0.34;
  const flameH = size * 0.5;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }}>
      {/* glow */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: size * 0.02,
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size,
            backgroundColor: Palette.marigold,
          },
          glowStyle,
        ]}
      />
      {/* flame */}
      <Animated.View style={[{ position: 'absolute', top: size * 0.06 }, flameStyle]}>
        <Svg width={flameW} height={flameH} viewBox="0 0 34 50">
          <Defs>
            <RadialGradient id="flame" cx="50%" cy="65%" r="60%">
              <Stop offset="0%" stopColor="#FFF6D6" />
              <Stop offset="45%" stopColor={Palette.marigold} />
              <Stop offset="100%" stopColor={Palette.saffronDeep} />
            </RadialGradient>
          </Defs>
          <Path
            d="M17 1 C 26 14, 30 24, 26 34 C 23 42, 11 42, 8 34 C 4 24, 9 16, 17 1 Z"
            fill="url(#flame)"
          />
          <Path d="M17 16 C 21 22, 22 28, 19 33 C 16 36, 12 33, 13 28 C 14 23, 15 20, 17 16 Z" fill="#FFF6D6" opacity={0.85} />
        </Svg>
      </Animated.View>
      {/* lamp */}
      <Svg width={size} height={size * 0.42} viewBox="0 0 160 68">
        <Defs>
          <RadialGradient id="bowl" cx="50%" cy="10%" r="90%">
            <Stop offset="0%" stopColor={Palette.gold} />
            <Stop offset="60%" stopColor={Palette.kumkum} />
            <Stop offset="100%" stopColor={Palette.kumkumDeep} />
          </RadialGradient>
        </Defs>
        <Path d="M14 14 C 40 6, 120 6, 146 14 C 132 52, 110 64, 80 64 C 50 64, 28 52, 14 14 Z" fill="url(#bowl)" />
        <Ellipse cx="80" cy="15" rx="66" ry="11" fill={Palette.saffronDeep} opacity={0.55} />
        <Path d="M146 14 C 150 12, 156 14, 154 20 C 150 24, 142 22, 146 14 Z" fill={Palette.gold} />
      </Svg>
    </View>
  );
}
