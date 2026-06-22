# 🪔 Diya — Daily Hindu Prayer

A calm, ad-free, **premium daily-sadhana app** for the Hindu diaspora. Diya
competes on *craft* — studio-grade recitations with synced learn-the-words
lyrics, an accurate timezone-aware panchang, attributed scripture and a daily
habit loop — rather than on the e-puja/transaction model of the funded
incumbents. Built with Expo + React Native so one codebase ships to iOS and
Android.

> Strategy in one line: out-craft, don't out-fund. The diaspora pays ~10× Indian
> ARPU and is under-served on *experience*; that is the wedge.

## What's in the app (all feature pillars implemented)

| Pillar | Screen | Status |
| --- | --- | --- |
| **Daily sadhana** | `Today` — deity of the day, streak ring, daily practice, verse, next festival | ✅ working |
| **Synced-lyric player** | `Player` — Devanagari + transliteration + translation, auto-scroll highlight, slow-down (0.5–1.25×), tap-to-seek | ✅ working |
| **Library** | search + category filters over aarti/mantra/chalisa/meditation | ✅ working |
| **Mandir** | deity browser → deity detail with practices & beeja | ✅ working |
| **Panchang** | tithi/nakshatra/yoga/karana, sunrise/sunset, Rahu Kaal, festivals — computed offline for any timezone | ✅ working |
| **Scripture** | Bhagavad Gita reader with attributed translations | ✅ working |
| **Membership** | paywall, plan selection, gating, restore — via a RevenueCat seam with a dev mock | ✅ working |
| **Habit loop** | streaks, daily reminders (local notifications), favorites, light/dark | ✅ working |
| **Onboarding** | 3-step intro + gate | ✅ working |

## Tech stack

- **Expo SDK 56** · React Native 0.85 · React 19 · TypeScript (strict)
- **expo-router** (typed, file-based) · **Reanimated** + **react-native-svg** (the animated diya)
- **zustand** + AsyncStorage (persisted state) · **astronomy-engine** (panchang)
- **RevenueCat** seam (lazy-loaded) · **expo-notifications** · **expo-audio**

## Run it

```bash
npm install
npx expo start         # press i / a, or scan with Expo Go
```

Typecheck / bundle:

```bash
npx tsc --noEmit
npx expo export --platform ios
```

## Architecture

```
src/
  app/                      # expo-router routes
    _layout.tsx             # providers, fonts, splash, onboarding gate
    (tabs)/                 # Today · Library · Mandir · Panchang · More
    player/[id].tsx         # synced-lyric player
    deity/[id].tsx  scripture/  paywall.tsx  onboarding.tsx
  components/
    ui/                     # design-system primitives (Text, Card, Button…)
    brand/                  # DiyaFlame, StreakRing
    content/  player/       # TrackRow, DeityAvatar, MiniPlayer, LyricsView
  lib/
    content/                # typed domain model, seed catalog, daily plan
    panchang/               # astronomical engine + festival resolver + locations
    audio/                  # playback store + clock + active-lyric resolver
    subscription/           # entitlement seam (RevenueCat | mock)
    state/  notifications/
  constants/theme.ts        # the Diya design system
```

Screens never import seed data directly — only `lib/content/catalog`, so the
source can become a remote CMS/CDN later without touching UI.

## Integration points (what only you can provide)

These are wired with clean seams + working fallbacks, because they need your
accounts/assets, not more code:

1. **Recitation audio** — every seed track has `audio: null` and plays in
   *follow-along* mode (the synced lyrics still work). Set `Track.audio` to a
   licensed/commissioned recording (CDN uri or bundled `require`) — timings stay.
2. **RevenueCat** — `npx expo install react-native-purchases`, set
   `EXPO_PUBLIC_REVENUECAT_KEY`, build a dev client. `initSubscriptions()` then
   uses the real SDK automatically; until then a persisted mock grants premium.
3. **Panchang precision** — the offline engine is good to the day; for
   Drik-grade timings (and high-latitude cities) wire a vetted panchang API as
   the source and keep this as the fallback.

## Content & authenticity

Sacred texts here are traditional/public-domain; transliterations and
translations are plain-English renderings authored for clarity and **flagged for
review by recognised scholars before production**. Start narrow, attribute
sources, and commission original audio — authenticity is the moat.
