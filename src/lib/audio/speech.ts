import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

/** Strip IAST diacritics so a default voice can pronounce the romanized fallback. */
export function romanizeForTTS(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

let hindiVoice: string | undefined;
let voicesLoaded = false;

/** Find a Hindi TTS voice on the device (call once at startup). */
export async function loadVoices() {
  if (voicesLoaded) return;
  voicesLoaded = true;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const hi = voices.find((v) => v.language?.toLowerCase().startsWith('hi'));
    hindiVoice = hi?.identifier;
  } catch {
    /* ignore */
  }
}

export interface SpeakOptions {
  rate?: number;
  onDone?: () => void;
  onError?: () => void;
}

/**
 * Speak a lyric line as clearly as the device allows. Prefers the Devanagari
 * read by a Hindi voice (`hi-IN`) — far more intelligible than an English voice
 * reading romanized Sanskrit — and falls back to the romanized transliteration
 * when no Hindi voice is available (e.g. some browsers). This is still robotic;
 * real recitation needs commissioned audio set on `Track.audio`.
 */
export function speakLine(line: { devanagari?: string; transliteration: string }, opts: SpeakOptions = {}) {
  const useDevanagari = !!line.devanagari && (!!hindiVoice || Platform.OS !== 'web');
  const common = { rate: opts.rate ?? 0.85, onDone: opts.onDone, onError: opts.onError };
  if (useDevanagari) {
    Speech.speak(line.devanagari as string, { language: 'hi-IN', voice: hindiVoice, ...common });
  } else {
    Speech.speak(romanizeForTTS(line.transliteration), common);
  }
}

export function stopSpeaking() {
  Speech.stop();
}
