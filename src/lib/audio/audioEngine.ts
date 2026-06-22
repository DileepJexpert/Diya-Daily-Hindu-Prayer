/**
 * Global audio engine — a single expo-audio player that lives for the whole app
 * session, so real-audio playback continues across screens and the mini-player
 * can control it from anywhere. (Text-to-speech tracks are still handled on the
 * player screen.)
 */
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import type { Track } from '../content/types';
import { useDownloadsStore } from './downloads';

let player: AudioPlayer | null = null;
let loadedTrackId: string | null = null;

/** Allow background + silent-mode playback and lock-screen controls. Call once. */
export async function configureAudioSession() {
  try {
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      shouldRouteThroughEarpiece: false,
      interruptionMode: 'doNotMix', // required for lock-screen controls
    });
  } catch {}
}

export function getAudioPlayer(): AudioPlayer {
  if (!player) player = createAudioPlayer(null, { updateInterval: 100 });
  return player;
}

function sourceFor(track: Track) {
  const local = useDownloadsStore.getState().downloads[track.id];
  if (local) return { uri: local }; // play the offline copy when available
  if (!track.audio) return null;
  return track.audio.type === 'remote' ? { uri: track.audio.uri } : track.audio.module;
}

/** Load + play a track's real audio. Returns false (no-op) for TTS tracks. */
export function audioLoadAndPlay(track: Track): boolean {
  const src = sourceFor(track);
  if (!src) return false;
  const p = getAudioPlayer();
  if (loadedTrackId !== track.id) {
    p.replace(src);
    loadedTrackId = track.id;
  }
  p.play();
  try {
    p.setActiveForLockScreen(true, { title: track.title, artist: track.artist, albumTitle: 'Diya' });
  } catch {}
  return true;
}

export function audioTogglePlay() {
  const p = getAudioPlayer();
  if (p.playing) p.pause();
  else p.play();
}
export function audioPlay() { getAudioPlayer().play(); }
export function audioPause() { getAudioPlayer().pause(); }
export function audioSeek(seconds: number) {
  // Guard against NaN/Infinity/negative: on web, setting an audio element's
  // currentTime to a non-finite value throws ("non-finite double value").
  if (!Number.isFinite(seconds) || seconds < 0) return;
  try {
    const result = getAudioPlayer().seekTo(seconds) as unknown;
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      (result as Promise<unknown>).catch(() => {});
    }
  } catch {}
}
export function audioSetRate(rate: number) {
  try { getAudioPlayer().setPlaybackRate(rate); } catch {}
}
