# 🚀 Quick Command Reference

## 📱 Development Commands

### First Time Setup
```bash
# Navigate to project
cd C:\Users\atulg\Documents\appstore\vedic_math

# Install dependencies (do this first!)
npm install
```

### Run the App
```bash
# Start development server
npx expo start

# Start with cleared cache
npx expo start -c

# Start in tunnel mode (if QR code doesn't work)
npx expo start --tunnel

# Run on Android emulator directly
npx expo start --android

# Run on iOS simulator directly (Mac only)
npx expo start --ios

# Run in web browser
npx expo start --web
```

### Common Issues Fix
```bash
# Clean everything and reinstall
rmdir /s /q node_modules
npm install
npx expo start -c

# Or on Mac/Linux:
rm -rf node_modules
npm install
npx expo start -c
```

## 📦 Building for Production

### Android
```bash
# Install EAS CLI (one time only)
npm install -g eas-cli

# Login to Expo
eas login

# Build APK for testing
eas build --platform android --profile preview

# Build for Play Store
eas build --platform android --profile production
```

### iOS
```bash
# Build for TestFlight/App Store
eas build --platform ios --profile production
```

## 🔍 Development Tools

### Check for Errors
```bash
# TypeScript check
npx tsc --noEmit

# Run tests (if you add them)
npm test
```

### View Logs
```bash
# Development server shows logs automatically
# Or use:
npx expo start
# Then press 'j' to open debugger
```

## 🎨 Customization

### Edit Questions
```
src/data/questions.ts
```

### Edit Concepts
```
src/data/concepts.ts
```

### Change Colors
```
Search for #4C1D95 in all .tsx files and replace with your color
```

### Modify XP Values
```
src/screens/GuidedPracticeScreen.tsx: line with addXP(2)
src/screens/RigorousPracticeScreen.tsx: line with addXP(5)
src/screens/MasteryLevelScreen.tsx: line with addXP(10)
```

## 📖 Documentation Quick Links

- **Start Here**: [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Setup Help**: [SETUP.md](./SETUP.md)
- **Features**: [FEATURES.md](./FEATURES.md)
- **Deploy**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Summary**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

## 🆘 Troubleshooting

### "npm not found"
Install Node.js: https://nodejs.org/

### "Cannot find module..."
```bash
npm install
```

### QR code won't scan
```bash
npx expo start --tunnel
```

### App won't load
1. Check phone and computer on same WiFi
2. Restart development server
3. Clear cache: `npx expo start -c`

### Metro bundler error
```bash
npx expo start -c
```

## 📱 Phone Setup

### Android
1. Install "Expo Go" from Play Store
2. Open Expo Go
3. Tap "Scan QR Code"
4. Scan the QR code from terminal

### iOS
1. Install "Expo Go" from App Store
2. Open Camera app
3. Point at QR code
4. Tap notification to open in Expo Go

## 🎯 Daily Development Workflow

```bash
# 1. Navigate to project
cd C:\Users\atulg\Documents\appstore\vedic_math

# 2. Start server
npx expo start

# 3. Make changes to code files

# 4. App automatically reloads

# 5. To manually reload:
# - Press 'r' in terminal
# - Or shake your phone and tap "Reload"
```

## 💾 Git Commands (Optional)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/vedic-math.git
git push -u origin main
```

## 🚢 Deploy to Stores

### Complete Deployment Flow
```bash
# 1. Build
eas build --platform android --profile production

# 2. Wait for build to complete (10-20 minutes)

# 3. Download build from provided URL

# 4. Upload to Google Play Console manually
# Or submit automatically:
eas submit --platform android
```

## 🔧 Advanced Commands

### Update Dependencies
```bash
npm update
```

### Check Outdated Packages
```bash
npm outdated
```

### Install Specific Package
```bash
npm install package-name
```

### Upgrade Expo SDK
```bash
npx expo upgrade
```

## 📊 Useful Keyboard Shortcuts

When development server is running:

- `r` - Reload app
- `m` - Toggle menu
- `d` - Open developer menu
- `i` - Run on iOS simulator
- `a` - Run on Android emulator
- `w` - Run in web browser
- `c` - Clear cache and restart
- `?` - Show all commands

## 🎓 Learning Resources

- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- React Navigation: https://reactnavigation.org/
- TypeScript: https://www.typescriptlang.org/

## ⚡ Pro Tips

1. **Keep terminal open** while developing
2. **Use tunnel mode** if local QR doesn't work
3. **Clear cache** if you see strange errors
4. **Shake phone** to access developer menu
5. **Save files** to trigger hot reload

---

## 🚀 Quick Start (Copy-Paste)

```bash
cd C:\Users\atulg\Documents\appstore\vedic_math
npm install
npx expo start
```

Then scan QR code with Expo Go app!

---

**Need more help?** See [GETTING_STARTED.md](./GETTING_STARTED.md)
