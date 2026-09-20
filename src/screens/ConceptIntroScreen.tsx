import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';
import MasteryBar from '../components/MasteryBar';
import AnimatedExample from '../components/AnimatedExample';
import BaseMultiplicationLesson from '../components/baseMultiplication/BaseMultiplicationLesson';
import { colors, gradients, radii, shadow, spacing } from '../theme/theme';

type ConceptIntroScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ConceptIntro'>;
  route: RouteProp<RootStackParamList, 'ConceptIntro'>;
};

const ConceptIntroScreen: React.FC<ConceptIntroScreenProps> = ({ navigation, route }) => {
  const { conceptId } = route.params;
  const { concepts, markVideoWatched, recordActivity } = useGame();
  
  const concept = concepts.find(c => c.id === conceptId);

  if (!concept) {
    return (
      <View style={styles.container}>
        <Text>Concept not found</Text>
      </View>
    );
  }

  if (concept.kind === 'introduction') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <LinearGradient colors={gradients.header} style={styles.header}>
            <Text style={styles.title}>🪔 {concept.name}</Text>
            <Text style={styles.subtitle}>{concept.description}</Text>
          </LinearGradient>
          <View style={styles.content}>
            <View style={styles.introCard}>
              <Text style={styles.sectionTitle}>📚 Introduction</Text>
              <Text style={styles.introText}>{concept.introduction}</Text>
            </View>
            {concept.introductionSections?.map((section) => (
              <View key={section.title} style={styles.informationCard}>
                <Text style={styles.informationTitle}>{section.title}</Text>
                <Text style={styles.informationText}>{section.body}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!concept.hasContent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>{concept.name}</Text>
          <View style={styles.introCard}>
            <Text style={styles.introText}>{concept.introduction}</Text>
          </View>
        </View>
      </SafeAreaView>
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
        colors={gradients.header}
        style={styles.header}
      >
        <Text style={styles.title}>🪔 {concept.name}</Text>
        <Text style={styles.subtitle}>{concept.description}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.introCard}>
          <Text style={styles.sectionTitle}>📚 Introduction</Text>
          <Text style={styles.introText}>{concept.introduction}</Text>
        </View>

        <MasteryBar percentage={concept.confidenceScore} label="Confidence" />

        <TouchableOpacity
          style={concept.videoWatched ? styles.replayButton : styles.startButton}
          onPress={() => {
            markVideoWatched(conceptId);
            recordActivity(conceptId, 'video', 0);
          }}
        >
          <Text style={concept.videoWatched ? styles.replayButtonText : styles.startButtonText}>
            {concept.videoWatched ? '✅ Video Watched' : '▶️ Mark Video as Watched'}
          </Text>
        </TouchableOpacity>

        {conceptId === 'nikhilam-navatashcaramam-dashatah' && (
          <>
            <Text style={styles.sectionTitle}>✨ Watch it happen</Text>
            <BaseMultiplicationLesson leftValue={98} rightValue={97} base={100} />
          </>
        )}

        <TouchableOpacity
          style={styles.replayButton}
          onPress={() => navigation.navigate('BaseMultiplication', { leftValue: 98, rightValue: 97, base: 100 })}
        >
          <Text style={styles.replayButtonText}>🔎 Open the animation full screen</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>🎯 Examples</Text>

        {concept.examples.map((example, index) => (
          <AnimatedExample
            key={index}
            index={index}
            problem={example.problem}
            steps={example.steps}
            solution={example.solution}
          />
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            recordActivity(conceptId, 'guided', 0);
            navigation.navigate('GuidedPractice', { conceptId });
          }}
        >
          <Text style={styles.startButtonText}>🔱 Start Guided Practice</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: spacing.xxl,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textInverse,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.goldSurface,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  informationCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  informationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  informationText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  replayButton: {
    backgroundColor: colors.surfaceMuted,
    padding: 16,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 10,
  },
  replayButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConceptIntroScreen;
