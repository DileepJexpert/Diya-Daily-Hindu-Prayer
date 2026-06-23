/**
 * Content source.
 *
 * The app ships a full bundled catalog (works offline, instant). If
 * EXPO_PUBLIC_CONTENT_URL is set, at startup we try to fetch an updated catalog
 * from that CMS/CDN and use it instead — so editors and scholars can correct and
 * add prayers WITHOUT shipping an app update. Any failure (offline, bad payload,
 * timeout) silently falls back to the bundled content.
 */
import { DEITIES } from './seed/deities';
import { TRACKS as CORE_TRACKS } from './seed/tracks';
import { EXTRA_TRACKS } from './seed/tracksExtra';
import { BHAGAVAD_GITA } from './seed/gita';
import { FESTIVALS } from './seed/festivals';
import { STORIES } from './seed/stories';
import { JOURNEYS } from './seed/journeys';
import { CHALLENGES } from './seed/challenges';
import { STORY_QUIZZES } from './seed/quizzes';
import type { Challenge, Deity, Festival, Journey, QuizQuestion, Scripture, Story, Track } from './types';

export interface ContentBundle {
  deities: Deity[];
  tracks: Track[];
  scriptures: Scripture[];
  festivals: Festival[];
  stories: Story[];
  journeys: Journey[];
  challenges: Challenge[];
  quizzes: Record<string, QuizQuestion[]>;
}

export const BUNDLED: ContentBundle = {
  deities: DEITIES,
  tracks: [...CORE_TRACKS, ...EXTRA_TRACKS],
  scriptures: [BHAGAVAD_GITA],
  festivals: FESTIVALS,
  stories: STORIES,
  journeys: JOURNEYS,
  challenges: CHALLENGES,
  quizzes: STORY_QUIZZES,
};

// Quick test slot: set EXPO_PUBLIC_TEST_AUDIO_URL to hear your own recording
// (a Suno export, a CC recitation, etc.) on the Gayatri Mantra — synced words.
const TEST_AUDIO_URL = process.env.EXPO_PUBLIC_TEST_AUDIO_URL;
if (TEST_AUDIO_URL) {
  const t = BUNDLED.tracks.find((x) => x.id === 'gayatri-mantra');
  if (t) t.audio = { type: 'remote', uri: TEST_AUDIO_URL };
}

// `base` is the published catalog (the bundled seed, or the remote catalog if it
// loaded at startup). `studio` holds tracks published locally from the in-app
// Creator Studio (admin screen) — layered on top so a creator sees their new
// bhajan immediately, before any backend sync exists.
let base: ContentBundle = BUNDLED;
let studio: Track[] = [];

function compose(): ContentBundle {
  if (studio.length === 0) return base;
  // Studio tracks first so the newest creation surfaces at the top of lists.
  return { ...base, tracks: [...studio, ...base.tracks] };
}

let active: ContentBundle = compose();

/**
 * Current content (remote if it loaded, otherwise bundled), with any locally
 * published Studio tracks layered on top. Synchronous.
 */
export const getContent = (): ContentBundle => active;

/**
 * Replace the locally published Studio tracks layered over the catalog. Called
 * by the admin Studio store when it publishes a track and after it rehydrates
 * from storage. Kept here (not in the store) so getContent stays the one read
 * path and the merge is O(1) on the hot path.
 */
export function setStudioTracks(tracks: Track[]): void {
  studio = tracks;
  active = compose();
}

const REMOTE_URL = process.env.EXPO_PUBLIC_CONTENT_URL ?? '';
const TIMEOUT_MS = 5000;

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('content-timeout')), ms));
}

/**
 * Called once at startup (before the app renders content). Resolves quickly when
 * no remote URL is configured.
 */
export async function hydrateContent(): Promise<void> {
  if (!REMOTE_URL) return;
  try {
    const res = (await Promise.race([fetch(REMOTE_URL), timeout(TIMEOUT_MS)])) as Response;
    if (!res.ok) return;
    const data = (await res.json()) as Partial<ContentBundle>;
    // Any section the server provides overrides the bundle; the rest stays local.
    base = {
      deities: data.deities ?? BUNDLED.deities,
      tracks: data.tracks ?? BUNDLED.tracks,
      scriptures: data.scriptures ?? BUNDLED.scriptures,
      festivals: data.festivals ?? BUNDLED.festivals,
      stories: data.stories ?? BUNDLED.stories,
      journeys: data.journeys ?? BUNDLED.journeys,
      challenges: data.challenges ?? BUNDLED.challenges,
      quizzes: data.quizzes ?? BUNDLED.quizzes,
    };
    active = compose();
  } catch {
    // offline / slow / malformed → keep bundled content
  }
}
