/**
 * Pure math + state helpers for the Base-N multiplication sutra
 * ("Nikhilam Navatashcaramam Dashatah" — all from 9, last from 10).
 *
 * Worked example: 98 x 97 with base 100
 *   leftDev = -2, rightDev = -3
 *   crossResult = 98 + (-3) = 95
 *   devProduct  = 2 * 3 = 6 -> padded "06"
 *   final       = "9506"
 */

export type Phase = 'enter' | 'deviations' | 'crossAdd' | 'multiply' | 'merge' | 'celebrate';

export const PHASE_ORDER: readonly Phase[] = [
  'enter',
  'deviations',
  'crossAdd',
  'multiply',
  'merge',
  'celebrate',
] as const;

export interface ScreenState {
  phase: Phase;
  leftValue: number;
  rightValue: number;
  base: number;
  leftDev: number;
  rightDev: number;
  crossResult: number;
  devProduct: number;
  devProductPadded: string;
  finalResult: string;
  /** True when the deviation product overflowed the base width and a carry moved left. */
  hasCarry: boolean;
  /** True when one number is above the base and the other below (requires a borrow). */
  isMixedSign: boolean;
}

/** value - base. Negative below the base, positive above it. */
export function computeDeviation(value: number, base: number): number {
  return value - base;
}

/** Cross-addition: either number plus the *other* number's deviation (both give the same answer). */
export function computeCrossAdd(leftValue: number, rightDev: number): number {
  return leftValue + rightDev;
}

/** Magnitude of the deviation product, which is what the learner writes on the right. */
export function computeDevProduct(leftDev: number, rightDev: number): number {
  return Math.abs(leftDev * rightDev);
}

/** Number of trailing zeros in the base — 100 -> 2, 1000 -> 3. */
export function baseZeroCount(base: number): number {
  if (!Number.isFinite(base) || base <= 0) return 0;
  return Math.max(0, String(Math.trunc(base)).length - 1);
}

/** Pads a number with leading zeros to the base's zero-width. Longer values are returned intact. */
export function padToBaseZeros(value: number, base: number): string {
  const width = baseZeroCount(base);
  const digits = String(Math.abs(Math.trunc(value)));
  return digits.length >= width ? digits : digits.padStart(width, '0');
}

/** The mathematically exact product, used to validate the animated construction. */
export function computeFinalResult(leftValue: number, rightValue: number): number {
  return leftValue * rightValue;
}

/**
 * Builds the full derivation for a phase-driven screen. Handles the three cases a learner
 * can hit: both numbers below the base, both above, and one of each (mixed sign).
 */
export function buildScreenState(
  leftValue: number,
  rightValue: number,
  base: number,
  phase: Phase = 'enter'
): ScreenState {
  const leftDev = computeDeviation(leftValue, base);
  const rightDev = computeDeviation(rightValue, base);
  const signedProduct = leftDev * rightDev;
  const isMixedSign = signedProduct < 0;

  const width = baseZeroCount(base);
  const limit = base;

  let crossResult = computeCrossAdd(leftValue, rightDev);
  let rightPart = Math.abs(signedProduct);
  let hasCarry = false;

  if (isMixedSign) {
    // e.g. 103 x 98 -> right part must be borrowed from the left part.
    crossResult -= 1;
    rightPart = limit - rightPart;
  } else if (rightPart >= limit) {
    // e.g. 88 x 87 -> deviation product overflows the base width, carry moves left.
    crossResult += Math.floor(rightPart / limit);
    rightPart = rightPart % limit;
    hasCarry = true;
  }

  const devProductPadded = String(rightPart).padStart(width, '0');

  return {
    phase,
    leftValue,
    rightValue,
    base,
    leftDev,
    rightDev,
    crossResult,
    devProduct: computeDevProduct(leftDev, rightDev),
    devProductPadded,
    finalResult: `${crossResult}${devProductPadded}`,
    hasCarry,
    isMixedSign,
  };
}

export function nextPhase(phase: Phase): Phase {
  const i = PHASE_ORDER.indexOf(phase);
  return PHASE_ORDER[Math.min(i + 1, PHASE_ORDER.length - 1)];
}

export function previousPhase(phase: Phase): Phase {
  const i = PHASE_ORDER.indexOf(phase);
  return PHASE_ORDER[Math.max(i - 1, 0)];
}

export function isFinalPhase(phase: Phase): boolean {
  return phase === PHASE_ORDER[PHASE_ORDER.length - 1];
}

/** Signs the deviation for display: -2, +3, 0. */
export function formatDeviation(dev: number): string {
  if (dev === 0) return '0';
  return dev > 0 ? `+${dev}` : String(dev);
}
