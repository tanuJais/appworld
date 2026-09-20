import { Question } from '../types';

// Ekadhikena Purvena Questions
export const ekadhinaQuestions: Question[] = [
  // Easy
  { id: 'e1', conceptId: 'ekadhikena-purvena', question: '15²', answer: 225, difficulty: 'easy', hint: 'First digit is 1, multiply by 2, append 25' },
  { id: 'e2', conceptId: 'ekadhikena-purvena', question: '25²', answer: 625, difficulty: 'easy', hint: 'First digit is 2, multiply by 3, append 25' },
  { id: 'e3', conceptId: 'ekadhikena-purvena', question: '35²', answer: 1225, difficulty: 'easy', hint: 'First digit is 3, multiply by 4, append 25' },
  { id: 'e4', conceptId: 'ekadhikena-purvena', question: '45²', answer: 2025, difficulty: 'easy', hint: 'First digit is 4, multiply by 5, append 25' },
  { id: 'e5', conceptId: 'ekadhikena-purvena', question: '55²', answer: 3025, difficulty: 'easy', hint: 'First digit is 5, multiply by 6, append 25' },
  
  // Medium
  { id: 'm1', conceptId: 'ekadhikena-purvena', question: '65²', answer: 4225, difficulty: 'medium', hint: '6 × 7 = 42, append 25' },
  { id: 'm2', conceptId: 'ekadhikena-purvena', question: '75²', answer: 5625, difficulty: 'medium', hint: '7 × 8 = 56, append 25' },
  { id: 'm3', conceptId: 'ekadhikena-purvena', question: '85²', answer: 7225, difficulty: 'medium', hint: '8 × 9 = 72, append 25' },
  { id: 'm4', conceptId: 'ekadhikena-purvena', question: '95²', answer: 9025, difficulty: 'medium', hint: '9 × 10 = 90, append 25' },
  
  // Hard
  { id: 'h1', conceptId: 'ekadhikena-purvena', question: '105²', answer: 11025, difficulty: 'hard', hint: '10 × 11 = 110, append 25' },
  { id: 'h2', conceptId: 'ekadhikena-purvena', question: '115²', answer: 13225, difficulty: 'hard', hint: '11 × 12 = 132, append 25' },
  { id: 'h3', conceptId: 'ekadhikena-purvena', question: '125²', answer: 15625, difficulty: 'hard', hint: '12 × 13 = 156, append 25' },
  { id: 'h4', conceptId: 'ekadhikena-purvena', question: '135²', answer: 18225, difficulty: 'hard', hint: '13 × 14 = 182, append 25' },
  
  // Expert
  { id: 'ex1', conceptId: 'ekadhikena-purvena', question: '145²', answer: 21025, difficulty: 'expert' },
  { id: 'ex2', conceptId: 'ekadhikena-purvena', question: '155²', answer: 24025, difficulty: 'expert' },
  { id: 'ex3', conceptId: 'ekadhikena-purvena', question: '165²', answer: 27225, difficulty: 'expert' },
  { id: 'ex4', conceptId: 'ekadhikena-purvena', question: '175²', answer: 30625, difficulty: 'expert' },
  { id: 'ex5', conceptId: 'ekadhikena-purvena', question: '185²', answer: 34225, difficulty: 'expert' },
  { id: 'ex6', conceptId: 'ekadhikena-purvena', question: '195²', answer: 38025, difficulty: 'expert' },
];

export const getQuestionsByDifficulty = (conceptId: string, difficulty: string, count: number): Question[] => {
  const filtered = ekadhinaQuestions.filter(
    q => q.conceptId === conceptId && q.difficulty === difficulty
  );
  return filtered.slice(0, count);
};

