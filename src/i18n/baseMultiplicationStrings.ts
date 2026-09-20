import { Phase, ScreenState, formatDeviation } from '../utils/baseMultiplication';

/**
 * Localized copy for the Base multiplication teaching screen.
 * Add a new locale key to `STRINGS` to translate the whole screen.
 */
export type Locale = 'en';

type Strings = {
  screenTitle: string;
  sutraName: string;
  sutraMeaning: string;
  phaseTitle: Record<Phase, string>;
  /** Kid-friendly "what we are doing and why" line for each phase. */
  phaseTip: Record<Phase, string>;
  /** The maths written out for the current phase. */
  phaseEquation: (state: ScreenState) => string;
  whatWeDo: string;
  leftCaption: string;
  rightCaption: string;
  baseCaption: string;
  bubblesCaption: string;
  leftPartCaption: string;
  wasNote: (value: number) => string;
  morphBanner: (from: number, dev: number, to: number) => string;
  next: string;
  replay: string;
  autoPlayOn: string;
  autoPlayOff: string;
  nextHint: string;
  replayHint: string;
  autoPlayHint: string;
  baseLabel: (base: number) => string;
  numberCharacter: (value: number) => string;
  deviationBubble: (value: number, dev: number, base: number) => string;
  leftBlock: (value: number) => string;
  rightBlock: (value: string) => string;
  finalAnnouncement: (state: ScreenState) => string;
  phaseAnnouncement: (state: ScreenState) => string;
};

const en: Strings = {
  screenTitle: 'Friendly Numbers near 100',
  sutraName: 'Nikhilam Navatashcaramam Dashatah',
  sutraMeaning: 'All from 9 and the last from 10 — when numbers sit close to a base, we multiply the tiny gaps instead of the big numbers.',
  phaseTitle: {
    enter: 'Meet the numbers',
    deviations: 'How far from the base?',
    crossAdd: 'Cross-add for the left part',
    multiply: 'Multiply the little numbers',
    merge: 'Join the two parts',
    celebrate: 'You did it!',
  },
  phaseTip: {
    enter: 'Both numbers are almost 100. Big numbers are hard, so we will use their small gaps from 100 instead.',
    deviations: 'Count down from the base to each number. That gap is called the deviation, and we write it in a bubble.',
    crossAdd: 'The other number\u2019s bubble hops across and joins this number. 98 \u2212 3 = 95, so the 98 character turns into 95 \u2014 that 95 is the left part of the answer. Try the other way too: 97 \u2212 2 = 95 as well.',
    multiply: 'Now multiply the two bubbles together. This small answer becomes the right part, padded with zeros to match the base.',
    merge: 'Write the left part, then the right part, side by side. No long multiplication needed!',
    celebrate: 'That is the whole trick: gap, gap, cross-add, multiply, join.',
  },
  phaseEquation: (s) => {
    switch (s.phase) {
      case 'enter':
        return `${s.leftValue} × ${s.rightValue} = ?`;
      case 'deviations':
        return `${s.leftValue} − ${s.base} = ${formatDeviation(s.leftDev)}    ${s.rightValue} − ${s.base} = ${formatDeviation(s.rightDev)}`;
      case 'crossAdd':
        return `${s.leftValue} + (${formatDeviation(s.rightDev)}) = ${s.crossResult}`;
      case 'multiply':
        return `(${formatDeviation(s.leftDev)}) × (${formatDeviation(s.rightDev)}) = ${s.devProduct} → ${s.devProductPadded}`;
      case 'merge':
        return `${s.crossResult} | ${s.devProductPadded} → ${s.finalResult}`;
      case 'celebrate':
        return `${s.leftValue} × ${s.rightValue} = ${s.finalResult}`;
    }
  },
  whatWeDo: 'What we are doing',
  leftCaption: 'first number',
  rightCaption: 'second number',
  baseCaption: 'our helper base',
  bubblesCaption: 'gaps from the base',
  leftPartCaption: 'left part of the answer',
  wasNote: (value) => `was ${value}`,
  morphBanner: (from, dev, to) =>
    `${from} ${dev < 0 ? '−' : '+'} ${Math.abs(dev)} → ${to}`,
  next: 'Next',
  replay: 'Replay',
  autoPlayOn: 'Pause',
  autoPlayOff: 'Auto play',
  nextHint: 'Show the next step of the trick',
  replayHint: 'Start the demonstration again from the beginning',
  autoPlayHint: 'Play all the steps automatically',
  baseLabel: (base) => `Base ${base}`,
  numberCharacter: (value) => `Number ${value}`,
  deviationBubble: (value, dev, base) =>
    dev === 0
      ? `${value} is exactly on the base ${base}`
      : dev < 0
        ? `${value} is ${Math.abs(dev)} less than ${base}`
        : `${value} is ${dev} more than ${base}`,
  leftBlock: (value) => `Left part ${value}`,
  rightBlock: (value) => `Right part ${value}`,
  finalAnnouncement: (s) =>
    `${s.leftValue} times ${s.rightValue} equals ${s.finalResult}. Great work!`,
  phaseAnnouncement: (s) => {
    switch (s.phase) {
      case 'enter':
        return `Let us multiply ${s.leftValue} by ${s.rightValue}.`;
      case 'deviations':
        return `The base is ${s.base}. ${s.leftValue} is ${formatDeviation(s.leftDev)} from the base, and ${s.rightValue} is ${formatDeviation(s.rightDev)} from the base.`;
      case 'crossAdd':
        return `Cross add: ${s.leftValue} plus ${formatDeviation(s.rightDev)} equals ${s.crossResult}. That is the left part.`;
      case 'multiply':
        return `Multiply the deviations: ${Math.abs(s.leftDev)} times ${Math.abs(s.rightDev)} equals ${s.devProduct}, written as ${s.devProductPadded}.`;
      case 'merge':
        return `Join ${s.crossResult} and ${s.devProductPadded} to make ${s.finalResult}.`;
      case 'celebrate':
        return `${s.leftValue} times ${s.rightValue} equals ${s.finalResult}.`;
    }
  },
};

const STRINGS: Record<Locale, Strings> = { en };

export function getStrings(locale: Locale = 'en'): Strings {
  return STRINGS[locale] ?? en;
}
