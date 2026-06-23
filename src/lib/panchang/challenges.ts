/**
 * Live challenge dating. Anchors each festival challenge to the festival
 * calendar (resolved per timezone) and computes whether it is upcoming, active
 * or past today — plus the current day and the countdown. This is what turns a
 * static journey into a dated, countdown-driven challenge.
 */
import type { Challenge } from '../content/types';
import { Catalog } from '../content/catalog';
import { DEFAULT_LOCATION, type GeoLocation } from './engine';
import { resolveFestivalInYear } from './festivals';

const DAY = 86400000;

export type ChallengeStatus = 'upcoming' | 'active' | 'past';

export interface ChallengeWindow {
  challenge: Challenge;
  startDate: Date;
  endDate: Date;
  status: ChallengeStatus;
  /** 0-based current day when active, else -1. */
  dayIndex: number;
  /** Whole days until the challenge starts (0 once it has begun). */
  daysUntilStart: number;
  /** Whether the underlying festival date is an estimate (lunisolar). */
  estimated: boolean;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * Resolve a challenge's window relative to `from`. Scans the previous, current
 * and next year and picks the soonest occurrence whose window has not yet ended
 * — so an in-progress challenge wins, otherwise the next upcoming one.
 */
export function resolveChallenge(
  ch: Challenge,
  from: Date = new Date(),
  loc: GeoLocation = DEFAULT_LOCATION,
): ChallengeWindow | null {
  const len = ch.days.length;
  const today = startOfDay(from);
  let chosen: { start: Date; end: Date; estimated: boolean } | null = null;

  for (const year of [from.getFullYear() - 1, from.getFullYear(), from.getFullYear() + 1]) {
    const r = resolveFestivalInYear(ch.festivalId, year, loc);
    if (!r) continue;
    const fday = startOfDay(r.date);
    const start = new Date(fday.getTime() - ch.festivalDayIndex * DAY);
    const end = new Date(start.getTime() + (len - 1) * DAY);
    if (end.getTime() < today.getTime()) continue; // window already finished
    if (!chosen || start.getTime() < chosen.start.getTime()) chosen = { start, end, estimated: r.estimated };
  }
  if (!chosen) return null;

  const { start, end, estimated } = chosen;
  let status: ChallengeStatus;
  let dayIndex = -1;
  let daysUntilStart = 0;
  if (today.getTime() < start.getTime()) {
    status = 'upcoming';
    daysUntilStart = Math.round((start.getTime() - today.getTime()) / DAY);
  } else if (today.getTime() <= end.getTime()) {
    status = 'active';
    dayIndex = Math.round((today.getTime() - start.getTime()) / DAY);
  } else {
    status = 'past';
  }
  return { challenge: ch, startDate: start, endDate: end, status, dayIndex, daysUntilStart, estimated };
}

/** Every challenge with a resolvable window, soonest first. */
export function allChallengeWindows(
  from: Date = new Date(),
  loc: GeoLocation = DEFAULT_LOCATION,
): ChallengeWindow[] {
  return Catalog.challenges()
    .map((c) => resolveChallenge(c, from, loc))
    .filter((w): w is ChallengeWindow => !!w)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

/** Active now, or upcoming within `leadDays` — what the Today screen surfaces. */
export function liveChallenges(
  from: Date = new Date(),
  loc: GeoLocation = DEFAULT_LOCATION,
  leadDays = 30,
): ChallengeWindow[] {
  return allChallengeWindows(from, loc).filter(
    (w) => w.status === 'active' || (w.status === 'upcoming' && w.daysUntilStart <= leadDays),
  );
}
