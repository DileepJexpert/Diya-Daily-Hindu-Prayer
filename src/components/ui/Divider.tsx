import { View } from 'react-native';
import { useColors } from '@/hooks/use-theme';

export function Divider({ spacing = 0 }: { spacing?: number }) {
  const colors = useColors();
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing }} />;
}
