import type { GeoLocation } from './engine';

/** Common homes for the Hindu diaspora — used by the location picker. */
export const LOCATION_PRESETS: GeoLocation[] = [
  { label: 'New Delhi, India', latitude: 28.6139, longitude: 77.209, timeZone: 'Asia/Kolkata' },
  { label: 'Mumbai, India', latitude: 19.076, longitude: 72.8777, timeZone: 'Asia/Kolkata' },
  { label: 'New York, USA', latitude: 40.7128, longitude: -74.006, timeZone: 'America/New_York' },
  { label: 'San Francisco, USA', latitude: 37.7749, longitude: -122.4194, timeZone: 'America/Los_Angeles' },
  { label: 'London, UK', latitude: 51.5074, longitude: -0.1278, timeZone: 'Europe/London' },
  { label: 'Toronto, Canada', latitude: 43.6532, longitude: -79.3832, timeZone: 'America/Toronto' },
  { label: 'Dubai, UAE', latitude: 25.2048, longitude: 55.2708, timeZone: 'Asia/Dubai' },
  { label: 'Singapore', latitude: 1.3521, longitude: 103.8198, timeZone: 'Asia/Singapore' },
  { label: 'Sydney, Australia', latitude: -33.8688, longitude: 151.2093, timeZone: 'Australia/Sydney' },
];
