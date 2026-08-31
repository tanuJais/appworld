import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { generateDynamicQuestions } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import MasteryBar from '../components/MasteryBar';

type MasteryLevelScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MasteryLevel'>;
  route: RouteProp<RootStackParamList, 'MasteryLevel'>;
};

const MasteryLevelScreen: React.FC<MasteryLevelScreenProps> = ({ navigation, route }) => {
  const { conceptId } = route.params;
  const { 
    recordAnswer, 
    addXP, 
    updateMastery, 
    unlockNextConcept,
    concepts 
  } = useGame();
  
  const [questions, setQuestions] = useState(generateDynamicQuestions(conceptId, 100));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  const totalQuestions = 30; // Show 30 questions per session

  const concept = concepts.find(c => c.id === conceptId);
  const localMastery = concept?.masteryPercentage || 0;

  const handleAnswer = (isCorrect: boolean) => {
    recordAnswer(conceptId, isCorrect);
    setTotal(total + 1);
    
    if (isCorrect) {
      setCorrect(correct + 1);
      addXP(10); // +10 XP for mastery level
      updateMastery(conceptId, 3); // +3% mastery
      
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
      
      if (localMastery - 2 < 50) {
        Alert.alert(
          '⚠️ Mastery Dropped',
          'Your mastery has dropped below 50%. You need to return to Rigorous Practice.',
          [
            {
              text: 'Back to Rigorous Practice',
              onPress: () => navigation.replace('RigorousPractice', { conceptId })
            }
          ]
        );
      } else {
        Alert.alert(
          '❌ Incorrect',
          `Correct answer: ${questions[currentIndex].answer}\nMastery: ${Math.max(0, localMastery - 2).toFixed(0)}%`,
          [{ text: 'Continue', onPress: moveToNext }]
        );
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
    const accuracy = (correct / total) * 100;
    
    Alert.alert(
      'Session Complete',
      `You completed the session with ${accuracy.toFixed(0)}% accuracy.\n\nCurrent Mastery: ${localMastery.toFixed(0)}%`,
      [
        {
          text: 'Continue Practicing',
          onPress: () => {
            setCurrentIndex(0);
            setCorrect(0);
            setTotal(0);
            setQuestions(generateDynamicQuestions(conceptId, 100));
          }
        },
        {
          text: 'Back to Home',
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
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
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C1D95',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
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
  encouragementBox: {
    backgroundColor: '#D1FAE5',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  encouragementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
  },
});

export default MasteryLevelScreen;
