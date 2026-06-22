/**
 * Playback store.
 *
 * Drives both real audio (when a track has a licensed source) and the
 * follow-along synced-lyric experience for seed tracks that ship without audio.
 * Position is advanced by `PlayerProvider`'s clock; when a real `expo-audio`
 * source is wired, swap the clock for the player's reported `currentTime`.
 */
import { create } from 'zustand';
import { Catalog } from '../content/catalog';
import { useAppStore } from '../state/store';

export const RATE_STEPS = [0.5, 0.75, 1, 1.25] as const;

interface PlayerState {
  trackId: string | null;
  isPlaying: boolean;
  position: number; // seconds
  duration: number; // seconds
  rate: number;
  queue: string[];
  completedThisSession: boolean;

  load: (trackId: string, queue?: string[]) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  cycleRate: () => void;
  tick: (dt: number) => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  trackId: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  rate: 1,
  queue: [],
  completedThisSession: false,

  load: (trackId, queue) => {
    const track = Catalog.track(trackId);
    if (!track) return;
    set({
      trackId,
      duration: track.duration,
      position: 0,
      isPlaying: true,
      completedThisSession: false,
      queue: queue && queue.length ? queue : [trackId],
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  seek: (seconds) =>
    set((s) => ({ position: Math.max(0, Math.min(seconds, s.duration)) })),
  cycleRate: () =>
    set((s) => {
      const i = RATE_STEPS.indexOf(s.rate as (typeof RATE_STEPS)[number]);
      return { rate: RATE_STEPS[(i + 1) % RATE_STEPS.length] };
    }),

  tick: (dt) => {
    const s = get();
    if (!s.isPlaying || !s.trackId) return;
    const position = s.position + dt;
    if (position >= s.duration) {
      // Track finished — record practice and advance the queue.
      if (!s.completedThisSession) useAppStore.getState().recordPractice();
      const idx = s.queue.indexOf(s.trackId);
      const nextId = idx >= 0 && idx < s.queue.length - 1 ? s.queue[idx + 1] : null;
      if (nextId) {
        const track = Catalog.track(nextId);
        set({ trackId: nextId, position: 0, duration: track?.duration ?? 0, completedThisSession: false });
      } else {
        set({ position: s.duration, isPlaying: false, completedThisSession: true });
      }
      return;
    }
    set({ position });
  },

  next: () => {
    const s = get();
    const idx = s.trackId ? s.queue.indexOf(s.trackId) : -1;
    const nextId = idx >= 0 && idx < s.queue.length - 1 ? s.queue[idx + 1] : null;
    if (nextId) get().load(nextId, s.queue);
  },
  prev: () => {
    const s = get();
    if (s.position > 3) return set({ position: 0 });
    const idx = s.trackId ? s.queue.indexOf(s.trackId) : -1;
    const prevId = idx > 0 ? s.queue[idx - 1] : null;
    if (prevId) get().load(prevId, s.queue);
  },
  stop: () => set({ trackId: null, isPlaying: false, position: 0, duration: 0 }),
}));
