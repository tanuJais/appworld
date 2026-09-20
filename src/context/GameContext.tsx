import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { UserProgress, GameState, DifficultyLevel, Concept, UserProfile, LastActivity, CalendarEntry } from '../types';
import * as profileService from '../services/profileService';
import * as db from '../services/database';
import { gurukulAvatars } from '../theme/theme';

type PracticeMode = 'guided' | 'rigorous' | 'mastery';

type GameContextType = {
  userProgress: UserProgress;
  gameState: GameState;
  concepts: Concept[];
  profiles: UserProfile[];
  activeProfileId: string | null;
  lastActivity: LastActivity | null;
  isLoading: boolean;
  todayMinutes: number;

  updateMastery: (conceptId: string, change: number) => void;
  recordAnswer: (conceptId: string, isCorrect: boolean) => void;
  adjustDifficulty: (accuracy: number) => void;
  resetGameState: () => void;
  addXP: (points: number) => void;
  updateStreak: () => void;
  unlockNextConcept: (conceptId: string) => void;
  completeGuidedPractice: (conceptId: string) => void;
  completeRigorousPractice: (conceptId: string) => void;
  markVideoWatched: (conceptId: string) => void;

  // Multi-profile
  switchProfile: (profileId: string) => Promise<void>;
  addProfile: (name: string, avatar?: string) => Promise<void>;
  renameProfile: (profileId: string, name: string) => Promise<void>;
  removeProfile: (profileId: string) => Promise<void>;
  resetActiveProfileProgress: () => Promise<void>;

  // Session & calendar tracking
  startSession: (conceptId: string, mode: PracticeMode) => void;
  endSession: (conceptId: string, mode: PracticeMode, questionsAttempted: number, correctCount: number) => Promise<void>;
  recordActivity: (conceptId: string, mode: LastActivity['mode'], questionIndex: number) => void;
  getCalendarEntries: (startDate: string, endDate: string) => Promise<CalendarEntry[]>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const todayKey = () => new Date().toISOString().slice(0, 10);

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

  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [lastActivity, setLastActivityState] = useState<LastActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayMinutes, setTodayMinutes] = useState(0);

  const sessionStartRef = useRef<number | null>(null);

  useEffect(() => {
    db.initDatabase();
    loadForActiveProfile();
  }, []);

  const loadForActiveProfile = async () => {
    setIsLoading(true);
    try {
      const profileId = await profileService.getActiveProfileId();
      const allProfiles = await profileService.getProfiles();
      const [loadedConcepts, loadedActivity, todayEntry] = await Promise.all([
        profileService.getTopicProgress(profileId),
        profileService.getLastActivity(profileId),
        db.getCalendarEntry(profileId, todayKey()),
      ]);

      setProfiles(allProfiles);
      setActiveProfileId(profileId);
      setConcepts(loadedConcepts);
      setLastActivityState(loadedActivity);
      setTodayMinutes(todayEntry?.totalMinutes ?? 0);

      const conceptProgress: UserProgress['concepts'] = {};
      loadedConcepts.filter(c => c.kind === 'lesson').forEach(c => {
        conceptProgress[c.id] = {
          conceptId: c.id,
          totalAttempts: 0,
          correctAttempts: 0,
          accuracy: c.confidenceScore,
          timeSpent: 0,
          guidedPracticeCompleted: c.guidedPracticeCompleted,
          rigorousPracticeCompleted: c.rigorousPracticeCompleted,
          lastAttempt: new Date(),
        };
      });
      setUserProgress(prev => ({ ...prev, concepts: conceptProgress }));
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistConcepts = useCallback((updated: Concept[]) => {
    if (!activeProfileId) return;
    profileService.saveTopicProgress(activeProfileId, updated);
  }, [activeProfileId]);

  const updateConcept = (conceptId: string, updates: Partial<Concept>) => {
    setConcepts(prev => {
      const updated = prev.map(c => (c.id === conceptId ? { ...c, ...updates } : c));
      persistConcepts(updated);
      return updated;
    });
  };

  const updateMastery = (conceptId: string, change: number) => {
    setConcepts(prev => {
      const updated = prev.map(concept => {
        if (concept.id !== conceptId) return concept;
        const newMastery = Math.max(0, Math.min(100, concept.masteryPercentage + change));
        return { ...concept, masteryPercentage: newMastery };
      });
      persistConcepts(updated);
      return updated;
    });
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
        totalAttempts: 0,
        correctAttempts: 0,
        accuracy: 0,
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

    // Confidence score is a rolling measure of practice accuracy per topic
    setConcepts(prev => {
      const updated = prev.map(c => {
        if (c.id !== conceptId) return c;
        const delta = isCorrect ? 2 : -3;
        return { ...c, confidenceScore: Math.max(0, Math.min(100, c.confidenceScore + delta)) };
      });
      persistConcepts(updated);
      return updated;
    });
  };

  const adjustDifficulty = (accuracy: number) => {
    setGameState(prev => {
      let newDifficulty: GameState['currentDifficulty'] = prev.currentDifficulty;

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
      if (currentIndex >= 0 && currentIndex + 1 < prev.length) {
        const updated = [...prev];
        const nextConcept = updated[currentIndex + 1];
        if (nextConcept) {
          updated[currentIndex + 1] = { ...nextConcept, unlocked: true };
          persistConcepts(updated);
          return updated;
        }
      }
      return prev;
    });
  };

  const completeGuidedPractice = (conceptId: string) => {
    updateConcept(conceptId, { guidedPracticeCompleted: true });
  };

  const completeRigorousPractice = (conceptId: string) => {
    updateConcept(conceptId, { rigorousPracticeCompleted: true });
  };

  const markVideoWatched = (conceptId: string) => {
    updateConcept(conceptId, { videoWatched: true });
  };

  // ---- Multi-profile ----
  const switchProfile = async (profileId: string) => {
    await profileService.setActiveProfileId(profileId);
    resetGameState();
    await loadForActiveProfile();
  };

  const addProfile = async (name: string, avatar: string = gurukulAvatars.boy) => {
    const profile = await profileService.createProfile(name, avatar);
    await switchProfile(profile.id);
  };

  const renameProfileFn = async (profileId: string, name: string) => {
    await profileService.renameProfile(profileId, name);
    setProfiles(await profileService.getProfiles());
  };

  const removeProfile = async (profileId: string) => {
    await profileService.deleteProfile(profileId);
    await loadForActiveProfile();
  };

  const resetActiveProfileProgress = async () => {
    if (!activeProfileId) return;
    await profileService.resetProfileProgress(activeProfileId);
    resetGameState();
    await loadForActiveProfile();
  };

  // ---- Session & calendar tracking ----
  const startSession = (_conceptId: string, _mode: PracticeMode) => {
    sessionStartRef.current = Date.now();
  };

  const endSession = async (conceptId: string, mode: PracticeMode, questionsAttempted: number, correctCount: number) => {
    if (!activeProfileId || !sessionStartRef.current || questionsAttempted === 0) {
      sessionStartRef.current = null;
      return;
    }
    const startTime = sessionStartRef.current;
    const endTime = Date.now();
    sessionStartRef.current = null;

    const durationMs = endTime - startTime;
    const avgTimePerQuestion = durationMs / questionsAttempted;
    const accuracy = (correctCount / questionsAttempted) * 100;

    await db.insertPracticeSession({
      sessionId: `session_${startTime}_${Math.random().toString(36).slice(2, 8)}`,
      profileId: activeProfileId,
      conceptId,
      mode,
      startTime,
      endTime,
      questionsAttempted,
      correctCount,
      avgTimePerQuestion,
    });

    const minutes = durationMs / 60000;
    await db.upsertCalendarEntry(activeProfileId, todayKey(), minutes, conceptId, accuracy);

    const todayEntry = await db.getCalendarEntry(activeProfileId, todayKey());
    setTodayMinutes(todayEntry?.totalMinutes ?? 0);
  };

  const recordActivity = (conceptId: string, mode: LastActivity['mode'], questionIndex: number) => {
    if (!activeProfileId) return;
    const activity: LastActivity = { conceptId, mode, lastQuestionIndex: questionIndex, updatedAt: Date.now() };
    setLastActivityState(activity);
    profileService.setLastActivity(activeProfileId, activity);
  };

  const getCalendarEntries = async (startDate: string, endDate: string): Promise<CalendarEntry[]> => {
    if (!activeProfileId) return [];
    return db.getCalendarEntries(activeProfileId, startDate, endDate);
  };

  return (
    <GameContext.Provider
      value={{
        userProgress,
        gameState,
        concepts,
        profiles,
        activeProfileId,
        lastActivity,
        isLoading,
        todayMinutes,
        updateMastery,
        recordAnswer,
        adjustDifficulty,
        resetGameState,
        addXP,
        updateStreak,
        unlockNextConcept,
        completeGuidedPractice,
        completeRigorousPractice,
        markVideoWatched,
        switchProfile,
        addProfile,
        renameProfile: renameProfileFn,
        removeProfile,
        resetActiveProfileProgress,
        startSession,
        endSession,
        recordActivity,
        getCalendarEntries,
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
