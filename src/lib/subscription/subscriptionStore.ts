/**
 * Subscription / entitlement store.
 *
 * Production gating runs through RevenueCat (one cross-platform SDK for App
 * Store + Play billing). To keep the app fully runnable in Expo Go and CI — and
 * because the native SDK isn't present until a dev build — RevenueCat is loaded
 * lazily and falls back to a local mock that persists the entitlement flag.
 *
 * To go live:
 *   1. `npx expo install react-native-purchases react-native-purchases-ui`
 *   2. Add the config plugin, set REVENUECAT_* keys, build a dev client.
 *   3. `initSubscriptions()` will then use the real SDK automatically.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PlanId = 'monthly' | 'annual' | 'lifetime';

export interface Plan {
  id: PlanId;
  title: string;
  price: string;
  period: string;
  blurb: string;
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  { id: 'annual', title: 'Annual', price: '$59.99', period: '/year', blurb: 'Best value — under $5/month', highlight: true },
  { id: 'monthly', title: 'Monthly', price: '$8.99', period: '/month', blurb: 'Flexible, cancel anytime' },
  { id: 'lifetime', title: 'Lifetime', price: '$149', period: 'once', blurb: 'Pay once, yours forever' },
];

export const ENTITLEMENT_ID = 'diya_premium';

/**
 * Master switch for paid membership. OFF for now — the whole app is unlocked and
 * no paywall is shown. Flip to true (and wire RevenueCat) to re-enable gating.
 */
export const MEMBERSHIP_ENABLED = false;

interface SubscriptionState {
  isPremium: boolean;
  activePlan: PlanId | null;
  inTrial: boolean;
  loading: boolean;
  usingRealSDK: boolean;
  setPremium: (premium: boolean, plan?: PlanId | null) => void;
  setLoading: (v: boolean) => void;
  setUsingRealSDK: (v: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      isPremium: false,
      activePlan: null,
      inTrial: false,
      loading: false,
      usingRealSDK: false,
      setPremium: (isPremium, activePlan = null) => set({ isPremium, activePlan }),
      setLoading: (loading) => set({ loading }),
      setUsingRealSDK: (usingRealSDK) => set({ usingRealSDK }),
    }),
    { name: 'diya-subscription-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export const useIsPremium = () => {
  const premium = useSubscriptionStore((s) => s.isPremium);
  // While membership is disabled, treat everyone as entitled (nothing gated).
  return MEMBERSHIP_ENABLED ? premium : true;
};