export const getRandomQuestions = (conceptId: string, count: number, difficulty?: string): Question[] => {
  let filtered = ekadhinaQuestions.filter(q => q.conceptId === conceptId);
  
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle and return
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Generate dynamic questions for Ekadhikena Purvena (squares ending in 5)
const generateSquareQuestion = (n: number, difficulty: string): Question => {
  const number = n * 10 + 5; // Convert to n5 format (15, 25, 35, etc.)
  const answer = n * (n + 1) * 100 + 25; // n × (n+1) concatenated with 25
  
  let hint = '';
  if (difficulty === 'easy') {
    hint = `First digit is ${n}, multiply by ${n + 1}, append 25`;
  } else if (difficulty === 'medium') {
    hint = `${n} × ${n + 1} = ${n * (n + 1)}, append 25`;
  }
  
  return {
    id: `gen_${number}_${Date.now()}_${Math.random()}`,
    conceptId: 'ekadhikena-purvena',
    question: `${number}²`,
    answer: answer,
    difficulty: difficulty as 'easy' | 'medium' | 'hard' | 'expert',
    hint: hint || undefined
  };
};

// Generate fresh questions dynamically
export const generateDynamicQuestions = (conceptId: string, count: number, difficulty?: string): Question[] => {
  const generator = dynamicQuestionGenerators[conceptId];
  if (generator) {
    return generator(count, difficulty);
  }
  if (conceptId !== 'ekadhikena-purvena') {
    return generateGeneralQuestions(conceptId, count, difficulty);
  }
  
  const questions: Question[] = [];
  
  // Define ranges for each difficulty
  let minN = 1, maxN = 9;
  let targetDifficulty = difficulty || 'easy';
  
  if (!difficulty) {
    // Mixed difficulty - use full range
    minN = 1;
    maxN = 50;
  } else {
    switch (difficulty) {
      case 'easy':
        minN = 1; maxN = 9;
        break;
      case 'medium':
        minN = 10; maxN = 19;
        break;
      case 'hard':
        minN = 20; maxN = 39;
        break;
      case 'expert':
        minN = 40; maxN = 99;
        break;
    }
  }
  
  const rangeSize = maxN - minN + 1;
  const usedNumbers = new Set<number>();
  
  // Generate questions - allow duplicates if we need more than available range
  while (questions.length < count) {
    // Reset usedNumbers if we've used all available numbers
    if (usedNumbers.size >= rangeSize) {
      usedNumbers.clear();
    }
    
    const n = Math.floor(Math.random() * rangeSize) + minN;
    
    if (!usedNumbers.has(n)) {
      usedNumbers.add(n);
      
      // Determine difficulty for this question if mixed mode
      let questionDifficulty = targetDifficulty;
      if (!difficulty) {
        if (n <= 9) questionDifficulty = 'easy';
        else if (n <= 19) questionDifficulty = 'medium';
        else if (n <= 39) questionDifficulty = 'hard';
        else questionDifficulty = 'expert';
      }
      
      questions.push(generateSquareQuestion(n, questionDifficulty));
    }
  }
  
  return questions;
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const uniqueId = () => `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const difficultyRanges: Record<string, [number, number]> = {
  easy: [1, 2],
  medium: [2, 3],
  hard: [3, 4],
  expert: [4, 5],
};

const pickDifficulty = (difficulty?: string): 'easy' | 'medium' | 'hard' | 'expert' => {
  if (difficulty) return difficulty as 'easy' | 'medium' | 'hard' | 'expert';
  const levels = ['easy', 'medium', 'hard', 'expert'] as const;
  return levels[randomInt(0, levels.length - 1)];
};

/** Level 1: quick mental addition/subtraction using round-number shortcuts. */
const generateIntroQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [minDigits, maxDigits] = difficultyRanges[questionDifficulty] || [1, 2];
    const base = randomInt(Math.pow(10, minDigits), Math.pow(10, maxDigits) - 1);
    const roundBase = Math.round(base / 10) * 10;
    const addend = randomInt(10, 90);
    const isAddition = Math.random() > 0.5;
    const a = roundBase - 1;
    const answer = isAddition ? a + addend : a - addend;

    questions.push({
      id: uniqueId(),
      conceptId: 'intro-mental-math',
      question: isAddition ? `${a} + ${addend}` : `${a} - ${addend}`,
      answer,
      difficulty: questionDifficulty,
      hint: isAddition
        ? `Round ${a} up to ${a + 1}, add, then subtract 1`
        : `Round ${a} up to ${a + 1}, subtract, then add 1 back`,
    });
  }
  return questions;
};

/** Level 3: Nikhilam multiplication of numbers close to a base (10/100/1000). */
const generateNikhilamQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const base = questionDifficulty === 'easy' || questionDifficulty === 'medium' ? 100 : 1000;
    const maxDeviation = questionDifficulty === 'easy' ? 5 : questionDifficulty === 'medium' ? 10 : 20;
    const dev1 = randomInt(1, maxDeviation);
    const dev2 = randomInt(1, maxDeviation);
    const a = base - dev1;
    const b = base - dev2;

    questions.push({
      id: uniqueId(),
      conceptId: 'nikhilam-navatashcaramam-dashatah',
      question: `${a} × ${b}`,
      answer: a * b,
      difficulty: questionDifficulty,
      hint: `Base ${base}, deviations -${dev1} and -${dev2}: cross-subtract, then multiply deviations`,
    });
  }
  return questions;
};

/** Level 4: Urdhva-Tiryagbhyam general multiplication. */
const generateUrdhvaQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const digits = questionDifficulty === 'easy' ? 1 : questionDifficulty === 'medium' ? 2 : questionDifficulty === 'hard' ? 2 : 3;
    const min = Math.pow(10, digits - 1) || 1;
    const max = Math.pow(10, digits) - 1;
    const a = randomInt(Math.max(min, 10), max);
    const b = randomInt(Math.max(min, 10), max);

    questions.push({
      id: uniqueId(),
      conceptId: 'urdhva-tiryagbhyam',
      question: `${a} × ${b}`,
      answer: a * b,
      difficulty: questionDifficulty,
      hint: 'Multiply vertically and crosswise, then combine with carries',
    });
  }
  return questions;
};

/** Give every catalog lesson an owned practice set until it has a specialist generator. */
const generateGeneralQuestions = (conceptId: string, count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = difficultyRanges[questionDifficulty] || [1, 2];
    const first = randomInt(Math.pow(10, min - 1), Math.pow(10, max) - 1);
    const second = randomInt(Math.pow(10, min - 1), Math.pow(10, max) - 1);
    const operation = i % 3;
    let question: string;
    let answer: number;

    if (operation === 0) {
      question = `${first} + ${second}`;
      answer = first + second;
    } else if (operation === 1) {
      const larger = Math.max(first, second);
      const smaller = Math.min(first, second);
      question = `${larger} - ${smaller}`;
      answer = larger - smaller;
    } else {
      const multiplier = randomInt(2, 9);
      question = `${first} × ${multiplier}`;
      answer = first * multiplier;
    }

    questions.push({
      id: uniqueId(),
      conceptId,
      question,
      answer,
      difficulty: questionDifficulty,
      hint: 'Estimate first, then choose the simplest method and verify your answer.',
    });
  }
  return questions;
};

/** Generic integer magnitude scale used by the algebra-style generators below. */
const magnitudeRanges: Record<'easy' | 'medium' | 'hard' | 'expert', [number, number]> = {
  easy: [2, 12],
  medium: [10, 40],
  hard: [30, 100],
  expert: [80, 300],
};

/** Small integer roots/constants used by the quadratic-factoring generators. */
const rootRanges: Record<'easy' | 'medium' | 'hard' | 'expert', [number, number]> = {
  easy: [1, 5],
  medium: [2, 8],
  hard: [4, 12],
  expert: [8, 20],
};

/** Level: Paravartya Yojayet — division by a divisor just below a base (10/100/1000). */
const generateParavartyaQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const base = questionDifficulty === 'easy' || questionDifficulty === 'medium' ? 100 : 1000;
    const maxDeviation = questionDifficulty === 'easy' ? 3 : questionDifficulty === 'medium' ? 6 : questionDifficulty === 'hard' ? 12 : 25;
    const deviation = randomInt(1, maxDeviation);
    const divisor = base - deviation;
    const maxQuotient = questionDifficulty === 'easy' ? 9 : questionDifficulty === 'medium' ? 20 : questionDifficulty === 'hard' ? 40 : 80;
    const quotient = randomInt(2, maxQuotient);
    const dividend = divisor * quotient;

    questions.push({
      id: uniqueId(),
      conceptId: 'paravartya-yojayet',
      question: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      difficulty: questionDifficulty,
      hint: `Divisor is ${deviation} below ${base}. Transpose the complement ${deviation} and carry it into the quotient as you divide.`,
    });
  }
  return questions;
};

/** Level: Shunyam Saamyasamuccaye — x + a = b - x, solved by combining equal sums. */
const generateShunyamQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = magnitudeRanges[questionDifficulty];
    const x = randomInt(min, max);
    const a = randomInt(min, max);
    const b = 2 * x + a;

    questions.push({
      id: uniqueId(),
      conceptId: 'shunyam-saamyasamuccaye',
      question: `x + ${a} = ${b} - x`,
      answer: x,
      difficulty: questionDifficulty,
      hint: `Add x to both sides to get 2x + ${a} = ${b}, then isolate x.`,
    });
  }
  return questions;
};

/** Level: Anurupye Shunyamanyat — cx + a = dx + b, solved with the ratio-based zero method. */
const generateAnurupyeQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = magnitudeRanges[questionDifficulty];
    const x = randomInt(min, max);
    const c = randomInt(2, 4);
    const d = c + randomInt(1, 3);
    const b = randomInt(min, max);
    const a = b + (d - c) * x;

    questions.push({
      id: uniqueId(),
      conceptId: 'anurupye-shunyamanyat',
      question: `${c}x + ${a} = ${d}x + ${b}`,
      answer: x,
      difficulty: questionDifficulty,
      hint: `Move the x terms together: ${d - c}x = ${a - b}, then divide to find x.`,
    });
  }
  return questions;
};

/** Level: Sankalana-Vyavakalanabhyam — add/subtract simultaneous equations to isolate x. */
const generateSankalanaQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = magnitudeRanges[questionDifficulty];
    const x = randomInt(min + 1, max);
    const y = randomInt(min, x - 1);
    const sum = x + y;
    const diff = x - y;

    questions.push({
      id: uniqueId(),
      conceptId: 'sankalana-vyavakalanabhyam',
      question: `x + y = ${sum}, x - y = ${diff}. Find x.`,
      answer: x,
      difficulty: questionDifficulty,
      hint: 'Add the two equations to eliminate y, then divide by 2.',
    });
  }
  return questions;
};

/** Level: Puranapuranabhyam — complete to a round number, then rebalance the rest. */
const generatePuranapuranabhyamQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const roundStep = questionDifficulty === 'hard' || questionDifficulty === 'expert' ? 100 : 10;
    const multiplierMax = questionDifficulty === 'easy' ? 5 : questionDifficulty === 'medium' ? 9 : questionDifficulty === 'hard' ? 20 : 90;
    const roundBase = randomInt(1, multiplierMax) * roundStep + roundStep;
    const deficiency = randomInt(1, 4);
    const a = roundBase - deficiency;
    const addend = randomInt(10, 90);

    questions.push({
      id: uniqueId(),
      conceptId: 'puranapuranabhyam',
      question: `${a} + ${addend}`,
      answer: a + addend,
      difficulty: questionDifficulty,
      hint: `${a} is ${deficiency} short of ${roundBase}; borrow ${deficiency} from ${addend}, then add to the round number.`,
    });
  }
  return questions;
};

/** Level: Chalana-Kalanabhyam — factor a quadratic; the answer is its smaller root. */
const generateChalanaKalanabhyamQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = rootRanges[questionDifficulty];
    const r1 = randomInt(min, max);
    const r2 = randomInt(r1 + 1, max + 2);
    const sum = r1 + r2;
    const product = r1 * r2;

    questions.push({
      id: uniqueId(),
      conceptId: 'chalana-kalanabhyam',
      question: `x² - ${sum}x + ${product} = 0 (smaller root)`,
      answer: r1,
      difficulty: questionDifficulty,
      hint: `Find two numbers that multiply to ${product} and add to ${sum}.`,
    });
  }
  return questions;
};

/** Level: Yaavadunam — square a number close to a base by working with its deficiency. */
const generateYaavadunamQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const base = questionDifficulty === 'easy' ? 10 : questionDifficulty === 'medium' || questionDifficulty === 'hard' ? 100 : 1000;
    const maxDeficiency = questionDifficulty === 'easy' ? 2 : questionDifficulty === 'medium' ? 5 : questionDifficulty === 'hard' ? 20 : 50;
    const deficiency = randomInt(1, maxDeficiency);
    const n = base - deficiency;

    questions.push({
      id: uniqueId(),
      conceptId: 'yaavadunam',
      question: `${n}²`,
      answer: n * n,
      difficulty: questionDifficulty,
      hint: `Deficiency from ${base} is ${deficiency}. Subtract it again (${n} - ${deficiency}) then append the square of ${deficiency}.`,
    });
  }
  return questions;
};

/** Level: Vyashtisamanstih — expand (x + a)(x + b) = product and find the positive root. */
const generateVyashtisamanstihQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = rootRanges[questionDifficulty];
    const x = randomInt(min, max);
    const a = randomInt(1, 5);
    const b = randomInt(1, 5);
    const product = (x + a) * (x + b);

    questions.push({
      id: uniqueId(),
      conceptId: 'vyashtisamanstih',
      question: `(x + ${a})(x + ${b}) = ${product} (positive root)`,
      answer: x,
      difficulty: questionDifficulty,
      hint: 'Expand into a quadratic, factor it, and keep the positive root.',
    });
  }
  return questions;
};

/** Level: Shesanyankena Charamena — long-division remainders behind recurring decimals. */
const generateShesanyankenaQuestions = (count: number, difficulty?: string): Question[] => {
  const divisorsByDifficulty: Record<'easy' | 'medium' | 'hard' | 'expert', number[]> = {
    easy: [3, 6, 7, 9],
    medium: [11, 13, 17],
    hard: [19, 23, 29],
    expert: [31, 37, 41],
  };
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const divisors = divisorsByDifficulty[questionDifficulty];
    const divisor = divisors[randomInt(0, divisors.length - 1)];
    const power = questionDifficulty === 'easy' ? 1 : questionDifficulty === 'medium' ? 2 : questionDifficulty === 'hard' ? 3 : 4;
    const numerator = Math.pow(10, power);

    questions.push({
      id: uniqueId(),
      conceptId: 'shesanyankena-charamena',
      question: `Remainder of ${numerator} ÷ ${divisor}`,
      answer: numerator % divisor,
      difficulty: questionDifficulty,
      hint: 'This is one step of long division; the remainder feeds into the next digit of the recurring decimal.',
    });
  }
  return questions;
};

/** Level: Sopantyadvayamantyam — factor a quadratic whose two roots are both negative. */
const generateSopantyadvayamantyamQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = rootRanges[questionDifficulty];
    const p = randomInt(min, max);
    const q = randomInt(p + 1, max + 2);
    const sum = p + q;
    const product = p * q;

    questions.push({
      id: uniqueId(),
      conceptId: 'sopantyadvayamantyam',
      question: `x² + ${sum}x + ${product} = 0 (root closer to zero)`,
      answer: -p,
      difficulty: questionDifficulty,
      hint: `Two numbers that multiply to ${product} and add to ${sum} are ${p} and ${q}; the roots are their negatives.`,
    });
  }
  return questions;
};

/** Level: Ekanyunena Purvena — multiply by 9, 99, 999, or 9999. */
const generateEkanyunenaQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const nines = questionDifficulty === 'easy' ? 9 : questionDifficulty === 'medium' ? 99 : questionDifficulty === 'hard' ? 999 : 9999;
    const multiplicand = randomInt(2, nines - 1);

    questions.push({
      id: uniqueId(),
      conceptId: 'ekanyunena-purvena',
      question: `${multiplicand} × ${nines}`,
      answer: multiplicand * nines,
      difficulty: questionDifficulty,
      hint: `Subtract 1: ${multiplicand - 1}. Complement it from ${nines}: ${nines - (multiplicand - 1)}. Combine the two parts.`,
    });
  }
  return questions;
};

/** Level: Gunitasamuccayah — verify (x + a)(x + b) by evaluating both sides at x = 1. */
const generateGunitasamuccayahQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = rootRanges[questionDifficulty];
    const a = randomInt(min, max);
    const b = randomInt(min, max);

    questions.push({
      id: uniqueId(),
      conceptId: 'gunitasamuccayah',
      question: `(x + ${a})(x + ${b}) at x = 1`,
      answer: (1 + a) * (1 + b),
      difficulty: questionDifficulty,
      hint: `Substitute x = 1 into both sides: LHS = ${1 + a} × ${1 + b}.`,
    });
  }
  return questions;
};

/** Level: Gunakasamuccayah — the coefficient of x equals the sum of the factor constants. */
const generateGunakasamuccayahQuestions = (count: number, difficulty?: string): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const questionDifficulty = pickDifficulty(difficulty);
    const [min, max] = rootRanges[questionDifficulty];
    const a = randomInt(min, max);
    const b = randomInt(min, max);

    questions.push({
      id: uniqueId(),
      conceptId: 'gunakasamuccayah',
      question: `Expand (x + ${a})(x + ${b}). What is the coefficient of x?`,
      answer: a + b,
      difficulty: questionDifficulty,
      hint: 'The coefficient of x equals the sum of the two constants being multiplied.',
    });
  }
  return questions;
};

/** Maps each catalog lesson id (see src/data/concepts.ts) to its matching question generator. */
const dynamicQuestionGenerators: Record<string, (count: number, difficulty?: string) => Question[]> = {
  'intro-mental-math': generateIntroQuestions,
  'nikhilam-navatashcaramam-dashatah': generateNikhilamQuestions,
  'urdhva-tiryagbhyam': generateUrdhvaQuestions,
  'paravartya-yojayet': generateParavartyaQuestions,
  'shunyam-saamyasamuccaye': generateShunyamQuestions,
  'anurupye-shunyamanyat': generateAnurupyeQuestions,
  'sankalana-vyavakalanabhyam': generateSankalanaQuestions,
  'puranapuranabhyam': generatePuranapuranabhyamQuestions,
  'chalana-kalanabhyam': generateChalanaKalanabhyamQuestions,
  'yaavadunam': generateYaavadunamQuestions,
  'vyashtisamanstih': generateVyashtisamanstihQuestions,
  'shesanyankena-charamena': generateShesanyankenaQuestions,
  'sopantyadvayamantyam': generateSopantyadvayamantyamQuestions,
  'ekanyunena-purvena': generateEkanyunenaQuestions,
  'gunitasamuccayah': generateGunitasamuccayahQuestions,
  'gunakasamuccayah': generateGunakasamuccayahQuestions,
};
