/**
 * Global audio engine — a single expo-audio player that lives for the whole app
 * session, so real-audio playback continues across screens and the mini-player
 * can control it from anywhere. (Text-to-speech tracks are still handled on the
 * player screen.)
 */
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import type { Track } from '../content/types';

let player: AudioPlayer | null = null;
let loadedTrackId: string | null = null;

export function getAudioPlayer(): AudioPlayer {
  if (!player) player = createAudioPlayer(null, { updateInterval: 100 });
  return player;
}

function sourceFor(track: Track) {
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
  return true;
}

export function audioTogglePlay() {
  const p = getAudioPlayer();
  if (p.playing) p.pause();
  else p.play();
}
export function audioPlay() { getAudioPlayer().play(); }
export function audioPause() { getAudioPlayer().pause(); }
export function audioSeek(seconds: number) { getAudioPlayer().seekTo(seconds); }
export function audioSetRate(rate: number) {
  try { getAudioPlayer().setPlaybackRate(rate); } catch {}
}
