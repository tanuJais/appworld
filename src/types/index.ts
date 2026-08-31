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

export interface Question {
  id: string;
  conceptId: string;
  question: string;
  answer: number;
  difficulty: DifficultyLevel;
  hint?: string;
  steps?: string[];
  explanation?: string;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  explanation: string;
  examples: Example[];
  unlocked: boolean;
  mastery: number; // 0-100
  completed: boolean;
}

export interface Example {
  problem: string;
  solution: string;
  steps: string[];
}

export interface UserProgress {
  conceptId: string;
  stage: LearningStage;
  accuracy: number;
  questionsAttempted: number;
  questionsCorrect: number;
  currentDifficulty: DifficultyLevel;
  masteryProgress: number;
  lastAttempt: Date;
  consecutiveWrong: number;
  hintsUsed: number;
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
