/**
 * Daily plan — deterministic from the date so "Today" is stable within a day and
 * rotates with the week. The deity of the day follows the traditional weekday
 * association (Monday→Shiva, Tuesday→Hanuman, etc.).
 */
import { Catalog } from './catalog';
import type { DailyPlan, DailyItem } from './types';

const WEEKDAY_DEITY: Record<number, string> = {
  0: 'surya', // Sunday
  1: 'shiva', // Monday
  2: 'hanuman', // Tuesday
  3: 'ganesha', // Wednesday
  4: 'vishnu', // Thursday
  5: 'lakshmi', // Friday
  6: 'hanuman', // Saturday
};

const GREETINGS = [
  'May your day begin in light',
  'Begin with a still mind',
  'A new day, a new offering',
  'Light your inner diya',
];

function hashDate(iso: string): number {
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getDailyPlan(date: Date = new Date()): DailyPlan {
  const dateISO = date.toISOString().slice(0, 10);
  const weekday = date.getDay();
  const deityId = WEEKDAY_DEITY[weekday] ?? 'ganesha';
  const hash = hashDate(dateISO);

  const deityTracks = Catalog.tracksByDeity(deityId);
  const mantras = Catalog.tracksByKind('mantra');
  const aartis = [...Catalog.tracksByKind('aarti'), ...Catalog.tracksByKind('chalisa')];
  const meditations = Catalog.tracksByKind('meditation');

  const pick = <T,>(arr: T[], salt: number): T | undefined =>
    arr.length ? arr[(hash + salt) % arr.length] : undefined;

  const mantraTrack =
    deityTracks.find((t) => t.kind === 'mantra') ?? pick(mantras, 1) ?? mantras[0];
  const aartiTrack =
    deityTracks.find((t) => t.kind === 'aarti' || t.kind === 'chalisa') ?? pick(aartis, 2) ?? aartis[0];
  const meditationTrack = pick(meditations, 3);

  const gita = Catalog.scripture('bhagavad-gita');
  const chapter = gita?.chapters[0];
  const verse = chapter?.verses[hash % (chapter?.verses.length || 1)];

  const items: DailyItem[] = [];
  if (mantraTrack) items.push({ trackId: mantraTrack.id, reason: 'Today’s mantra' });
  if (aartiTrack) items.push({ trackId: aartiTrack.id, reason: `For ${Catalog.deity(deityId)?.name}` });
  if (meditationTrack) items.push({ trackId: meditationTrack.id, reason: 'Sit in stillness' });

  return {
    dateISO,
    greeting: GREETINGS[hash % GREETINGS.length],
    deityOfDay: deityId,
    mantraTrackId: mantraTrack?.id ?? '',
    aartiTrackId: aartiTrack?.id ?? '',
    meditationTrackId: meditationTrack?.id,
    verse: {
      scriptureId: 'bhagavad-gita',
      chapter: chapter?.number ?? 2,
      ref: verse?.ref ?? '2.47',
    },
    items,
  };
}
