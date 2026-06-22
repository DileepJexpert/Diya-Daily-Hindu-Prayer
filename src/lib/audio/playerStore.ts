/**
 * Playback store.
 *
 * Drives both real audio (when a track has a licensed source) and the
 * follow-along synced-lyric experience for seed tracks that ship without audio.
 * Position is advanced by `PlayerProvider`'s clock; when a real `expo-audio`
 * source is wired, swap the clock for the player's reported `currentTime`.
 *
 * Supports repeat (off/all/one), a sleep timer, and a `loopRange` used by Learn
 * mode to repeat a single lyric line.
 */
import { create } from 'zustand';
import { Catalog } from '../content/catalog';
import { useAppStore } from '../state/store';
import { audioLoadAndPlay } from './audioEngine';

export const RATE_STEPS = [0.5, 0.75, 1, 1.25] as const;
export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  trackId: string | null;
  isPlaying: boolean;
  position: number; // seconds
  duration: number; // seconds
  rate: number;
  repeat: RepeatMode;
  queue: string[];
  loopRange: { start: number; end: number } | null;
  sleepTimerEndsAt: number | null; // epoch ms
  completedThisSession: boolean;

  load: (trackId: string, queue?: string[]) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  cycleRate: () => void;
  cycleRepeat: () => void;
  setLoopRange: (range: { start: number; end: number } | null) => void;
  setSleepTimer: (minutes: number) => void;
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
  repeat: 'off',
  queue: [],
  loopRange: null,
  sleepTimerEndsAt: null,
  completedThisSession: false,

  load: (trackId, queue) => {
    const track = Catalog.track(trackId);
    if (!track) return;
    useAppStore.getState().addRecentlyPlayed(trackId);
    const isAudio = audioLoadAndPlay(track); // real audio plays on the global engine
    set({
      trackId,
      duration: track.duration,
      position: 0,
      isPlaying: !isAudio, // audio is driven by the engine; the clock stays idle
      loopRange: null,
      completedThisSession: false,
      queue: queue && queue.length ? queue : [trackId],
    });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  seek: (seconds) => set((s) => ({ position: Math.max(0, Math.min(seconds, s.duration)) })),
  cycleRate: () =>
    set((s) => {
      const i = RATE_STEPS.indexOf(s.rate as (typeof RATE_STEPS)[number]);
      return { rate: RATE_STEPS[(i + 1) % RATE_STEPS.length] };
    }),
  cycleRepeat: () =>
    set((s) => ({ repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off' })),
  setLoopRange: (loopRange) => set({ loopRange }),
  setSleepTimer: (minutes) =>
    set({ sleepTimerEndsAt: minutes > 0 ? Date.now() + minutes * 60000 : null }),

  tick: (dt) => {
    const s = get();
    if (!s.isPlaying || !s.trackId) return;

    // Sleep timer
    if (s.sleepTimerEndsAt && Date.now() >= s.sleepTimerEndsAt) {
      set({ isPlaying: false, sleepTimerEndsAt: null });
      return;
    }

    let position = s.position + dt;

    // Learn-mode single-line loop
    if (s.loopRange) {
      if (position >= s.loopRange.end) position = s.loopRange.start;
      set({ position });
      return;
    }

    if (position >= s.duration) {
      if (!s.completedThisSession) useAppStore.getState().recordPractice();
      if (s.repeat === 'one') {
        set({ position: 0, completedThisSession: true });
        return;
      }
      const idx = s.queue.indexOf(s.trackId);
      let nextId = idx >= 0 && idx < s.queue.length - 1 ? s.queue[idx + 1] : null;
      if (!nextId && s.repeat === 'all' && s.queue.length) nextId = s.queue[0];
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
    const nextId = idx >= 0 && idx < s.queue.length - 1 ? s.queue[idx + 1] : s.repeat === 'all' ? s.queue[0] : null;
    if (nextId) get().load(nextId, s.queue);
  },
  prev: () => {
    const s = get();
    if (s.position > 3) return set({ position: 0 });
    const idx = s.trackId ? s.queue.indexOf(s.trackId) : -1;
    const prevId = idx > 0 ? s.queue[idx - 1] : null;
    if (prevId) get().load(prevId, s.queue);
  },
  stop: () => set({ trackId: null, isPlaying: false, position: 0, duration: 0, loopRange: null }),
}));
