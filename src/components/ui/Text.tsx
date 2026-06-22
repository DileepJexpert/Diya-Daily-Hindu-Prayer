import { Text as RNText, type TextProps } from 'react-native';
import { Typography, type ColorToken } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

type Variant = keyof typeof Typography;

export interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: ColorToken | string;
  center?: boolean;
}

/** Themed text. Pass a semantic `variant` and a color token (or raw color). */
export function Text({ variant = 'body', color = 'text', center, style, ...rest }: AppTextProps) {
  const colors = useColors();
  const resolved = (colors as Record<string, string>)[color] ?? color;
  return (
    <RNText
      style={[Typography[variant], { color: resolved }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
