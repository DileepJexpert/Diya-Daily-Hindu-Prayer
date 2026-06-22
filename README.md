# 🪔 Diya — Daily Hindu Prayer

A calm, ad-free, **premium daily-sadhana app** for the Hindu diaspora. Diya
competes on *craft* — studio-grade recitations with synced, word-by-word
learn-the-words lyrics, an accurate timezone-aware panchang, attributed
scripture, an interactive home shrine and a daily habit loop — rather than on the
e-puja/transaction model of the funded incumbents. Built with Expo + React
Native so one codebase ships to iOS and Android.

> Strategy in one line: out-craft, don't out-fund. The diaspora pays ~10× Indian
> ARPU and is under-served on *experience*; that is the wedge.

## What's in the app

| Pillar | What it does | Status |
| --- | --- | --- |
| **Today** | name greeting, deity of the day, streak ring, daily practice queue, sankalpa, verse, next festival, quick tools | ✅ |
| **Synced-lyric player** | Devanagari + transliteration + translation, **word-by-word** highlight, auto-scroll, slow-down (0.5–1.25×), repeat, sleep timer, tap-to-seek, share | ✅ |
| **Learn mode** | step a chant line-by-line, each line loops until it sticks, reveal-on-demand, word highlight | ✅ |
| **Daily darshan** | interactive aarti — drag the diya around the deity, ring the bell, offer flowers; ambience seam | ✅ |
| **Journeys** | multi-day guided programs with per-day intention + practices + verse and progress tracking | ✅ |
| **Stories (katha)** | family-friendly sacred tales with comprehension **quizzes** and an all-ages/kids filter | ✅ |
| **Japa** | tap-to-count mala with haptics (27/54/108) | ✅ |
| **Sankalpa** | daily intention journal with history | ✅ |
| **Library** | global search across practices, deities & stories + category filters | ✅ |
| **Mandir** | deity browser → detail, set your ishta-devata | ✅ |
| **Panchang** | tithi/nakshatra/yoga/karana, sunrise/sunset, Rahu Kaal + festival calendar, offline for any timezone | ✅ |
| **Scripture** | Bhagavad Gita reader (Ch. 2, 9, 12, 15, 18) with shareable, attributed verses | ✅ |
| **Membership** | paywall, plans, gating, restore — RevenueCat seam with a dev mock | ✅ |
| **Retention** | streaks, practice-history heatmap, recently-played, favorites, daily reminders, light/dark | ✅ |
| **Onboarding** | personalized — name, ishta-devata, location, reminders | ✅ |

**Content footprint:** 13 deities · 18 recitations (synced lyrics) · 5 Gita
chapters · 6 journeys · 7 stories (+quizzes) · 10 festivals.

## Tech stack

- **Expo SDK 56** · React Native 0.85 · React 19 · TypeScript (strict)
- **expo-router** (typed, file-based) · **Reanimated** + **react-native-svg** (the animated diya, aarti circle)
- **zustand** + AsyncStorage (persisted state) · **astronomy-engine** (panchang)
- **RevenueCat** seam (lazy-loaded) · **expo-notifications** · **expo-audio** · **expo-haptics**

## Run it

```bash
npm install
npx expo start         # press i / a, or scan with Expo Go
```

Typecheck / bundle (both must stay green):

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
    player/[id]  learn/[id] # synced-lyric player + learn mode
    darshan  japa  sankalpa # interactive shrine, mala, intention journal
    journeys  journey/[id]  # guided programs
    stories  story/[id]     # katha + quizzes
    deity/[id]  scripture/  festival/[id]  festivals  paywall  onboarding
  components/
    ui/                     # design-system primitives (Text, Card, Button…)
    brand/                  # DiyaFlame, StreakRing, AartiCircle, PracticeHeatmap
    content/  player/       # TrackRow, DeityAvatar, JourneyCard, StoryQuiz, MiniPlayer, LyricsView
  lib/
    content/                # typed domain model, seed catalog, daily plan
    panchang/               # astronomical engine + festival resolver + locations
    audio/                  # playback store + clock + active-lyric + ambience seam
    subscription/           # entitlement seam (RevenueCat | mock)
    state/  notifications/  share.ts
  constants/theme.ts        # the Diya design system
```

Screens never import seed data directly — only `lib/content/catalog`, so the
source can become a remote CMS/CDN later without touching UI.

## Integration points (what only you can provide)

Wired as clean seams with working fallbacks — they need your accounts/assets, not
more code:

1. **Recitation audio** — every seed track has `audio: null` and plays in
   *follow-along* mode (synced lyrics still work). Set `Track.audio` to a
   licensed/commissioned recording (CDN uri or bundled `require`) — timings stay.
2. **Ambience loops** — the darshan ambience picker (`lib/audio/ambience.ts`) is
   a seam awaiting looping audio assets.
3. **RevenueCat** — `npx expo install react-native-purchases`, set
   `EXPO_PUBLIC_REVENUECAT_KEY`, build a dev client. `initSubscriptions()` then
   uses the real SDK automatically; until then a persisted mock grants premium.
4. **Panchang precision** — the offline engine is good to the day; for Drik-grade
   timings (and high-latitude cities) wire a vetted panchang API and keep this as
   the fallback.
5. **Remote content** — set `EXPO_PUBLIC_CONTENT_URL` to a CMS/CDN JSON of the
   catalog (`{ deities, tracks, scriptures, festivals, stories, journeys,
   quizzes }`); at startup the app loads it (5s timeout) and otherwise uses the
   bundled content. Lets editors/scholars update prayers without an app update.

## Try live content updates (no app rebuild)

The whole prayer catalog can come from a file/CMS instead of the app binary. To
see it on web:

```bash
npm run content:export      # writes public/catalog.json from the bundled seed
cp .env.example .env        # sets EXPO_PUBLIC_CONTENT_URL=/catalog.json
npx expo start --web
```

Now edit `public/catalog.json` — change a track title, fix a translation, add a
deity — and **reload the page**. The change appears with no code change and no
rebuild. In production you'd host that JSON on a CMS/CDN and point
`EXPO_PUBLIC_CONTENT_URL` at it (absolute URL for native). Unset it to go back to
the bundled content (which always works offline).

## Content & authenticity

Sacred texts here are traditional/public-domain; transliterations and
translations are plain-English renderings authored for clarity and **flagged for
review by recognised scholars before production**. Story retellings are
family-friendly paraphrases. Start narrow, attribute sources, and commission
original audio — authenticity is the moat.
