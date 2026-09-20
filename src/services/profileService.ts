import AsyncStorage from '@react-native-async-storage/async-storage';
import { Concept, LastActivity, UserProfile } from '../types';
import { concepts as defaultConcepts } from '../data/concepts';
import { clearProfileData } from './database';
import { gurukulAvatars } from '../theme/theme';

/**
 * Manages local learner profiles and per-profile progress/settings.
 * Each profile's data is isolated by namespacing AsyncStorage keys with the profileId.
 */

const PROFILES_KEY = 'profiles';
const ACTIVE_PROFILE_KEY = 'activeProfileId';

const topicProgressKey = (profileId: string) => `topicProgress_${profileId}`;
const lastActivityKey = (profileId: string) => `lastActivity_${profileId}`;

// Older builds stored a graduation-cap emoji as the avatar; map those to the new Gurukul icon tokens.
const LEGACY_AVATAR_MAP: Record<string, string> = {
  '🧑‍🎓': gurukulAvatars.boy,
  '👨‍🎓': gurukulAvatars.boy,
  '👩‍🎓': gurukulAvatars.girl,
};
const normalizeAvatar = (avatar: string): string => LEGACY_AVATAR_MAP[avatar] ?? avatar;

export async function getProfiles(): Promise<UserProfile[]> {
  const raw = await AsyncStorage.getItem(PROFILES_KEY);
  const profiles: UserProfile[] = raw ? JSON.parse(raw) : [];
  return profiles.map(p => ({ ...p, avatar: normalizeAvatar(p.avatar) }));
}

async function saveProfiles(profiles: UserProfile[]): Promise<void> {
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

/** Ensures at least one profile exists and returns the active profile id. */
export async function ensureDefaultProfile(): Promise<string> {
  let profiles = await getProfiles();
  if (profiles.length === 0) {
    const defaultProfile: UserProfile = {
      id: `profile_${Date.now()}`,
      name: 'Learner 1',
      avatar: gurukulAvatars.boy,
      createdAt: Date.now(),
    };
    profiles = [defaultProfile];
    await saveProfiles(profiles);
    await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, defaultProfile.id);
    return defaultProfile.id;
  }

  let activeId = await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
  if (!activeId || !profiles.some(p => p.id === activeId)) {
    activeId = profiles[0].id;
    await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, activeId);
  }
  return activeId;
}

export async function getActiveProfileId(): Promise<string> {
  return ensureDefaultProfile();
}

export async function setActiveProfileId(profileId: string): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
}

export async function createProfile(name: string, avatar: string = gurukulAvatars.boy): Promise<UserProfile> {
  const profiles = await getProfiles();
  const profile: UserProfile = {
    id: `profile_${Date.now()}`,
    name,
    avatar,
    createdAt: Date.now(),
  };
  profiles.push(profile);
  await saveProfiles(profiles);
  return profile;
}

export async function renameProfile(profileId: string, name: string): Promise<void> {
  const profiles = await getProfiles();
  const updated = profiles.map(p => (p.id === profileId ? { ...p, name } : p));
  await saveProfiles(updated);
}

export async function deleteProfile(profileId: string): Promise<void> {
  const profiles = await getProfiles();
  const remaining = profiles.filter(p => p.id !== profileId);
  await saveProfiles(remaining);
  await AsyncStorage.multiRemove([topicProgressKey(profileId), lastActivityKey(profileId)]);
  await clearProfileData(profileId);

  const activeId = await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
  if (activeId === profileId) {
    if (remaining.length > 0) {
      await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, remaining[0].id);
    } else {
      await AsyncStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
  }
}

/** Clears a profile's saved progress/activity/session data without deleting the profile itself. */
export async function resetProfileProgress(profileId: string): Promise<void> {
  await AsyncStorage.multiRemove([topicProgressKey(profileId), lastActivityKey(profileId)]);
  await clearProfileData(profileId);
}

/** Returns the concept list merged with this profile's saved progress. */
export async function getTopicProgress(profileId: string): Promise<Concept[]> {
  const raw = await AsyncStorage.getItem(topicProgressKey(profileId));
  const saved: Record<string, Partial<Concept>> = raw ? JSON.parse(raw) : {};

  return defaultConcepts.map((concept) => ({
    ...concept,
    ...saved[concept.id],
    unlocked: saved[concept.id]?.unlocked ?? concept.unlocked,
  }));
}

export async function saveTopicProgress(profileId: string, concepts: Concept[]): Promise<void> {
  const map: Record<string, Concept> = {};
  concepts.forEach(c => {
    map[c.id] = c;
  });
  await AsyncStorage.setItem(topicProgressKey(profileId), JSON.stringify(map));
}

export async function getLastActivity(profileId: string): Promise<LastActivity | null> {
  const raw = await AsyncStorage.getItem(lastActivityKey(profileId));
  return raw ? JSON.parse(raw) : null;
}

export async function setLastActivity(profileId: string, activity: LastActivity): Promise<void> {
  await AsyncStorage.setItem(lastActivityKey(profileId), JSON.stringify(activity));
}
