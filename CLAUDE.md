# Diya — notes for Claude

Premium daily Hindu prayer app for the diaspora. Expo + React Native + TS.
Competes on craft (audio + synced lyrics + panchang + clean UX), **not** on
e-puja/transactions.

## Commands
- `npx expo start` — run (Expo Go or dev client)
- `npx tsc --noEmit` — typecheck (must stay green)
- `npx expo export --platform ios` — bundle smoke test (must stay green)

## Conventions
- Routes live in `src/app` (expo-router, typed). Path alias `@/* → src/*`.
- **Never** hardcode colors/spacing — use tokens from `src/constants/theme.ts`
  via the `useColors()` hook and the `ui/` primitives (`Text`, `Card`, `Button`,
  `Screen`, `Pill`, `Icon`, `SectionHeader`, `Divider`).
- Screens read content only through `src/lib/content/catalog.ts` (never seed
  files directly) so the source can move to a remote CMS later.
- Global state = zustand stores in `src/lib/{state,audio,subscription}`.
  App/user + subscription stores persist to AsyncStorage.
- To play a track use `useOpenTrack()` — it handles paywall gating + queue.

## Key seams (don't rip out)
- `lib/subscription/entitlements.ts` — RevenueCat lazy-loaded, mock fallback.
- `lib/audio/PlayerProvider.tsx` — virtual clock drives synced lyrics until real
  audio is wired; swap for expo-audio `currentTime` when `Track.audio` is set.
- `lib/panchang/engine.ts` — offline astronomy; a paid API can replace it.
- `lib/audio/ambience.ts` — ambience soundscape seam (awaiting looping audio).
- `lib/admin/backend.ts` — Creator Studio (in-app admin, `src/app/studio/*`)
  upload/publish seam. Mock layers published tracks over the catalog on-device
  via `setStudioTracks`; swap for Supabase/Firebase to reach every user. Only
  publish audio you have the rights to (re-uploading label recordings = infringe).
- Player `loopRange` powers Learn mode (single-line loop); add word-level timings
  via `LyricLine.words` for karaoke highlight.

## Content integrity
Sacred text must be accurate. Seed translations are flagged for scholarly review.
When adding tracks/verses, keep Devanagari + transliteration + translation and an
`attribution`. Audio is `null` by default (follow-along mode).
