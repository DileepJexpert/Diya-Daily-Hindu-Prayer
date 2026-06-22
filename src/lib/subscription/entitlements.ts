/**
 * Entitlement service — the seam between the app and the billing provider.
 * Tries RevenueCat (lazy, so a missing native module never crashes Expo Go) and
 * otherwise uses a persisted mock so the paywall, gating and "restore" flows are
 * all exercisable end-to-end in development.
 */
import { Platform } from 'react-native';
import { ENTITLEMENT_ID, PlanId, useSubscriptionStore } from './subscriptionStore';

// Public RevenueCat API keys would live in env/app config, not in source.
const RC_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_KEY ?? '';

type Purchases = any; // typed loosely; real types come with the SDK when installed.

function loadPurchases(): Purchases | null {
  if (Platform.OS === 'web' || !RC_API_KEY) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-purchases').default ?? require('react-native-purchases');
  } catch {
    return null; // native module not in this build — use mock.
  }
}

export async function initSubscriptions(): Promise<void> {
  const store = useSubscriptionStore.getState();
  const Purchases = loadPurchases();
  if (!Purchases) {
    store.setUsingRealSDK(false);
    return; // mock mode: persisted flag already drives `isPremium`.
  }
  try {
    store.setLoading(true);
    Purchases.configure({ apiKey: RC_API_KEY });
    const info = await Purchases.getCustomerInfo();
    store.setUsingRealSDK(true);
    store.setPremium(!!info?.entitlements?.active?.[ENTITLEMENT_ID]);
  } catch {
    store.setUsingRealSDK(false);
  } finally {
    store.setLoading(false);
  }
}

/** Purchase a plan. Mock mode simply grants the entitlement locally. */
export async function purchasePlan(plan: PlanId): Promise<boolean> {
  const store = useSubscriptionStore.getState();
  const Purchases = loadPurchases();
  if (!Purchases) {
    store.setPremium(true, plan); // mock grant
    return true;
  }
  try {
    store.setLoading(true);
    const offerings = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.[0];
    if (!pkg) return false;
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const premium = !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
    store.setPremium(premium, plan);
    return premium;
  } catch {
    return false;
  } finally {
    store.setLoading(false);
  }
}

export async function restorePurchases(): Promise<boolean> {
  const store = useSubscriptionStore.getState();
  const Purchases = loadPurchases();
  if (!Purchases) return store.isPremium;
  try {
    store.setLoading(true);
    const info = await Purchases.restorePurchases();
    const premium = !!info?.entitlements?.active?.[ENTITLEMENT_ID];
    store.setPremium(premium);
    return premium;
  } catch {
    return false;
  } finally {
    store.setLoading(false);
  }
}
