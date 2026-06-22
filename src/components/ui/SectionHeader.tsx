import { Pressable, View } from 'react-native';
import { Spacing } from '@/constants/theme';
import { Text } from './Text';

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
        marginTop: Spacing.xl,
      }}
    >
      <Text variant="title">{title}</Text>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="label" color="primary">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
