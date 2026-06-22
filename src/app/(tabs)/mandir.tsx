import { View } from 'react-native';
import { router } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Card, Screen, Text } from '@/components/ui';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { Catalog } from '@/lib/content/catalog';

export default function MandirScreen() {
  const deities = Catalog.deities();
  return (
    <Screen>
      <Text variant="h1">Mandir</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
        Your home shrine — choose a deity to sit with today.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: Spacing.lg }}>
        {deities.map((d) => (
          <Card
            key={d.id}
            onPress={() => router.push(`/deity/${d.id}`)}
            style={{ width: '48%', alignItems: 'center', paddingVertical: Spacing.xl, marginBottom: Spacing.md }}
          >
            <DeityAvatar deity={d} size={72} />
            <Text variant="title" center style={{ marginTop: Spacing.sm }}>{d.name}</Text>
            <Text variant="caption" color="textMuted" center numberOfLines={1}>{d.epithet}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
