/**
 * Creator Studio — the in-app admin/creator store.
 *
 * Lets you publish your OWN devotional tracks (e.g. a bhajan generated in Suno,
 * or an original recording you have the rights to) straight from the app.
 *
 * Two backends (EXPO_PUBLIC_STUDIO_BACKEND):
 *   • mock     — published tracks persist on-device and overlay the catalog via
 *                setStudioTracks(); a passcode gates the screen.
 *   • supabase — published tracks are stored on Supabase and fetched by EVERY
 *                user at startup (hydrateStudio); an email/password admin login
 *                gates writes. See lib/admin/supabase.ts + the setup guide.
 *
 * ⚠ Content integrity: only publish audio you created or have the right to use.
 * Re-uploading a commercial recording (e.g. a label-owned bhajan) is copyright
 * infringement, even when given away free.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Track } from '../content/types';
import { setStudioTracks } from '../content/source';
import { STUDIO_BACKEND, publishCatalog } from './backend';
import {
  fetchPublished,
  signIn as supabaseSignIn,
  supabaseConfigured,
  type StudioSession,
} from './supabase';

interface StudioState {
  /** Locally published / authored studio tracks, newest first. */
  tracks: Track[];
  /** Gate open? (passcode for mock, signed-in for supabase.) Session-only. */
  unlocked: boolean;
  /** Supabase admin session (JWT for writes). Session-only, supabase mode. */
  session: StudioSession | null;
  unlock: (passcode: string) => boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  lock: () => void;
  publish: (track: Track) => Promise<void>;
  unpublish: (id: string) => void;
  clear: () => void;
}

// Mock gate passcode. Ignored in supabase mode (real login is used instead).
const PASSCODE = process.env.EXPO_PUBLIC_STUDIO_PASSCODE ?? '1008';

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      tracks: [],
      unlocked: false,
      session: null,

      unlock: (passcode) => {
        const ok = passcode.trim() === PASSCODE;
        if (ok) set({ unlocked: true });
        return ok;
      },

      signIn: async (email, password) => {
        try {
          const session = await supabaseSignIn(email, password);
          set({ session, unlocked: true });
          return true;
        } catch {
          return false;
        }
      },

      lock: () => set({ unlocked: false, session: null }),

      publish: async (track) => {
        const tracks = [track, ...get().tracks.filter((t) => t.id !== track.id)];
        set({ tracks });
        setStudioTracks(tracks);
        // Best-effort push to the backend so every user gets it. Mock is a no-op;
        // supabase needs the signed-in token. Failure keeps it local.
        try {
          await publishCatalog(tracks, get().session?.token);
        } catch {
          // backend offline / not signed in — track stays on this device
        }
      },

      unpublish: (id) => {
        const tracks = get().tracks.filter((t) => t.id !== id);
        set({ tracks });
        setStudioTracks(tracks);
      },

      clear: () => {
        set({ tracks: [] });
        setStudioTracks([]);
      },
    }),
    {
      name: 'diya-studio-v1',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only the tracks; the gate + session reset every launch.
      partialize: (s) => ({ tracks: s.tracks }),
      onRehydrateStorage: () => (state) => {
        if (state?.tracks?.length) setStudioTracks(state.tracks);
      },
    },
  ),
);

const timeout = (ms: number) =>
  new Promise<never>((_, reject) => setTimeout(() => reject(new Error('studio-timeout')), ms));

/**
 * Apply persisted Studio tracks synchronously at startup (covers the case where
 * rehydration finished before any screen subscribed). Call once from the root
 * layout; onRehydrateStorage handles the async-completion case.
 */
export function initStudio(): void {
  setStudioTracks(useStudioStore.getState().tracks);
}

/**
 * Fetch the published Studio tracks so EVERY user (not just the admin device)
 * sees them. No-op unless the supabase backend is configured. Safe to call at
 * startup — it times out fast and falls back to whatever is already applied.
 */
export async function hydrateStudio(): Promise<void> {
  if (STUDIO_BACKEND !== 'supabase' || !supabaseConfigured()) return;
  try {
    const data = (await Promise.race([fetchPublished(), timeout(5000)])) as { tracks?: Track[] };
    if (Array.isArray(data?.tracks)) setStudioTracks(data.tracks);
  } catch {
    // offline / nothing published yet → keep the local overlay
  }
}
