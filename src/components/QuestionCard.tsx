import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Question } from '../types';

type QuestionCardProps = {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  showHint?: boolean;
  questionNumber: number;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onAnswer, 
  showHint = true,
  questionNumber 
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [hintVisible, setHintVisible] = useState(false);

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      Alert.alert('Please enter an answer');
      return;
    }

    const answer = parseInt(userAnswer);
    const isCorrect = answer === question.answer;
    
    onAnswer(isCorrect);
    setUserAnswer('');
    setHintVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionNumber}>Question {questionNumber}</Text>
        <View style={[styles.difficultyBadge, styles[`difficulty_${question.difficulty}`]]}>
          <Text style={styles.difficultyText}>
            {question.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      <TextInput
        style={styles.input}
        value={userAnswer}
        onChangeText={setUserAnswer}
        placeholder="Enter your answer"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />

      {showHint && question.hint && (
        <TouchableOpacity
          style={styles.hintButton}
          onPress={() => setHintVisible(!hintVisible)}
        >
          <Text style={styles.hintButtonText}>
            {hintVisible ? '🙈 Hide Hint' : '💡 Show Hint'}
          </Text>
        </TouchableOpacity>
      )}

      {hintVisible && question.hint && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>{question.hint}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Answer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  questionNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficulty_easy: {
    backgroundColor: '#D1FAE5',
  },
  difficulty_medium: {
    backgroundColor: '#FEF3C7',
  },
  difficulty_hard: {
    backgroundColor: '#FED7AA',
  },
  difficulty_expert: {
    backgroundColor: '#FECACA',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  questionContainer: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#4C1D95',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  hintButton: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  hintButtonText: {
    color: '#4C1D95',
    fontSize: 14,
    fontWeight: '600',
  },
  hintContainer: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4C1D95',
  },
  hintText: {
    color: '#4C1D95',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4C1D95',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuestionCard;
