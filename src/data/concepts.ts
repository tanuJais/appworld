import { Concept } from '../types';

const createLesson = (
  level: number,
  id: string,
  name: string,
  description: string,
  introduction: string,
  problem: string,
  solution: string,
  steps: string[],
  prerequisiteConceptIds?: string[],
  kind: 'introduction' | 'lesson' = 'lesson'
): Concept => ({
  id,
  kind,
  level,
  name,
  description,
  introduction,
  examples: [{ problem, solution, steps }],
  hasContent: true,
  unlocked: true,
  prerequisiteConceptIds,
  masteryPercentage: 0,
  confidenceScore: 0,
  guidedPracticeCompleted: false,
  rigorousPracticeCompleted: false,
  videoWatched: false,
  examplesDone: 0,
});

/** Updated learning path aligned to Lesson/chapters.txt. */
export const concepts: Concept[] = [
  {
    ...createLesson(
      1,
      'vedic-origins',
      'Introduction to Vedic Mathematics',
      'History, sutras, and confident mental calculation',
      'Meet the tradition of Vedic Mathematics, its 16 sutras and 13 sub-sutras, and learn how to choose a strategy with confidence.',
      '',
      '',
      [],
      undefined,
      'introduction'
    ),
    introductionSections: [
      {
        title: 'Origin and introduction',
        body: 'The modern system of Vedic Mathematics was organized and taught by Jagadguru Sri Bharati Krishna Tirthaji Maharaja (1884–1960). His work was published posthumously in 1965 as Vedic Mathematics. The methods are presented as a practical tradition inspired by ancient Indian mathematical knowledge.'
      },
      {
        title: 'The 16 sutras',
        body: '1. Ekadhikena Purvena\n2. Nikhilam Navatashcaramam Dashatah\n3. Urdhva-Tiryagbhyam\n4. Paravartya Yojayet\n5. Shunyam Saamyasamuccaye\n6. Anurupye Shunyamanyat\n7. Sankalana-Vyavakalanabhyam\n8. Puranapuranabhyam\n9. Chalana-Kalanabhyam\n10. Yaavadunam\n11. Vyashtisamanstih\n12. Shesanyankena Charamena\n13. Sopantyadvayamantyam\n14. Ekanyunena Purvena\n15. Gunitasamuccayah\n16. Gunakasamuccayah'
      },
      {
        title: 'The 13 sub-sutras',
        body: '1. Anurupyena\n2. Shishyate Sheshasamjnah\n3. Adyamadyenantyamantyena\n4. Kevalaih Saptakam Gunyat\n5. Vestanam\n6. Yavadunam Tavadunam\n7. Yavadunam Tavadunikritya Varganca Yojayet\n8. Antyayor Dashakepi\n9. Antyayoreva\n10. Samuccayagunitah\n11. Lopanasthapanabhyam\n12. Vilokanam\n13. Gunitasamuccayah Samuccayagunitah'
      },
      {
        title: 'How Vedic Mathematics helps',
        body: 'These principles help learners calculate with fewer written steps, recognize number patterns, estimate answers, and choose an efficient method. Regular practice can improve mental arithmetic, concentration, confidence, and the ability to check whether an answer is reasonable.'
      }
    ]
  },
  createLesson(1, 'ekadhikena-purvena', 'Ekadhikena Purvena', 'Squaring numbers ending in 5', '"Ekadhikena Purvena" means "one more than the previous one." This technique is perfect for squaring numbers ending in 5.', '15²', '225', ['Circle the first digit: 1', 'Hop to the next number: 1 → 2', 'Multiply them: 1 × 2 = 2', 'Stick 25 at the end: 2 | 25 → 225']),
  createLesson(1, 'nikhilam-navatashcaramam-dashatah', 'Nikhilam Navatashcaramam Dashatah', 'Fast subtraction and base-near multiplication', '"Nikhilam Navatashcaramam Dashatah" means "all from 9 and the last from 10." It is ideal for calculations close to a base such as 10, 100, or 1000.', '98 × 97', '9506', ['Base is 100', 'Deviations: 98 - 100 = -2 and 97 - 100 = -3', 'Cross-subtract: 98 + (-3) = 95', 'Multiply deviations: (-2) × (-3) = 06 (padded to 2 digits since the base has two zeros)', 'Combine: 95|06 → 9506']),
  createLesson(1, 'urdhva-tiryagbhyam', 'Urdhva-Tiryagbhyam', 'General vertical and crosswise multiplication', '"Urdhva Tiryagbhyam" means "vertically and crosswise." This method works for any multi-digit multiplication.', '23 × 41', '943', ['Multiply units: 3 × 1 = 3', 'Cross multiply and add: (2 × 1) + (3 × 4) = 14', 'Multiply tens: 2 × 4 = 8', 'Combine with carries: 8|4|3 → 943']),
  createLesson(2, 'paravartya-yojayet', 'Paravartya Yojayet', 'Division using transposition near a base', '"Paravartya Yojayet" means "transpose and apply." It is useful when the divisor is just above or below a round number.', '1125 ÷ 99', '11.36', ['Split 1125 into 11 | 25 (base 100 has two zeros)', 'Complement of 99 from 100 is 1', 'Multiply quotient by complement: 11 × 1 = 11', 'Add to the remainder part: 25 + 11 = 36', 'Combine: 11|36 → 11.36']),
  createLesson(2, 'shunyam-saamyasamuccaye', 'Shunyam Saamyasamuccaye', 'When sums are equal, the total is zero', 'This sutra helps solve equations where matching sums create a simpler balance condition.', 'x + 2 = 5 - x', 'x = 1.5', ['Add x to both sides: 2x + 2 = 5', 'Subtract 2 from both sides: 2x = 3', 'Divide by 2: x = 1.5']),
  createLesson(2, 'anurupye-shunyamanyat', 'Anurupye Shunyamanyat', 'Ratio-based zero method', 'If one ratio matches the other, the unmatched term becomes the key target in the equation.', '3x + 6 = 2x + 12', 'x = 6', ['Subtract 2x from both sides: x + 6 = 12', 'Subtract 6 from both sides: x = 6']),
  createLesson(2, 'sankalana-vyavakalanabhyam', 'Sankalana-Vyavakalanabhyam', 'Add and subtract to simplify simultaneous equations', 'This sutra combines and separates equations so the unknowns become easy to isolate.', 'x + y = 7, x - y = 3', 'x = 5, y = 2', ['Add the equations: 2x = 10', 'Divide by 2: x = 5', 'Substitute x = 5 into x + y = 7: y = 2']),
  createLesson(2, 'puranapuranabhyam', 'Puranapuranabhyam', 'Completion and non-completion strategies', 'Complete nearby round numbers and rebalance the rest to simplify addition and early algebra.', '49 + 28', '77', ['49 is 1 short of 50', 'Take 1 from 28 to make 27', '50 + 27 = 77']),
  createLesson(2, 'chalana-kalanabhyam', 'Chalana-Kalanabhyam', 'Motion and difference methods', 'Use difference and variation thinking to solve problems in changing quantities and quadratic patterns.', 'x² - 5x + 6 = 0', 'x = 2 or 3', ['Factors of 6 that add to 5: 2 and 3', '(x - 2)(x - 3) = 0', 'Set each factor to zero: x = 2 or x = 3']),
  createLesson(3, 'yaavadunam', 'Yaavadunam', 'Squaring numbers near a base', '"Yaavadunam" means "whatever the deficiency". Use it to square numbers close to 10, 100, or 1000.', '98²', '9604', ['Use base 100', 'Deficiency: 100 - 98 = 2', 'Subtract the deficiency: 98 - 2 = 96', 'Square the deficiency: 2² = 04', 'Combine: 96|04 → 9604']),
  createLesson(3, 'vyashtisamanstih', 'Vyashtisamanstih', 'Part-whole structure in algebra', 'Break complex expressions into smaller matching groups and solve them by substitution.', '(x + 1)(x + 2) = 12', 'x = 2 or x = -5', ['Expand the pair: x² + 3x + 2 = 12', 'Simplify: x² + 3x - 10 = 0', 'Factor: (x - 2)(x + 5) = 0', 'Set each factor to zero: x = 2 or x = -5']),
  createLesson(3, 'shesanyankena-charamena', 'Shesanyankena Charamena', 'Using the last digit and remainders', 'This sutra helps simplify recurring decimals, divisibility checks, and remainder patterns.', '1 ÷ 7', '0.142857...', ['10 ÷ 7 = 1 remainder 3', '30 ÷ 7 = 4 remainder 2', '20 ÷ 7 = 2 remainder 6', '60 ÷ 7 = 8 remainder 4', '40 ÷ 7 = 5 remainder 5', '50 ÷ 7 = 7 remainder 1, and the cycle repeats']),
  createLesson(3, 'sopantyadvayamantyam', 'Sopantyadvayamantyam', 'Near extremes and matched ends', 'Look at the ends and the center to reveal a patterned solution to specialized algebraic relationships.', 'x² + 6x + 8 = 0', 'x = -2 or -4', ['Factors of 8 that add to 6: 2 and 4', '(x + 2)(x + 4) = 0', 'Set each factor to zero: x = -2 or x = -4']),
  createLesson(3, 'ekanyunena-purvena', 'Ekanyunena Purvena', 'Multiply by numbers made of 9s', '"Ekanyunena Purvena" means "by one less than the previous one." It is the shortcut for 9, 99, 999, and so on.', '23 × 99', '2277', ['Subtract 1: 23 - 1 = 22', 'Complement from 99: 99 - 22 = 77', 'Combine: 22|77 → 2277']),
  createLesson(4, 'gunitasamuccayah', 'Gunitasamuccayah', 'Product-of-sum verification', 'Use the relation between sums and products to check algebraic identities quickly and confidently.', '(x + 2)(x + 3)', 'x² + 5x + 6', ['Set x = 1', 'LHS = 3 × 4 = 12', 'RHS = 1 + 5 + 6 = 12', 'The identity is verified']),
  createLesson(4, 'gunakasamuccayah', 'Gunakasamuccayah', 'Factor-of-sum checking', 'Compare the total of factors with the coefficient structure to validate polynomial expansions and factorizations.', '(x + 1)(x + 4)', 'x² + 5x + 4', ['Coefficients: 1 and 4', 'Sum: 1 + 4 = 5', 'Product: 1 × 4 = 4', 'Result: x² + 5x + 4'])
];
