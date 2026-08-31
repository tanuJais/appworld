# Cloud Storage Setup Guide (Firebase)

This guide shows how to implement cloud storage using Firebase (free tier available).

## 🚀 Quick Setup

### 1. Install Firebase
```bash
npm install firebase
```

### 2. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "vedic-math-mastery"
4. Enable Google Analytics (optional)
5. Create project

### 3. Add Firebase to Your App

1. In Firebase Console, click "Add app" → Web (</>) 
2. Register app with nickname "Vedic Math Web"
3. Copy the configuration object

### 4. Create Firebase Config File

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };
```

### 5. Enable Realtime Database

1. In Firebase Console, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose location (closest to users)
4. Start in **test mode** (for development)

### 6. Update Storage Service

Replace the placeholder methods in `src/services/storageService.ts`:

```typescript
import { database, auth } from '../config/firebase';
import { ref, set, get, remove } from 'firebase/database';

private async saveToCloud(key: string, data: any): Promise<void> {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const dataRef = ref(database, `users/${userId}/${key}`);
    await set(dataRef, data);
    console.log(`[Cloud] ${key} saved successfully`);
  } catch (error) {
    console.error(`[Cloud] Error saving ${key}:`, error);
    throw error;
  }
}

private async loadFromCloud(key: string): Promise<any | null> {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return null;
    }

    const dataRef = ref(database, `users/${userId}/${key}`);
    const snapshot = await get(dataRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error(`[Cloud] Error loading ${key}:`, error);
    return null;
  }
}

private async deleteFromCloud(key: string): Promise<void> {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const dataRef = ref(database, `users/${userId}/${key}`);
    await remove(dataRef);
    console.log(`[Cloud] ${key} deleted successfully`);
  } catch (error) {
    console.error(`[Cloud] Error deleting ${key}:`, error);
    throw error;
  }
}
```

## 🔐 Add Authentication

### 1. Enable Authentication Methods

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable sign-in methods:
   - **Email/Password** (simplest)
   - **Google** (recommended)
   - **Anonymous** (for guest users)

### 2. Create Auth Service

```typescript
// src/services/authService.ts
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut
} from 'firebase/auth';

export const authService = {
  async signInEmail(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async signUpEmail(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  async signInAnonymous() {
    return await signInAnonymously(auth);
  },

  async signOut() {
    return await signOut(auth);
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  onAuthStateChanged(callback: (user: any) => void) {
    return auth.onAuthStateChanged(callback);
  }
};
```

### 3. Add Sign In Screen

```typescript
// src/screens/SignInScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { authService } from '../services/authService';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await authService.signInEmail(email, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      await authService.signInAnonymous();
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Text>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleSignIn}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGuestSignIn}>
        <Text>Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 📊 Database Structure

Your Firebase Realtime Database will look like:

```
users/
  ├─ userId1/
  │   ├─ userProgress: { totalXP: 450, level: 2, ... }
  │   └─ concepts: [ { id: "...", mastery: 65, ... } ]
  │
  ├─ userId2/
  │   ├─ userProgress: { ... }
  │   └─ concepts: [ ... ]
```

## 🔒 Security Rules

Update your Firebase Realtime Database Rules:

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "$userId === auth.uid"
      }
    }
  }
}
```

This ensures users can only read/write their own data.

## 🧪 Testing Cloud Sync

1. Enable cloud sync in Settings
2. Sign in with an account
3. Complete some practice
4. Check Firebase Console → Realtime Database
5. You should see your data saved!

## 💰 Cost Considerations

Firebase **free tier** includes:
- ✅ 1 GB stored data
- ✅ 10 GB/month downloaded
- ✅ 100 simultaneous connections
- ✅ Unlimited authentication

Perfect for starting out! Upgrade to Blaze plan (pay-as-you-go) when you need more.

## 🚀 Alternative Cloud Providers

### Option 2: AWS Amplify
```bash
npm install aws-amplify
# Configure with AWS account
```

### Option 3: Supabase (Open Source Firebase Alternative)
```bash
npm install @supabase/supabase-js
```

### Option 4: Custom Backend
Build your own REST API with:
- Node.js + Express
- MongoDB/PostgreSQL
- Deploy on Heroku/Railway/Vercel

## ✅ Implementation Checklist

- [ ] Create Firebase project
- [ ] Install Firebase SDK
- [ ] Add Firebase config
- [ ] Enable Realtime Database
- [ ] Enable Authentication
- [ ] Update storageService.ts
- [ ] Test cloud sync
- [ ] Set security rules
- [ ] Add sign in/out functionality
- [ ] Test on multiple devices

## 📚 Resources

- Firebase Docs: https://firebase.google.com/docs
- React Native Firebase: https://rnfirebase.io/
- Firebase Console: https://console.firebase.google.com/

## 🎯 Next Steps

1. Follow this guide to set up Firebase
2. Test with the Settings screen toggle
3. Implement sign-in screen
4. Test syncing across devices
5. Deploy to production!
