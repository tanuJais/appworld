import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { generateDynamicQuestions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import MasteryBar from '../components/MasteryBar';
import { colors, radii, spacing } from '../theme/theme';

type MasteryLevelScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MasteryLevel'>;
  route: RouteProp<RootStackParamList, 'MasteryLevel'>;
};

const MasteryLevelScreen: React.FC<MasteryLevelScreenProps> = ({ navigation, route }) => {
  const { conceptId } = route.params;
  const { 
    recordAnswer, 
    addXP, 
    updateMastery, 
    unlockNextConcept,
    concepts,
    startSession,
    endSession,
    recordActivity
  } = useGame();
  
  const [questions, setQuestions] = useState(generateDynamicQuestions(conceptId, 100));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSessionPrompt, setShowSessionPrompt] = useState(false);
  const [droppedBelow50, setDroppedBelow50] = useState(false);
  
  const totalQuestions = 30; // Show 30 questions per session

  const concept = concepts.find(c => c.id === conceptId);
  const localMastery = concept?.masteryPercentage || 0;

  useEffect(() => {
    startSession(conceptId, 'mastery');
  }, [conceptId]);

  const handleAnswer = (isCorrect: boolean) => {
    recordAnswer(conceptId, isCorrect);
    recordActivity(conceptId, 'mastery', currentIndex);
    setTotal(total + 1);
    
    if (isCorrect) {
      setCorrect(correct + 1);
      addXP(10); // +10 XP for mastery level
      updateMastery(conceptId, 3); // +3% mastery
      setIsWrong(false);
      
      if (localMastery + 3 >= 100) {
        showMasteryComplete();
      } else {
        setFeedback(`✅ Correct! Mastery: ${Math.min(100, localMastery + 3).toFixed(0)}%`);
        
        // Auto-advance after a short delay
        setTimeout(() => {
          setFeedback(null);
          moveToNext();
        }, 1000);
      }
    } else {
      updateMastery(conceptId, -2); // -2% mastery
      setIsWrong(true);
      
      if (localMastery - 2 < 50) {
        setIsComplete(true);
        endSession(conceptId, 'mastery', total + 1, correct);
        setFeedback('⚠️ Mastery dropped below 50%. Time to return to Rigorous Practice.');
        setDroppedBelow50(true);
      } else {
        setFeedback(`❌ Incorrect. Correct answer: ${questions[currentIndex].answer}. Mastery: ${Math.max(0, localMastery - 2).toFixed(0)}%`);
        
        setTimeout(() => {
          setFeedback(null);
          setIsWrong(false);
          moveToNext();
        }, 1800);
      }
    }
  };

  const moveToNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeSession();
    }
  };

  const showMasteryComplete = () => {
    setIsComplete(true);
    endSession(conceptId, 'mastery', total + 1, correct + 1);
    updateMastery(conceptId, 0); // Ensure it's exactly 100
    unlockNextConcept(conceptId);
    addXP(100); // Bonus XP
    
    setFeedback(`🏆 MASTERY ACHIEVED! You've mastered ${concept?.name}! +100 XP Bonus! Returning home...`);
    
    // Auto-navigate to Home after 3 seconds
    setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);
  };

  const completeSession = () => {
    endSession(conceptId, 'mastery', total, correct);
    setIsComplete(true);
    setShowSessionPrompt(true);
  };

  const handleContinuePracticing = () => {
    setShowSessionPrompt(false);
    setIsComplete(false);
    setCurrentIndex(0);
    setCorrect(0);
    setTotal(0);
    setQuestions(generateDynamicQuestions(conceptId, 100));
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
        <Text style={styles.title}>🏆 Mastery Challenge</Text>
        <Text style={styles.subtitle}>Reach 100% to unlock next concept</Text>
        
        <View style={styles.masteryContainer}>
          <MasteryBar percentage={localMastery} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentIndex + 1}/{totalQuestions}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{correct}/{total}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {total > 0 ? ((correct/total)*100).toFixed(0) : 0}%
            </Text>
            <Text style={styles.statLabel}>Session</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {feedback && (
          <View style={isComplete ? styles.completionBanner : isWrong ? styles.wrongBanner : styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        {droppedBelow50 && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.replace('RigorousPractice', { conceptId })}
          >
            <Text style={styles.retryButtonText}>Back to Rigorous Practice</Text>
          </TouchableOpacity>
        )}

        {showSessionPrompt && (
          <View style={styles.retryRow}>
            <TouchableOpacity style={styles.retryButton} onPress={handleContinuePracticing}>
              <Text style={styles.retryButtonText}>Continue Practicing</Text>
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

        {!isComplete && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🎯 Mastery Rules:</Text>
            <Text style={styles.infoText}>
              • +3% for each correct answer{'\n'}
              • -2% for each wrong answer{'\n'}
              • Reach 100% to master the concept{'\n'}
              • Below 50% returns to Rigorous Practice{'\n'}
              • Earn maximum XP per question
            </Text>
          </View>
        )}

        {!isComplete && localMastery >= 80 && (
          <View style={styles.encouragementBox}>
            <Text style={styles.encouragementText}>
              🌟 Almost there! Just {100 - localMastery}% to go!
            </Text>
          </View>
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
    marginBottom: 20,
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
  masteryContainer: {
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    padding: 12,
    borderRadius: radii.sm,
    marginHorizontal: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    padding: 20,
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
  encouragementBox: {
    backgroundColor: colors.goldSurface,
    padding: 15,
    borderRadius: radii.md,
    marginTop: 15,
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
});

export default MasteryLevelScreen;
