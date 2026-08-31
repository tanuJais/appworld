# ⚠️ CRITICAL FIX REQUIRED

## 🚨 Your Node.js v24 is INCOMPATIBLE with Expo on Windows

You're hitting an **unfixable** Windows + Node v24 + Expo bug. Web mode won't work either.

### **YOU MUST Install Node.js v20 - No Other Option**

See **[md/INSTALL_NODE_20.md](md/INSTALL_NODE_20.md)** for complete step-by-step instructions.

### **Quick Install (10 minutes):**

1. Download NVM: https://github.com/coreybutler/nvm-windows/releases
2. Install `nvm-setup.exe`
3. Open Command Prompt:
   ```cmd
   nvm install 20.18.0
   nvm use 20.18.0
   node --version
   ```
4. Should show `v20.18.0`
5. **NOW your app will work:**
   ```cmd
   cd C:\Users\atulg\Documents\appstore\vedic_math
   npm start
   ```

---

## Why This is Required

- Node v24 uses `node:sea` protocol
- Expo tries to create `node:sea` folders
- Windows doesn't allow `:` in folder names
- **ERROR:** `ENOENT: mkdir 'node:sea'`
- **NO workaround exists** - must use Node v20

---

## After Installing Node v20

Once installed, ALL these will work:

✅ `npm start` - Regular Expo development  
✅ `npm run web` - Web browser testing  
✅ `npm run android` - Android emulator  
✅ Expo Go app on your phone  

---

## Full Documentation

1. **[INSTALL_NODE_20.md](md/INSTALL_NODE_20.md)** ⬅️ **START HERE**
2. **[TESTING_GUIDE.md](md/TESTING_GUIDE.md)** - Testing options (after Node v20)
3. **[WINDOWS_FIX.md](md/WINDOWS_FIX.md)** - Other Windows issues

---

**TL;DR:** Download NVM → Install Node v20 → `nvm use 20` → `npm start` → Done! 🚀
