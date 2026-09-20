import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import { bmTiming } from '../components/baseMultiplication/tokens';

/**
 * Animation primitives shared by the Base-multiplication lesson.
 * Every hook returns a driver value plus a `play` function so components stay declarative.
 */

export const easings = {
  easeOutBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  easeOutQuad: Easing.bezier(0.5, 1, 0.89, 1),
  easeInOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  easeOutExpo: Easing.bezier(0.16, 1, 0.3, 1),
};

/**
 * True when the platform asks for reduced motion, or when measured frame rate is poor.
 * Consumers shorten/skip animations instead of dropping frames.
 */
export function useReducedMotion(sampleMs = 1500): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(value => {
        if (!cancelled && value) setReduced(true);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', value =>
      setReduced(Boolean(value))
    );
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof requestAnimationFrame !== 'function') return;
    let frames = 0;
    let rafId = 0;
    const start = Date.now();
    const tick = () => {
      frames += 1;
      if (Date.now() - start >= sampleMs) {
        const fps = (frames * 1000) / (Date.now() - start);
        if (fps < 40) setReduced(true);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [sampleMs]);

  return reduced;
}

type PlayFn = (onComplete?: () => void) => void;

function useTimedDriver(
  duration: number,
  easing: (v: number) => number,
  reducedMotion: boolean
): [Animated.Value, PlayFn, () => void] {
  const value = useRef(new Animated.Value(0)).current;

  const reset = useCallback(() => value.setValue(0), [value]);

  const play = useCallback<PlayFn>(
    onComplete => {
      value.setValue(0);
      Animated.timing(value, {
        toValue: 1,
        duration: reducedMotion ? Math.min(150, duration) : duration,
        easing: reducedMotion ? Easing.linear : easing,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onComplete?.();
      });
    },
    [value, duration, easing, reducedMotion]
  );

  return [value, play, reset];
}

/** 500ms easeOutBack entrance — characters bounce onto the stage. */
export function useHopIn(reducedMotion = false) {
  const [progress, play, reset] = useTimedDriver(bmTiming.hopIn, easings.easeOutBack, reducedMotion);
  const style = useMemo(
    () => ({
      opacity: progress,
      transform: [
        { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) },
        { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-40, 0] }) },
      ],
    }),
    [progress]
  );
  return { progress, style, play, reset };
}

/** 600ms easeOutQuad rise — deviation bubbles float above their character. */
export function useFloatUp(reducedMotion = false) {
  const [progress, play, reset] = useTimedDriver(bmTiming.floatUp, easings.easeOutQuad, reducedMotion);
  const style = useMemo(
    () => ({
      opacity: progress,
      transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [16, -8] }) }],
    }),
    [progress]
  );
  return { progress, style, play, reset };
}

/** 700ms easeInOutCubic travel of a bubble from one character to the other. */
export function useBubbleTransfer(distance: number, reducedMotion = false) {
  const [progress, play, reset] = useTimedDriver(
    bmTiming.bubbleTransfer,
    easings.easeInOutCubic,
    reducedMotion
  );
  const style = useMemo(
    () => ({
      transform: [
        { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, distance] }) },
        {
          translateY: progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, -28, 0],
          }),
        },
      ],
    }),
    [progress, distance]
  );
  return { progress, style, play, reset };
}

/** 400ms burst plus a 600ms particle fade when the two deviations collide. */
export function useCollisionSpark(reducedMotion = false) {
  const burst = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const play = useCallback<PlayFn>(
    onComplete => {
      burst.setValue(0);
      fade.setValue(1);
      Animated.sequence([
        Animated.timing(burst, {
          toValue: 1,
          duration: reducedMotion ? 120 : bmTiming.collisionSpark,
          easing: easings.easeOutQuad,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 0,
          duration: reducedMotion ? 120 : bmTiming.sparkFade,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onComplete?.();
      });
    },
    [burst, fade, reducedMotion]
  );

  const reset = useCallback(() => {
    burst.setValue(0);
    fade.setValue(0);
  }, [burst, fade]);

  const style = useMemo(
    () => ({
      opacity: fade,
      transform: [{ scale: burst.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1.8] }) }],
    }),
    [burst, fade]
  );

  return { burst, fade, style, play, reset };
}

/** 500ms easeOutExpo slide that snaps the two result blocks together. */
export function useSlideTogether(reducedMotion = false) {
  const [progress, play, reset] = useTimedDriver(
    bmTiming.slideTogether,
    easings.easeOutExpo,
    reducedMotion
  );
  return { progress, play, reset };
}

/** 1200ms confetti driver. */
export function useConfettiBurst(reducedMotion = false) {
  const [progress, play, reset] = useTimedDriver(
    bmTiming.confettiBurst,
    easings.easeOutQuad,
    reducedMotion
  );
  return { progress, play, reset };
}

/** Looping attention pulse for the final answer. */
export function usePulse(active: boolean, reducedMotion = false) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active || reducedMotion) {
      value.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: 600, easing: easings.easeOutQuad, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: 600, easing: easings.easeOutQuad, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, reducedMotion, value]);

  const style = useMemo(
    () => ({ transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }] }),
    [value]
  );

  return { progress: value, style };
}
