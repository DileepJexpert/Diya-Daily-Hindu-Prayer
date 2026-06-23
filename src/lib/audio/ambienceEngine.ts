/**
 * Ambience engine — a second, independent looping audio player for soft
 * background soundscapes (temple bells, river, om drone) under darshan and the
 * player. It's separate from the main audio engine so it mixes *underneath* the
 * recitation at low volume.
 *
 * A soundscape plays only if its `AMBIENCE` entry carries a `uri` (a looping
 * asset). Until those loops are added it stays silent — but the engine, the
 * picker UI and the mixing are all wired, so dropping a URL in `ambience.ts` is
 * the only step left to make it audible.
 */
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { AMBIENCE } from './ambience';

const AMBIENCE_VOLUME = 0.35; // sits softly under the recitation

let player: AudioPlayer | null = null;
let currentId: string | null = null;

function ensure(): AudioPlayer {
  if (!player) {
    player = createAudioPlayer(null, { updateInterval: 1000 });
    player.loop = true;
    player.volume = AMBIENCE_VOLUME;
  }
  return player;
}

/** Start (or switch) the ambience loop. 'none' or an asset-less id stops sound. */
export function setAmbience(id: string): void {
  if (id === currentId) return;
  currentId = id;
  const item = AMBIENCE.find((a) => a.id === id);
  if (!item?.uri) {
    try { player?.pause(); } catch {}
    return;
  }
  const p = ensure();
  try {
    p.replace({ uri: item.uri });
    p.loop = true;
    p.volume = AMBIENCE_VOLUME;
    p.play();
  } catch {}
}

export function stopAmbience(): void {
  currentId = null;
  try { player?.pause(); } catch {}
}
