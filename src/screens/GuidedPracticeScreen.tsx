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
import { colors, radii, shadow, spacing } from '../theme/theme';

type GuidedPracticeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'GuidedPractice'>;
  route: RouteProp<RootStackParamList, 'GuidedPractice'>;
};

const GuidedPracticeScreen: React.FC<GuidedPracticeScreenProps> = ({ navigation, route }) => {
  const { conceptId } = route.params;
  const { recordAnswer, addXP, completeGuidedPractice, userProgress, concepts, startSession, endSession, recordActivity } = useGame();
  
  const [questions, setQuestions] = useState(generateDynamicQuestions(conceptId, 50, 'easy'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showRetryPrompt, setShowRetryPrompt] = useState(false);
  
  const totalQuestions = 10; // Show 10 questions per session

  const concept = concepts.find(c => c.id === conceptId);
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  useEffect(() => {
    startSession(conceptId, 'guided');
  }, [conceptId]);

  const handleAnswer = (isCorrect: boolean) => {
    recordAnswer(conceptId, isCorrect);
    recordActivity(conceptId, 'guided', currentIndex);
    setTotal(total + 1);
    
    if (isCorrect) {
      setCorrect(correct + 1);
      addXP(2); // +2 XP for guided practice
      setIsWrong(false);
      setFeedback('✅ Correct! Great job!');
      
      // Auto-advance after a short delay
      setTimeout(() => {
        setFeedback(null);
        moveToNext();
      }, 1000);
    } else {
      // Show correct answer inline and auto-advance (Alert dialogs don't reliably fire on web)
      setIsWrong(true);
      setFeedback(`❌ Not quite. The correct answer is ${questions[currentIndex].answer}.`);
      
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
    endSession(conceptId, 'guided', total, correct);
    
    if (accuracy >= 70) {
      completeGuidedPractice(conceptId);
      setFeedback(`🎉 Guided Practice Complete! ${accuracy.toFixed(0)}% accuracy. Moving to Rigorous Practice...`);
      
      // Auto-navigate to Rigorous Practice after 2.5 seconds
      setTimeout(() => {
        navigation.replace('RigorousPractice', { conceptId });
      }, 2500);
    } else {
      setFeedback(`Keep Practicing! You got ${accuracy.toFixed(0)}% accuracy. Need 70% to unlock Rigorous Practice.`);
      setShowRetryPrompt(true);
    }
  };

  const handleRetry = () => {
    setShowRetryPrompt(false);
    setIsComplete(false);
    setCurrentIndex(0);
    setCorrect(0);
    setTotal(0);
    setQuestions(generateDynamicQuestions(conceptId, 50, 'easy'));
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
        <Text style={styles.title}>Guided Practice</Text>
        <Text style={styles.subtitle}>Practice with hints and support</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
          <Text style={styles.accuracyText}>
            Accuracy: {accuracy.toFixed(0)}% ({correct}/{total})
          </Text>
        </View>

        <MasteryBar percentage={concept.masteryPercentage} showLabel={false} />
      </View>

      <View style={styles.content}>
        {feedback && (
          <View style={isComplete ? styles.completionBanner : isWrong ? styles.wrongBanner : styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        {showRetryPrompt && (
          <View style={styles.retryRow}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Retry</Text>
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
            showHint={true}
            questionNumber={currentIndex + 1}
          />
        )}

        {!isComplete && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💡 Tips for Success:</Text>
            <Text style={styles.infoText}>
              • Take your time to understand each step{'\n'}
              • Use hints when you're stuck{'\n'}
              • Review the examples if needed{'\n'}
              • Aim for 70% accuracy before moving on
            </Text>
          </View>
        )}

        {showRetryPrompt && (
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
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
  infoBox: {
    backgroundColor: colors.warningSurface,
    padding: 15,
    borderRadius: radii.md,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.warning,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.warning,
    lineHeight: 20,
  },
});

export default GuidedPracticeScreen;
