import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Question } from '../types';
import { colors, radii, shadow, spacing } from '../theme/theme';

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
        placeholderTextColor={colors.textMuted}
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
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginVertical: spacing.md,
    ...shadow.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  questionNumber: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.md,
  },
  difficulty_easy: {
    backgroundColor: colors.easySurface,
  },
  difficulty_medium: {
    backgroundColor: colors.mediumSurface,
  },
  difficulty_hard: {
    backgroundColor: colors.hardSurface,
  },
  difficulty_expert: {
    backgroundColor: colors.expertSurface,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  questionContainer: {
    backgroundColor: colors.surfaceMuted,
    padding: spacing.xl,
    borderRadius: radii.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radii.md,
    padding: 15,
    fontSize: 18,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  hintButton: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  hintButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  hintContainer: {
    backgroundColor: colors.surfaceAlt,
    padding: 15,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  hintText: {
    color: colors.primary,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuestionCard;
