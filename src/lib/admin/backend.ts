/**
 * Creator Studio — backend seam.
 *
 * Mock by default so the whole compose → publish → appears-in-app flow works
 * today with no accounts:
 *   • uploadAudio()    passes a pasted URL straight through.
 *   • publishCatalog() is a no-op (the on-device overlay in studioStore is what
 *                      makes a new track appear).
 *
 * To make published tracks reach EVERY user (not just this device), set
 * EXPO_PUBLIC_STUDIO_BACKEND=supabase (or firebase) and fill in the two adapters
 * below. The contract the rest of the app relies on never changes:
 *   1. uploadAudio  — store the MP3 bytes and return a public, streamable URL.
 *   2. publishCatalog — persist the track list to the hosted catalog JSON that
 *      EXPO_PUBLIC_CONTENT_URL points at, so the app loads it at startup.
 *
 * ⚠ Only publish audio you created or have the right to use. Re-uploading a
 * commercial recording (e.g. a label-owned bhajan) is copyright infringement —
 * even when given away for free.
 */
import type { Track } from '../content/types';

export type StudioBackendKind = 'mock' | 'supabase' | 'firebase';

export const STUDIO_BACKEND =
  (process.env.EXPO_PUBLIC_STUDIO_BACKEND as StudioBackendKind | undefined) ?? 'mock';

export interface UploadInput {
  /** A device `file://` URI (from a file picker) or a public http(s) URL. */
  uri: string;
  filename?: string;
}

/** Store an audio file and return a public, streamable URL. */
export async function uploadAudio(input: UploadInput): Promise<{ uri: string }> {
  switch (STUDIO_BACKEND) {
    case 'supabase':
    case 'firebase':
      // TODO(real backend): read the bytes at input.uri and upload them to your
      // Storage bucket (Supabase Storage / Firebase Storage / S3), then return
      // the resulting public URL. Needs the provider SDK + a public bucket, and
      // — to pick a file off the device — expo-document-picker.
      throw new Error(
        `Studio backend "${STUDIO_BACKEND}" is not wired yet — implement uploadAudio in lib/admin/backend.ts`,
      );
    default:
      // Mock: the user pasted a ready URL (a Suno export, a Creative-Commons
      // recitation, an MP3 they host) — use it as-is.
      return { uri: input.uri };
  }
}

/**
 * Publish the full Studio track list so every user receives it, not just this
 * device. Mock is a no-op (the local overlay already surfaced the track).
 */
export async function publishCatalog(_tracks: Track[]): Promise<void> {
  if (STUDIO_BACKEND === 'mock') return;
  // TODO(real backend): merge _tracks into the hosted catalog JSON that
  // EXPO_PUBLIC_CONTENT_URL serves (e.g. upsert a Supabase row and regenerate
  // the catalog, or PUT to your CMS/CDN). Until then, published tracks live on
  // this device only.
}
