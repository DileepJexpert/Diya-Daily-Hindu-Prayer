/**
 * Creator Studio — backend seam.
 *
 * Two modes, chosen by EXPO_PUBLIC_STUDIO_BACKEND:
 *
 *   • mock (default) — uploadAudio() passes a pasted URL through and
 *     publishCatalog() is a no-op. The on-device overlay in studioStore is what
 *     makes a new track appear. No accounts needed.
 *
 *   • supabase — uploadAudio() stores the MP3 on your Supabase bucket (re-hosting
 *     remote sources durably) and returns a public URL; publishCatalog() writes
 *     the published track list as JSON so EVERY user's app loads it at startup.
 *     Writes require an admin login (see lib/admin/supabase.ts). Setup guide:
 *     docs/CREATOR_STUDIO_SUPABASE.md
 *
 * ⚠ Only publish audio you created or have the right to use. Re-uploading a
 * commercial recording (e.g. a label-owned bhajan) is copyright infringement —
 * even when given away for free.
 */
import type { Track } from '../content/types';
import { PUBLISHED_PATH, uploadAudioFile, uploadJson } from './supabase';

export type StudioBackendKind = 'mock' | 'supabase';

export const STUDIO_BACKEND =
  (process.env.EXPO_PUBLIC_STUDIO_BACKEND as StudioBackendKind | undefined) ?? 'mock';

export interface UploadInput {
  /** A device `file://` URI (from a file picker) or a public http(s) URL. */
  uri: string;
  /** Suggested object name (e.g. the track id); sanitised before upload. */
  filename?: string;
}

/** Store an audio file and return a public, streamable URL. */
export async function uploadAudio(input: UploadInput, token?: string): Promise<{ uri: string }> {
  if (STUDIO_BACKEND === 'supabase') {
    if (!token) throw new Error('Sign in to the Studio before uploading.');
    const raw = (input.filename ?? `track-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `audio/${raw.toLowerCase().endsWith('.mp3') ? raw : `${raw}.mp3`}`;
    const uri = await uploadAudioFile(input.uri, path, token);
    return { uri };
  }
  // Mock: the user pasted a ready URL (a Suno export, a Creative-Commons
  // recitation, an MP3 they host) — use it as-is.
  return { uri: input.uri };
}

/**
 * Publish the full Studio track list so every user receives it, not just this
 * device. Mock is a no-op (the local overlay already surfaced the track).
 */
export async function publishCatalog(tracks: Track[], token?: string): Promise<void> {
  if (STUDIO_BACKEND !== 'supabase') return;
  if (!token) return; // not signed in — track stays published on this device only
  await uploadJson(PUBLISHED_PATH, { tracks }, token);
}
