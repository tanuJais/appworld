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
  if (conceptId === 'intro-mental-math') {
    return generateIntroQuestions(count, difficulty);
  }
  if (conceptId === 'nikhilam-multiplication') {
    return generateNikhilamQuestions(count, difficulty);
  }
  if (conceptId === 'urdhva-tiryak') {
    return generateUrdhvaQuestions(count, difficulty);
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
      conceptId: 'nikhilam-multiplication',
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
      conceptId: 'urdhva-tiryak',
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
