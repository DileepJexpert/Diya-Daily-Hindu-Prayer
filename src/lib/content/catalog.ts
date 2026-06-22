/**
 * Catalog — the read API over content. Reads from the active content bundle
 * (remote if it loaded at startup, else the bundled seed) so screens never care
 * where prayers come from. Lookups are computed on read; the catalog stays small.
 */
import { getContent } from './source';
import type { Deity, Journey, Scripture, Story, Track, TrackKind } from './types';

export const Catalog = {
  deities: (): Deity[] => getContent().deities,
  deity: (id: string): Deity | undefined => getContent().deities.find((d) => d.id === id),

  tracks: (): Track[] => getContent().tracks,
  track: (id: string): Track | undefined => getContent().tracks.find((t) => t.id === id),
  tracksById: (ids: string[]): Track[] =>
    ids.map((id) => getContent().tracks.find((t) => t.id === id)).filter((t): t is Track => !!t),
  tracksByDeity: (deityId: string): Track[] => getContent().tracks.filter((t) => t.deityId === deityId),
  tracksByKind: (kind: TrackKind): Track[] => getContent().tracks.filter((t) => t.kind === kind),

  scriptures: (): Scripture[] => getContent().scriptures,
  scripture: (id: string): Scripture | undefined => getContent().scriptures.find((s) => s.id === id),

  festivals: () => getContent().festivals,
  festival: (id: string) => getContent().festivals.find((f) => f.id === id),

  stories: (): Story[] => getContent().stories,
  story: (id: string): Story | undefined => getContent().stories.find((s) => s.id === id),
  storiesByDeity: (deityId: string): Story[] => getContent().stories.filter((s) => s.deityId === deityId),
  storyQuiz: (storyId: string) => getContent().quizzes[storyId] ?? [],

  journeys: (): Journey[] => getContent().journeys,
  journey: (id: string): Journey | undefined => getContent().journeys.find((j) => j.id === id),

  search: (query: string): Track[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getContent().tracks.filter((t) => {
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
