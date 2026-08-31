import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { userProgress, concepts } = useGame();

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
        <Text style={styles.title}>Welcome Back! 👋</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userProgress.totalXP}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Level {userProgress.level}</Text>
            <Text style={styles.statLabel}>Your Level</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userProgress.streak} 🔥</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.progressButton, styles.halfButton]}
            onPress={() => navigation.navigate('Progress')}
          >
            <Text style={styles.progressButtonText}>📊 Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingsButton, styles.halfButton]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Learning Path</Text>

        {concepts.map((concept, index) => {
          const isLocked = !concept.unlocked;
          const progress = userProgress.concepts[concept.id];

          return (
            <TouchableOpacity
              key={concept.id}
              style={[styles.conceptCard, isLocked && styles.lockedCard]}
              disabled={isLocked}
              onPress={() => navigation.navigate('ConceptIntro', { conceptId: concept.id })}
            >
              <View style={styles.conceptHeader}>
                <Text style={styles.conceptNumber}>{index + 1}</Text>
                <View style={styles.conceptInfo}>
                  <Text style={[styles.conceptName, isLocked && styles.lockedText]}>
                    {concept.name} {isLocked && '🔒'}
                  </Text>
                  <Text style={styles.conceptDescription}>{concept.description}</Text>
                </View>
              </View>

              {!isLocked && (
                <View style={styles.progressInfo}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${concept.masteryPercentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.masteryText}>
                    {Math.round(concept.masteryPercentage)}% Mastery
                  </Text>
                </View>
              )}

              {!isLocked && (
                <View style={styles.badges}>
                  {concept.guidedPracticeCompleted && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>✓ Guided</Text>
                    </View>
                  )}
                  {concept.rigorousPracticeCompleted && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>✓ Rigorous</Text>
                    </View>
                  )}
                  {concept.masteryPercentage >= 100 && (
                    <View style={[styles.badge, styles.masteryBadge]}>
                      <Text style={styles.badgeText}>🏆 Mastered</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#E9D5FF',
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  halfButton: {
    flex: 1,
  },
  progressButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#6B7280',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  lockedCard: {
    opacity: 0.6,
  },
  conceptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  conceptNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C1D95',
    backgroundColor: '#EEF2FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40,
    marginRight: 15,
  },
  conceptInfo: {
    flex: 1,
  },
  conceptName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  conceptDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressInfo: {
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4C1D95',
  },
  masteryText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  masteryBadge: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default HomeScreen;
