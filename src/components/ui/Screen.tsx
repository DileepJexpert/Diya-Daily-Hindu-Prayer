import { ScrollView, View, type ViewStyle, type StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout, Spacing } from '@/constants/theme';
import { useColors } from '@/hooks/use-theme';

export interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Extra bottom space so content clears the mini-player + tab bar. */
  bottomGutter?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll = true,
  padded = true,
  bottomGutter = true,
  style,
  contentStyle,
}: ScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingTop: insets.top + Spacing.sm,
    paddingHorizontal: padded ? Layout.screenPadding : 0,
    paddingBottom: (bottomGutter ? Layout.miniPlayerHeight + Spacing.xxl : 0) + insets.bottom,
  };

  const inner = (
    <View style={[{ width: '100%', maxWidth: Layout.maxContentWidth, alignSelf: 'center' }, contentStyle]}>
      {children}
    </View>
  );

  if (!scroll) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.background }, padding, style]}>{inner}</View>
    );
  }

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      contentContainerStyle={padding}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {inner}
    </ScrollView>
  );
}
