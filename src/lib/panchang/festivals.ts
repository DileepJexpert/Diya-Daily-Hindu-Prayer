/**
 * Festival date resolution.
 *
 * Fixed-date festivals resolve exactly. Lunisolar (tithi-rule) festivals are
 * resolved by scanning the year for the matching tithi+paksha at sunrise and
 * selecting the occurrence nearest the festival's expected season (derived from
 * its lunar month). These are flagged `estimated` and should be confirmed
 * against a vetted panchang for production.
 */
import { FESTIVALS } from '../content/seed/festivals';
import type { Festival } from '../content/types';
import { GeoLocation, DEFAULT_LOCATION, sunRashiIndex, tithiAtSunrise } from './engine';

/** Lunar month (1=Chaitra) → approximate Gregorian month. */
const LUNAR_TO_GREGORIAN: Record<number, number> = {
  1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 1, 11: 2, 12: 3,
};

export interface ResolvedFestival {
  festival: Festival;
  date: Date;
  estimated: boolean;
  daysAway: number;
}

function targetTithiIndex(paksha: 'shukla' | 'krishna', tithi: number): number {
  // shukla 1..15 → 0..14 ; krishna 1..15 (15=amavasya) → 15..29
  return paksha === 'shukla' ? tithi - 1 : 15 + (tithi - 1);
}

function monthDistance(a: number, b: number): number {
  const d = Math.abs(a - b);
  return Math.min(d, 12 - d);
}

function resolveInYear(festival: Festival, year: number, loc: GeoLocation): { date: Date; estimated: boolean } | null {
  const rule = festival.rule;
  if (rule.type === 'gregorian') {
    return { date: new Date(year, rule.month - 1, rule.day, 8, 0, 0), estimated: false };
  }
  if (rule.type === 'solar' && rule.event === 'makara_sankranti') {
    // Sun enters Makara (sidereal Capricorn, index 9) ~ Jan 14–15.
    for (let day = 12; day <= 16; day++) {
      const d = new Date(year, 0, day, 12, 0, 0);
      if (sunRashiIndex(d) === 9) return { date: new Date(year, 0, day, 8, 0, 0), estimated: true };
    }
    return { date: new Date(year, 0, 14, 8, 0, 0), estimated: true };
  }
  if (rule.type === 'tithi') {
    const wantIdx = targetTithiIndex(rule.paksha, rule.tithi);
    const targetMonth = LUNAR_TO_GREGORIAN[rule.month] ?? 6;
    let best: { date: Date; dist: number } | null = null;
    const cursor = new Date(year, 0, 1, 8, 0, 0);
    for (let i = 0; i < 366; i++) {
      const d = new Date(cursor.getTime() + i * 86400000);
      if (d.getFullYear() !== year) break;
      const t = tithiAtSunrise(d, loc);
      if (t.index === wantIdx) {
        const dist = monthDistance(d.getMonth() + 1, targetMonth);
        if (!best || dist < best.dist) best = { date: d, dist };
      }
    }
    return best ? { date: best.date, estimated: true } : null;
  }
  return null;
}

export function upcomingFestivals(
  from: Date = new Date(),
  count = 8,
  loc: GeoLocation = DEFAULT_LOCATION,
): ResolvedFestival[] {
  const out: ResolvedFestival[] = [];
  const startOfDay = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (const festival of FESTIVALS) {
    for (const year of [from.getFullYear(), from.getFullYear() + 1]) {
      const r = resolveInYear(festival, year, loc);
      if (!r) continue;
      if (r.date >= startOfDay) {
        const daysAway = Math.round((r.date.getTime() - startOfDay.getTime()) / 86400000);
        out.push({ festival, date: r.date, estimated: r.estimated, daysAway });
        break; // nearest future occurrence only
      }
    }
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, count);
}

export function nextFestival(loc: GeoLocation = DEFAULT_LOCATION): ResolvedFestival | null {
  return upcomingFestivals(new Date(), 1, loc)[0] ?? null;
}
