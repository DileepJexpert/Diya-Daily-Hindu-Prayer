import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Radius, Spacing } from '@/constants/theme';
import { Button, Card, Icon, Screen, SectionHeader, Text } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { Catalog, TRACK_KINDS } from '@/lib/content/catalog';
import { STUDIO_BACKEND } from '@/lib/admin/backend';
import { useStudioStore } from '@/lib/admin/studioStore';

/** Passcode gate — a mock admin login until real auth is wired. */
function Gate() {
  const colors = useColors();
  const unlock = useStudioStore((s) => s.unlock);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const submit = () => {
    if (!unlock(code)) {
      setError(true);
      setCode('');
    }
  };

  return (
    <Card elevated style={{ marginTop: Spacing.xl }}>
      <Text variant="overline" color="primary">Admin</Text>
      <Text variant="title" style={{ marginTop: Spacing.xs }}>Enter your passcode</Text>
      <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.xs }}>
        The Studio is for you, the creator. (Mock gate for now — wire real login with your backend.)
      </Text>
      <TextInput
        value={code}
        onChangeText={(t) => { setCode(t); setError(false); }}
        placeholder="Passcode"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        keyboardType="number-pad"
        onSubmitEditing={submit}
        style={{
          marginTop: Spacing.md,
          fontSize: 18,
          color: colors.text,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: Radius.md,
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
        }}
      />
      {error && (
        <Text variant="caption" color="danger" style={{ marginTop: Spacing.sm }}>
          Incorrect passcode.
        </Text>
      )}
      <Button label="Unlock Studio" icon="lock-open" full style={{ marginTop: Spacing.lg }} onPress={submit} />
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

          {STUDIO_BACKEND === 'mock' && (
            <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.md }}>
              Preview mode — published tracks are saved on this device only. Connect a backend
              (Supabase/Firebase) to share them with everyone.
            </Text>
          )}

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
