import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { generateDynamicQuestions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import MasteryBar from '../components/MasteryBar';
import PrerequisiteHint from '../components/PrerequisiteHint';
import { colors, radii, spacing } from '../theme/theme';

type RigorousPracticeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'RigorousPractice'>;
  route: RouteProp<RootStackParamList, 'RigorousPractice'>;
};

const RigorousPracticeScreen: React.FC<RigorousPracticeScreenProps> = ({ navigation, route }) => {
  const { conceptId } = route.params;
  const { recordAnswer, addXP, adjustDifficulty, gameState, completeRigorousPractice, concepts, startSession, endSession, recordActivity } = useGame();
  
  const [questions, setQuestions] = useState(generateDynamicQuestions(conceptId, 100));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showRetryPrompt, setShowRetryPrompt] = useState(false);
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);
  
  const totalQuestions = 20; // Show 20 questions per session

  const concept = concepts.find(c => c.id === conceptId);
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  useEffect(() => {
    startSession(conceptId, 'rigorous');
  }, [conceptId]);

  useEffect(() => {
    // Adjust difficulty every 5 questions
    if (total > 0 && total % 5 === 0) {
      adjustDifficulty(accuracy);
      // Get new questions at adjusted difficulty
      const newQuestions = generateDynamicQuestions(conceptId, 100, gameState.currentDifficulty);
      setQuestions(newQuestions);
    }
  }, [total]);

  useEffect(() => {
    // Check for recovery mode
    if (gameState.consecutiveMistakes >= 3) {
      setShowRecoveryPrompt(true);
    }
  }, [gameState.consecutiveMistakes]);

  const switchToEasierQuestions = () => {
    setShowRecoveryPrompt(false);
    const easyQuestions = generateDynamicQuestions(conceptId, 100, 'easy');
    setQuestions(easyQuestions);
  };

  const handleAnswer = (isCorrect: boolean) => {
    recordAnswer(conceptId, isCorrect);
    recordActivity(conceptId, 'rigorous', currentIndex);
    setTotal(total + 1);
    
    if (isCorrect) {
      setCorrect(correct + 1);
      addXP(5); // +5 XP for rigorous practice
      setIsWrong(false);
      setFeedback(`✅ Correct! Streak: ${gameState.currentStreak}`);
      
      // Auto-advance after a short delay
      setTimeout(() => {
        setFeedback(null);
        moveToNext();
      }, 1000);
    } else {
      // Show correct answer inline and auto-advance (Alert dialogs don't reliably fire on web)
      setIsWrong(true);
      setFeedback(`❌ Incorrect. The correct answer is ${questions[currentIndex].answer}.`);
      
      setTimeout(() => {
        setFeedback(null);
        setIsWrong(false);
        moveToNext();
      }, 1800);
    }
  };

  const moveToNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    setIsComplete(true);
    endSession(conceptId, 'rigorous', total, correct);
    
    if (accuracy >= 85) {
      completeRigorousPractice(conceptId);
      setFeedback(`🎉 Rigorous Practice Complete! ${accuracy.toFixed(0)}% accuracy. Starting Mastery Challenge...`);
      
      // Auto-navigate to Mastery Challenge after 2.5 seconds
      setTimeout(() => {
        navigation.replace('MasteryLevel', { conceptId });
      }, 2500);
    } else {
      setFeedback(`Almost There! You got ${accuracy.toFixed(0)}% accuracy. Need 85% for Mastery Challenge.`);
      setShowRetryPrompt(true);
    }
  };

  const handleRetry = () => {
    setShowRetryPrompt(false);
    setIsComplete(false);
    setCurrentIndex(0);
    setCorrect(0);
    setTotal(0);
    setQuestions(generateDynamicQuestions(conceptId, 100));
    setFeedback(null);
  };

  if (!concept) {
    return <View><Text>Concept not found</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
      <View style={styles.header}>
        <Text style={styles.title}>Rigorous Practice</Text>
        <Text style={styles.subtitle}>Challenge yourself with mixed difficulty</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Question</Text>
            <Text style={styles.statValue}>{currentIndex + 1}/{totalQuestions}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={styles.statValue}>{accuracy.toFixed(0)}%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Difficulty</Text>
            <Text style={styles.statValue}>{gameState.currentDifficulty}</Text>
          </View>
        </View>

        <MasteryBar percentage={concept.masteryPercentage} showLabel={false} />
      </View>

      <View style={styles.content}>
        {showRecoveryPrompt && (
          <View style={styles.recoveryBanner}>
            <Text style={styles.recoveryText}>🆘 3 wrong answers in a row. Want easier questions?</Text>
            <TouchableOpacity style={styles.recoveryButton} onPress={switchToEasierQuestions}>
              <Text style={styles.recoveryButtonText}>Switch to Easier Questions</Text>
            </TouchableOpacity>
          </View>
        )}

        {feedback && (
          <View style={isComplete ? styles.completionBanner : isWrong ? styles.wrongBanner : styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        {showRetryPrompt && (
          <View style={styles.retryRow}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {!isComplete && questions[currentIndex] && (
          <QuestionCard
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
            showHint={false}
            questionNumber={currentIndex + 1}
          />
        )}

        {!isComplete && gameState.currentStreak >= 5 && (
          <View style={styles.streakBanner}>
            <Text style={styles.streakText}>🔥 {gameState.currentStreak} in a row! You're on fire!</Text>
          </View>
        )}

        {!isComplete && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🎯 Challenge Mode:</Text>
            <Text style={styles.infoText}>
              • No hints available{'\n'}
              • Difficulty adjusts based on performance{'\n'}
              • Earn more XP per correct answer{'\n'}
              • Need 85% accuracy to proceed
            </Text>
          </View>
        )}

        {(showRecoveryPrompt || showRetryPrompt) && (
          <PrerequisiteHint
            concepts={concepts}
            prerequisiteIds={concept.prerequisiteConceptIds}
            onOpenLesson={prerequisiteId => navigation.navigate('ConceptIntro', { conceptId: prerequisiteId })}
          />
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    ...Platform.select({
      web: {
        maxHeight: '100vh' as any,
      },
    }),
  },
  container: {
    flex: 1,
  },
  wrongBanner: {
    backgroundColor: colors.errorSurface,
    padding: 16,
    borderRadius: radii.md,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  retryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  retryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  retryButtonText: {
    color: colors.textInverse,
    fontWeight: 'bold',
    fontSize: 15,
  },
  homeButton: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    padding: 14,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  homeButtonText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  recoveryBanner: {
    backgroundColor: colors.surfaceAlt,
    padding: 16,
    borderRadius: radii.md,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  recoveryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  recoveryButton: {
    backgroundColor: colors.gold,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.sm,
  },
  recoveryButtonText: {
    color: colors.primaryDark,
    fontWeight: 'bold',
    fontSize: 13,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    padding: 10,
    borderRadius: radii.sm,
    marginHorizontal: 3,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  content: {
    padding: spacing.xl,
  },
  feedbackBanner: {
    backgroundColor: colors.successSurface,
    padding: 16,
    borderRadius: radii.md,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },
  completionBanner: {
    backgroundColor: colors.goldSurface,
    padding: 24,
    borderRadius: radii.lg,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.gold,
  },
  streakBanner: {
    backgroundColor: colors.goldSurface,
    padding: 15,
    borderRadius: radii.md,
    marginTop: 15,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  infoBox: {
    backgroundColor: colors.surfaceAlt,
    padding: 15,
    borderRadius: radii.md,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.primary,
    lineHeight: 20,
  },
});

export default RigorousPracticeScreen;
