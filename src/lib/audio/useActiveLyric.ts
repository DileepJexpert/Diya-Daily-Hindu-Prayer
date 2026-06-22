import { useMemo } from 'react';
import type { LyricLine } from '../content/types';

export interface ActiveLyric {
  index: number; // active line index, -1 before the first line
  lineProgress: number; // 0..1 within the active line
}

/** Resolves the active lyric line (and progress within it) for a position. */
export function useActiveLyric(lyrics: LyricLine[], position: number, duration: number): ActiveLyric {
  return useMemo(() => {
    if (!lyrics.length) return { index: -1, lineProgress: 0 };
    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (position >= lyrics[i].t) index = i;
      else break;
    }
    if (index < 0) return { index: -1, lineProgress: 0 };
    const start = lyrics[index].t;
    const end = lyrics[index].end ?? lyrics[index + 1]?.t ?? duration;
    const span = Math.max(0.001, end - start);
    const lineProgress = Math.max(0, Math.min(1, (position - start) / span));
    return { index, lineProgress };
  }, [lyrics, position, duration]);
}
