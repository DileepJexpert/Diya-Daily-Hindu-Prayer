/**
 * Offline downloads. Saves a track's remote audio to local storage so it plays
 * with no internet. Persisted so downloads survive restarts. Bundled audio is
 * already local, so only remote tracks are downloadable.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import type { Track } from '../content/types';

const DIR = `${FileSystem.documentDirectory ?? ''}diya-audio/`;

interface DownloadsState {
  downloads: Record<string, string>; // trackId -> local file uri
  downloading: Record<string, boolean>;
  download: (track: Track) => Promise<void>;
  remove: (trackId: string) => Promise<void>;
}

export const useDownloadsStore = create<DownloadsState>()(
  persist(
    (set, get) => ({
      downloads: {},
      downloading: {},

      download: async (track) => {
        if (!track.audio || track.audio.type !== 'remote') return;
        if (get().downloads[track.id] || get().downloading[track.id]) return;
        set((s) => ({ downloading: { ...s.downloading, [track.id]: true } }));
        try {
          await FileSystem.makeDirectoryAsync(DIR, { intermediates: true }).catch(() => {});
          const res = await FileSystem.downloadAsync(track.audio.uri, `${DIR}${track.id}.mp3`);
          if (res?.uri) set((s) => ({ downloads: { ...s.downloads, [track.id]: res.uri } }));
        } catch {
          // network/storage error — stays "not downloaded"
        } finally {
          set((s) => ({ downloading: { ...s.downloading, [track.id]: false } }));
        }
      },

      remove: async (trackId) => {
        const uri = get().downloads[trackId];
        if (uri) await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
        set((s) => {
          const downloads = { ...s.downloads };
          delete downloads[trackId];
          return { downloads };
        });
      },
    }),
    {
      name: 'diya-downloads-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ downloads: s.downloads }),
    },
  ),
);
