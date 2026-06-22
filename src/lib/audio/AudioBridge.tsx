import { useEffect } from 'react';
import { useAudioPlayerStatus } from 'expo-audio';
import { audioPlay, audioSeek, configureAudioSession, getAudioPlayer } from './audioEngine';
import { usePlayerStore } from './playerStore';
import { useAppStore } from '../state/store';

/**
 * Mounted once at the root. Watches the global audio player and, when a track
 * finishes, records a practice and honors repeat-one — regardless of which
 * screen the user is on.
 */
export function AudioBridge() {
  const status = useAudioPlayerStatus(getAudioPlayer());

  useEffect(() => {
    configureAudioSession(); // background + lock-screen playback
  }, []);

  useEffect(() => {
    if (!status.didJustFinish) return;
    useAppStore.getState().recordPractice();
    if (usePlayerStore.getState().repeat === 'one') {
      audioSeek(0);
      audioPlay();
    }
  }, [status.didJustFinish]);

  return null;
}
