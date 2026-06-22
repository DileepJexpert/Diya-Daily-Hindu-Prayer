/**
 * Diya — Design System
 *
 * A warm, premium, temple-inspired palette. Light mode evokes ghee-lamp glow on
 * ivory; dark mode evokes a temple at night lit by diyas. Tokens are semantic so
 * screens never reach for raw hex values.
 */

import { Platform, TextStyle } from 'react-native';

/* ------------------------------------------------------------------ palette */

const palette = {
  saffron: '#E8772E', // primary — marigold/diya flame
  saffronDeep: '#C75B17',
  saffronSoft: '#F7A35C',
  marigold: '#F4A300',
  kumkum: '#9E2B25', // deep maroon
  kumkumDeep: '#6E1B18',
  gold: '#C9A24B',
  goldSoft: '#E4C77E',

  ivory: '#FFFBF4',
  cream: '#FBF3E4',
  sand: '#F3E7D2',

  ink: '#2A1A12', // warm near-black
  cocoa: '#6B5747',
  taupe: '#9C8775',

  night: '#100A18', // temple-night indigo/charcoal
  nightSurface: '#1A1222',
  nightElevated: '#241830',
  moon: '#F6EFE4',
  ash: '#B8A894',
  smoke: '#7E7060',

  white: '#FFFFFF',
  black: '#000000',

  success: '#3E8E5A',
  danger: '#C0392B',
  info: '#3C6E9E',
} as const;

export type ColorTokens = {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceElevated: string;
  surfaceSelected: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryDeep: string;
  primarySoft: string;
  onPrimary: string;
  accent: string; // kumkum
  gold: string;
  goldSoft: string;
  border: string;
  borderStrong: string;
  overlay: string;
  scrim: string;
  success: string;
  danger: string;
  info: string;
  tabBar: string;
  tabInactive: string;
};

export const Colors: { light: ColorTokens; dark: ColorTokens } = {
  light: {
    background: palette.ivory,
    backgroundAlt: palette.cream,
    surface: palette.white,
    surfaceElevated: '#FFF7EA',
    surfaceSelected: palette.sand,
    text: palette.ink,
    textSecondary: palette.cocoa,
    textMuted: palette.taupe,
    primary: palette.saffron,
    primaryDeep: palette.saffronDeep,
    primarySoft: '#FCE9D5',
    onPrimary: palette.white,
    accent: palette.kumkum,
    gold: palette.gold,
    goldSoft: palette.goldSoft,
    border: '#ECDFC9',
    borderStrong: '#DcC9A8',
    overlay: 'rgba(42,26,18,0.45)',
    scrim: 'rgba(42,26,18,0.06)',
    success: palette.success,
    danger: palette.danger,
    info: palette.info,
    tabBar: 'rgba(255,251,244,0.92)',
    tabInactive: palette.taupe,
  },
  dark: {
    background: palette.night,
    backgroundAlt: palette.nightSurface,
    surface: palette.nightSurface,
    surfaceElevated: palette.nightElevated,
    surfaceSelected: '#2E2040',
    text: palette.moon,
    textSecondary: palette.ash,
    textMuted: palette.smoke,
    primary: palette.saffronSoft,
    primaryDeep: palette.saffron,
    primarySoft: '#34241B',
    onPrimary: '#2A1206',
    accent: '#E07A6E',
    gold: palette.goldSoft,
    goldSoft: '#8C7430',
    border: '#2C2238',
    borderStrong: '#3C2F4C',
    overlay: 'rgba(0,0,0,0.6)',
    scrim: 'rgba(255,255,255,0.05)',
    success: '#5FB37C',
    danger: '#E2675A',
    info: '#7BA9D0',
    tabBar: 'rgba(16,10,24,0.92)',
    tabInactive: palette.smoke,
  },
};

export const Palette = palette;

export type ThemeName = keyof typeof Colors;
export type ColorToken = keyof ColorTokens;

/* -------------------------------------------------------------------- fonts */

/**
 * Font families. Keys map to families loaded in the root layout via
 * expo-google-fonts. `sans` falls back to the platform system UI font until the
 * custom face is loaded.
 */
export const Fonts = {
  display: 'Marcellus_400Regular', // elegant serif for titles / deity names
  serif: 'Marcellus_400Regular',
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) as string,
  devanagari: 'NotoSansDevanagari_400Regular',
  devanagariBold: 'NotoSansDevanagari_700Bold',
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) as string,
} as const;

/* ------------------------------------------------------------------ spacing */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  pill: 999,
} as const;

/* --------------------------------------------------------------- typography */

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyLg'
  | 'label'
  | 'caption'
  | 'overline'
  | 'sanskrit'
  | 'transliteration'
  | 'translation';

export const Typography: Record<Variant, TextStyle> = {
  display: { fontFamily: Fonts.display, fontSize: 40, lineHeight: 46 },
  h1: { fontFamily: Fonts.display, fontSize: 30, lineHeight: 38 },
  h2: { fontFamily: Fonts.display, fontSize: 24, lineHeight: 32 },
  title: { fontFamily: Fonts.sans, fontSize: 18, lineHeight: 24, fontWeight: '700' },
  subtitle: { fontFamily: Fonts.sans, fontSize: 16, lineHeight: 22, fontWeight: '600' },
  bodyLg: { fontFamily: Fonts.sans, fontSize: 17, lineHeight: 26, fontWeight: '400' },
  body: { fontFamily: Fonts.sans, fontSize: 15, lineHeight: 22, fontWeight: '400' },
  label: { fontFamily: Fonts.sans, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontFamily: Fonts.sans, fontSize: 12, lineHeight: 16, fontWeight: '500' },
  overline: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  sanskrit: { fontFamily: Fonts.devanagari, fontSize: 22, lineHeight: 38 },
  transliteration: { fontFamily: Fonts.serif, fontSize: 17, lineHeight: 28, fontStyle: 'italic' },
  translation: { fontFamily: Fonts.sans, fontSize: 15, lineHeight: 23 },
};

/* ---------------------------------------------------------------- elevation */

export const Shadow = {
  card: {
    shadowColor: '#3A1E08',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  floating: {
    shadowColor: '#3A1E08',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
} as const;

export const Duration = { fast: 150, base: 250, slow: 450, breathe: 3200 } as const;

export const Layout = {
  maxContentWidth: 720,
  screenPadding: Spacing.xl,
  miniPlayerHeight: 64,
} as const;
