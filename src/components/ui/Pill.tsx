import { Pressable } from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

export function Pill({
  label,
  active,
  icon,
  onPress,
}: {
  label: string;
  active?: boolean;
  icon?: IconName;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.pill,
        backgroundColor: active ? colors.primary : colors.surfaceElevated,
        borderWidth: 1,
        borderColor: active ? colors.primary : colors.border,
      }}
    >
      {icon && <Icon name={icon} size={15} color={active ? colors.onPrimary : 'textSecondary'} />}
      <Text variant="label" style={{ color: active ? colors.onPrimary : colors.textSecondary }}>
        {label}
      </Text>
    </Pressable>
  );
}
