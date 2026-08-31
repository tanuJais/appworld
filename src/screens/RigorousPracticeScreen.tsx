import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { generateDynamicQuestions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import MasteryBar from '../components/MasteryBar';

type RigorousPracticeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RigorousPractice'>;
  route: RouteProp<RootStackParamList, 'RigorousPractice'>;
};

const RigorousPracticeScreen: React.FC<RigorousPracticeScreenProps> = ({ navigation, route }) => {
  const { conceptId } = route.params;
  const { recordAnswer, addXP, adjustDifficulty, gameState, completeRigorousPractice, concepts } = useGame();
  
  const [questions, setQuestions] = useState(generateDynamicQuestions(conceptId, 100));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const totalQuestions = 20; // Show 20 questions per session

  const concept = concepts.find(c => c.id === conceptId);
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

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
      Alert.alert(
        '🆘 Recovery Mode',
        'You\'ve had 3 wrong answers in a row. Let\'s take a break and try some easier questions.',
        [
          {
            text: 'Switch to Easier Questions',
            onPress: () => {
              const easyQuestions = generateDynamicQuestions(conceptId, 100, 'easy');
              setQuestions(easyQuestions);
            }
          }
        ]
      );
    }
  }, [gameState.consecutiveMistakes]);

  const handleAnswer = (isCorrect: boolean) => {
    recordAnswer(conceptId, isCorrect);
    setTotal(total + 1);
    
    if (isCorrect) {
      setCorrect(correct + 1);
      addXP(5); // +5 XP for rigorous practice
      setFeedback(`✅ Correct! Streak: ${gameState.currentStreak}`);
      
      // Auto-advance after a short delay
      setTimeout(() => {
        setFeedback(null);
        moveToNext();
      }, 1000);
    } else {
      Alert.alert(
        '❌ Incorrect',
        `The correct answer is ${questions[currentIndex].answer}.`,
        [{ text: 'Continue', onPress: moveToNext }]
      );
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
    
    if (accuracy >= 85) {
      completeRigorousPractice(conceptId);
      setFeedback(`🎉 Rigorous Practice Complete! ${accuracy.toFixed(0)}% accuracy. Starting Mastery Challenge...`);
      
      // Auto-navigate to Mastery Challenge after 2.5 seconds
      setTimeout(() => {
        navigation.replace('MasteryLevel', { conceptId });
      }, 2500);
    } else {
      setFeedback(`Almost There! You got ${accuracy.toFixed(0)}% accuracy. Need 85% for Mastery Challenge.`);
      
      // Show retry option after 2.5 seconds
      setTimeout(() => {
        Alert.alert(
          'Try Again?',
          'Would you like to retry Rigorous Practice or return home?',
          [
            {
              text: 'Try Again',
              onPress: () => {
                setIsComplete(false);
                setCurrentIndex(0);
                setCorrect(0);
                setTotal(0);
                setQuestions(generateDynamicQuestions(conceptId, 100));
                setFeedback(null);
              }
            },
            {
              text: 'Back to Home',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      }, 2500);
    }
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
        {feedback && (
          <View style={isComplete ? styles.completionBanner : styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedback}</Text>
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
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    ...Platform.select({
      web: {
        maxHeight: '100vh',
      },
    }),
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C1D95',
  },
  content: {
    padding: 20,
  },
  feedbackBanner: {
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
  },
  completionBanner: {
    backgroundColor: '#DDD6FE',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  streakBanner: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  infoBox: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C1D95',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#5B21B6',
    lineHeight: 20,
  },
});

export default RigorousPracticeScreen;
