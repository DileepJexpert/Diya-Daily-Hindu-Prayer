/**
 * Core domain model for Diya.
 *
 * Everything devotional is content: deities, audio tracks (aarti / mantra /
 * chalisa / bhajan / meditation), scriptures and their verses, and the festival
 * calendar. Content is authored as typed data so it can be bundled offline today
 * and served from a CMS/CDN later without touching screens.
 */

export type Tradition =
  | 'sanatana'
  | 'vaishnava'
  | 'shaiva'
  | 'shakta'
  | 'smarta'
  | 'ganapatya';

export type Language = 'sa' | 'hi' | 'en' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn';

export type TrackKind =
  | 'aarti'
  | 'mantra'
  | 'chalisa'
  | 'bhajan'
  | 'stotra'
  | 'meditation'
  | 'katha';

export type DeityId = string;

export interface Deity {
  id: DeityId;
  name: string; // English / common
  devanagari: string;
  epithet: string; // e.g. "Remover of Obstacles"
  tradition: Tradition;
  description: string;
  /** Days of week (0=Sun) especially associated with this deity. */
  auspiciousDays: number[];
  /** Accent color used for this deity's artwork gradients. */
  colors: [string, string];
  /** Emoji / glyph fallback until commissioned artwork ships. */
  glyph: string;
  mantraSeed?: string; // beeja / short mantra
}

/**
 * A single line of devotional text, time-synced for the karaoke-style player.
 * `t` is the start time in seconds; the player highlights the active line and,
 * when word timings exist, the active word.
 */
export interface LyricLine {
  t: number; // start time (s)
  end?: number; // optional explicit end (s)
  devanagari?: string;
  transliteration: string; // IAST / phonetic Roman
  translation: string; // English meaning
  /** Optional per-word start offsets (s, relative to line start) for highlight. */
  words?: { text: string; t: number }[];
  /** Section marker, e.g. "Doha", "Chaupai 1", "Refrain". */
  section?: string;
}

export interface Track {
  id: string;
  title: string;
  devanagari?: string;
  kind: TrackKind;
  deityId: DeityId;
  language: Language;
  /** Reciter / artist credit. */
  artist: string;
  /** Total duration in seconds (of the bundled/remote audio). */
  duration: number;
  /**
   * Audio source. `null` means audio has not been licensed/commissioned yet —
   * the player falls back to a silent metronome-paced scroll so the synced
   * lyric experience is still demonstrable. Replace with a CDN URL or bundled
   * require() in production.
   */
  audio: AudioSource | null;
  artwork?: string;
  lyrics: LyricLine[];
  /** Free preview length in seconds for non-subscribers; full track gated. */
  previewSeconds?: number;
  isFree?: boolean;
  tags?: string[];
  attribution?: string; // source of the text / translation
}

export type AudioSource =
  | { type: 'remote'; uri: string }
  | { type: 'bundled'; module: number };

export interface Verse {
  ref: string; // e.g. "2.47"
  devanagari: string;
  transliteration: string;
  translation: string;
  commentary?: string;
}

export interface ScriptureChapter {
  number: number;
  title: string;
  devanagari?: string;
  summary: string;
  verses: Verse[];
}

export interface Scripture {
  id: string;
  title: string;
  devanagari?: string;
  subtitle: string;
  description: string;
  attribution: string;
  chapters: ScriptureChapter[];
}

export type FestivalKind = 'major' | 'vrat' | 'jayanti' | 'regional';

export interface Festival {
  id: string;
  name: string;
  devanagari?: string;
  kind: FestivalKind;
  deityId?: DeityId;
  description: string;
  /**
   * Resolver for the festival's Gregorian date in a given year. Many Hindu
   * festivals are lunisolar; the panchang engine resolves these from tithi.
   */
  rule: FestivalRule;
  significance?: string;
  observances?: string[];
}

export type FestivalRule =
  | { type: 'tithi'; month: number; paksha: 'shukla' | 'krishna'; tithi: number } // lunar
  | { type: 'gregorian'; month: number; day: number }
  | { type: 'nakshatra'; month: number; nakshatra: number }
  | { type: 'solar'; event: 'makara_sankranti' };

/** A track plus the reason it appears in today's plan. */
export interface DailyItem {
  trackId: string;
  reason: string;
}

export interface DailyPlan {
  dateISO: string;
  greeting: string;
  deityOfDay: DeityId;
  mantraTrackId: string;
  aartiTrackId: string;
  meditationTrackId?: string;
  verse: { scriptureId: string; chapter: number; ref: string };
  items: DailyItem[];
}
