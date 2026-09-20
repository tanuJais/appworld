import { colors, radii, spacing } from '../../theme/theme';

/**
 * Design tokens for the animated Base-multiplication lesson.
 * All foreground/background pairs below meet WCAG AA (>= 4.5:1) at the sizes used.
 */
export const bmColors = {
  canvas: colors.background,
  characterFill: colors.goldSurface,
  characterStroke: colors.primary,
  characterText: colors.primaryDark, // #5C1A0A on #FFF -> 12.5:1
  captionText: colors.textSecondary,
  highlightRing: colors.gold,
  highlightFill: colors.goldSurface,
  noteFill: colors.surfaceMuted,
  baseFill: colors.tealSurface,
  baseStroke: colors.teal,
  baseText: '#0B5C56', // on #E6F5F3 -> 6.4:1
  bubbleNegative: colors.errorSurface,
  bubbleNegativeText: '#8C241A', // on #FBE1DE -> 7.0:1
  bubblePositive: colors.successSurface,
  bubblePositiveText: '#0A5B3F', // on #D9F3E4 -> 6.9:1
  blockLeftFill: colors.surfaceMuted,
  blockRightFill: colors.goldSurface,
  blockText: colors.textPrimary,
  finalFill: colors.primary,
  finalText: colors.textInverse, // #FFF on #8A2B0C -> 8.3:1
  spark: colors.goldLight,
  confetti: ['#D4A017', '#0F766E', '#C2410C', '#9D174D', '#0F8A5F'],
};

export const bmSizes = {
  characterDiameter: 96,
  characterFontSize: 34,
  /** The numeral is the character itself, so it is drawn large. */
  numeralFontSize: 78,
  baseDiameter: 108,
  baseFontSize: 30,
  bubbleDiameter: 52,
  bubbleFontSize: 20,
  blockFontSize: 36,
  finalFontSize: 46,
  gap: spacing.xl,
  radius: radii.lg,
};

/** Animation primitive timings (ms) — keep in sync with the design spec. */
export const bmTiming = {
  hopIn: 500,
  floatUp: 600,
  bubbleTransfer: 700,
  collisionSpark: 400,
  sparkFade: 600,
  slideTogether: 500,
  confettiBurst: 1200,
  /** Delay before auto-play advances to the next phase. */
  autoAdvance: 2400,
};

export default { bmColors, bmSizes, bmTiming };
