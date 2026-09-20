import React from 'react';
import { Alert, View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing, typography, motifs } from '../theme/theme';
import Avatar from '../components/ui/Avatar';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const GREETINGS = ['Namaste', 'Welcome back', 'Suswagatam'];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { userProgress, concepts, profiles, activeProfileId, lastActivity, todayMinutes } = useGame();
  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const lastConcept = lastActivity ? concepts.find(c => c.id === lastActivity.conceptId) : null;
  const greeting = GREETINGS[new Date().getDate() % GREETINGS.length];
  const dailyGoalMinutes = 15;
  const goalProgress = Math.min(100, (todayMinutes / dailyGoalMinutes) * 100);

  const resumeScreen = (mode: string): keyof RootStackParamList => {
    if (mode === 'guided') return 'GuidedPractice';
    if (mode === 'rigorous') return 'RigorousPractice';
    if (mode === 'mastery') return 'MasteryLevel';
    return 'ConceptIntro';
  };

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
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileSwitcher')} style={styles.profileRow}>
            <Text style={styles.eyebrow}>{motifs.om} {greeting}</Text>
            <View style={styles.profileNameRow}>
              <Avatar avatar={activeProfile?.avatar || 'gurukul_boy'} size={30} />
              <Text style={styles.title}> {activeProfile?.name || 'Learner'} ›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('Progress')}
              accessibilityLabel="View progress"
            >
              <Text style={styles.headerIcon}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('Settings')}
              accessibilityLabel="Open settings menu"
            >
              <Text style={styles.headerIcon}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userProgress.totalXP}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userProgress.streak}🔥</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Lvl {userProgress.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>
        <View style={styles.goldRule} />
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.goalCard}>
          <View style={styles.goalTextCol}>
            <Text style={styles.goalTitle}>Today's Practice</Text>
            <Text style={styles.goalSubtitle}>
              {Math.round(todayMinutes)} of {dailyGoalMinutes} min
              {goalProgress >= 100 ? ' · Goal reached! 🌟' : ''}
            </Text>
          </View>
          <View style={styles.goalBarTrack}>
            <View style={[styles.goalBarFill, { width: `${goalProgress}%` }]} />
          </View>
        </View>

        {lastConcept && (
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => (navigation as any).navigate(resumeScreen(lastActivity!.mode), { conceptId: lastConcept.id })}
          >
            <Text style={styles.continueLabel}>▶️ CONTINUE LEARNING</Text>
            <Text style={styles.continueConceptName}>{lastConcept.name}</Text>
            <Text style={styles.continueCta}>Resume practice →</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => navigation.navigate('BaseMultiplication', { leftValue: 98, rightValue: 97, base: 100 })}
        >
          <Text style={styles.progressButtonText}>✨ Base-100 Animation (98 × 97)</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{motifs.lotus} Your Learning Path</Text>

        {concepts.map((concept, index) => {
          const progress = userProgress.concepts[concept.id];
          const isLast = index === concepts.length - 1;

          return (
            <View key={concept.id} style={styles.pathRow}>
              <View style={styles.pathTrack}>
                <View style={[styles.pathDot, styles.pathDotActive]} />
                {!isLast && <View style={[styles.pathLine, concept.masteryPercentage >= 100 && styles.pathLineActive]} />}
              </View>
              <TouchableOpacity
                style={styles.conceptCard}
                onPress={() => {
                  navigation.navigate('ConceptIntro', { conceptId: concept.id });
                }}
                activeOpacity={0.85}
              >
                <View style={styles.conceptHeader}>
                  <Text style={styles.conceptNumber}>{index + 1}</Text>
                  <View style={styles.conceptInfo}>
                    <Text style={styles.conceptName}>{concept.name}</Text>
                    <Text style={styles.conceptDescription}>{concept.description}</Text>
                    {concept.kind === 'introduction' && (
                      <Text style={styles.masteryText}>Introduction</Text>
                    )}
                  </View>
                </View>

                {(
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

                {(
                  <View style={styles.badges}>
                    {concept.videoWatched && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>▶️ Video</Text>
                      </View>
                    )}
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
            </View>
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
    paddingTop: spacing.xxxl,
    position: 'relative',
  },
  profileRow: {
    marginBottom: spacing.xl,
    flex: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  headerIconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerIcon: {
    fontSize: 21,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.goldLight,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  title: {
    ...typography.display,
    color: colors.textInverse,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    padding: spacing.lg,
    borderRadius: radii.md,
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  statLabel: {
    fontSize: 12,
    color: colors.goldSurface,
    marginTop: 4,
  },
  goldRule: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.gold,
    opacity: 0.7,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  goalTextCol: {
    marginBottom: spacing.sm,
  },
  goalTitle: {
    ...typography.label,
    color: colors.textPrimary,
  },
  goalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  goalBarTrack: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
  },
  continueCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    ...shadow.card,
  },
  continueLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  continueConceptName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  continueCta: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.teal,
    marginTop: spacing.xs,
  },
  progressButton: {
    backgroundColor: colors.teal,
    padding: spacing.lg,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  progressButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  pathRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  pathTrack: {
    width: 24,
    alignItems: 'center',
  },
  pathDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
    marginTop: spacing.xl,
  },
  pathDotActive: {
    backgroundColor: colors.gold,
  },
  pathLine: {
    width: 3,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  pathLineActive: {
    backgroundColor: colors.gold,
  },
  conceptCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    flex: 1,
    ...shadow.card,
  },
  lockedCard: {
    opacity: 0.6,
  },
  subscriptionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  subscriptionBadgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  conceptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  conceptNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    backgroundColor: colors.surfaceAlt,
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40,
    marginRight: spacing.lg,
  },
  conceptInfo: {
    flex: 1,
  },
  conceptName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  lockedText: {
    color: colors.textMuted,
  },
  conceptDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressInfo: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  masteryText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.successSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.md,
  },
  masteryBadge: {
    backgroundColor: colors.goldSurface,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

export default HomeScreen;
