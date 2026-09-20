import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing } from '../theme/theme';

type SettingsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { userProgress, concepts, resetActiveProfileProgress } = useGame();

  const handleResetProgress = () => {
    Alert.alert(
      '⚠️ Reset All Progress',
      'This will delete all your progress, XP, and achievements. This action cannot be undone!',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetActiveProfileProgress();
              Alert.alert('✅ Reset Complete', 'All progress has been cleared.');
              navigation.navigate('Home');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset progress');
            }
          }
        }
      ]
    );
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
        <Text style={styles.title}>⚙️ Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Profiles Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Learner Profiles</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ProfileSwitcher')}>
            <Text style={styles.actionButtonIcon}>👥</Text>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Manage Profiles</Text>
              <Text style={styles.actionButtonDescription}>
                Add, switch, or remove learner profiles
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Calendar')}>
            <Text style={styles.actionButtonIcon}>📅</Text>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Practice Calendar</Text>
              <Text style={styles.actionButtonDescription}>
                View daily time spent practicing
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Data Management</Text>

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={handleResetProgress}
          >
            <Text style={styles.actionButtonIcon}>🗑️</Text>
            <View style={styles.actionButtonContent}>
              <Text style={[styles.actionButtonTitle, styles.dangerText]}>
                Reset All Progress
              </Text>
              <Text style={styles.actionButtonDescription}>
                Delete all data (cannot be undone)
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Storage Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Storage Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Storage Type:</Text>
              <Text style={styles.infoValue}>
                📱 Local Only
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total XP:</Text>
              <Text style={styles.infoValue}>{userProgress.totalXP}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Concepts Tracked:</Text>
              <Text style={styles.infoValue}>
                {Object.keys(userProgress.concepts).length}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated:</Text>
              <Text style={styles.infoValue}>Just now</Text>
            </View>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform:</Text>
              <Text style={styles.infoValue}>React Native + Expo</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for math learners everywhere
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
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radii.md,
    marginBottom: 10,
    ...shadow.card,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoBox: {
    backgroundColor: colors.surfaceAlt,
    padding: 12,
    borderRadius: radii.sm,
    marginTop: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18,
  },
  syncButton: {
    backgroundColor: colors.success,
    padding: 14,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 10,
  },
  syncButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radii.md,
    marginBottom: 10,
    ...shadow.card,
  },
  actionButtonIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.errorSurface,
  },
  dangerText: {
    color: colors.error,
  },
  infoCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radii.md,
    ...shadow.card,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default SettingsScreen;
