import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing } from '../theme/theme';

type ProgressScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Progress'>;
};

const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const { userProgress, concepts } = useGame();
  const lessons = concepts.filter(concept => concept.kind === 'lesson');

  const completedConcepts = lessons.filter(c => c.masteryPercentage >= 100).length;
  const totalAccuracy = Object.values(userProgress.concepts).reduce(
    (sum, concept) => sum + concept.accuracy, 0
  ) / Math.max(Object.keys(userProgress.concepts).length, 1);

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
        <Text style={styles.headerTitle}>🏆 Your Progress</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProgress.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProgress.totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProgress.streak} 🔥</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedConcepts}/{lessons.length}</Text>
            <Text style={styles.statLabel}>Concepts</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity style={styles.calendarLink} onPress={() => navigation.navigate('Calendar')}>
          <Text style={styles.calendarLinkText}>📅 View Practice Calendar ›</Text>
        </TouchableOpacity>

        <View style={styles.accuracyCard}>
          <Text style={styles.accuracyTitle}>Overall Accuracy</Text>
          <Text style={styles.accuracyValue}>{totalAccuracy.toFixed(1)}%</Text>
          <View style={styles.accuracyBar}>
            <View style={[styles.accuracyFill, { width: `${totalAccuracy}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Concept Progress</Text>

        {lessons.map((concept) => {
          const progress = userProgress.concepts[concept.id];
          
          return (
            <View key={concept.id} style={styles.conceptCard}>
              <View style={styles.conceptHeader}>
                <Text style={styles.conceptName}>{concept.name}</Text>
                {concept.masteryPercentage >= 100 && (
                  <Text style={styles.masteredBadge}>🏆 Mastered</Text>
                )}
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Mastery</Text>
                <Text style={styles.progressValue}>
                  {concept.masteryPercentage.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={
                    concept.masteryPercentage >= 100
                      ? gradients.success
                      : [colors.primary, colors.primaryLight]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${Math.min(100, concept.masteryPercentage)}%` }]}
                />
              </View>

              {progress && (
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailValue}>{progress.totalAttempts}</Text>
                    <Text style={styles.detailLabel}>Attempts</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailValue}>{progress.correctAttempts}</Text>
                    <Text style={styles.detailLabel}>Correct</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailValue}>{progress.accuracy.toFixed(0)}%</Text>
                    <Text style={styles.detailLabel}>Accuracy</Text>
                  </View>
                </View>
              )}

              <View style={styles.badges}>
                {concept.videoWatched && (
                  <View style={styles.badge}>
                    <Text>▶️ Video</Text>
                  </View>
                )}
                {concept.guidedPracticeCompleted && (
                  <View style={styles.badge}>
                    <Text>✓ Guided</Text>
                  </View>
                )}
                {concept.rigorousPracticeCompleted && (
                  <View style={styles.badge}>
                    <Text>✓ Rigorous</Text>
                  </View>
                )}
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Confidence</Text>
                <Text style={styles.progressValue}>
                  {concept.confidenceScore.toFixed(0)}%
                </Text>
              </View>

              <TouchableOpacity
                style={styles.practiceButton}
                onPress={() => {
                  if (!concept.guidedPracticeCompleted) {
                    navigation.navigate('GuidedPractice', { conceptId: concept.id });
                  } else if (!concept.rigorousPracticeCompleted) {
                    navigation.navigate('RigorousPractice', { conceptId: concept.id });
                  } else {
                    navigation.navigate('MasteryLevel', { conceptId: concept.id });
                  }
                }}
              >
                <Text style={styles.practiceButtonText}>
                  Continue Practice →
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Tips to Improve:</Text>
          <Text style={styles.tipText}>
            • Practice daily to maintain your streak{'\n'}
            • Review concepts where accuracy is low{'\n'}
            • Complete all practice levels{'\n'}
            • Aim for 100% mastery on each concept
          </Text>
        </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textInverse,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    padding: 15,
    borderRadius: radii.md,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textInverse,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.goldSurface,
  },
  content: {
    padding: spacing.xl,
  },
  calendarLink: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
    ...shadow.card,
  },
  calendarLinkText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  accuracyCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: 20,
    alignItems: 'center',
    ...shadow.card,
  },
  accuracyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  accuracyValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  accuracyBar: {
    width: '100%',
    height: 12,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  conceptCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: 15,
    ...shadow.card,
  },
  conceptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  conceptName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  masteredBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressFill: {
    height: '100%',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderRadius: radii.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  badge: {
    backgroundColor: colors.successSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.md,
  },
  practiceButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  tipBox: {
    backgroundColor: colors.surfaceAlt,
    padding: 15,
    borderRadius: radii.md,
    marginTop: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.primary,
    lineHeight: 20,
  },
});

export default ProgressScreen;
