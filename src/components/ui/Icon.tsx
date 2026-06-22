import { Ionicons } from '@expo/vector-icons';
import { type ColorToken } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function Icon({
  name,
  size = 22,
  color = 'text',
}: {
  name: IconName;
  size?: number;
  color?: ColorToken | string;
}) {
  const colors = useColors();
  const resolved = (colors as Record<string, string>)[color] ?? color;
  return <Ionicons name={name} size={size} color={resolved} />;
}
