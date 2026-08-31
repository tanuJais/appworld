import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, Concept } from '../types';

/**
 * Storage Service - Handles both local and cloud storage
 */

export type StorageType = 'local' | 'cloud';

class StorageService {
  private storageType: StorageType = 'local';
  private cloudSyncEnabled: boolean = false;

  /**
   * Initialize storage service and load preferences
   */
  async initialize() {
    try {
      const preference = await AsyncStorage.getItem('cloudSyncEnabled');
      this.cloudSyncEnabled = preference === 'true';
      this.storageType = this.cloudSyncEnabled ? 'cloud' : 'local';
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  /**
   * Set storage type preference
   */
  async setStorageType(type: StorageType) {
    this.storageType = type;
    this.cloudSyncEnabled = type === 'cloud';
    await AsyncStorage.setItem('cloudSyncEnabled', this.cloudSyncEnabled.toString());
  }

  /**
   * Get current storage type
   */
  getStorageType(): StorageType {
    return this.storageType;
  }

  /**
   * Save user progress
   */
  async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      // Always save locally first
      await AsyncStorage.setItem('userProgress', JSON.stringify(progress));

      // If cloud sync is enabled, also save to cloud
      if (this.cloudSyncEnabled) {
        await this.saveToCloud('userProgress', progress);
      }
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw error;
    }
  }

  /**
   * Load user progress
   */
  async loadUserProgress(): Promise<UserProgress | null> {
    try {
      // Try cloud first if enabled
      if (this.cloudSyncEnabled) {
        const cloudData = await this.loadFromCloud('userProgress');
        if (cloudData) {
          // Sync to local storage
          await AsyncStorage.setItem('userProgress', JSON.stringify(cloudData));
          return cloudData as UserProgress;
        }
      }

      // Fall back to local storage
      const localData = await AsyncStorage.getItem('userProgress');
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      console.error('Error loading user progress:', error);
      return null;
    }
  }

  /**
   * Save concepts data
   */
  async saveConcepts(concepts: Concept[]): Promise<void> {
    try {
      // Always save locally
      await AsyncStorage.setItem('concepts', JSON.stringify(concepts));

      // If cloud sync is enabled, also save to cloud
      if (this.cloudSyncEnabled) {
        await this.saveToCloud('concepts', concepts);
      }
    } catch (error) {
      console.error('Error saving concepts:', error);
      throw error;
    }
  }

  /**
   * Load concepts data
   */
  async loadConcepts(): Promise<Concept[] | null> {
    try {
      // Try cloud first if enabled
      if (this.cloudSyncEnabled) {
        const cloudData = await this.loadFromCloud('concepts');
        if (cloudData) {
          // Sync to local storage
          await AsyncStorage.setItem('concepts', JSON.stringify(cloudData));
          return cloudData as Concept[];
        }
      }

      // Fall back to local storage
      const localData = await AsyncStorage.getItem('concepts');
      return localData ? JSON.parse(localData) : null;
    } catch (error) {
      console.error('Error loading concepts:', error);
      return null;
    }
  }

  /**
   * Clear all data (local and cloud)
   */
  async clearAll(): Promise<void> {
    try {
      // Clear local storage
      await AsyncStorage.multiRemove(['userProgress', 'concepts']);

      // Clear cloud storage if enabled
      if (this.cloudSyncEnabled) {
        await this.deleteFromCloud('userProgress');
        await this.deleteFromCloud('concepts');
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  /**
   * Sync data from cloud to local
   */
  async syncFromCloud(): Promise<void> {
    if (!this.cloudSyncEnabled) {
      throw new Error('Cloud sync is not enabled');
    }

    try {
      // Fetch from cloud and save locally
      const userProgress = await this.loadFromCloud('userProgress');
      const concepts = await this.loadFromCloud('concepts');

      if (userProgress) {
        await AsyncStorage.setItem('userProgress', JSON.stringify(userProgress));
      }
      if (concepts) {
        await AsyncStorage.setItem('concepts', JSON.stringify(concepts));
      }
    } catch (error) {
      console.error('Error syncing from cloud:', error);
      throw error;
    }
  }

  /**
   * Sync data from local to cloud
   */
  async syncToCloud(): Promise<void> {
    if (!this.cloudSyncEnabled) {
      throw new Error('Cloud sync is not enabled');
    }

    try {
      // Get local data and push to cloud
      const userProgressData = await AsyncStorage.getItem('userProgress');
      const conceptsData = await AsyncStorage.getItem('concepts');

      if (userProgressData) {
        await this.saveToCloud('userProgress', JSON.parse(userProgressData));
      }
      if (conceptsData) {
        await this.saveToCloud('concepts', JSON.parse(conceptsData));
      }
    } catch (error) {
      console.error('Error syncing to cloud:', error);
      throw error;
    }
  }

  // ==================== CLOUD STORAGE METHODS ====================
  // These would be implemented with your chosen cloud provider
  // (Firebase, AWS, custom backend, etc.)

  /**
   * Save data to cloud storage
   * TODO: Implement with Firebase/backend
   */
  private async saveToCloud(key: string, data: any): Promise<void> {
    try {
      // Example implementation placeholder
      // In production, replace with actual cloud storage
      console.log(`[Cloud] Saving ${key} to cloud...`);
      
      // Example: Firebase Realtime Database
      // const db = getDatabase();
      // const userId = getCurrentUserId();
      // await set(ref(db, `users/${userId}/${key}`), data);

      // Example: Custom API
      // await fetch('https://api.yourbackend.com/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ key, data })
      // });

      // For now, simulate cloud save
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`[Cloud] ${key} saved successfully`);
    } catch (error) {
      console.error(`[Cloud] Error saving ${key}:`, error);
      // Don't throw - we still have local backup
    }
  }

  /**
   * Load data from cloud storage
   * TODO: Implement with Firebase/backend
   */
  private async loadFromCloud(key: string): Promise<any | null> {
    try {
      console.log(`[Cloud] Loading ${key} from cloud...`);
      
      // Example: Firebase Realtime Database
      // const db = getDatabase();
      // const userId = getCurrentUserId();
      // const snapshot = await get(ref(db, `users/${userId}/${key}`));
      // return snapshot.exists() ? snapshot.val() : null;

      // Example: Custom API
      // const response = await fetch(`https://api.yourbackend.com/load?key=${key}`);
      // return await response.json();

      // For now, return null (no cloud data)
      return null;
    } catch (error) {
      console.error(`[Cloud] Error loading ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete data from cloud storage
   * TODO: Implement with Firebase/backend
   */
  private async deleteFromCloud(key: string): Promise<void> {
    try {
      console.log(`[Cloud] Deleting ${key} from cloud...`);
      
      // Example: Firebase Realtime Database
      // const db = getDatabase();
      // const userId = getCurrentUserId();
      // await remove(ref(db, `users/${userId}/${key}`));

      // For now, simulate deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`[Cloud] ${key} deleted successfully`);
    } catch (error) {
      console.error(`[Cloud] Error deleting ${key}:`, error);
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
