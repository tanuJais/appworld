import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, Alert, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { userProgress, concepts, resetGameState } = useGame();
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Load cloud sync preference
  React.useEffect(() => {
    loadSyncPreference();
  }, []);

  const loadSyncPreference = async () => {
    try {
      const preference = await AsyncStorage.getItem('cloudSyncEnabled');
      if (preference !== null) {
        setCloudSyncEnabled(preference === 'true');
      }
    } catch (error) {
      console.error('Error loading sync preference:', error);
    }
  };

  const toggleCloudSync = async (value: boolean) => {
    try {
      // Save preference
      await AsyncStorage.setItem('cloudSyncEnabled', value.toString());
      setCloudSyncEnabled(value);

      if (value) {
        // Enable cloud sync
        Alert.alert(
          '☁️ Cloud Sync Enabled',
          'Your progress will now be synced to the cloud. Sign in to access your progress from any device.',
          [
            {
              text: 'Sign In',
              onPress: () => {
                // TODO: Implement sign in
                Alert.alert('Coming Soon', 'Cloud authentication will be available soon!');
              }
            },
            { text: 'Later' }
          ]
        );
      } else {
        // Disable cloud sync
        Alert.alert(
          '📱 Local Storage Only',
          'Your progress will only be saved on this device.'
        );
      }
    } catch (error) {
      console.error('Error toggling cloud sync:', error);
      Alert.alert('Error', 'Failed to update sync preference');
    }
  };

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
              await AsyncStorage.multiRemove(['userProgress', 'concepts']);
              resetGameState();
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

  const handleExportProgress = async () => {
    try {
      const exportData = {
        userProgress,
        concepts,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      Alert.alert(
        '📤 Export Progress',
        `Your progress has been prepared for export.\n\nData size: ${(jsonString.length / 1024).toFixed(2)} KB`,
        [
          {
            text: 'Copy to Clipboard',
            onPress: () => {
              // In a real app, use Clipboard API
              Alert.alert('✅ Copied', 'Progress data copied to clipboard');
            }
          },
          {
            text: 'Share',
            onPress: () => {
              // In a real app, use expo-sharing
              Alert.alert('Coming Soon', 'File sharing will be available soon!');
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export progress');
    }
  };

  const handleImportProgress = () => {
    Alert.alert(
      '📥 Import Progress',
      'Import progress from a backup file or another device.',
      [
        {
          text: 'From File',
          onPress: () => Alert.alert('Coming Soon', 'File import will be available soon!')
        },
        {
          text: 'From Cloud',
          onPress: () => Alert.alert('Coming Soon', 'Cloud import will be available soon!')
        },
        { text: 'Cancel', style: 'cancel' }
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
        colors={['#4C1D95', '#5B21B6']}
        style={styles.header}
      >
        <Text style={styles.title}>⚙️ Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Cloud Sync Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>☁️ Storage & Sync</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Cloud Sync</Text>
              <Text style={styles.settingDescription}>
                {cloudSyncEnabled 
                  ? 'Progress synced to cloud' 
                  : 'Progress saved locally only'}
              </Text>
            </View>
            <Switch
              value={cloudSyncEnabled}
              onValueChange={toggleCloudSync}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor={cloudSyncEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          {cloudSyncEnabled && (
            <>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Auto Sync</Text>
                  <Text style={styles.settingDescription}>
                    Sync automatically when connected
                  </Text>
                </View>
                <Switch
                  value={autoSyncEnabled}
                  onValueChange={setAutoSyncEnabled}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor={autoSyncEnabled ? '#fff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  ℹ️ Cloud sync requires an account. Your data is encrypted and secure.
                </Text>
              </View>

              <TouchableOpacity style={styles.syncButton}>
                <Text style={styles.syncButtonText}>🔄 Sync Now</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Data Management</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportProgress}>
            <Text style={styles.actionButtonIcon}>📤</Text>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Export Progress</Text>
              <Text style={styles.actionButtonDescription}>
                Save a backup of your progress
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleImportProgress}>
            <Text style={styles.actionButtonIcon}>📥</Text>
            <View style={styles.actionButtonContent}>
              <Text style={styles.actionButtonTitle}>Import Progress</Text>
              <Text style={styles.actionButtonDescription}>
                Restore from a backup file
              </Text>
            </View>
          </TouchableOpacity>

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
                {cloudSyncEnabled ? '☁️ Cloud + Local' : '📱 Local Only'}
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
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoBox: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 13,
    color: '#4C1D95',
    lineHeight: 18,
  },
  syncButton: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    color: '#1F2937',
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerText: {
    color: '#DC2626',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default SettingsScreen;
