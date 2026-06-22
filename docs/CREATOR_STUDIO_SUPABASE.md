# Creator Studio → Supabase (make published bhajans reach everyone)

By default the Creator Studio is a **local mock**: anything you publish is saved on
your own phone. This guide flips it to a **real backend** so a bhajan you publish
shows up for **every user** — with no app-store update.

It takes ~10 minutes and uses Supabase's **free** tier. You won't write any code:
the app already has the Supabase wiring built in (`src/lib/admin/supabase.ts`).

## How it works (the short version)

```
You (admin)                         Supabase                         Every user
───────────                         ────────                         ──────────
sign in (email+password) ─────────▶ Auth checks you
paste Suno MP3 + lyrics
press Publish ───────────────────▶ Storage: your-bhajan.mp3   (public URL)
                                    Storage: published.json    (the track list)
                                                                      │
app startup  ◀────────────── fetches published.json ◀─────────────────┘
                              → the new bhajan appears, with synced lyrics
```

- **Reads are public** — the catalog is public content, so every user's app can
  fetch it with no login.
- **Writes need your login** — only you, signed in, can upload and publish.

---

## Step 1 — Create a Supabase project

1. Go to <https://supabase.com>, sign up, and **New project** (pick any name, a
   strong database password, and the region closest to your users).
2. When it's ready, open **Project Settings → API** and copy two values:
   - **Project URL** — looks like `https://abcdxyz.supabase.co`
   - **anon public** key — a long string. (This one is *safe* to ship in the app;
     it only allows what your policies allow. **Never** use the `service_role`
     key in the app.)

## Step 2 — Create the storage bucket

1. Left sidebar → **Storage** → **New bucket**.
2. Name it exactly **`studio`** and turn **Public bucket ON**. Create it.

(Public = anyone can *read* files. *Writing* still requires your login, which we
set up next.)

## Step 3 — Add the security policies

Left sidebar → **SQL Editor** → **New query**, paste this, and **Run**:

```sql
-- Anyone may READ files in the public 'studio' bucket
create policy "studio_public_read"
  on storage.objects for select
  using ( bucket_id = 'studio' );

-- Only signed-in admins may ADD files to 'studio'
create policy "studio_admin_insert"
  on storage.objects for insert to authenticated
  with check ( bucket_id = 'studio' );

-- Only signed-in admins may OVERWRITE files in 'studio' (re-publishing)
create policy "studio_admin_update"
  on storage.objects for update to authenticated
  using ( bucket_id = 'studio' );
```

> **Lock it to just you (recommended):** replace the two `'studio'` checks in the
> insert/update policies with
> `bucket_id = 'studio' and auth.jwt() ->> 'email' = 'you@example.com'`
> so only your email can publish, even if someone else signs up.

## Step 4 — Create your admin login

1. Left sidebar → **Authentication → Users → Add user**.
2. Enter your email + a password, and tick **Auto Confirm User** (so you can sign
   in immediately).
3. (Recommended) **Authentication → Providers → Email** → turn **Allow new users
   to sign up OFF**, so only the user you just created exists.

## Step 5 — Point the app at Supabase

In your **`.env`** (copy from `.env.example` if you haven't):

```bash
EXPO_PUBLIC_STUDIO_BACKEND=supabase
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
EXPO_PUBLIC_STUDIO_BUCKET=studio
```

Then restart Expo. Native env changes need a fresh start — and on a **dev build**
(`eas build`), env vars are baked at build time, so rebuild after changing them.

---

## Using it

1. In the app: **More → Creator Studio** → **sign in** with your admin email +
   password.
2. **Add a bhajan** → paste a Suno (or other licensed) MP3 URL, choose the deity /
   type / language, type the words with their start-times → **Publish**.
3. The MP3 is re-hosted on **your** bucket (so the link never expires), the track
   list is written to `studio/catalog/published.json`, and it opens in the player.
4. On every other user's next app launch, `hydrateStudio()` fetches that JSON and
   the bhajan appears for them too.

## What each file does

| File | Role |
| --- | --- |
| `src/lib/admin/supabase.ts` | tiny fetch-based client: sign-in, upload audio, upsert JSON, public read |
| `src/lib/admin/backend.ts` | the seam: `uploadAudio()` + `publishCatalog()` (mock vs supabase) |
| `src/lib/admin/studioStore.ts` | login session, publish, and `hydrateStudio()` at startup |
| `src/lib/content/source.ts` | overlays studio tracks on the catalog (`setStudioTracks`) |

No SDK, no extra npm packages — it's all plain HTTP + `expo-file-system`.

## Troubleshooting

- **Sign-in fails** → user not confirmed (tick *Auto Confirm*), or wrong
  email/password, or `EXPO_PUBLIC_SUPABASE_URL` / anon key not set.
- **Upload fails (4xx)** → bucket isn't named `studio`, or the Step 3 policies
  weren't run, or you're not signed in.
- **Other users don't see it** → they need to reopen the app (startup fetch).
  Confirm `studio/catalog/published.json` exists in Storage and opens in a
  browser (it's public).
- **Audio won't play** → open the file's public URL in a browser; if it doesn't
  stream, the upload didn't finish.

## ⚠ Copyright

Only publish audio you **created or have the right to use**. Re-uploading a
commercial recording (e.g. a label-owned Lata Mangeshkar bhajan) is copyright
infringement — even for free. Original or Suno-generated audio keeps you clean.
