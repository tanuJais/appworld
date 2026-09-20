import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing } from '../theme/theme';
import Avatar, { GURUKUL_AVATARS } from '../components/ui/Avatar';

type ProfileSwitcherScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProfileSwitcher'>;
};

const ProfileSwitcherScreen: React.FC<ProfileSwitcherScreenProps> = ({ navigation }) => {
  const { profiles, activeProfileId, switchProfile, addProfile, renameProfile, removeProfile } = useGame();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState<string>(GURUKUL_AVATARS.boy);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    await addProfile(name, newAvatar);
    setNewName('');
    setNewAvatar(GURUKUL_AVATARS.boy);
    setIsAdding(false);
    navigation.navigate('Home');
  };

  const handleSwitch = async (profileId: string) => {
    if (profileId === activeProfileId) return;
    await switchProfile(profileId);
    navigation.navigate('Home');
  };

  const handleStartEdit = (profileId: string, name: string) => {
    setEditingProfileId(profileId);
    setEditedName(name);
  };

  const handleSaveEdit = async () => {
    const name = editedName.trim();
    if (!editingProfileId || !name) return;
    await renameProfile(editingProfileId, name);
    setEditingProfileId(null);
    setEditedName('');
  };

  const handleDelete = (profileId: string, name: string) => {
    if (profiles.length <= 1) {
      Alert.alert('Cannot Remove', 'At least one profile must remain.');
      return;
    }
    Alert.alert(
      `Remove ${name}?`,
      'This will permanently delete this profile and all of its progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeProfile(profileId) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={gradients.header} style={styles.header}>
          <Text style={styles.title}>👥 Profiles</Text>
          <Text style={styles.subtitle}>Switch learners or add a new one</Text>
        </LinearGradient>

        <View style={styles.content}>
          {profiles.map(profile => (
            <View key={profile.id}>
              {editingProfileId === profile.id ? (
                <View style={styles.editForm}>
                  <TextInput
                    style={styles.input}
                    value={editedName}
                    onChangeText={setEditedName}
                    autoFocus
                    selectTextOnFocus
                    placeholder="Learner name"
                  />
                  <View style={styles.addFormRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setEditingProfileId(null)}>
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                      <Text style={styles.saveButtonText}>Save Name</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View
                  style={[styles.profileCard, profile.id === activeProfileId && styles.activeProfileCard]}
                >
                  <TouchableOpacity
                    style={styles.profileSelect}
                    onPress={() => handleSwitch(profile.id)}
                    onLongPress={() => handleDelete(profile.id, profile.name)}
                  >
                    <View style={styles.avatar}>
                      <Avatar avatar={profile.avatar} size={32} />
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{profile.name}</Text>
                      {profile.id === activeProfileId && <Text style={styles.activeLabel}>Active</Text>}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleStartEdit(profile.id, profile.name)}
                    accessibilityLabel={`Edit ${profile.name}`}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          {isAdding ? (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="Learner name"
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
              <Text style={styles.avatarLabel}>Choose an avatar</Text>
              <View style={styles.avatarOptions}>
                {[
                  { value: GURUKUL_AVATARS.boy, label: 'Boy' },
                  { value: GURUKUL_AVATARS.girl, label: 'Girl' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.avatarOption, newAvatar === option.value && styles.selectedAvatarOption]}
                    onPress={() => setNewAvatar(option.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: newAvatar === option.value }}
                  >
                    <Avatar avatar={option.value} size={42} />
                    <Text style={styles.avatarOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.addFormRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
                  <Text style={styles.saveButtonText}>Add Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
              <Text style={styles.addButtonText}>+ Add Learner Profile</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.hint}>Tip: Long-press a profile to remove it.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    ...Platform.select({ web: { maxHeight: '100vh' as any } }),
  },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { padding: spacing.xxl, paddingTop: spacing.xl },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.textInverse, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.goldSurface },
  content: { padding: spacing.xl },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow.card,
  },
  profileSelect: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  editButtonText: { color: colors.primary, fontWeight: '600' },
  activeProfileCard: { borderColor: colors.gold },
  avatar: { marginRight: 16 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  activeLabel: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 2 },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: { color: colors.textInverse, fontWeight: 'bold', fontSize: 16 },
  addForm: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: 16, marginTop: 8, ...shadow.card },
  editForm: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: 16, marginBottom: 12, ...shadow.card },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: colors.textPrimary,
  },
  avatarLabel: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  avatarOptions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  avatarOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  selectedAvatarOption: { borderColor: colors.primary, backgroundColor: colors.surfaceMuted },
  avatarOptionText: { color: colors.textPrimary, fontWeight: '600' },
  addFormRow: { flexDirection: 'row', gap: 10 },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: radii.sm,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  cancelButtonText: { color: colors.textSecondary, fontWeight: '600' },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: radii.sm,
    alignItems: 'center',
    backgroundColor: colors.success,
  },
  saveButtonText: { color: colors.textInverse, fontWeight: 'bold' },
  hint: { textAlign: 'center', color: colors.textMuted, marginTop: 16, fontSize: 12 },
});

export default ProfileSwitcherScreen;
