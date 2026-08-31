# 🎓 Vedic Maths Mastery App - Getting Started

## 🚀 Quick Start (5 minutes)

### What You Need
- Computer with Node.js installed
- Smartphone (Android or iOS)
- 5 minutes of your time

### Step 1: Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Choose LTS version (recommended)
- Install with default settings

### Step 2: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter

### Step 3: Navigate to Project Folder
```bash
cd C:\Users\atulg\Documents\appstore\vedic_math
```

### Step 4: Install Dependencies
```bash
npm install
```
This will take 2-3 minutes. You'll see a lot of text scrolling by - this is normal!

### Step 5: Start the App
```bash
npx expo start
```

A QR code will appear in your terminal.

### Step 6: Install Expo Go on Your Phone
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS**: https://apps.apple.com/app/expo-go/id982107779

### Step 7: Scan the QR Code
- **Android**: Open Expo Go app, tap "Scan QR Code"
- **iOS**: Open Camera app, point at QR code, tap notification

### Step 8: App Opens on Your Phone! 🎉

That's it! The app is now running on your phone.

---

## 📱 What You'll See

### Home Screen
- Your XP, Level, and Streak
- List of Vedic Math concepts
- First concept (Ekadhikena Purvena) is unlocked
- Progress bars for each concept

### Learning Flow
1. **Tap on a concept** → Read introduction with examples
2. **Start Guided Practice** → Answer easy questions with hints
3. **Complete Rigorous Practice** → Tackle harder questions
4. **Master the Concept** → Reach 100% mastery
5. **Unlock Next Concept** → Keep learning!

---

## 🎮 How to Use the App

### Answer Questions
1. Read the question (e.g., "35²")
2. Type your answer in the input field
3. Tap "Submit Answer"
4. Get instant feedback!

### Use Hints (Guided Practice)
- Tap "💡 Show Hint" when stuck
- Hints guide you step-by-step
- Using hints is encouraged while learning!

### Track Progress
- Tap "📊 View Your Progress" on home screen
- See detailed statistics for each concept
- Check your overall accuracy

### Earn Rewards
- **Guided Practice**: +2 XP per correct answer
- **Rigorous Practice**: +5 XP per correct answer
- **Mastery Level**: +10 XP per correct answer
- **Complete Mastery**: +100 XP bonus!

### Level Up
- Every 1000 XP = 1 Level
- Keep practicing to level up!

---

## 🧮 Vedic Math Concepts

### 1. Ekadhikena Purvena (Unlocked)
**What it does**: Square numbers ending in 5 quickly

**Example**: 35² 
- Take first digit: 3
- Multiply by one more: 3 × 4 = 12
- Append 25
- Answer: 1225

**Try**: 45², 65², 85²

### 2. Nikhilam Sutra (Locked)
**What it does**: Multiply numbers near 10, 100, or 1000

**Example**: 98 × 97 = 9506

**Unlock**: Master Ekadhikena Purvena first!

### 3. Urdhva Tiryak (Locked)
**What it does**: Multiply any numbers vertically and crosswise

**Example**: 23 × 41 = 943

**Unlock**: Master previous concepts!

---

## 💡 Tips for Success

### Learning Strategy
1. **Understand First**: Read the introduction carefully
2. **Practice with Hints**: Use guided practice to build confidence
3. **Challenge Yourself**: Rigorous practice tests your mastery
4. **Aim for 100%**: Complete mastery unlocks next concept

### Maximize XP
- Practice daily to maintain your streak 🔥
- Complete all practice levels
- Aim for high accuracy
- Avoid using hints in rigorous practice (when you're ready)

### If You're Struggling
- The app automatically switches to easier questions
- Recovery mode activates after 3 wrong answers
- Take your time - there's no rush!
- Review the introduction anytime

### If You're Excelling
- Difficulty automatically increases
- Challenge yourself with expert-level questions
- Try to solve without hints
- Maintain 100% accuracy streak

---

## 🛠️ Troubleshooting

### "Command not found: npm"
**Solution**: Install Node.js from https://nodejs.org/

### "Command not found: expo"
**Solution**: Run `npm install` first

### App won't load on phone
**Solutions**:
1. Make sure phone and computer are on same WiFi
2. Try scanning QR code again
3. Restart the terminal and run `npx expo start` again

### "Unable to resolve module..."
**Solution**: 
```bash
rm -rf node_modules
npm install
npx expo start -c
```

### QR code won't scan
**Solutions**:
1. Try typing the URL manually in Expo Go
2. Use tunnel mode: `npx expo start --tunnel`
3. Make sure Expo Go app is installed

---

## 🎯 Goals & Milestones

### Beginner Goals
- [ ] Complete Concept Introduction
- [ ] Finish Guided Practice (70% accuracy)
- [ ] Earn first 100 XP
- [ ] Reach Level 2

### Intermediate Goals
- [ ] Complete Rigorous Practice (85% accuracy)
- [ ] Master first concept (100%)
- [ ] Unlock second concept
- [ ] Maintain 7-day streak

### Advanced Goals
- [ ] Master all 3 concepts
- [ ] Reach Level 10
- [ ] Achieve 90%+ overall accuracy
- [ ] Maintain 30-day streak

---

## 📚 Additional Resources

### Learn More About Vedic Maths
- Wikipedia: https://en.wikipedia.org/wiki/Vedic_Mathematics
- YouTube tutorials on Vedic Math techniques
- Practice mental math daily

### React Native / Expo Learning
- Expo Documentation: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/

### Modify the App
- Edit questions in: `src/data/questions.ts`
- Add new concepts in: `src/data/concepts.ts`
- Change colors in each screen's StyleSheet

---

## 🎨 Customization

### Change Colors
Edit the purple theme color `#4C1D95` in component styles to your favorite color!

### Add More Questions
Edit `src/data/questions.ts`:
```typescript
{ 
  id: 'newQ1', 
  conceptId: 'ekadhikena-purvena', 
  question: '55²', 
  answer: 3025, 
  difficulty: 'easy',
  hint: 'First digit is 5...' 
}
```

### Add New Concepts
Edit `src/data/concepts.ts`:
```typescript
{
  id: 'new-concept',
  name: 'New Vedic Technique',
  description: 'What it does',
  introduction: 'Explanation...',
  examples: [...]
}
```

---

## 🚀 Next Steps

### For Students
1. ✅ Install and run the app
2. 📖 Complete first concept introduction
3. 💪 Practice guided questions
4. 🏆 Master the concept
5. 🔓 Unlock next concept

### For Developers
1. ✅ Run the app successfully
2. 🔍 Explore the codebase
3. 🎨 Customize colors/content
4. ➕ Add more concepts
5. 📦 Build for production (see DEPLOYMENT.md)

---

## 📞 Need Help?

### Common Questions

**Q: Do I need internet to use the app?**
A: Only to download it initially. After that, it works completely offline!

**Q: Does the app cost money?**
A: No! It's completely free with no ads or subscriptions.

**Q: Can I reset my progress?**
A: Yes! You can reset in the app settings (feature can be added).

**Q: Will my progress be saved?**
A: Yes! All progress is saved automatically on your device.

**Q: Can I use this on tablet?**
A: Yes! The app works on both phones and tablets.

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Run the app on your phone
- ✅ Learn Vedic Mathematics
- ✅ Track your progress
- ✅ Master mental math techniques

**Ready to start learning?** Open the app and begin your Vedic Math journey!

---

Made with ❤️ for math learners everywhere
