# Setup Guide - Vedic Maths Mastery App

## Quick Start

### Option 1: Run on Your Phone (Easiest)

1. **Install Expo Go app** on your phone:
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Scan the QR code** with:
   - **Android**: Use the Expo Go app
   - **iOS**: Use the Camera app, then open in Expo Go

### Option 2: Run on Emulator

#### Android Emulator

1. **Install Android Studio**: Download from [developer.android.com](https://developer.android.com/studio)

2. **Set up Android Virtual Device (AVD)**:
   - Open Android Studio
   - Go to Tools → Device Manager
   - Create a new Virtual Device
   - Select a device (e.g., Pixel 5)
   - Download a system image (e.g., Android 13)
   - Finish setup

3. **Run the app**:
   ```bash
   npm install
   npx expo start
   # Press 'a' to open in Android emulator
   ```

#### iOS Simulator (Mac only)

1. **Install Xcode**: Download from Mac App Store

2. **Install Command Line Tools**:
   ```bash
   xcode-select --install
   ```

3. **Run the app**:
   ```bash
   npm install
   npx expo start
   # Press 'i' to open in iOS Simulator
   ```

## Building for Production

### Android APK

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Build APK**:
   ```bash
   eas build --platform android --profile preview
   ```

4. **Download and install** the APK on your Android device

### iOS IPA (Requires Apple Developer Account)

1. **Build IPA**:
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

## Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules
npm install
```

### Metro bundler issues
```bash
npx expo start -c
```

### Android build fails
- Make sure Android SDK is installed
- Check Java version (Java 11 recommended)

### iOS build fails
- Make sure Xcode is up to date
- Run: `pod install` in the ios folder (if it exists)

## Project Configuration

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change App Icon
Replace files in `assets/` folder:
- `icon.png` - 1024x1024 px
- `adaptive-icon.png` - 1024x1024 px (Android)
- `splash.png` - 1284x2778 px

### Change Package Name
Edit `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.yourapp"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    }
  }
}
```

## Development Tips

### Hot Reload
The app automatically reloads when you save files. To manually reload:
- Shake your device
- Press 'r' in the terminal

### Debug Menu
- Android: Shake device or press Ctrl+M
- iOS: Shake device or press Cmd+D

### View Logs
```bash
npx expo start
# Logs appear in the terminal
```

### Clear Cache
```bash
npx expo start -c
```

## Need Help?

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/docs/getting-started
- **React Navigation**: https://reactnavigation.org/docs/getting-started

## Next Steps

1. ✅ Install dependencies
2. ✅ Run the app
3. 📱 Test on your device
4. 🎨 Customize colors/content
5. 📦 Build for production
6. 🚀 Publish to stores

Happy coding! 🎉
