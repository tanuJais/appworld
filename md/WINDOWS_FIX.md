# Windows + Node v24 + Expo Compatibility Fix

## ⚠️ CRITICAL: You MUST Use Node.js v20

**There is NO workaround for this issue.** Even web mode fails because Expo CLI initializes Metro bundler before loading any config.

### **The ONLY Solution:**

**Install Node.js v20** - See **[INSTALL_NODE_20.md](INSTALL_NODE_20.md)** for complete instructions.

Quick install:
```cmd
# Download NVM from: https://github.com/coreybutler/nvm-windows/releases
# Then run:
nvm install 20.18.0
nvm use 20.18.0
```

---

## The Problem
You're experiencing a known bug where Expo CLI tries to create folders with `node:sea` in the path, which is invalid on Windows (colons aren't allowed in folder names except for drive letters).

**This happens with:**
- ❌ `npm start`
- ❌ `npm run web`  
- ❌ `npm run android`
- ❌ ALL Expo commands

**The ONLY fix:** Use Node.js v20 instead of v24.

---

## ✅ How to Fix This (10 Minutes)

### **Step 1: Install NVM for Windows**

1. Download from: https://github.com/coreybutler/nvm-windows/releases
2. Download and run **`nvm-setup.exe`**
3. Follow the installer

### **Step 2: Install and Use Node v20**

Open Command Prompt:

```cmd
nvm install 20.18.0
nvm use 20.18.0
node --version
```

Should show: `v20.18.0`

### **Step 3: Test Your App**

```cmd
cd C:\Users\atulg\Documents\appstore\vedic_math
npm start
```

✅ **Your app will now work!**

---

## Full Instructions

See **[INSTALL_NODE_20.md](INSTALL_NODE_20.md)** for:
- Complete step-by-step guide
- Alternative installation methods
- NVM commands reference
- Troubleshooting

---

---

## After Installing Node v20

Once you have Node v20, all these commands will work:

### 1. Test Normally
```cmd
npm start
```
Scan QR code with Expo Go app on your phone

### 2. Test in Web Browser
```cmd
npm run web
```
Opens in your browser

### 3. Test on Android Emulator
```cmd
npm run android
```
(Requires Android Studio)

### 4. Test on iOS Simulator  
```cmd
npm run ios
```
(Requires macOS with Xcode)

---

## Why This Happens

- **Node.js v24** introduced the `node:` protocol for built-in modules (like `node:sea`, `node:test`)
- **Expo CLI v50** tries to create folders for these externals during Metro bundler setup
- **Windows** doesn't allow colons (`:`) in folder names (except drive letters like `C:`)
- **Result:** `ENOENT` error when trying to create `C:\...\node:sea` folder

This is a **filesystem-level incompatibility** - no workaround exists.

---

## Recommended Approach

1. ✅ **Right now:** Install NVM and Node v20 (10 minutes)
2. ✅ **Test your app:** `npm start` will work perfectly
3. ✅ **Keep NVM installed:** Switch between Node versions as needed
4. ✅ **Check for updates:** Expo v51+ may fix this, but Node v20 is stable

---

## Additional Resources

- [Expo CLI GitHub Issues](https://github.com/expo/expo/issues)
- [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows)
- [React Native Windows Setup](https://reactnative.dev/docs/environment-setup)
