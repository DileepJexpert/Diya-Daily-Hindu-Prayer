import type { IconName } from '@/components/ui';

/**
 * Ambient soundscapes for darshan & meditation. This is an audio seam: like the
 * tracks, the loops aren't bundled yet. Selecting one sets the mood visually and
 * is wired to drop in a looping `expo-audio` source per id when assets are ready.
 */
export interface Ambience {
  id: string;
  label: string;
  icon: IconName;
}

export const AMBIENCE: Ambience[] = [
  { id: 'none', label: 'Silence', icon: 'remove-circle-outline' },
  { id: 'bells', label: 'Temple bells', icon: 'notifications-outline' },
  { id: 'river', label: 'River', icon: 'water-outline' },
  { id: 'om', label: 'Om drone', icon: 'radio-outline' },
  { id: 'rain', label: 'Rain', icon: 'rainy-outline' },
];
