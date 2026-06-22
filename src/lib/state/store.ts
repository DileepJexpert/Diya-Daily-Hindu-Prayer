/**
 * App + user store. Persisted to device storage. Holds preferences (theme,
 * location, reminders), the practice streak, and favorites. Subscription state
 * lives in its own store.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_LOCATION, GeoLocation } from '../panchang/engine';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ReminderSettings {
  enabled: boolean;
  hour: number; // 0-23, local
  minute: number;
}

interface Streak {
  count: number;
  longest: number;
  lastPracticeISO: string | null;
}

interface AppState {
  onboarded: boolean;
  themeMode: ThemeMode;
  location: GeoLocation;
  reminders: ReminderSettings;
  streak: Streak;
  favorites: string[];
  completedCount: number;

  setOnboarded: (v: boolean) => void;
  setThemeMode: (m: ThemeMode) => void;
  setLocation: (l: GeoLocation) => void;
  setReminders: (r: Partial<ReminderSettings>) => void;
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  recordPractice: () => void;
  hydrated: boolean;
  setHydrated: () => void;
}

const dayKey = (d: Date = new Date()) => d.toISOString().slice(0, 10);
const daysBetween = (aISO: string, bISO: string) =>
  Math.round((Date.parse(bISO) - Date.parse(aISO)) / 86400000);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      themeMode: 'system',
      location: DEFAULT_LOCATION,
      reminders: { enabled: false, hour: 7, minute: 0 },
      streak: { count: 0, longest: 0, lastPracticeISO: null },
      favorites: [],
      completedCount: 0,
      hydrated: false,

      setOnboarded: (v) => set({ onboarded: v }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setLocation: (location) => set({ location }),
      setReminders: (r) => set((s) => ({ reminders: { ...s.reminders, ...r } })),

      toggleFavorite: (trackId) =>
        set((s) => ({
          favorites: s.favorites.includes(trackId)
            ? s.favorites.filter((id) => id !== trackId)
            : [trackId, ...s.favorites],
        })),
      isFavorite: (trackId) => get().favorites.includes(trackId),

      recordPractice: () =>
        set((s) => {
          const today = dayKey();
          if (s.streak.lastPracticeISO === today) {
            return { completedCount: s.completedCount + 1 };
          }
          let count = 1;
          if (s.streak.lastPracticeISO) {
            const diff = daysBetween(s.streak.lastPracticeISO, today);
            count = diff === 1 ? s.streak.count + 1 : 1;
          }
          return {
            streak: { count, longest: Math.max(count, s.streak.longest), lastPracticeISO: today },
            completedCount: s.completedCount + 1,
          };
        }),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'diya-app-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const isPracticedToday = (s: AppState) => s.streak.lastPracticeISO === dayKey();
