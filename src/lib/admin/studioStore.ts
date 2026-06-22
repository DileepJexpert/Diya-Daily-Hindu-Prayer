/**
 * Creator Studio — the in-app admin/creator store.
 *
 * Lets you publish your OWN devotional tracks (e.g. a bhajan generated in Suno,
 * or an original recording you have the rights to) straight from the app. For
 * now this is a LOCAL mock: published tracks persist on-device and are layered
 * over the catalog via setStudioTracks(), so they show up across the app
 * immediately. Swap to a real backend in lib/admin/backend.ts to reach every
 * user — the store already calls publishCatalog().
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
import { publishCatalog } from './backend';

interface StudioState {
  /** Locally published studio tracks, newest first. */
  tracks: Track[];
  /** Admin passcode gate — session only (not persisted). */
  unlocked: boolean;
  unlock: (passcode: string) => boolean;
  lock: () => void;
  publish: (track: Track) => Promise<void>;
  unpublish: (id: string) => void;
  clear: () => void;
}

// Mock gate. In production, replace with real auth (Supabase/Firebase login).
const PASSCODE = process.env.EXPO_PUBLIC_STUDIO_PASSCODE ?? '1008';

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      tracks: [],
      unlocked: false,

      unlock: (passcode) => {
        const ok = passcode.trim() === PASSCODE;
        if (ok) set({ unlocked: true });
        return ok;
      },
      lock: () => set({ unlocked: false }),

      publish: async (track) => {
        const tracks = [track, ...get().tracks.filter((t) => t.id !== track.id)];
        set({ tracks });
        setStudioTracks(tracks);
        // Best-effort push to the real backend so every user gets it. The mock
        // backend is a no-op — the overlay above is what makes it appear here.
        try {
          await publishCatalog(tracks);
        } catch {
          // backend offline / not wired — track stays published on this device
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
      // Persist only the tracks; the unlock gate resets every launch.
      partialize: (s) => ({ tracks: s.tracks }),
      onRehydrateStorage: () => (state) => {
        if (state?.tracks?.length) setStudioTracks(state.tracks);
      },
    },
  ),
);

/**
 * Apply persisted Studio tracks at startup (covers the case where rehydration
 * finishes before any screen subscribes). Call once from the root layout;
 * onRehydrateStorage handles the async-completion case.
 */
export function initStudio(): void {
  setStudioTracks(useStudioStore.getState().tracks);
}
