# Vedic Maths Mastery App

A gamified mobile learning app for mastering Vedic Mathematics concepts through adaptive difficulty, guided practice, and mastery-based progression.

## 🚀 Features

- **Concept Introduction**: Learn new Vedic Maths techniques with animated explanations and examples
- **Guided Practice**: Build confidence with scaffolded questions and hints
- **Rigorous Practice**: Challenge yourself with adaptive difficulty
- **Mastery Levels**: Reach 100% mastery to unlock new concepts
- **Recovery Mode**: Automatic difficulty adjustment when struggling
- **Gamification**: Earn XP, maintain streaks, and unlock badges
- **Progress Tracking**: Detailed analytics and weak area identification
- **Cross-Platform**: Runs on both Android and iOS

## 📱 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Context API with React Hooks
- **Storage**: AsyncStorage for persistent data
- **UI**: React Native components with Expo Linear Gradient

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on your device**:
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## 📂 Project Structure

```
vedic_math/
├── App.tsx                 # Main app entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── babel.config.js        # Babel configuration
├── src/
│   ├── types/            # TypeScript type definitions
│   ├── context/          # React Context for state management
│   ├── data/             # Static data (concepts, questions)
│   ├── components/       # Reusable UI components
│   └── screens/          # App screens
│       ├── HomeScreen.tsx
│       ├── ConceptIntroScreen.tsx
│       ├── GuidedPracticeScreen.tsx
│       ├── RigorousPracticeScreen.tsx
│       ├── MasteryLevelScreen.tsx
│       └── ProgressScreen.tsx
```

## 🎮 How It Works

### Learning Flow

1. **Concept Introduction**
   - Watch animated explanations
   - See solved examples with step-by-step solutions
   - Understand the Vedic Maths technique

2. **Guided Practice** (5-10 questions)
   - Easy, scaffolded questions
   - Hints available
   - Must achieve 70% accuracy to proceed

3. **Rigorous Practice** (15-20 questions)
   - Mixed difficulty levels
   - Adaptive difficulty engine
   - Must achieve 85% accuracy to proceed

4. **Mastery Challenge** (20-30 questions)
   - +3% mastery per correct answer
   - -2% mastery per wrong answer
   - Reach 100% to unlock next concept

### Adaptive Difficulty

- **>90% accuracy**: Difficulty increases
- **<60% accuracy**: Difficulty decreases
- **3 consecutive mistakes**: Recovery mode activated

### Gamification

- **XP System**: 
  - Guided Practice: +2 XP per correct answer
  - Rigorous Practice: +5 XP per correct answer
  - Mastery Level: +10 XP per correct answer
- **Levels**: 1 level per 1000 XP
- **Streaks**: Track daily practice consistency
- **Badges**: Unlock achievements for mastery

## 📱 Building for Production

### Android

```bash
# Build APK
expo build:android

# Or use EAS Build
npm install -g eas-cli
eas build --platform android
```

### iOS

```bash
# Build IPA
expo build:ios

# Or use EAS Build
eas build --platform ios
```

## 🧮 Current Concepts

1. **Ekadhikena Purvena** - Squaring numbers ending in 5
2. **Nikhilam Sutra** - Multiplication near base (10, 100, etc.)
3. **Urdhva Tiryak** - Vertical and crosswise multiplication

## 🔄 Adding New Concepts

1. Add concept data in `src/data/concepts.ts`
2. Add questions in `src/data/questions.ts`
3. Concepts auto-unlock after mastering previous concept

## 📊 Data Persistence

All user progress is automatically saved locally using AsyncStorage:
- XP and level
- Streak count
- Concept mastery percentages
- Question attempts and accuracy
- Completion status

## 🎨 Customization

- **Colors**: Edit the color scheme in component styles
- **Difficulty Thresholds**: Adjust in `GameContext.tsx`
- **XP Values**: Modify in practice screen handlers
- **Mastery Points**: Change in `MasteryLevelScreen.tsx`

## 📝 Future Enhancements

- [ ] Leaderboard with cloud sync
- [ ] Animated concept introductions
- [ ] More Vedic Maths concepts
- [ ] Practice reminders/notifications
- [ ] Social sharing of achievements
- [ ] Detailed analytics dashboard
- [ ] Offline mode support

## 🤝 Contributing

This is a learning app designed to help students master Vedic Mathematics. Contributions are welcome!

## 📄 License

MIT License - Feel free to use this app for educational purposes.

## 🙏 Credits

Based on ancient Vedic Mathematics techniques for mental calculation.

---

Made with ❤️ for math learners everywhere
