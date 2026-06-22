/**
 * Resolves the active color scheme, honoring the user's explicit theme override
 * (light/dark) and falling back to the system scheme.
 */
import { useColorScheme as useSystemScheme } from 'react-native';
import { Colors, type ColorTokens } from '@/constants/theme';
import { useAppStore } from '@/lib/state/store';

export function useScheme(): 'light' | 'dark' {
  const system = useSystemScheme();
  const mode = useAppStore((s) => s.themeMode);
  if (mode === 'light' || mode === 'dark') return mode;
  return system === 'dark' ? 'dark' : 'light';
}

export function useColors(): ColorTokens {
  return Colors[useScheme()];
}

// Back-compat alias used by a few scaffold components.
export const useTheme = useColors;
