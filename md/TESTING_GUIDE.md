# Testing Your Vedic Math App

## Quick Start - Three Ways to Test

### **Option 1: Expo Go App (Easiest - No Setup)**

This is the fastest way to test your app on a real device without any complex setup.

**Steps:**
1. **Install Expo Go** on your phone:
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Open a Command Prompt** in your project folder:
   - Press `Win + R`, type `cmd`, press Enter
   - Navigate to your project:
     ```cmd
     cd C:\Users\atulg\Documents\appstore\vedic_math
     ```

3. **Start the development server:**
   ```cmd
   npm start
   ```

4. **Connect your device:**
   - Make sure your phone and computer are on the same WiFi network
   - Open Expo Go app on your phone
   - Scan the QR code shown in the terminal
   - Your app will load!

**Pros:**
- ✅ No build process required
- ✅ Works on both Android and iOS
- ✅ Instant refresh when you make changes
- ✅ Free and fast

**Cons:**
- ❌ Requires WiFi connection
- ❌ Limited to Expo SDK features only

---

### **Option 2: Android Emulator (Development)**

Test on an Android emulator without a physical device.

**Prerequisites:**
- Android Studio installed
- Android Virtual Device (AVD) set up

**Steps:**
1. Open Android Studio and launch an emulator
2. Open Command Prompt in your project:
   ```cmd
   cd C:\Users\atulg\Documents\appstore\vedic_math
   npm start
   ```
3. Press `a` to open on Android emulator

**Pros:**
- ✅ No physical device needed
- ✅ Test different Android versions
- ✅ Access to all device features

**Cons:**
- ❌ Requires Android Studio setup (large download)
- ❌ Can be slow on some computers

---

### **Option 3: Physical Device with Development Build**

Create a development build for testing native features.

**Steps:**
1. Install EAS CLI:
   ```cmd
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```cmd
   eas login
   ```

3. Build for your platform:
   ```cmd
   eas build --profile development --platform android
   ```
   or for iOS:
   ```cmd
   eas build --profile development --platform ios
   ```

4. Install the build on your device and run:
   ```cmd
   npm start
   ```

**Pros:**
- ✅ Full native API access
- ✅ Better performance
- ✅ Custom native modules

**Cons:**
- ❌ Longer build time
- ❌ Requires Expo account

---

## Troubleshooting

### "npm not recognized"
- Make sure Node.js is installed: https://nodejs.org/
- Restart your terminal after installing

### "expo not found"
Run: `npm install -g expo-cli`

### QR Code not working
- Ensure both devices are on same WiFi
- Try typing the URL manually in Expo Go
- Check firewall settings

### Port already in use
- Kill the process using port 8081
- Or specify a different port: `npm start -- --port 8082`

---

## Quick Commands Reference

```cmd
npm start              # Start development server
npm run android        # Run on Android (emulator or device)
npm run ios            # Run on iOS (macOS only)
npm run web            # Run in web browser
```

---

## Next Steps After Testing

Once you've tested your app and it works well:
1. See [DEPLOYMENT.md](DEPLOYMENT.md) for publishing to app stores
2. See [ANDROID_SETUP_GUIDE.md](ANDROID_SETUP_GUIDE.md) for detailed Android setup
3. See [FEATURES.md](FEATURES.md) for implemented features

---

**Need Help?**
- Check logs in the terminal for errors
- Look at [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for all guides
- Visit [Expo Documentation](https://docs.expo.dev/)
