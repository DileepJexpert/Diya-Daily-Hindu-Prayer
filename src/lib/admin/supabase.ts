/**
 * Creator Studio — minimal Supabase REST client.
 *
 * Deliberately tiny and SDK-free: it talks to Supabase Auth + Storage over plain
 * HTTP (fetch + expo-file-system), so we add ZERO dependencies and nothing to
 * rebuild. It powers the `supabase` branch of lib/admin/backend.ts.
 *
 * Model:
 *   • Reads are PUBLIC — the published catalog is public content, fetched by
 *     every user at startup (no login).
 *   • Writes require an admin LOGIN — uploads/publish use the signed-in user's
 *     JWT as a Bearer token; Storage RLS policies restrict writes to that user.
 *
 * Setup (bucket, policies, admin user, env vars): docs/CREATOR_STUDIO_SUPABASE.md
 */
import * as FileSystem from 'expo-file-system/legacy';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const BUCKET = process.env.EXPO_PUBLIC_STUDIO_BUCKET ?? 'studio';

/** Path (inside the bucket) of the published studio-tracks overlay. */
export const PUBLISHED_PATH = 'catalog/published.json';

export const supabaseConfigured = (): boolean => !!SUPABASE_URL && !!ANON_KEY;

export interface StudioSession {
  token: string;
  email: string;
}

/** Admin sign-in (email + password). Returns a session with a JWT for writes. */
export async function signIn(email: string, password: string): Promise<StudioSession> {
  if (!supabaseConfigured()) throw new Error('Supabase is not configured (missing env vars).');
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (!res.ok) throw new Error('Sign-in failed — check your email and password.');
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Sign-in failed — no token returned.');
  return { token: data.access_token, email: email.trim() };
}

/** Public URL for an object in the (public) studio bucket. */
export function publicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

/**
 * Upload an audio file to Storage and return its public URL. A remote source
 * (e.g. a Suno export URL) is downloaded first, which also re-hosts it durably
 * on your own bucket so the link never expires.
 */
export async function uploadAudioFile(uri: string, path: string, token: string): Promise<string> {
  let localUri = uri;
  if (/^https?:\/\//.test(uri)) {
    const dest = `${FileSystem.cacheDirectory ?? ''}studio-upload-${Date.now()}.mp3`;
    const dl = await FileSystem.downloadAsync(uri, dest);
    localUri = dl.uri;
  }
  const res = await FileSystem.uploadAsync(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, localUri, {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
    },
  });
  if (res.status >= 300) throw new Error(`Audio upload failed (${res.status}).`);
  return publicUrl(path);
}

/** Upsert a small JSON object into Storage and return its public URL. */
export async function uploadJson(path: string, obj: unknown, token: string): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-upsert': 'true',
    },
    body: JSON.stringify(obj),
  });
  if (!res.ok) throw new Error(`Publish failed (${res.status}).`);
  return publicUrl(path);
}

/** Fetch the published studio-tracks overlay (public read; no login). */
export async function fetchPublished(): Promise<{ tracks?: unknown }> {
  const res = await fetch(`${publicUrl(PUBLISHED_PATH)}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`fetch published failed (${res.status})`);
  return (await res.json()) as { tracks?: unknown };
}
