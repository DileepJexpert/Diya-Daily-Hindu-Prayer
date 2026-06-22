/**
 * Mounts the global playback clock. While a track is playing it advances the
 * player position (scaled by playback rate) ~10×/second, which drives the
 * synced-lyric highlight. When real audio is wired via expo-audio, replace the
 * interval body with the player's reported currentTime.
 */
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { usePlayerStore } from './playerStore';

const TICK_MS = 100;

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const last = useRef(Date.now());

  useEffect(() => {
    last.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dtSec = (now - last.current) / 1000;
      last.current = now;
      const { isPlaying, rate, tick } = usePlayerStore.getState();
      if (isPlaying) tick(dtSec * rate);
    }, TICK_MS);

    const sub = AppState.addEventListener('change', () => {
      last.current = Date.now(); // avoid a jump after backgrounding
    });

    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);

  return children as React.ReactElement;
}
