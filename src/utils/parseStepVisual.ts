export type StepVisual =
  | { type: 'round'; from: string; to: string; delta: string; caption: string }
  | {
      type: 'cross';
      a1: string;
      a2: string;
      aProduct: string;
      b1: string;
      b2: string;
      bProduct: string;
      result: string;
      caption: string;
    }
  | { type: 'combine'; parts: string[]; result: string; caption: string }
  | { type: 'square'; base: string; result: string; caption: string }
  | { type: 'equation'; left: string; operator: string; right: string; result: string; caption: string }
  | { type: 'text'; caption: string };

const NUM = '(-?\\d+(?:\\.\\d+)?)';
const OP = '([+\\-×x*÷/])';

const ROUND_RE = new RegExp(`round\\s+${NUM}\\s+(up|down)\\s+to\\s+${NUM}`, 'i');
const SQUARE_RE = new RegExp(`${NUM}\\s*[²]\\s*=\\s*${NUM}`);
// Matches "(A × B) + (C × D) = E" — a crosswise multiply-and-add, e.g. Urdhva Tiryagbhyam.
const PAIR = `\\(?\\s*${NUM}\\s*[×x*]\\s*${NUM}\\s*\\)?`;
const CROSS_RE = new RegExp(`${PAIR}\\s*\\+\\s*${PAIR}\\s*=\\s*${NUM}`);
// Matches "8|4|3 → 943" — combining separate digit groups into a final answer.
const COMBINE_RE = /((?:-?\d+\s*\|\s*)+-?\d+)\s*(?:→|->)\s*(-?\d+(?:\.\d+)?)/;
const EQUATION_RE = new RegExp(`\\(?${NUM}\\)?\\s*${OP}\\s*\\(?${NUM}\\)?\\s*=\\s*${NUM}`);

const normalizeOperator = (op: string) => {
  if (op === 'x' || op === '*') return '×';
  if (op === '/') return '÷';
  return op;
};

const formatProduct = (a: string, b: string) => {
  const product = parseFloat(a) * parseFloat(b);
  return Number.isInteger(product) ? String(product) : product.toFixed(2);
};

// Extracts a "board-friendly" numeric transformation from a step's description text
// (e.g. "Round 99 up to 100 (add 1)") so it can be shown as a live worked equation
// instead of just prose, mirroring how a teacher writes it on a chalkboard.
// Checked in order from most specific to most general so compound expressions
// (e.g. "(2 × 1) + (3 × 4) = 14") aren't mis-parsed as a single plain equation.
export function parseStepVisual(step: string): StepVisual {
  const roundMatch = step.match(ROUND_RE);
  if (roundMatch) {
    const [, from, , to] = roundMatch;
    const delta = parseFloat(to) - parseFloat(from);
    return { type: 'round', from, to, delta: `${delta > 0 ? '+' : ''}${delta}`, caption: step };
  }

  const crossMatch = step.match(CROSS_RE);
  if (crossMatch) {
    const [, a1, a2, b1, b2, result] = crossMatch;
    return {
      type: 'cross',
      a1,
      a2,
      aProduct: formatProduct(a1, a2),
      b1,
      b2,
      bProduct: formatProduct(b1, b2),
      result,
      caption: step,
    };
  }

  const combineMatch = step.match(COMBINE_RE);
  if (combineMatch) {
    const [, partsRaw, result] = combineMatch;
    const parts = partsRaw.split('|').map(p => p.trim());
    return { type: 'combine', parts, result, caption: step };
  }

  const squareMatch = step.match(SQUARE_RE);
  if (squareMatch) {
    const [, base, result] = squareMatch;
    return { type: 'square', base, result, caption: step };
  }

  const eqMatch = step.match(EQUATION_RE);
  if (eqMatch) {
    const [, left, operator, right, result] = eqMatch;
    return { type: 'equation', left, operator: normalizeOperator(operator), right, result, caption: step };
  }

  return { type: 'text', caption: step };
}

const VERTICAL_CROSSWISE_PROBLEM_RE = /^(\d{2})\s*[×x*]\s*(\d{2})$/;

// Detects the classic "vertically and crosswise" 2-digit × 2-digit example so it can be
// rendered as a stacked grid instead of a flat list of text steps. Keyed off the step
// captions (rather than concept id) so it only matches lessons phrased this specific way.
export function detectVerticalCrosswise(problem: string, steps: string[]): { a: string; b: string } | null {
  const match = problem.match(VERTICAL_CROSSWISE_PROBLEM_RE);
  if (!match) return null;
  const hasCross = steps.some(s => /cross multiply and add/i.test(s));
  const hasCombine = steps.some(s => /combine with carries/i.test(s));
  if (!hasCross || !hasCombine) return null;
  return { a: match[1], b: match[2] };
}

