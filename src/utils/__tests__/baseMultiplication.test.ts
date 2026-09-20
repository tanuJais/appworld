import {
  PHASE_ORDER,
  baseZeroCount,
  buildScreenState,
  computeCrossAdd,
  computeDevProduct,
  computeDeviation,
  computeFinalResult,
  formatDeviation,
  isFinalPhase,
  nextPhase,
  padToBaseZeros,
  previousPhase,
} from '../baseMultiplication';

describe('math helpers', () => {
  it('computes deviations below and above the base', () => {
    expect(computeDeviation(98, 100)).toBe(-2);
    expect(computeDeviation(103, 100)).toBe(3);
    expect(computeDeviation(100, 100)).toBe(0);
  });

  it('cross-adds using the other number deviation', () => {
    expect(computeCrossAdd(98, -3)).toBe(95);
    expect(computeCrossAdd(97, -2)).toBe(95);
  });

  it('returns the magnitude of the deviation product', () => {
    expect(computeDevProduct(-2, -3)).toBe(6);
    expect(computeDevProduct(3, -2)).toBe(6);
    expect(computeDevProduct(0, -3)).toBe(0);
  });

  it('counts base zeros', () => {
    expect(baseZeroCount(10)).toBe(1);
    expect(baseZeroCount(100)).toBe(2);
    expect(baseZeroCount(1000)).toBe(3);
  });

  it('pads to the base zero width', () => {
    expect(padToBaseZeros(6, 100)).toBe('06');
    expect(padToBaseZeros(6, 1000)).toBe('006');
    expect(padToBaseZeros(56, 100)).toBe('56');
    expect(padToBaseZeros(156, 100)).toBe('156');
    expect(padToBaseZeros(0, 100)).toBe('00');
  });
});

describe('buildScreenState', () => {
  const cases: Array<[number, number, number]> = [
    [98, 97, 100], // both below
    [103, 104, 100], // both above
    [103, 98, 100], // mixed sign -> borrow
    [88, 87, 100], // carry out of the right part
    [994, 998, 1000], // base 1000
    [100, 97, 100], // zero deviation
    [100, 100, 100], // both zero deviations
    [9, 7, 10], // base 10
  ];

  it.each(cases)('derives the correct answer for %i x %i (base %i)', (left, right, base) => {
    const s = buildScreenState(left, right, base);
    expect(Number(s.finalResult)).toBe(computeFinalResult(left, right));
  });

  it('matches the canonical 98 x 97 walkthrough', () => {
    const s = buildScreenState(98, 97, 100);
    expect(s).toMatchObject({
      phase: 'enter',
      leftDev: -2,
      rightDev: -3,
      crossResult: 95,
      devProduct: 6,
      devProductPadded: '06',
      finalResult: '9506',
      hasCarry: false,
      isMixedSign: false,
    });
  });

  it('flags a carry when the deviation product overflows the base', () => {
    const s = buildScreenState(88, 87, 100);
    expect(s.hasCarry).toBe(true);
    expect(s.devProductPadded).toBe('56');
    expect(s.finalResult).toBe('7656');
  });

  it('flags a borrow when the deviations have opposite signs', () => {
    const s = buildScreenState(103, 98, 100);
    expect(s.isMixedSign).toBe(true);
    expect(s.finalResult).toBe('10094');
  });

  it('handles a zero deviation', () => {
    const s = buildScreenState(100, 97, 100);
    expect(s.leftDev).toBe(0);
    expect(s.devProductPadded).toBe('00');
    expect(s.finalResult).toBe('9700');
  });
});

describe('phase helpers', () => {
  it('walks forward and clamps at the end', () => {
    expect(nextPhase('enter')).toBe('deviations');
    expect(nextPhase('celebrate')).toBe('celebrate');
  });

  it('walks back and clamps at the start', () => {
    expect(previousPhase('crossAdd')).toBe('deviations');
    expect(previousPhase('enter')).toBe('enter');
  });

  it('knows the final phase', () => {
    expect(isFinalPhase('celebrate')).toBe(true);
    expect(isFinalPhase('merge')).toBe(false);
    expect(PHASE_ORDER).toHaveLength(6);
  });
});

describe('formatDeviation', () => {
  it('signs values for display', () => {
    expect(formatDeviation(-2)).toBe('-2');
    expect(formatDeviation(3)).toBe('+3');
    expect(formatDeviation(0)).toBe('0');
  });
});
