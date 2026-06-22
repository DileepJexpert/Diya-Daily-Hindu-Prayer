import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/use-theme';
import { MiniPlayer } from '@/components/player/MiniPlayer';

export default function TabsLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56 + insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            height: tabBarHeight,
            paddingTop: 6,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Today', tabBarIcon: ({ color, size }) => <Ionicons name="flame" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="library"
          options={{ title: 'Library', tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="mandir"
          options={{ title: 'Mandir', tabBarIcon: ({ color, size }) => <Ionicons name="flower" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="panchang"
          options={{ title: 'Panchang', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }}
        />
        <Tabs.Screen
          name="more"
          options={{ title: 'More', tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size} color={color} /> }}
        />
      </Tabs>
      <MiniPlayer bottom={tabBarHeight + 6} />
    </View>
  );
}
