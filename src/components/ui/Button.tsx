import { ActivityIndicator, Platform, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Radius, Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold';
type Size = 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  full,
  style,
}: ButtonProps) {
  const colors = useColors();

  const bg: Record<Variant, string> = {
    primary: colors.primary,
    secondary: colors.surfaceElevated,
    ghost: 'transparent',
    gold: colors.gold,
  };
  const fg: Record<Variant, string> = {
    primary: colors.onPrimary,
    secondary: colors.text,
    ghost: colors.primary,
    gold: '#2A1206',
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
          backgroundColor: bg[variant],
          borderRadius: Radius.pill,
          paddingVertical: size === 'lg' ? Spacing.lg : Spacing.md,
          paddingHorizontal: Spacing.xl,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: colors.border,
          alignSelf: full ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg[variant]} />
      ) : (
        <>
          {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} color={fg[variant]} />}
          <Text variant={size === 'lg' ? 'subtitle' : 'label'} style={{ color: fg[variant] }}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
