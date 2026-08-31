# How to View User Progress Data

## 🎯 Quick Guide

### Option 1: In the App (Easiest)
1. Run the app: `npx expo start`
2. Tap "📊 View Your Progress" on home screen
3. See all your statistics displayed beautifully

### Option 2: Browser DevTools (Development)
1. Start app: `npx expo start`
2. Press `w` to open in web browser
3. Open browser console (F12)
4. Run these commands:

```javascript
// View all progress data
AsyncStorage.getItem('userProgress').then(data => console.log(JSON.parse(data)));

// View concept data
AsyncStorage.getItem('concepts').then(data => console.log(JSON.parse(data)));
```

### Option 3: React Native Debugger
1. Install React Native Debugger: https://github.com/jhen0409/react-native-debugger
2. Start app: `npx expo start`
3. Press `d` in terminal (or shake device)
4. Select "Debug Remote JS"
5. View AsyncStorage in debugger

### Option 4: Expo Dev Tools
1. Run: `npx expo start`
2. Press `shift + m` to open more tools
3. View Redux DevTools or AsyncStorage

### Option 5: Add Debug Screen (Permanent)
See `src/utils/DebugProgress.tsx` for a utility component

Add it to HomeScreen temporarily:
```typescript
import DebugProgress from '../utils/DebugProgress';

// In HomeScreen component:
<DebugProgress />
```

## 📱 View Progress on Physical Device

### Android (ADB)
```bash
# Connect device via USB
adb shell

# Navigate to app data
cd /data/data/com.vedicmath.mastery/databases

# View AsyncStorage
cat AsyncStorage
```

### iOS (Mac only)
```bash
# Install ios-deploy
npm install -g ios-deploy

# View device logs
npx react-native log-ios
```

## 💾 Export Progress Data

### Create Export Feature
Add this button to ProgressScreen:

```typescript
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const exportProgress = async () => {
  const data = {
    userProgress,
    concepts,
    exportDate: new Date().toISOString()
  };
  
  const fileUri = FileSystem.documentDirectory + 'progress.json';
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
  await Sharing.shareAsync(fileUri);
};

// Add button:
<Button title="Export Progress" onPress={exportProgress} />
```

## 🔍 What Data is Saved

### userProgress Key
```json
{
  "totalXP": 450,
  "streak": 5,
  "level": 2,
  "concepts": {
    "ekadhikena-purvena": {
      "conceptId": "ekadhikena-purvena",
      "masteryPercentage": 65,
      "accuracy": 82.5,
      "totalAttempts": 40,
      "correctAttempts": 33,
      "timeSpent": 0,
      "guidedPracticeCompleted": true,
      "rigorousPracticeCompleted": false,
      "lastAttempt": "2026-08-19T10:30:00.000Z"
    }
  }
}
```

### concepts Key
```json
[
  {
    "id": "ekadhikena-purvena",
    "name": "Ekadhikena Purvena",
    "masteryPercentage": 65,
    "unlocked": true,
    "guidedPracticeCompleted": true,
    "rigorousPracticeCompleted": false
  }
]
```

## 🧪 Test Progress Saving

Run this in HomeScreen to test:

```typescript
useEffect(() => {
  // Log when progress loads
  console.log('Current Progress:', userProgress);
  console.log('Current Concepts:', concepts);
}, [userProgress, concepts]);
```

## 🔄 Reset Progress (If Needed)

Add this to HomeScreen for testing:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const resetProgress = async () => {
  await AsyncStorage.multiRemove(['userProgress', 'concepts']);
  Alert.alert('Progress Reset', 'All progress has been cleared.');
  // Refresh the app
};
```

## 📊 Progress Viewing Examples

### View in Terminal
Add to any screen:
```typescript
console.log('=== PROGRESS SNAPSHOT ===');
console.log('XP:', userProgress.totalXP);
console.log('Level:', userProgress.level);
console.log('Streak:', userProgress.streak);
Object.entries(userProgress.concepts).forEach(([id, progress]) => {
  console.log(`${id}:`, {
    mastery: progress.masteryPercentage,
    accuracy: progress.accuracy,
    attempts: progress.totalAttempts
  });
});
```

### Create Progress Dashboard
See `src/screens/ProgressScreen.tsx` - it's already built!

## 🎯 Summary

| Method | Ease | Detail Level | Use Case |
|--------|------|--------------|----------|
| In-App Progress Screen | ⭐⭐⭐⭐⭐ | High | Normal use |
| Browser Console | ⭐⭐⭐⭐ | Very High | Development |
| React Native Debugger | ⭐⭐⭐ | Very High | Deep debugging |
| Terminal Logs | ⭐⭐⭐⭐ | Medium | Quick checks |
| ADB/Device | ⭐⭐ | Very High | Device debugging |

**Recommended**: Use the built-in Progress Screen for normal viewing, and browser console for development/debugging.
