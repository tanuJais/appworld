import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, GameState, DifficultyLevel, Concept } from '../types';
import { concepts as initialConcepts } from '../data/concepts';

type GameContextType = {
  userProgress: UserProgress;
  gameState: GameState;
  concepts: Concept[];
  updateMastery: (conceptId: string, change: number) => void;
  recordAnswer: (conceptId: string, isCorrect: boolean) => void;
  adjustDifficulty: (accuracy: number) => void;
  resetGameState: () => void;
  addXP: (points: number) => void;
  updateStreak: () => void;
  unlockNextConcept: (conceptId: string) => void;
  completeGuidedPractice: (conceptId: string) => void;
  completeRigorousPractice: (conceptId: string) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 0,
    streak: 0,
    level: 1,
    concepts: {},
  });

  const [gameState, setGameState] = useState<GameState>({
    currentDifficulty: 'easy',
    consecutiveMistakes: 0,
    isRecoveryMode: false,
    currentStreak: 0,
    sessionCorrect: 0,
    sessionTotal: 0,
  });

  const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData();
  }, [userProgress, concepts]);

  const loadData = async () => {
    try {
      const progressData = await AsyncStorage.getItem('userProgress');
      const conceptsData = await AsyncStorage.getItem('concepts');
      
      if (progressData) {
        setUserProgress(JSON.parse(progressData));
      }
      if (conceptsData) {
        setConcepts(JSON.parse(conceptsData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('userProgress', JSON.stringify(userProgress));
      await AsyncStorage.setItem('concepts', JSON.stringify(concepts));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateMastery = (conceptId: string, change: number) => {
    setConcepts(prev => prev.map(concept => {
      if (concept.id === conceptId) {
        const newMastery = Math.max(0, Math.min(100, concept.masteryPercentage + change));
        return { ...concept, masteryPercentage: newMastery };
      }
      return concept;
    }));
  };

  const recordAnswer = (conceptId: string, isCorrect: boolean) => {
    setGameState(prev => ({
      ...prev,
      consecutiveMistakes: isCorrect ? 0 : prev.consecutiveMistakes + 1,
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      sessionCorrect: isCorrect ? prev.sessionCorrect + 1 : prev.sessionCorrect,
      sessionTotal: prev.sessionTotal + 1,
      isRecoveryMode: prev.consecutiveMistakes >= 2 && !isCorrect,
    }));

    setUserProgress(prev => {
      const conceptProgress = prev.concepts[conceptId] || {
        conceptId,
        masteryPercentage: 0,
        accuracy: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        timeSpent: 0,
        guidedPracticeCompleted: false,
        rigorousPracticeCompleted: false,
        lastAttempt: new Date(),
      };

      const newTotalAttempts = conceptProgress.totalAttempts + 1;
      const newCorrectAttempts = conceptProgress.correctAttempts + (isCorrect ? 1 : 0);
      const newAccuracy = (newCorrectAttempts / newTotalAttempts) * 100;

      return {
        ...prev,
        concepts: {
          ...prev.concepts,
          [conceptId]: {
            ...conceptProgress,
            totalAttempts: newTotalAttempts,
            correctAttempts: newCorrectAttempts,
            accuracy: newAccuracy,
            lastAttempt: new Date(),
          },
        },
      };
    });
  };

  const adjustDifficulty = (accuracy: number) => {
    setGameState(prev => {
      let newDifficulty: DifficultyLevel = prev.currentDifficulty;

      if (accuracy > 90) {
        if (prev.currentDifficulty === 'easy') newDifficulty = 'medium';
        else if (prev.currentDifficulty === 'medium') newDifficulty = 'hard';
        else if (prev.currentDifficulty === 'hard') newDifficulty = 'expert';
      } else if (accuracy < 60) {
        if (prev.currentDifficulty === 'expert') newDifficulty = 'hard';
        else if (prev.currentDifficulty === 'hard') newDifficulty = 'medium';
        else if (prev.currentDifficulty === 'medium') newDifficulty = 'easy';
      }

      return { ...prev, currentDifficulty: newDifficulty };
    });
  };

  const resetGameState = () => {
    setGameState({
      currentDifficulty: 'easy',
      consecutiveMistakes: 0,
      isRecoveryMode: false,
      currentStreak: 0,
      sessionCorrect: 0,
      sessionTotal: 0,
    });
  };

  const addXP = (points: number) => {
    setUserProgress(prev => {
      const newXP = prev.totalXP + points;
      const newLevel = Math.floor(newXP / 1000) + 1;
      return { ...prev, totalXP: newXP, level: newLevel };
    });
  };

  const updateStreak = () => {
    setUserProgress(prev => ({ ...prev, streak: prev.streak + 1 }));
  };

  const unlockNextConcept = (currentConceptId: string) => {
    setConcepts(prev => {
      const currentIndex = prev.findIndex(c => c.id === currentConceptId);
      if (currentIndex >= 0 && currentIndex < prev.length - 1) {
        const updated = [...prev];
        updated[currentIndex + 1].unlocked = true;
        return updated;
      }
      return prev;
    });
  };

  const completeGuidedPractice = (conceptId: string) => {
    setConcepts(prev => prev.map(concept => 
      concept.id === conceptId 
        ? { ...concept, guidedPracticeCompleted: true }
        : concept
    ));
  };

  const completeRigorousPractice = (conceptId: string) => {
    setConcepts(prev => prev.map(concept => 
      concept.id === conceptId 
        ? { ...concept, rigorousPracticeCompleted: true }
        : concept
    ));
  };

  return (
    <GameContext.Provider
      value={{
        userProgress,
        gameState,
        concepts,
        updateMastery,
        recordAnswer,
        adjustDifficulty,
        resetGameState,
        addXP,
        updateStreak,
        unlockNextConcept,
        completeGuidedPractice,
        completeRigorousPractice,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
