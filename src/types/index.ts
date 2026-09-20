export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export enum LearningStage {
  INTRO = 'intro',
  GUIDED = 'guided',
  RIGOROUS = 'rigorous',
  MASTERY = 'mastery',
  RECOVERY = 'recovery'
}

export type ConceptKind = 'introduction' | 'lesson';

export interface Question {
  id: string;
  conceptId: string;
  question: string;
  answer: number;
  difficulty: DifficultyLevel | 'easy' | 'medium' | 'hard' | 'expert';
  hint?: string;
  steps?: string[];
  explanation?: string;
}

export interface Example {
  problem: string;
  solution: string;
  steps: string[];
}

export interface IntroductionSection {
  title: string;
  body: string;
}

/** A single Vedic Math topic/level in the learning path. */
export interface Concept {
  id: string;
  kind: ConceptKind;
  level: number;
  name: string;
  description: string;
  introduction: string;
  examples: Example[];
  introductionSections?: IntroductionSection[];
  hasContent: boolean; // false for stub/placeholder topics awaiting full content
  unlocked: boolean;
  prerequisiteConceptIds?: string[];
  masteryPercentage: number; // 0-100, driven by Mastery Level challenge
  confidenceScore: number; // 0-100, driven by guided/rigorous practice accuracy
  guidedPracticeCompleted: boolean;
  rigorousPracticeCompleted: boolean;
  videoWatched: boolean;
  examplesDone: number;
}

export interface ConceptProgress {
  conceptId: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  timeSpent: number;
  guidedPracticeCompleted: boolean;
  rigorousPracticeCompleted: boolean;
  lastAttempt: Date;
}

export interface UserProgress {
  totalXP: number;
  streak: number;
  level: number;
  concepts: Record<string, ConceptProgress>;
}

export interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  badges: Badge[];
  conceptsCompleted: number;
  totalQuestionsAnswered: number;
  accuracy: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface PracticeSession {
  conceptId: string;
  questions: Question[];
  currentQuestionIndex: number;
  correctAnswers: number;
  wrongAnswers: number;
  startTime: Date;
  difficulty: DifficultyLevel;
}

export interface GameState {
  currentDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
  consecutiveMistakes: number;
  isRecoveryMode: boolean;
  currentStreak: number;
  sessionCorrect: number;
  sessionTotal: number;
}

/** A local learner profile - all progress data is scoped to a profileId. */
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

/** Where the learner left off, used to power the "Continue Learning" card. */
export interface LastActivity {
  conceptId: string;
  mode: 'video' | 'guided' | 'rigorous' | 'mastery';
  lastQuestionIndex: number;
  updatedAt: number;
}

/** A single logged practice session, stored in SQLite. */
export interface PracticeSessionRecord {
  sessionId: string;
  profileId: string;
  conceptId: string;
  mode: 'guided' | 'rigorous' | 'mastery';
  startTime: number;
  endTime: number;
  questionsAttempted: number;
  correctCount: number;
  avgTimePerQuestion: number;
}

/** A single day's aggregated time-tracking entry, stored in SQLite. */
export interface CalendarEntry {
  profileId: string;
  date: string; // YYYY-MM-DD
  totalMinutes: number;
  topicsPracticed: string[];
  accuracySummary: Record<string, number>;
}

export type RootStackParamList = {
  Home: undefined;
  ConceptIntro: { conceptId: string };
  GuidedPractice: { conceptId: string };
  RigorousPractice: { conceptId: string };
  MasteryLevel: { conceptId: string };
  BaseMultiplication: { leftValue?: number; rightValue?: number; base?: number } | undefined;
  Progress: undefined;
  Settings: undefined;
  ProfileSwitcher: undefined;
  Calendar: undefined;
};
