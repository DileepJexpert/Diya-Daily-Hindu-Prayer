import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Icon, Screen, Text } from '@/components/ui';
import { JourneyCard } from '@/components/content/JourneyCard';
import { Catalog } from '@/lib/content/catalog';

export default function JourneysScreen() {
  const journeys = Catalog.journeys();
  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Journeys</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs, marginBottom: Spacing.lg }}>
        Guided programs to build a steady daily practice, one day at a time.
      </Text>
      <View>
        {journeys.map((j) => (
          <JourneyCard key={j.id} journey={j} wide />
        ))}
      </View>
    </Screen>
  );
}
