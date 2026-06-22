import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import { router } from 'expo-router';
import { Radius, Spacing } from '@/constants/theme';
import { Button, Card, Icon, Pill, Screen, SectionHeader, Text, type IconName } from '@/components/ui';
import { useColors } from '@/hooks/use-theme';
import { Catalog, TRACK_KINDS } from '@/lib/content/catalog';
import type { AudioSource, Language, LyricLine, Track, TrackKind } from '@/lib/content/types';
import { uploadAudio } from '@/lib/admin/backend';
import { useStudioStore } from '@/lib/admin/studioStore';

const LANGS: { id: Language; label: string }[] = [
  { id: 'hi', label: 'Hindi' },
  { id: 'sa', label: 'Sanskrit' },
  { id: 'en', label: 'English' },
  { id: 'ta', label: 'Tamil' },
  { id: 'te', label: 'Telugu' },
  { id: 'bn', label: 'Bengali' },
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'track';

type Line = { t: string; devanagari: string; transliteration: string; translation: string };
const emptyLine = (): Line => ({ t: '', devanagari: '', transliteration: '', translation: '' });

/** A labelled text input matching the app's form style. */
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  hint,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  hint?: string;
}) {
  const colors = useColors();
  return (
    <View style={{ marginTop: Spacing.lg }}>
      <Text variant="overline" color="textMuted">{label}</Text>
      {!!hint && (
        <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>{hint}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={{
          marginTop: Spacing.sm,
          fontSize: 16,
          color: colors.text,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: Radius.md,
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.lg,
          minHeight: multiline ? 60 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
}

export default function ComposeScreen() {
  const colors = useColors();
  const publish = useStudioStore((s) => s.publish);
  const token = useStudioStore((s) => s.session?.token);
  const deities = Catalog.deities();

  const [title, setTitle] = useState('');
  const [devanagari, setDevanagari] = useState('');
  const [kind, setKind] = useState<TrackKind>('bhajan');
  const [deityId, setDeityId] = useState(deities[0]?.id ?? '');
  const [language, setLanguage] = useState<Language>('hi');
  const [artist, setArtist] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [durationStr, setDurationStr] = useState('');
  const [attribution, setAttribution] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [lines, setLines] = useState<Line[]>([emptyLine()]);

  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLine = (i: number, key: keyof Line, val: string) =>
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)));
  const addLine = () => setLines((prev) => [...prev, emptyLine()]);
  const removeLine = (i: number) => setLines((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const onPublish = async () => {
    if (!title.trim()) { setError('Please add a title.'); return; }
    if (!deityId) { setError('Please choose a deity.'); return; }
    setError(null);
    setPublishing(true);
    try {
      const id = `studio-${slugify(title)}-${Date.now().toString(36).slice(-4)}`;

      let audio: AudioSource | null = null;
      const url = audioUrl.trim();
      if (url) {
        // Mock returns the URL as-is; supabase re-hosts it on your bucket.
        const up = await uploadAudio({ uri: url, filename: id }, token);
        audio = { type: 'remote', uri: up.uri };
      }

      const lyrics: LyricLine[] = lines
        .filter((l) => l.transliteration.trim() || l.devanagari.trim() || l.translation.trim())
        .map((l) => ({
          t: Number(l.t) || 0,
          devanagari: l.devanagari.trim() || undefined,
          transliteration: l.transliteration.trim(),
          translation: l.translation.trim(),
        }));

      const lastT = lyrics.length ? lyrics[lyrics.length - 1].t : 0;
      const duration = Number(durationStr) || (lastT ? lastT + 30 : 0);

      const track: Track = {
        id,
        title: title.trim(),
        devanagari: devanagari.trim() || undefined,
        kind,
        deityId,
        language,
        artist: artist.trim() || 'Studio',
        duration,
        audio,
        isFree: true,
        tags: tagsStr.split(',').map((s) => s.trim()).filter(Boolean),
        attribution: attribution.trim() || undefined,
        lyrics,
      };

      await publish(track);
      router.replace(`/player/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not publish.');
      setPublishing(false);
    }
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginBottom: Spacing.sm }}>
        <Icon name="chevron-back" size={26} color="textSecondary" />
      </Pressable>
      <Text variant="h1">New bhajan</Text>
      <Text variant="body" color="textSecondary" style={{ marginTop: Spacing.xs }}>
        Paste a licensed audio link (e.g. a Suno export) and type the words with their timings.
      </Text>

      <Field label="Title" value={title} onChangeText={setTitle} placeholder="Aaj Brij Mein" />
      <Field label="Devanagari (optional)" value={devanagari} onChangeText={setDevanagari} placeholder="आज ब्रज में" />

      <View style={{ marginTop: Spacing.lg }}>
        <Text variant="overline" color="textMuted">Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
          {TRACK_KINDS.map((k) => (
            <Pill key={k.kind} label={k.label} icon={k.icon as IconName} active={kind === k.kind} onPress={() => setKind(k.kind)} />
          ))}
        </ScrollView>
      </View>

      <View style={{ marginTop: Spacing.lg }}>
        <Text variant="overline" color="textMuted">Deity</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
          {deities.map((d) => (
            <Pill key={d.id} label={`${d.glyph} ${d.name}`} active={deityId === d.id} onPress={() => setDeityId(d.id)} />
          ))}
        </ScrollView>
      </View>

      <View style={{ marginTop: Spacing.lg }}>
        <Text variant="overline" color="textMuted">Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
          {LANGS.map((l) => (
            <Pill key={l.id} label={l.label} active={language === l.id} onPress={() => setLanguage(l.id)} />
          ))}
        </ScrollView>
      </View>

      <Field
        label="Audio URL"
        value={audioUrl}
        onChangeText={setAudioUrl}
        placeholder="https://…/your-bhajan.mp3"
        keyboardType="url"
        hint="A Suno export, a Creative-Commons recitation, or an MP3 you host. Leave blank for follow-along (synced words, no audio)."
      />
      <Field label="Duration in seconds (optional)" value={durationStr} onChangeText={setDurationStr} placeholder="205" keyboardType="number-pad" hint="Auto-estimated from your last line if left blank." />
      <Field label="Artist / reciter (optional)" value={artist} onChangeText={setArtist} placeholder="Studio" />
      <Field label="Attribution (optional)" value={attribution} onChangeText={setAttribution} placeholder="Traditional · AI recording via Suno" />
      <Field label="Tags (comma-separated, optional)" value={tagsStr} onChangeText={setTagsStr} placeholder="krishna, holi, braj" />

      <SectionHeader title="Lyrics & timings" />
      <Text variant="caption" color="textMuted" style={{ marginTop: -Spacing.sm }}>
        Each line highlights when the audio reaches its start time (in seconds).
      </Text>

      {lines.map((l, i) => (
        <Card key={i} style={{ marginTop: Spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="label" color="primary">Line {i + 1}</Text>
            {lines.length > 1 && (
              <Pressable onPress={() => removeLine(i)} hitSlop={8}>
                <Icon name="close-circle" size={20} color="textMuted" />
              </Pressable>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm }}>
            <Text variant="caption" color="textMuted">Start at (s)</Text>
            <TextInput
              value={l.t}
              onChangeText={(v) => setLine(i, 't', v)}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              style={{
                width: 72,
                fontSize: 16,
                color: colors.text,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: Radius.sm,
                paddingVertical: Spacing.sm,
                paddingHorizontal: Spacing.md,
                textAlign: 'center',
              }}
            />
          </View>
          <TextInput
            value={l.devanagari}
            onChangeText={(v) => setLine(i, 'devanagari', v)}
            placeholder="Devanagari (optional)"
            placeholderTextColor={colors.textMuted}
            style={{ marginTop: Spacing.sm, fontSize: 16, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.sm, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md }}
          />
          <TextInput
            value={l.transliteration}
            onChangeText={(v) => setLine(i, 'transliteration', v)}
            placeholder="Transliteration"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            style={{ marginTop: Spacing.sm, fontSize: 16, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.sm, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md }}
          />
          <TextInput
            value={l.translation}
            onChangeText={(v) => setLine(i, 'translation', v)}
            placeholder="English translation"
            placeholderTextColor={colors.textMuted}
            style={{ marginTop: Spacing.sm, fontSize: 16, color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: Radius.sm, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md }}
          />
        </Card>
      ))}

      <Button label="Add line" icon="add" variant="secondary" style={{ marginTop: Spacing.md }} onPress={addLine} />

      {!!error && (
        <Text variant="body" color="danger" style={{ marginTop: Spacing.lg }}>{error}</Text>
      )}

      <Button
        label={publishing ? 'Publishing…' : 'Publish'}
        icon="cloud-upload"
        loading={publishing}
        full
        style={{ marginTop: Spacing.xl }}
        onPress={onPublish}
      />
      <Text variant="caption" color="textMuted" center style={{ marginTop: Spacing.md }}>
        Publish only audio you created or have the right to use.
      </Text>
    </Screen>
  );
}
