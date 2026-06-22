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
import { STORY_QUIZZES } from './seed/quizzes';
import type { Deity, Festival, Journey, QuizQuestion, Scripture, Story, Track } from './types';

export interface ContentBundle {
  deities: Deity[];
  tracks: Track[];
  scriptures: Scripture[];
  festivals: Festival[];
  stories: Story[];
  journeys: Journey[];
  quizzes: Record<string, QuizQuestion[]>;
}

export const BUNDLED: ContentBundle = {
  deities: DEITIES,
  tracks: [...CORE_TRACKS, ...EXTRA_TRACKS],
  scriptures: [BHAGAVAD_GITA],
  festivals: FESTIVALS,
  stories: STORIES,
  journeys: JOURNEYS,
  quizzes: STORY_QUIZZES,
};

// Quick test slot: set EXPO_PUBLIC_TEST_AUDIO_URL to hear your own recording
// (a Suno export, a CC recitation, etc.) on the Gayatri Mantra — synced words.
const TEST_AUDIO_URL = process.env.EXPO_PUBLIC_TEST_AUDIO_URL;
if (TEST_AUDIO_URL) {
  const t = BUNDLED.tracks.find((x) => x.id === 'gayatri-mantra');
  if (t) t.audio = { type: 'remote', uri: TEST_AUDIO_URL };
}

let active: ContentBundle = BUNDLED;

/** Current content (remote if it loaded, otherwise bundled). Synchronous. */
export const getContent = (): ContentBundle => active;

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
    active = {
      deities: data.deities ?? BUNDLED.deities,
      tracks: data.tracks ?? BUNDLED.tracks,
      scriptures: data.scriptures ?? BUNDLED.scriptures,
      festivals: data.festivals ?? BUNDLED.festivals,
      stories: data.stories ?? BUNDLED.stories,
      journeys: data.journeys ?? BUNDLED.journeys,
      quizzes: data.quizzes ?? BUNDLED.quizzes,
    };
  } catch {
    // offline / slow / malformed → keep bundled content
  }
}
