import * as Speech from 'expo-speech';

/** Strip IAST diacritics so a default TTS voice can pronounce the line. */
export function romanizeForTTS(s: string): string {
  // Decompose, then drop combining diacritics (U+0300–U+036F): "bhūr" → "bhur".
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export interface SpeakOptions {
  rate?: number;
  language?: string;
  onDone?: () => void;
  onError?: () => void;
}

/**
 * On-device text-to-speech. Lets users *hear* a recitation today without any
 * bundled audio assets. For authentic devotional audio, set `Track.audio` to a
 * commissioned recording and play it via expo-audio instead.
 */
export function speak(text: string, opts: SpeakOptions = {}) {
  Speech.speak(romanizeForTTS(text), {
    rate: opts.rate ?? 0.9,
    language: opts.language,
    onDone: opts.onDone,
    onError: opts.onError,
  });
}

export function stopSpeaking() {
  Speech.stop();
}
