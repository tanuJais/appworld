import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Concept, UserProgress, UserStats, DifficultyLevel, LearningStage } from '../types';
import { conceptsData } from '../data/concepts';

interface AppState {
  concepts: Concept[];
  userProgress: Record<string, UserProgress>;
  userStats: UserStats;
  
  // Actions
  initializeApp: () => Promise<void>;
  updateProgress: (conceptId: string, updates: Partial<UserProgress>) => void;
  updateMastery: (conceptId: string, change: number) => void;
  addXP: (points: number) => void;
  incrementStreak: () => void;
  unlockConcept: (conceptId: string) => void;
  completeConcept: (conceptId: string) => void;
  resetProgress: () => void;
  saveProgress: () => Promise<void>;
}

const initialStats: UserStats = {
  totalXP: 0,
  level: 1,
  streak: 0,
  badges: [],
  conceptsCompleted: 0,
  totalQuestionsAnswered: 0,
  accuracy: 0,
};

export const useStore = create<AppState>((set, get) => ({
  concepts: conceptsData,
  userProgress: {},
  userStats: initialStats,

  initializeApp: async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('userProgress');
      const savedStats = await AsyncStorage.getItem('userStats');
      
      if (savedProgress) {
        set({ userProgress: JSON.parse(savedProgress) });
      }
      
      if (savedStats) {
        set({ userStats: JSON.parse(savedStats) });
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  },

  updateProgress: (conceptId: string, updates: Partial<UserProgress>) => {
    set((state) => ({
      userProgress: {
        ...state.userProgress,
        [conceptId]: {
          ...(state.userProgress[conceptId] || {
            conceptId,
            stage: LearningStage.INTRO,
            accuracy: 0,
            questionsAttempted: 0,
            questionsCorrect: 0,
            currentDifficulty: DifficultyLevel.EASY,
            masteryProgress: 0,
            lastAttempt: new Date(),
            consecutiveWrong: 0,
            hintsUsed: 0,
          }),
          ...updates,
          lastAttempt: new Date(),
        },
      },
    }));
    get().saveProgress();
  },

  updateMastery: (conceptId: string, change: number) => {
    set((state) => {
      const progress = state.userProgress[conceptId];
      if (!progress) return state;

      const newMastery = Math.max(0, Math.min(100, progress.masteryProgress + change));
      
      // Update concept mastery
      const updatedConcepts = state.concepts.map((c) =>
        c.id === conceptId ? { ...c, mastery: newMastery } : c
      );

      return {
        concepts: updatedConcepts,
        userProgress: {
          ...state.userProgress,
          [conceptId]: {
            ...progress,
            masteryProgress: newMastery,
          },
        },
      };
    });
    get().saveProgress();
  },

  addXP: (points: number) => {
    set((state) => {
      const newXP = state.userStats.totalXP + points;
      const newLevel = Math.floor(newXP / 100) + 1;
      
      return {
        userStats: {
          ...state.userStats,
          totalXP: newXP,
          level: newLevel,
        },
      };
    });
    get().saveProgress();
  },

  incrementStreak: () => {
    set((state) => ({
      userStats: {
        ...state.userStats,
        streak: state.userStats.streak + 1,
      },
    }));
    get().saveProgress();
  },

  unlockConcept: (conceptId: string) => {
    set((state) => ({
      concepts: state.concepts.map((c) =>
        c.id === conceptId ? { ...c, unlocked: true } : c
      ),
    }));
    get().saveProgress();
  },

  completeConcept: (conceptId: string) => {
    set((state) => ({
      concepts: state.concepts.map((c) =>
        c.id === conceptId ? { ...c, completed: true } : c
      ),
      userStats: {
        ...state.userStats,
        conceptsCompleted: state.userStats.conceptsCompleted + 1,
      },
    }));
    get().saveProgress();
  },

  resetProgress: () => {
    set({
      userProgress: {},
      userStats: initialStats,
    });
    AsyncStorage.multiRemove(['userProgress', 'userStats']);
  },

  saveProgress: async () => {
    try {
      await AsyncStorage.setItem(
        'userProgress',
        JSON.stringify(get().userProgress)
      );
      await AsyncStorage.setItem(
        'userStats',
        JSON.stringify(get().userStats)
      );
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },
}));
