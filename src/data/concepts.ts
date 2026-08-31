import { Concept } from '../types';

export const concepts: Concept[] = [
  {
    id: 'ekadhikena-purvena',
    name: 'Ekadhikena Purvena',
    description: 'Squaring numbers ending in 5',
    introduction: `"Ekadhikena Purvena" means "one more than the previous one."

This technique is perfect for squaring numbers ending in 5.

Formula: For a number ending in 5, multiply the first digit(s) by one more than itself, then append 25.`,
    examples: [
      {
        problem: '15²',
        solution: '225',
        steps: [
          'Take the first digit: 1',
          'Multiply by one more: 1 × 2 = 2',
          'Append 25: 225',
          'Answer: 15² = 225'
        ]
      },
      {
        problem: '35²',
        solution: '1225',
        steps: [
          'Take the first digit: 3',
          'Multiply by one more: 3 × 4 = 12',
          'Append 25: 1225',
          'Answer: 35² = 1225'
        ]
      },
      {
        problem: '105²',
        solution: '11025',
        steps: [
          'Take the first digits: 10',
          'Multiply by one more: 10 × 11 = 110',
          'Append 25: 11025',
          'Answer: 105² = 11025'
        ]
      }
    ],
    unlocked: true,
    masteryPercentage: 0,
    guidedPracticeCompleted: false,
    rigorousPracticeCompleted: false
  },
  {
    id: 'nikhilam-multiplication',
    name: 'Nikhilam Sutra',
    description: 'Multiplication near base (10, 100, etc.)',
    introduction: `"Nikhilam Navatashcaramam Dashatah" means "all from 9 and the last from 10."

This method is perfect for multiplying numbers close to a base like 10, 100, or 1000.

When both numbers are close to the same base, this method is incredibly fast!`,
    examples: [
      {
        problem: '98 × 97',
        solution: '9506',
        steps: [
          'Base is 100',
          'Deviations: -2 and -3',
          'Cross-subtract: 98 - 3 = 95 (or 97 - 2 = 95)',
          'Multiply deviations: (-2) × (-3) = 6',
          'Answer: 9506'
        ]
      }
    ],
    unlocked: false,
    masteryPercentage: 0,
    guidedPracticeCompleted: false,
    rigorousPracticeCompleted: false
  },
  {
    id: 'urdhva-tiryak',
    name: 'Urdhva Tiryak',
    description: 'Vertical and crosswise multiplication',
    introduction: `"Urdhva Tiryagbhyam" means "vertically and crosswise."

This is a general multiplication technique that works for any numbers.

It's especially useful for two-digit and three-digit multiplication.`,
    examples: [
      {
        problem: '23 × 41',
        solution: '943',
        steps: [
          'Multiply units: 3 × 1 = 3',
          'Cross multiply and add: (2 × 1) + (3 × 4) = 14',
          'Multiply tens: 2 × 4 = 8',
          'Combine with carries: 8|4|3 → 943'
        ]
      }
    ],
    unlocked: false,
    masteryPercentage: 0,
    guidedPracticeCompleted: false,
    rigorousPracticeCompleted: false
  }
];
