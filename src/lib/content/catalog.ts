/**
 * Catalog — the read API over bundled content. Screens import from here, never
 * from the raw seed files, so the source can later become a remote CMS/CDN fetch
 * without changing callers.
 */
import { DEITIES, DEITY_BY_ID } from './seed/deities';
import { TRACKS } from './seed/tracks';
import { BHAGAVAD_GITA } from './seed/gita';
import { FESTIVALS } from './seed/festivals';
import type { Deity, Scripture, Track, TrackKind } from './types';

const TRACK_BY_ID: Record<string, Track> = Object.fromEntries(TRACKS.map((t) => [t.id, t]));
const SCRIPTURES: Scripture[] = [BHAGAVAD_GITA];

export const Catalog = {
  deities: (): Deity[] => DEITIES,
  deity: (id: string): Deity | undefined => DEITY_BY_ID[id],

  tracks: (): Track[] => TRACKS,
  track: (id: string): Track | undefined => TRACK_BY_ID[id],
  tracksByDeity: (deityId: string): Track[] => TRACKS.filter((t) => t.deityId === deityId),
  tracksByKind: (kind: TrackKind): Track[] => TRACKS.filter((t) => t.kind === kind),

  scriptures: (): Scripture[] => SCRIPTURES,
  scripture: (id: string): Scripture | undefined => SCRIPTURES.find((s) => s.id === id),

  festivals: () => FESTIVALS,
  festival: (id: string) => FESTIVALS.find((f) => f.id === id),

  search: (query: string): Track[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return TRACKS.filter((t) => {
      const hay = [t.title, t.devanagari, t.artist, ...(t.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  },
};

export const TRACK_KINDS: { kind: TrackKind; label: string; icon: string }[] = [
  { kind: 'aarti', label: 'Aarti', icon: 'flame' },
  { kind: 'chalisa', label: 'Chalisa', icon: 'book' },
  { kind: 'mantra', label: 'Mantra', icon: 'infinite' },
  { kind: 'bhajan', label: 'Bhajan', icon: 'musical-notes' },
  { kind: 'stotra', label: 'Stotra', icon: 'document-text' },
  { kind: 'meditation', label: 'Meditation', icon: 'leaf' },
  { kind: 'katha', label: 'Katha', icon: 'bookmarks' },
];
