import { router } from 'expo-router';
import { usePlayerStore } from './playerStore';
import { useIsPremium } from '../subscription/subscriptionStore';
import type { Track } from '../content/types';

/**
 * Centralized "play this" behavior: gated tracks route to the paywall, otherwise
 * the track is loaded (with an optional queue) and the player opens.
 */
export function useOpenTrack() {
  const premium = useIsPremium();
  const load = usePlayerStore((s) => s.load);

  return (track: Track, queue?: string[]) => {
    if (!track.isFree && !premium) {
      router.push('/paywall');
      return;
    }
    load(track.id, queue ?? [track.id]);
    router.push(`/player/${track.id}`);
  };
}
