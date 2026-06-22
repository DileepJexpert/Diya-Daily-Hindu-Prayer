/**
 * Panchang engine.
 *
 * Computes the five limbs (tithi, vaara, nakshatra, yoga, karana) plus
 * sunrise/sunset and Rahu Kaal from real sun/moon positions via
 * `astronomy-engine` — fully offline. Sidereal quantities use an approximate
 * Lahiri ayanamsa. Tithi/yoga/karana are evaluated at local sunrise, the
 * traditional reference instant.
 *
 * Accuracy note: this is good to the day for most locations. For Drik-grade
 * production timings (and for high-latitude diaspora cities where the sun may
 * not rise/set), wire a vetted panchang API as the source and keep this as the
 * offline fallback.
 */
import * as Astronomy from 'astronomy-engine';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  timeZone: string; // IANA, e.g. "America/New_York"
  label: string;
}

export const DEFAULT_LOCATION: GeoLocation = {
  latitude: 28.6139,
  longitude: 77.209,
  timeZone: 'Asia/Kolkata',
  label: 'New Delhi, India',
};

export interface PanchangAngas {
  name: string;
  index: number; // 1-based
}

export interface Panchang {
  dateISO: string;
  location: GeoLocation;
  vaara: string;
  sunrise: Date | null;
  sunset: Date | null;
  tithi: PanchangAngas & { paksha: 'Shukla' | 'Krishna' };
  nakshatra: PanchangAngas;
  yoga: PanchangAngas;
  karana: PanchangAngas;
  moonRashi: string;
  sunRashi: string;
  rahuKaal: { start: Date; end: Date } | null;
}

const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
  'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
  'Trayodashi', 'Chaturdashi', 'Purnima',
];

const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
  'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva',
  'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana',
  'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
  'Brahma', 'Indra', 'Vaidhriti',
];

const KARANA_MOVABLE = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'];

const RASHI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];

const VAARA_NAMES = ['Ravivara', 'Somavara', 'Mangalavara', 'Budhavara', 'Guruvara', 'Shukravara', 'Shanivara'];

/** Rahu Kaal segment (0-indexed of 8 daytime parts) per weekday, Sun..Sat. */
const RAHU_SEGMENT = [7, 1, 6, 4, 5, 3, 2];

const norm360 = (d: number) => ((d % 360) + 360) % 360;

/** Approximate Lahiri ayanamsa in degrees for a given date. */
function ayanamsa(date: Date): number {
  const year = date.getUTCFullYear() + (date.getUTCMonth() + 1) / 12;
  return 23.85 + 0.013972 * (year - 2000);
}

function sunLongitude(time: Astronomy.AstroTime): number {
  const ecl = Astronomy.SunPosition(time);
  return norm360(ecl.elon);
}

function moonLongitude(time: Astronomy.AstroTime): number {
  const ecl = Astronomy.EclipticGeoMoon(time);
  return norm360(ecl.lon);
}

function riseSet(
  body: Astronomy.Body,
  observer: Astronomy.Observer,
  date: Date,
  direction: 1 | -1,
): Date | null {
  try {
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
    const t = Astronomy.SearchRiseSet(body, observer, direction, Astronomy.MakeTime(start), 1);
    return t ? t.date : null;
  } catch {
    return null;
  }
}

export function computePanchang(date: Date, location: GeoLocation): Panchang {
  const observer = new Astronomy.Observer(location.latitude, location.longitude, 0);
  const sunrise = riseSet(Astronomy.Body.Sun, observer, date, 1);
  const sunset = riseSet(Astronomy.Body.Sun, observer, date, -1);

  // Evaluate angas at sunrise (fallback to local noon UTC if no sunrise).
  const refDate = sunrise ?? new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 6, 0, 0));
  const time = Astronomy.MakeTime(refDate);

  const sunTrop = sunLongitude(time);
  const moonTrop = moonLongitude(time);
  const aya = ayanamsa(refDate);
  const sunSid = norm360(sunTrop - aya);
  const moonSid = norm360(moonTrop - aya);

  // Tithi from the elongation (ayanamsa-independent).
  const elong = norm360(moonTrop - sunTrop);
  const tithiIdx = Math.floor(elong / 12); // 0..29
  const paksha: 'Shukla' | 'Krishna' = tithiIdx < 15 ? 'Shukla' : 'Krishna';
  const tithiName = tithiIdx < 15
    ? TITHI_NAMES[tithiIdx]
    : tithiIdx === 29 ? 'Amavasya' : TITHI_NAMES[tithiIdx - 15];

  // Nakshatra from sidereal moon (27 × 13°20').
  const nakIdx = Math.floor(moonSid / (360 / 27));

  // Yoga from sidereal sum.
  const yogaIdx = Math.floor(norm360(sunSid + moonSid) / (360 / 27));

  // Karana from half-tithi.
  const k = Math.floor(elong / 6); // 0..59
  let karanaName: string;
  let karanaNum: number;
  if (k === 0) { karanaName = 'Kimstughna'; karanaNum = 1; }
  else if (k <= 56) { karanaName = KARANA_MOVABLE[(k - 1) % 7]; karanaNum = ((k - 1) % 7) + 1; }
  else { karanaName = ['Shakuni', 'Chatushpada', 'Naga'][k - 57]; karanaNum = k - 56; }

  // Rahu Kaal: split daylight into 8 equal parts.
  let rahuKaal: { start: Date; end: Date } | null = null;
  if (sunrise && sunset && sunset > sunrise) {
    const span = sunset.getTime() - sunrise.getTime();
    const seg = span / 8;
    const idx = RAHU_SEGMENT[date.getDay()];
    rahuKaal = {
      start: new Date(sunrise.getTime() + idx * seg),
      end: new Date(sunrise.getTime() + (idx + 1) * seg),
    };
  }

  return {
    dateISO: date.toISOString().slice(0, 10),
    location,
    vaara: VAARA_NAMES[date.getDay()],
    sunrise,
    sunset,
    tithi: { name: tithiName, index: (tithiIdx % 15) + 1, paksha },
    nakshatra: { name: NAKSHATRA_NAMES[nakIdx], index: nakIdx + 1 },
    yoga: { name: YOGA_NAMES[yogaIdx], index: yogaIdx + 1 },
    karana: { name: karanaName, index: karanaNum },
    moonRashi: RASHI_NAMES[Math.floor(moonSid / 30)],
    sunRashi: RASHI_NAMES[Math.floor(sunSid / 30)],
    rahuKaal,
  };
}

/** Raw sidereal elongation helpers reused by the festival resolver. */
export function tithiAtSunrise(date: Date, location: GeoLocation): { index: number; paksha: 'Shukla' | 'Krishna' } {
  const observer = new Astronomy.Observer(location.latitude, location.longitude, 0);
  const sunrise = riseSet(Astronomy.Body.Sun, observer, date, 1)
    ?? new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 6, 0, 0));
  const time = Astronomy.MakeTime(sunrise);
  const elong = norm360(moonLongitude(time) - sunLongitude(time));
  const tithiIdx = Math.floor(elong / 12);
  return { index: tithiIdx, paksha: tithiIdx < 15 ? 'Shukla' : 'Krishna' };
}

/** Sidereal solar month index (0=Mesha) at a date — used to bracket lunar months. */
export function sunRashiIndex(date: Date): number {
  const time = Astronomy.MakeTime(date);
  return Math.floor(norm360(sunLongitude(time) - ayanamsa(date)) / 30);
}

export function formatTime(date: Date | null, timeZone: string): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone, hour12: true,
  }).format(date);
}
