import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radius, Spacing } from '@/constants/theme';
import { Button, Icon, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { PLANS, type PlanId, useSubscriptionStore } from '@/lib/subscription/subscriptionStore';
import { purchasePlan, restorePurchases } from '@/lib/subscription/entitlements';

const BENEFITS: { icon: Parameters<typeof Icon>[0]['name']; text: string }[] = [
  { icon: 'infinite', text: 'The complete library — every aarti, mantra, chalisa & stotra' },
  { icon: 'mic', text: 'Studio recitations with synced, slow-down lyrics' },
  { icon: 'leaf', text: 'Guided daily sadhana & meditations' },
  { icon: 'cloud-offline', text: 'Offline downloads for travel & the mandir' },
  { icon: 'calendar', text: 'Festival & muhurat reminders in your timezone' },
  { icon: 'heart', text: 'Ad-free, forever — made with devotion' },
];

export default function Paywall() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const loading = useSubscriptionStore((s) => s.loading);
  const [selected, setSelected] = useState<PlanId>('annual');

  const buy = async () => {
    const ok = await purchasePlan(selected);
    if (ok) router.back();
  };

  const restore = async () => {
    const ok = await restorePurchases();
    if (ok) router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.xl, paddingTop: insets.top + Spacing.lg, paddingBottom: Spacing.huge }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="overline" color="primary">Diya Membership</Text>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Icon name="close" size={26} color="textSecondary" />
          </Pressable>
        </View>

        <Text variant="h1" style={{ marginTop: Spacing.md }}>Your whole practice, unlocked</Text>
        <Text variant="bodyLg" color="textSecondary" style={{ marginTop: Spacing.sm }}>
          Join devotees around the world keeping their tradition close.
        </Text>

        {/* Benefits */}
        <View style={{ gap: Spacing.md, marginTop: Spacing.xl }}>
          {BENEFITS.map((b) => (
            <View key={b.text} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={b.icon} size={18} color="primary" />
              </View>
              <Text variant="body" style={{ flex: 1 }}>{b.text}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={{ gap: Spacing.md, marginTop: Spacing.xl }}>
          {PLANS.map((plan) => {
            const active = selected === plan.id;
            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelected(plan.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: Spacing.lg,
                  borderRadius: Radius.lg,
                  borderWidth: 2,
                  borderColor: active ? colors.primary : colors.border,
                  backgroundColor: active ? colors.primarySoft : colors.surface,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                    <Text variant="subtitle">{plan.title}</Text>
                    {plan.highlight && (
                      <View style={{ backgroundColor: colors.gold, borderRadius: Radius.pill, paddingHorizontal: Spacing.sm, paddingVertical: 2 }}>
                        <Text variant="caption" style={{ color: '#2A1206' }}>Best value</Text>
                      </View>
                    )}
                  </View>
                  <Text variant="caption" color="textMuted">{plan.blurb}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text variant="title">{plan.price}</Text>
                  <Text variant="caption" color="textMuted">{plan.period}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={{ padding: Spacing.xl, paddingBottom: insets.bottom + Spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.background }}>
        <Button label="Start 7-day free trial" size="lg" full loading={loading} onPress={buy} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg, marginTop: Spacing.md }}>
          <Text variant="caption" color="textMuted" onPress={restore}>Restore purchase</Text>
          <Text variant="caption" color="textMuted">Terms · Privacy</Text>
        </View>
      </View>
    </View>
  );
}
