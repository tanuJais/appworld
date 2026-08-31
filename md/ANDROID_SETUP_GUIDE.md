# 📱 Running Your App on Android - Step by Step

This guide will walk you through running your Vedic Math Mastery app on Android devices.

## 🎯 Three Ways to Run on Android

1. **Expo Go** (Easiest - for testing)
2. **Development Build** (Full features)
3. **Production APK** (For distribution)

---

## 🚀 Method 1: Expo Go (Quickest Start - 5 Minutes)

This is the **easiest way** to test your app immediately.

### Step 1: Install Expo Go on Your Android Phone

1. Open **Google Play Store** on your Android phone
2. Search for **"Expo Go"**
3. Install the app (it's free)
4. Open Expo Go after installation

### Step 2: Start the Development Server

On your computer, in the project folder:

```powershell
cd C:\Users\atulg\Documents\appstore\vedic_math
npm start
```

You'll see a QR code and menu like this:
```
Metro waiting on exp://192.168.x.x:8081
› Press a │ open Android
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

### Step 3: Connect Your Phone

**Option A: Scan QR Code (Recommended)**
1. In Expo Go app, tap **"Scan QR code"**
2. Point camera at the QR code in your terminal
3. App will load automatically!

**Option B: Same WiFi Network**
1. Make sure your phone and computer are on the **same WiFi network**
2. In Expo Go, your app should appear under "Recently opened"
3. Tap it to open

**Option C: Press 'a' in Terminal**
1. In the terminal where Metro is running, press **`a`**
2. This will attempt to open in Expo Go automatically

### Step 4: Test Your App!

Your app should now be running on your Android phone! 🎉

**Troubleshooting:**
- If QR code doesn't work, check both devices are on same WiFi
- Windows Firewall might block connection - see troubleshooting section below
- Try connecting via USB (see Tunnel mode below)

---

## 🔧 Method 2: Development Build (Full Features)

Use this if you need:
- Native modules not supported by Expo Go
- Custom fonts or assets
- Full testing before production

### Step 1: Install Android Studio

1. **Download Android Studio**
   - Go to: https://developer.android.com/studio
   - Download Android Studio (latest version)
   - Run installer (~1 GB download)

2. **During Installation:**
   - Choose **Standard** installation
   - Accept all licenses
   - Let it download Android SDK (~3 GB more)

3. **Configure Android SDK**
   - Open Android Studio
   - Click "More Actions" → "SDK Manager"
   - In "SDK Platforms" tab, check:
     - ✅ Android 13.0 (Tiramisu) - API 33
     - ✅ Android 12.0 (S) - API 31
   - In "SDK Tools" tab, check:
     - ✅ Android SDK Build-Tools
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools
   - Click "Apply" and let it download

### Step 2: Set Environment Variables

1. **Open Environment Variables:**
   - Press `Windows + S`
   - Type "environment variables"
   - Click "Edit the system environment variables"
   - Click "Environment Variables" button

2. **Add ANDROID_HOME:**
   - Under "User variables", click "New"
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\atulg\AppData\Local\Android\Sdk`
   - Click OK

3. **Update PATH:**
   - Find "Path" under "User variables"
   - Click "Edit"
   - Click "New" and add: `%ANDROID_HOME%\platform-tools`
   - Click "New" and add: `%ANDROID_HOME%\emulator`
   - Click OK on all dialogs

4. **Verify Installation:**
   ```powershell
   adb --version
   ```
   Should show: `Android Debug Bridge version x.x.x`

### Step 3: Create Android Emulator (Virtual Device)

1. **Open AVD Manager:**
   - Open Android Studio
   - Click "More Actions" → "Virtual Device Manager"
   - Click "Create Device"

2. **Choose Device:**
   - Select **Pixel 5** or **Pixel 6**
   - Click "Next"

3. **Choose System Image:**
   - Select **Tiramisu (API 33)** with Google APIs
   - Click "Download" if needed
   - Click "Next"

4. **Finish Setup:**
   - Name: "Pixel_5_API_33"
   - Click "Finish"

5. **Start Emulator:**
   - Click the ▶️ Play button next to your device
   - Wait for emulator to boot (~1-2 minutes first time)

### Step 4: Build and Run Development Build

In your project folder:

```powershell
# Install EAS CLI
npm install -g eas-cli

# Login to Expo (create free account if needed)
eas login

# Configure project
eas build:configure

# Build for Android development
eas build --platform android --profile development
```

This will:
- Create a development build
- Download APK when ready
- Install on emulator or device

**Or run locally (faster):**
```powershell
npx expo run:android
```

This will:
- Build the app locally
- Install on connected device/emulator
- Start Metro bundler

---

## 📦 Method 3: Production APK (For Distribution)

Build an APK to install on any Android device or publish to Play Store.

### Step 1: Configure app.json

Update your `app.json`:

```json
{
  "expo": {
    "name": "Vedic Math Mastery",
    "slug": "vedic-math-mastery",
    "version": "1.0.0",
    "android": {
      "package": "com.yourname.vedicmathmastery",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4C1D95"
      }
    }
  }
}
```

### Step 2: Build Production APK

```powershell
# Build APK
eas build --platform android --profile preview
```

**Or build AAB for Play Store:**
```powershell
eas build --platform android --profile production
```

### Step 3: Download and Install

1. EAS will build your app (5-15 minutes)
2. Download the APK from the link provided
3. Transfer to Android device
4. Install (enable "Install from unknown sources" if needed)

---

## 🔌 Testing on Physical Android Device

### Option 1: Wireless (Same WiFi)

1. Connect phone to **same WiFi** as computer
2. Run `npm start` in project folder
3. Scan QR code with Expo Go
4. App loads wirelessly

### Option 2: USB Connection

1. **Enable Developer Mode on Phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" **7 times**
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Go to Settings → Developer Options
   - Enable **"USB Debugging"**

3. **Connect Phone to Computer:**
   - Use USB cable
   - On phone, tap "Allow USB debugging" popup

4. **Verify Connection:**
   ```powershell
   adb devices
   ```
   Should show:
   ```
   List of devices attached
   ABC123XYZ    device
   ```

5. **Run App:**
   ```powershell
   npm start
   # Press 'a' to open on Android
   ```

### Option 3: Tunnel Mode (Works Anywhere)

If WiFi doesn't work (different networks, firewall):

```powershell
npx expo start --tunnel
```

This creates a tunnel through Expo's servers. Scan QR code - works even on different networks!

---

## 🐛 Common Issues & Solutions

### Issue 1: "Unable to connect to Metro"

**Solution:**
```powershell
# Clear cache and restart
npx expo start -c
```

### Issue 2: "No devices found"

**Solution:**
```powershell
# Check ADB connection
adb devices

# If empty, reconnect USB or restart ADB
adb kill-server
adb start-server
```

### Issue 3: "Port 8081 already in use"

**Solution:**
```powershell
# Kill process using port 8081
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F

# Or use different port
npx expo start --port 8082
```

### Issue 4: Windows Firewall Blocking

**Solution:**
1. Windows Security → Firewall & network protection
2. Click "Allow an app through firewall"
3. Click "Change settings"
4. Find "Node.js" and check both Private and Public
5. Click OK
6. Restart `npm start`

### Issue 5: "Expo Go app not loading"

**Solution:**
```powershell
# Use tunnel mode
npx expo start --tunnel

# Or specify LAN connection
npx expo start --lan
```

### Issue 6: App crashes on startup

**Solution:**
```powershell
# Clear Metro cache
npx expo start -c

# Clear Expo cache
npx expo r -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📊 Quick Reference Commands

```powershell
# Start development server
npm start

# Start with cache clear
npx expo start -c

# Start in tunnel mode (different networks)
npx expo start --tunnel

# Open on Android
# (Press 'a' after npm start)

# Check connected devices
adb devices

# Install on specific device
adb -s DEVICE_ID install app.apk

# View device logs
adb logcat

# Restart ADB
adb kill-server
adb start-server
```

---

## 🎯 Recommended Testing Workflow

### For Daily Development:
1. Use **Expo Go** on physical device
2. Connect via same WiFi
3. Hot reload as you code
4. Fastest iteration

### For Feature Testing:
1. Use **Android Emulator**
2. Test different screen sizes
3. Debug with Chrome DevTools
4. Test without Expo Go limitations

### Before Release:
1. Build **production APK**
2. Test on multiple real devices
3. Test offline functionality
4. Performance testing

---

## 📱 Testing Your Vedic Math Features

Once running on Android, test:

### ✅ Navigation
- [ ] Home screen loads
- [ ] All concept cards clickable
- [ ] Settings screen accessible

### ✅ Practice Modes
- [ ] Guided practice works
- [ ] Rigorous practice works
- [ ] Mastery challenge works
- [ ] Questions display correctly

### ✅ Data Persistence
- [ ] Complete some practice
- [ ] Force close app
- [ ] Reopen - progress saved ✓

### ✅ Settings
- [ ] Cloud sync toggle works
- [ ] Export progress downloads JSON
- [ ] Reset progress clears data

### ✅ Gamification
- [ ] XP increases after correct answers
- [ ] Level updates
- [ ] Streak counter works
- [ ] Progress bars update

---

## 🚀 Next Steps

1. **Test on Android** (this guide)
2. **Test on iOS** (need Mac or Expo Go on iPhone)
3. **Deploy to Play Store** (see DEPLOYMENT.md)
4. **Add app icon** (see assets/icon.png)
5. **Implement cloud sync** (see CLOUD_SETUP.md)

---

## 📚 Helpful Resources

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **Android Studio:** https://developer.android.com/studio
- **Play Console:** https://play.google.com/console

---

## 💡 Pro Tips

1. **Keep Expo Go Updated:** Update regularly from Play Store
2. **Use Physical Device:** Real device = better performance testing
3. **Enable Dev Menu:** Shake device or press `Ctrl+M` in emulator
4. **Hot Reload:** Enable in Expo Go settings for faster development
5. **Debug Mode:** Shake device → "Debug Remote JS" → Chrome DevTools

---

## 🆘 Still Having Issues?

1. Check the official Expo troubleshooting: https://docs.expo.dev/troubleshooting/
2. Verify all prerequisites are installed
3. Try tunnel mode: `npx expo start --tunnel`
4. Clear all caches: `npx expo start -c`
5. Restart everything (terminal, Expo Go, computer)

---

**Ready to test your app? Start with Method 1 (Expo Go) - it's the fastest way!** 🚀
