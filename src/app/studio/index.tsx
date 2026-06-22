import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Radius, Spacing } from '@/constants/theme';
import { Button, Card, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { Catalog, TRACK_KINDS } from '@/lib/content/catalog';
import { STUDIO_BACKEND } from '@/lib/admin/backend';
import { useStudioStore } from '@/lib/admin/studioStore';

/** Admin gate — email/password login in supabase mode, passcode in mock mode. */
function Gate() {
  const colors = useColors();
  const isSupabase = STUDIO_BACKEND === 'supabase';
  const unlock = useStudioStore((s) => s.unlock);
  const signIn = useStudioStore((s) => s.signIn);

  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputStyle = {
    marginTop: Spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: error ? colors.danger : colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  } as const;

  const submitMock = () => {
    if (!unlock(code)) { setError('Incorrect passcode.'); setCode(''); }
  };
  const submitSupabase = async () => {
    setBusy(true);
    setError(null);
    const ok = await signIn(email, password);
    if (!ok) setError('Sign-in failed — check your email and password.');
    setBusy(false);
  };

  return (
    <Card elevated style={{ marginTop: Spacing.xl }}>
      <Text variant="overline" color="primary">Admin</Text>
      <Text variant="title" style={{ marginTop: Spacing.xs }}>
        {isSupabase ? 'Sign in' : 'Enter your passcode'}
      </Text>
      <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.xs }}>
        {isSupabase
          ? 'The Studio is for you, the creator. Sign in with your admin account.'
          : 'The Studio is for you, the creator. (Mock gate — wire real login with your backend.)'}
      </Text>

      {isSupabase ? (
        <>
          <TextInput
            value={email}
            onChangeText={(t) => { setEmail(t); setError(null); }}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={inputStyle}
          />
          <TextInput
            value={password}
            onChangeText={(t) => { setPassword(t); setError(null); }}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            onSubmitEditing={submitSupabase}
            style={inputStyle}
          />
        </>
      ) : (
        <TextInput
          value={code}
          onChangeText={(t) => { setCode(t); setError(null); }}
          placeholder="Passcode"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          keyboardType="number-pad"
          onSubmitEditing={submitMock}
          style={[inputStyle, { fontSize: 18 }]}
        />
      )}

      {!!error && (
        <Text variant="caption" color="danger" style={{ marginTop: Spacing.sm }}>{error}</Text>
      )}

      <Button
        label={isSupabase ? (busy ? 'Signing in…' : 'Sign in') : 'Unlock Studio'}
        icon="lock-open"
        loading={busy}
        full
        style={{ marginTop: Spacing.lg }}
        onPress={isSupabase ? submitSupabase : submitMock}
      />
    </Card>
  );
}

export default function StudioScreen() {
  const colors = useColors();
  const unlocked = useStudioStore((s) => s.unlocked);
  const tracks = useStudioStore((s) => s.tracks);
  const unpublish = useStudioStore((s) => s.unpublish);

  const kindLabel = (k: string) => TRACK_KINDS.find((t) => t.kind === k)?.label ?? k;

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">Creator Studio</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
        Publish your own bhajans — an AI track from Suno, or a recording you have the rights to — and
        hear it in the app with synced lyrics.
      </Text>

      {!unlocked ? (
        <Gate />
      ) : (
        <>
          <Button
            label="Add a bhajan"
            icon="add"
            full
            style={{ marginTop: Spacing.xl }}
            onPress={() => router.push('/studio/compose')}
          />

          <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.md }}>
            {STUDIO_BACKEND === 'supabase'
              ? 'Connected to Supabase — published tracks reach every user.'
              : 'Preview mode — published tracks are saved on this device only. Set EXPO_PUBLIC_STUDIO_BACKEND=supabase to share them with everyone.'}
          </Text>

          <SectionHeader title={tracks.length ? `Your tracks (${tracks.length})` : 'Your tracks'} />

          {tracks.length === 0 ? (
            <Card>
              <Text variant="body" color="textSecondary">
                Nothing published yet. Tap <Text variant="subtitle" color="primary">Add a bhajan</Text>,
                paste a Suno (or other licensed) MP3 link, type the words with their timings, and it
                appears across the app.
              </Text>
              <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.md }}>
                Use only audio you created or have the right to use — re-uploading a label's recording
                (even free) is copyright infringement.
              </Text>
            </Card>
          ) : (
            tracks.map((t) => (
              <Card key={t.id} style={{ marginBottom: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <Pressable onPress={() => router.push(`/player/${t.id}`)} style={{ flex: 1 }}>
                  <Text variant="subtitle">{t.title}</Text>
                  {!!t.devanagari && (
                    <Text variant="sanskrit" style={{ fontSize: 17, lineHeight: 26, marginTop: 2 }}>{t.devanagari}</Text>
                  )}
                  <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.xs }}>
                    {kindLabel(t.kind)} · {Catalog.deity(t.deityId)?.name ?? t.deityId} ·{' '}
                    {t.audio ? 'audio' : 'follow-along'} · {t.lyrics.length} lines
                  </Text>
                </Pressable>
                <Pressable onPress={() => router.push(`/player/${t.id}`)} hitSlop={8}>
                  <Icon name="play-circle" size={30} color="primary" />
                </Pressable>
                <Pressable onPress={() => unpublish(t.id)} hitSlop={8}>
                  <Icon name="trash-outline" size={20} color="textMuted" />
                </Pressable>
              </Card>
            ))
          )}
        </>
      )}
    </Screen>
  );
}
