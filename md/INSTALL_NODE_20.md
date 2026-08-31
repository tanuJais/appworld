# ⚠️ CRITICAL: Install Node.js v20 to Fix This Issue

## The Problem
**Expo CLI v50 does NOT work with Node.js v24 on Windows.** Period.

The error `ENOENT: mkdir 'node:sea'` happens because:
- Node v24 uses `node:` protocol for built-in modules
- Expo tries to create folders with these names
- Windows doesn't allow `:` in folder names
- **There is NO workaround** - you must use Node v20

---

## ✅ Solution: Install Node.js v20 LTS

### **Method 1: Using NVM (Recommended - Keeps Both Versions)**

NVM lets you switch between Node versions easily.

#### **Step 1: Install NVM for Windows**

1. **Download NVM:**
   - Go to: https://github.com/coreybutler/nvm-windows/releases
   - Download **`nvm-setup.exe`** (latest version)
   - Run the installer

2. **Verify installation:**
   - Open Command Prompt
   - Run: `nvm version`
   - You should see the NVM version

#### **Step 2: Install Node v20**

Open Command Prompt and run:

```cmd
nvm install 20.18.0
```

Wait for it to download and install.

#### **Step 3: Switch to Node v20**

```cmd
nvm use 20.18.0
```

#### **Step 4: Verify**

```cmd
node --version
```

Should show: `v20.18.0`

#### **Step 5: Test Your App**

```cmd
cd C:\Users\atulg\Documents\appstore\vedic_math
npm start
```

✅ **It should work now!**

---

### **Method 2: Direct Install (Removes Node v24)**

If you don't need Node v24, just replace it:

1. **Uninstall Node.js v24:**
   - Go to Windows Settings → Apps
   - Find "Node.js"
   - Click Uninstall

2. **Download Node v20 LTS:**
   - Go to: https://nodejs.org/
   - Click "Download LTS" (should be v20.x.x)
   - Run the installer
   - Follow the wizard (default settings are fine)

3. **Verify:**
   - Open NEW Command Prompt
   - Run: `node --version`
   - Should show v20.x.x

4. **Test your app:**
   ```cmd
   cd C:\Users\atulg\Documents\appstore\vedic_math
   npm start
   ```

---

## 🎯 Quick NVM Commands Reference

Once NVM is installed:

```cmd
nvm list                    # Show installed Node versions
nvm list available          # Show versions you can install
nvm install 20.18.0         # Install Node v20
nvm install 18.20.0         # Install Node v18
nvm use 20.18.0            # Switch to Node v20
nvm use 24.19.0            # Switch back to Node v24
nvm current                 # Show current version
```

---

## ❓ FAQ

**Q: Will this break other projects that need Node v24?**  
A: If you use NVM, no! Just run `nvm use 24` when you need v24.

**Q: Can I just upgrade Expo instead?**  
A: Expo v51+ might fix this, but upgrading Expo requires updating many dependencies. Switching Node is faster.

**Q: Why does this only happen on Windows?**  
A: Linux/Mac allow `:` in folder names. Windows doesn't.

**Q: Is there really no other workaround?**  
A: No. This is a filesystem-level incompatibility. You cannot create folders with `:` on Windows.

---

## 📝 After Installing Node v20

Once you have Node v20 installed:

1. **Test normally:**
   ```cmd
   npm start
   ```

2. **Test on web:**
   ```cmd
   npm run web
   ```

3. **Test with Expo Go:**
   - Run `npm start`
   - Scan QR code with Expo Go app

4. **Test on Android:**
   ```cmd
   npm run android
   ```

All testing methods should work!

---

## 🔗 Resources

- **NVM for Windows:** https://github.com/coreybutler/nvm-windows
- **Node.js Downloads:** https://nodejs.org/
- **Node.js v20 Release:** https://nodejs.org/en/blog/release/v20.18.0
- **Expo Documentation:** https://docs.expo.dev/

---

## 🚨 Bottom Line

**Stop trying workarounds. Install Node v20. It's the only solution.**

The 10 minutes it takes to install NVM and switch to Node v20 will save you hours of frustration.
