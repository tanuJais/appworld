import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type SoundName = 'hop' | 'click' | 'spark' | 'chime';

/** Web audio files live in the public folder; drop the mp3s in `assets/sounds` for native bundling. */
const WEB_SOURCES: Record<SoundName, string> = {
  hop: '/sounds/hop.mp3',
  click: '/sounds/click.mp3',
  spark: '/sounds/spark.mp3',
  chime: '/sounds/chime.mp3',
};

const HAPTIC_STYLE: Record<SoundName, Haptics.ImpactFeedbackStyle> = {
  hop: Haptics.ImpactFeedbackStyle.Light,
  click: Haptics.ImpactFeedbackStyle.Light,
  spark: Haptics.ImpactFeedbackStyle.Medium,
  chime: Haptics.ImpactFeedbackStyle.Heavy,
};

let muted = false;
const webCache: Partial<Record<SoundName, HTMLAudioElement>> = {};

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

/** Fire-and-forget cue. Missing audio files degrade to haptics (native) or silence (web). */
export function playSound(name: SoundName): void {
  if (muted) return;

  if (Platform.OS === 'web') {
    if (typeof Audio === 'undefined') return;
    try {
      const cached = webCache[name] ?? new Audio(WEB_SOURCES[name]);
      webCache[name] = cached;
      cached.currentTime = 0;
      void cached.play().catch(() => undefined);
    } catch {
      // Audio is a progressive enhancement — never break the lesson over it.
    }
    return;
  }

  void Haptics.impactAsync(HAPTIC_STYLE[name]).catch(() => undefined);
}

export default { playSound, setMuted, isMuted };
