import { Pressable, View, type ViewStyle, type StyleProp } from 'react-native';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, onPress, elevated, padded = true, style }: CardProps) {
  const colors = useColors();
  const base: ViewStyle = {
    backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: padded ? Spacing.lg : 0,
    ...(elevated ? Shadow.card : null),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
