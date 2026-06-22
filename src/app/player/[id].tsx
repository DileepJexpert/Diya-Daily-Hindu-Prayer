import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioPlayerStatus } from 'expo-audio';
import { Spacing } from '@/constants/theme';
import { Button, Icon, Pill, Text } from '@/components/ui';
import { DeityAvatar } from '@/components/content/DeityAvatar';
import { LyricsView } from '@/components/player/LyricsView';
import { Catalog } from '@/lib/content/catalog';
import { usePlayerStore } from '@/lib/audio/playerStore';
import { audioSeek, audioSetRate, audioTogglePlay, getAudioPlayer } from '@/lib/audio/audioEngine';
import { useDownloadsStore } from '@/lib/audio/downloads';
import { useActiveLyric } from '@/lib/audio/useActiveLyric';
import { useIsPremium } from '@/lib/subscription/subscriptionStore';
import { useAppStore } from '@/lib/state/store';
import { formatTrackShare, shareText } from '@/lib/share';
import { speakLine, stopSpeaking } from '@/lib/audio/speech';
import { useColors } from '@/hooks/use-theme';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const premium = useIsPremium();

  const track = id ? Catalog.track(id) : undefined;
  const deity = track ? Catalog.deity(track.deityId) : undefined;
  const locked = !!track && !track.isFree && !premium;

  const audioStatus = useAudioPlayerStatus(getAudioPlayer());
  const hasRealAudio = !!track?.audio;
  const ttsMode = !!track && !track.audio;
  const isRemote = track?.audio?.type === 'remote';

  const {
    rate, repeat, position: storePosition, load, pause, seek, cycleRate, cycleRepeat,
    sleepTimerEndsAt, setSleepTimer,
  } = usePlayerStore();
  const isFavorite = useAppStore((s) => (id ? s.favorites.includes(id) : false));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const downloaded = useDownloadsStore((s) => (id ? !!s.downloads[id] : false));
  const downloading = useDownloadsStore((s) => (id ? !!s.downloading[id] : false));
  const download = useDownloadsStore((s) => s.download);
  const removeDownload = useDownloadsStore((s) => s.remove);

  const [showDeva, setShowDeva] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  const [barWidth, setBarWidth] = useState(1);
  const [sleepMin, setSleepMin] = useState(0);
  const [reading, setReading] = useState(false);
  const [spokenIndex, setSpokenIndex] = useState(0);
  const readingRef = useRef(false);

  const SLEEPS = [0, 10, 20, 30];
  const cycleSleep = () => {
    const nextMin = SLEEPS[(SLEEPS.indexOf(sleepMin) + 1) % SLEEPS.length];
    setSleepMin(nextMin);
    setSleepTimer(nextMin);
  };

  const stopReading = () => {
    readingRef.current = false;
    setReading(false);
    stopSpeaking();
  };
  const startReading = () => {
    if (!track) return;
    pause();
    readingRef.current = true;
    setReading(true);
    const lines = track.lyrics;
    const step = (i: number) => {
      if (!readingRef.current) return;
      if (i >= lines.length) {
        readingRef.current = false;
        setReading(false);
        seek(track.duration);
        useAppStore.getState().recordPractice();
        return;
      }
      setSpokenIndex(i);
      seek(lines[i].t);
      speakLine(lines[i], {
        rate: usePlayerStore.getState().rate,
        onDone: () => step(i + 1),
        onError: () => step(i + 1),
      });
    };
    step(0);
  };

  useEffect(() => {
    if (track && !locked && usePlayerStore.getState().trackId !== track.id) load(track.id, [track.id]);
    pause();
  }, [track, locked, load, pause]);

  useEffect(() => {
    if (hasRealAudio) audioSetRate(rate);
  }, [rate, hasRealAudio]);

  // Audio persists across screens, so only TTS is stopped on exit.
  useEffect(() => () => stopSpeaking(), []);

  const position = hasRealAudio ? audioStatus?.currentTime ?? 0 : storePosition;
  const duration = hasRealAudio
    ? (audioStatus?.duration && audioStatus.duration > 0 ? audioStatus.duration : track?.duration ?? 0)
    : track?.duration ?? 0;
  const { index: activeIndex } = useActiveLyric(track?.lyrics ?? [], position, duration);
  const displayIndex = ttsMode ? spokenIndex : activeIndex;
  const mainPlaying = hasRealAudio ? audioStatus?.playing ?? false : reading;

  if (!track) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text variant="title">Track not found</Text>
        <Button label="Go back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const onMainPress = () => {
    if (hasRealAudio) audioTogglePlay();
    else reading ? stopReading() : startReading();
  };
  const onSeek = (target: number) => {
    if (hasRealAudio) audioSeek(target);
    else seek(target);
  };
  const goTo = (delta: 1 | -1) => {
    const q = usePlayerStore.getState().queue;
    const i = q.indexOf(track.id);
    let nid: string | null = null;
    if (delta > 0) nid = i >= 0 && i < q.length - 1 ? q[i + 1] : repeat === 'all' ? q[0] : null;
    else nid = i > 0 ? q[i - 1] : null;
    if (nid) router.replace(`/player/${nid}`);
  };
  const onPrev = () => {
    if (hasRealAudio && (audioStatus?.currentTime ?? 0) > 3) audioSeek(0);
    else goTo(-1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm }}>
      {/* Top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Icon name="chevron-down" size={28} color="textSecondary" />
        </Pressable>
        <Text variant="overline" color="textMuted">{track.kind.toUpperCase()}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }}>
          {isRemote && (
            <Pressable onPress={() => (downloaded ? removeDownload(track.id) : download(track))} hitSlop={12} disabled={downloading}>
              <Icon
                name={downloading ? 'cloud-download' : downloaded ? 'cloud-done' : 'cloud-download-outline'}
                size={22}
                color={downloaded ? 'primary' : 'textSecondary'}
              />
            </Pressable>
          )}
          <Pressable onPress={() => shareText(formatTrackShare(track.title, track.lyrics[0]?.transliteration))} hitSlop={12}>
            <Icon name="share-outline" size={22} color="textSecondary" />
          </Pressable>
          <Pressable onPress={() => toggleFavorite(track.id)} hitSlop={12}>
            <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? 'accent' : 'textSecondary'} />
          </Pressable>
        </View>
      </View>

      {/* Header */}
      <View style={{ alignItems: 'center', paddingHorizontal: Spacing.xl, marginTop: Spacing.md }}>
        {deity && <DeityAvatar deity={deity} size={64} />}
        <Text variant="h2" center style={{ marginTop: Spacing.sm }}>{track.title}</Text>
        {track.devanagari && <Text variant="sanskrit" center color="textSecondary">{track.devanagari}</Text>}
        <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.xs }}>{track.artist}</Text>
      </View>

      {locked ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md }}>
          <Icon name="lock-closed" size={40} color="primary" />
          <Text variant="title" center>A Diya membership unlocks this</Text>
          <Text variant="body" color="textSecondary" center>
            Full guided practices, the complete library and offline downloads.
          </Text>
          <Button label="See membership" icon="sparkles" onPress={() => router.push('/paywall')} />
        </View>
      ) : (
        <>
          {/* Synced lyrics */}
          <View style={{ flex: 1, paddingHorizontal: Spacing.xl }}>
            <LyricsView
              lyrics={track.lyrics}
              activeIndex={displayIndex}
              position={position}
              showDevanagari={showDeva}
              showTranslation={showTrans}
              onPressLine={(i) => onSeek(track.lyrics[i].t)}
            />
          </View>

          {/* Controls */}
          <View
            style={{
              paddingHorizontal: Spacing.xl,
              paddingBottom: insets.bottom + Spacing.lg,
              paddingTop: Spacing.md,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              gap: Spacing.md,
            }}
          >
            <View style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' }}>
              <Pill
                label={repeat === 'one' ? 'Repeat 1' : repeat === 'all' ? 'Repeat all' : 'Repeat'}
                icon="repeat"
                active={repeat !== 'off'}
                onPress={cycleRepeat}
              />
              <Pill label={sleepMin ? `Sleep ${sleepMin}m` : 'Sleep'} icon="moon" active={!!sleepTimerEndsAt} onPress={cycleSleep} />
              <Pill label="Learn" icon="school" onPress={() => router.push(`/learn/${track.id}`)} />
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' }}>
              <Pill label="अ Devanagari" active={showDeva} onPress={() => setShowDeva((v) => !v)} />
              <Pill label="A Translation" active={showTrans} onPress={() => setShowTrans((v) => !v)} />
            </View>
            {ttsMode && (
              <Text variant="caption" color="textMuted" center>🔊 Device voice (text-to-speech) — studio audio coming soon</Text>
            )}

            {/* Seek bar */}
            <View>
              <Pressable
                onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
                onPress={(e) => onSeek((e.nativeEvent.locationX / barWidth) * duration)}
                style={{ paddingVertical: Spacing.sm }}
              >
                <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.border }}>
                  <View style={{ width: `${duration ? (position / duration) * 100 : 0}%`, height: 4, borderRadius: 2, backgroundColor: colors.primary }} />
                </View>
              </Pressable>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="caption" color="textMuted">{fmt(position)}</Text>
                <Text variant="caption" color="textMuted">{fmt(duration)}</Text>
              </View>
            </View>

            {/* Transport */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pressable onPress={cycleRate} hitSlop={8} style={{ width: 56 }}>
                <Text variant="label" color="textSecondary">{rate}×</Text>
              </Pressable>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xl }}>
                <Pressable onPress={onPrev} hitSlop={10}><Icon name="play-skip-back" size={28} color="text" /></Pressable>
                <Pressable
                  onPress={onMainPress}
                  style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name={mainPlaying ? 'pause' : 'play'} size={30} color="onPrimary" />
                </Pressable>
                <Pressable onPress={() => goTo(1)} hitSlop={10}><Icon name="play-skip-forward" size={28} color="text" /></Pressable>
              </View>
              <View style={{ width: 56, alignItems: 'flex-end' }}>
                <Text variant="caption" color={mainPlaying ? 'primary' : 'textMuted'}>{hasRealAudio ? '♪' : 'voice'}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
