import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';

type ConceptIntroScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ConceptIntro'>;
  route: RouteProp<RootStackParamList, 'ConceptIntro'>;
};

const ConceptIntroScreen: React.FC<ConceptIntroScreenProps> = ({ navigation, route }) => {
  const { conceptId } = route.params;
  const { concepts } = useGame();
  
  const concept = concepts.find(c => c.id === conceptId);

  if (!concept) {
    return (
      <View style={styles.container}>
        <Text>Concept not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <LinearGradient
        colors={['#4C1D95', '#5B21B6']}
        style={styles.header}
      >
        <Text style={styles.title}>{concept.name}</Text>
        <Text style={styles.subtitle}>{concept.description}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.introCard}>
          <Text style={styles.sectionTitle}>📚 Introduction</Text>
          <Text style={styles.introText}>{concept.introduction}</Text>
        </View>

        <Text style={styles.sectionTitle}>🎯 Examples</Text>

        {concept.examples.map((example, index) => (
          <View key={index} style={styles.exampleCard}>
            <View style={styles.exampleHeader}>
              <Text style={styles.exampleNumber}>Example {index + 1}</Text>
              <Text style={styles.problem}>{example.problem}</Text>
            </View>

            <View style={styles.stepsContainer}>
              {example.steps.map((step, stepIndex) => (
                <View key={stepIndex} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            <View style={styles.solutionBox}>
              <Text style={styles.solutionLabel}>Answer:</Text>
              <Text style={styles.solution}>{example.solution}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('GuidedPractice', { conceptId })}
        >
          <Text style={styles.startButtonText}>🚀 Start Guided Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.replayButton}
          onPress={() => {}}
        >
          <Text style={styles.replayButtonText}>🔄 Replay Introduction</Text>
        </TouchableOpacity>
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
    padding: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E9D5FF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4C1D95',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  exampleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleHeader: {
    marginBottom: 15,
  },
  exampleNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4C1D95',
    marginBottom: 8,
  },
  problem: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  stepsContainer: {
    marginVertical: 15,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    paddingTop: 3,
  },
  solutionBox: {
    backgroundColor: '#D1FAE5',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  solutionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065F46',
    marginRight: 10,
  },
  solution: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  startButton: {
    backgroundColor: '#4C1D95',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  replayButton: {
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  replayButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConceptIntroScreen;
