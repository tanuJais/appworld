import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';

type ProgressScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Progress'>;
};

const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const { userProgress, concepts } = useGame();

  const completedConcepts = concepts.filter(c => c.masteryPercentage >= 100).length;
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
        colors={['#4C1D95', '#5B21B6', '#6D28D9']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Your Progress</Text>
        
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
            <Text style={styles.statValue}>{completedConcepts}/{concepts.length}</Text>
            <Text style={styles.statLabel}>Concepts</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.accuracyCard}>
          <Text style={styles.accuracyTitle}>Overall Accuracy</Text>
          <Text style={styles.accuracyValue}>{totalAccuracy.toFixed(1)}%</Text>
          <View style={styles.accuracyBar}>
            <View style={[styles.accuracyFill, { width: `${totalAccuracy}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Concept Progress</Text>

        {concepts.map((concept) => {
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
                      ? ['#10B981', '#059669']
                      : ['#4C1D95', '#6D28D9']
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
                disabled={!concept.unlocked}
              >
                <Text style={styles.practiceButtonText}>
                  {!concept.unlocked ? '🔒 Locked' : 'Continue Practice →'}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#E9D5FF',
  },
  content: {
    padding: 20,
  },
  accuracyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accuracyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  accuracyValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4C1D95',
    marginBottom: 15,
  },
  accuracyBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    backgroundColor: '#4C1D95',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  conceptCard: {
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
  conceptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  conceptName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  masteredBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4C1D95',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  badge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  practiceButton: {
    backgroundColor: '#4C1D95',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tipBox: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C1D95',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#5B21B6',
    lineHeight: 20,
  },
});

export default ProgressScreen;
