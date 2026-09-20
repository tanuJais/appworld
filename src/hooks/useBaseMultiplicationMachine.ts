import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  Phase,
  PHASE_ORDER,
  ScreenState,
  buildScreenState,
  isFinalPhase,
  nextPhase,
  previousPhase,
} from '../utils/baseMultiplication';
import { getStrings, Locale } from '../i18n/baseMultiplicationStrings';
import { bmTiming } from '../components/baseMultiplication/tokens';

export interface MachineOptions {
  leftValue: number;
  rightValue: number;
  base: number;
  locale?: Locale;
  autoPlayDelayMs?: number;
  /** Disables the screen-reader announcements (useful in tests). */
  announce?: boolean;
}

export interface Machine {
  state: ScreenState;
  phaseIndex: number;
  totalPhases: number;
  isAutoPlaying: boolean;
  isFinished: boolean;
  next: () => void;
  back: () => void;
  replay: () => void;
  toggleAutoPlay: () => void;
  /** Components call this when their phase animation finishes; drives auto-advance. */
  onPhaseAnimationComplete: (phase: Phase) => void;
}

/**
 * Phase state machine for the animated Base-multiplication lesson.
 * Auto-play advances only after the current phase reports its animation completed,
 * so the narration never runs ahead of the visuals.
 */
export function useBaseMultiplicationMachine({
  leftValue,
  rightValue,
  base,
  locale = 'en',
  autoPlayDelayMs = bmTiming.autoAdvance,
  announce = true,
}: MachineOptions): Machine {
  const [phase, setPhase] = useState<Phase>('enter');
  const [isAutoPlaying, setAutoPlaying] = useState(false);
  const completedRef = useRef<Phase | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const state = useMemo(
    () => buildScreenState(leftValue, rightValue, base, phase),
    [leftValue, rightValue, base, phase]
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const next = useCallback(() => {
    clearTimer();
    setPhase(current => nextPhase(current));
  }, [clearTimer]);

  const back = useCallback(() => {
    clearTimer();
    setAutoPlaying(false);
    setPhase(current => previousPhase(current));
  }, [clearTimer]);

  const replay = useCallback(() => {
    clearTimer();
    completedRef.current = null;
    setPhase('enter');
  }, [clearTimer]);

  const toggleAutoPlay = useCallback(() => setAutoPlaying(v => !v), []);

  const onPhaseAnimationComplete = useCallback(
    (completed: Phase) => {
      completedRef.current = completed;
      if (!isAutoPlaying || isFinalPhase(completed)) return;
      clearTimer();
      timerRef.current = setTimeout(() => {
        setPhase(current => (current === completed ? nextPhase(current) : current));
      }, autoPlayDelayMs);
    },
    [isAutoPlaying, autoPlayDelayMs, clearTimer]
  );

  // Resume auto-play mid-phase if the learner toggles it on after an animation already finished.
  useEffect(() => {
    if (!isAutoPlaying) {
      clearTimer();
      return;
    }
    if (completedRef.current === phase && !isFinalPhase(phase)) {
      timerRef.current = setTimeout(() => setPhase(current => nextPhase(current)), autoPlayDelayMs);
    }
    return clearTimer;
  }, [isAutoPlaying, phase, autoPlayDelayMs, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  // Reset when the example changes.
  useEffect(() => {
    completedRef.current = null;
    setPhase('enter');
  }, [leftValue, rightValue, base]);

  useEffect(() => {
    if (!announce) return;
    const strings = getStrings(locale);
    const message = isFinalPhase(phase)
      ? strings.finalAnnouncement(state)
      : strings.phaseAnnouncement(state);
    AccessibilityInfo.announceForAccessibility(message);
  }, [phase, announce, locale, state]);

  return {
    state,
    phaseIndex: PHASE_ORDER.indexOf(phase),
    totalPhases: PHASE_ORDER.length,
    isAutoPlaying,
    isFinished: isFinalPhase(phase),
    next,
    back,
    replay,
    toggleAutoPlay,
    onPhaseAnimationComplete,
  };
}

export default useBaseMultiplicationMachine;
