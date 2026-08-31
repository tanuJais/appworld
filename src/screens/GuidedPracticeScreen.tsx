import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { generateDynamicQuestions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import MasteryBar from '../components/MasteryBar';

type GuidedPracticeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GuidedPractice'>;
  route: RouteProp<RootStackParamList, 'GuidedPractice'>;
};

const GuidedPracticeScreen: React.FC<GuidedPracticeScreenProps> = ({ navigation, route }) => {
  const { conceptId } = route.params;
  const { recordAnswer, addXP, completeGuidedPractice, userProgress, concepts } = useGame();
  
  const [questions, setQuestions] = useState(generateDynamicQuestions(conceptId, 50, 'easy'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const totalQuestions = 10; // Show 10 questions per session

  const concept = concepts.find(c => c.id === conceptId);
  const accuracy = total > 0 ? (correct / total) * 100 : 0;

  const handleAnswer = (isCorrect: boolean) => {
    recordAnswer(conceptId, isCorrect);
    setTotal(total + 1);
    
    if (isCorrect) {
      setCorrect(correct + 1);
      addXP(2); // +2 XP for guided practice
      setFeedback('✅ Correct! Great job!');
      
      // Auto-advance after a short delay
      setTimeout(() => {
        setFeedback(null);
        moveToNext();
      }, 1000);
    } else {
      // Show correct answer and auto-advance
      Alert.alert(
        '❌ Not Quite',
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
    
    if (accuracy >= 70) {
      completeGuidedPractice(conceptId);
      setFeedback(`🎉 Guided Practice Complete! ${accuracy.toFixed(0)}% accuracy. Moving to Rigorous Practice...`);
      
      // Auto-navigate to Rigorous Practice after 2.5 seconds
      setTimeout(() => {
        navigation.replace('RigorousPractice', { conceptId });
      }, 2500);
    } else {
      setFeedback(`Keep Practicing! You got ${accuracy.toFixed(0)}% accuracy. Need 70% to unlock Rigorous Practice.`);
      
      // Show retry option after 2.5 seconds
      setTimeout(() => {
        Alert.alert(
          'Try Again?',
          'Would you like to retry Guided Practice or return home?',
          [
            {
              text: 'Retry',
              onPress: () => {
                setIsComplete(false);
                setCurrentIndex(0);
                setCorrect(0);
                setTotal(0);
                setQuestions(generateDynamicQuestions(conceptId, 50, 'easy'));
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
          <View style={isComplete ? styles.completionBanner : styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedback}</Text>
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
              • Achieve 70% accuracy to unlock next level
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4C1D95',
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
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
  infoBox: {
    backgroundColor: '#FEF3C7',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },
});

export default GuidedPracticeScreen;
