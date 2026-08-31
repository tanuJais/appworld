# Deployment Guide - Publishing to App Stores

## Prerequisites

### For Both Platforms
- Expo account (create at https://expo.dev)
- EAS CLI installed: `npm install -g eas-cli`

### For iOS
- Apple Developer Account ($99/year)
- Mac computer (for final submission)

### For Android
- Google Play Developer Account ($25 one-time fee)

## Step-by-Step Deployment

### 1. Prepare Your App

#### Update App Information
Edit `app.json`:
```json
{
  "expo": {
    "name": "Vedic Maths Mastery",
    "slug": "vedic-maths-mastery",
    "version": "1.0.0",
    "description": "Learn Vedic Mathematics through gamified, adaptive learning",
    "privacy": "public",
    "android": {
      "package": "com.yourcompany.vedicmath",
      "versionCode": 1,
      "permissions": []
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.vedicmath",
      "buildNumber": "1.0.0",
      "supportsTablet": true
    }
  }
}
```

#### Create App Assets
Ensure you have all required assets in the `assets/` folder:
- icon.png (1024x1024)
- adaptive-icon.png (1024x1024)
- splash.png (1284x2778)

### 2. Configure EAS Build

Login to EAS:
```bash
eas login
```

Configure the project:
```bash
eas build:configure
```

### 3. Build for Android

#### Build APK (for testing)
```bash
eas build --platform android --profile preview
```

#### Build AAB (for Play Store)
```bash
eas build --platform android --profile production
```

After build completes:
1. Download the APK/AAB from the provided URL
2. Test the APK on a real device
3. Upload AAB to Google Play Console

### 4. Build for iOS

#### Build for TestFlight
```bash
eas build --platform ios --profile production
```

After build completes:
1. Download the IPA from the provided URL
2. The build is automatically submitted to TestFlight (if configured)

### 5. Submit to Google Play Store

#### Create a Google Play Developer Account
1. Go to https://play.google.com/console
2. Pay the $25 registration fee
3. Complete the account setup

#### Create a New App
1. Click "Create app"
2. Select language and title
3. Specify if it's an app or game
4. Accept policies

#### Fill Required Information

**Store Listing**:
- App name: Vedic Maths Mastery
- Short description (80 chars): Learn Vedic Math through fun, adaptive lessons
- Full description (4000 chars): [See template below]
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (minimum 2, up to 8 per device type)

**Content Rating**:
- Fill out questionnaire
- App suitable for "Everyone"

**App Content**:
- Privacy policy URL (required)
- Target audience
- Data safety form

**Pricing & Distribution**:
- Free or Paid
- Select countries
- Consent for distribution

#### Upload Build
1. Go to "Production" → "Create new release"
2. Upload the AAB file
3. Fill release notes
4. Set roll-out percentage (start with 20%)
5. Review and roll out

### 6. Submit to Apple App Store

#### Requirements
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- App Store Connect access

#### Prepare App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: Vedic Maths Mastery
   - Primary Language: English
   - Bundle ID: com.yourcompany.vedicmath
   - SKU: vedicmath001

#### Fill App Information
- Name
- Subtitle (30 chars)
- Description (4000 chars)
- Keywords (100 chars)
- Support URL
- Marketing URL (optional)
- Screenshots (required for all device sizes)
- App icon (1024x1024)

#### Pricing and Availability
- Price: Free
- Availability: All territories

#### Submit for Review
1. Upload build from EAS or Transporter app
2. Select build in App Store Connect
3. Fill "App Review Information"
4. Submit for review

#### App Review Timeline
- Usually 1-3 days
- May ask for clarifications
- Responds to feedback quickly

### 7. App Store Assets

#### Google Play Store Screenshots
- Minimum 2 screenshots
- Recommended: 4-8 screenshots
- Size: 1080x1920 (portrait) or 1920x1080 (landscape)
- Show key features:
  1. Home screen with learning path
  2. Concept introduction
  3. Practice question
  4. Progress tracking
  5. Mastery achievement

#### Apple App Store Screenshots
Required for multiple device sizes:
- 6.5" iPhone (1284x2778): iPhone 14 Pro Max
- 5.5" iPhone (1242x2208): iPhone 8 Plus
- 12.9" iPad Pro (2048x2732)

### 8. Create Store Listing Content

#### App Description Template

**Google Play / App Store Description**:
```
🧮 Master Vedic Mathematics Through Fun, Adaptive Learning! 🎓

Vedic Maths Mastery makes learning ancient calculation techniques fun and engaging through gamification, adaptive difficulty, and mastery-based progression.

🎯 KEY FEATURES:

✅ STRUCTURED LEARNING PATH
• Step-by-step concept introductions
• Guided practice with hints
• Rigorous challenges
• Mastery-based progression

🎮 GAMIFICATION
• Earn XP and level up
• Maintain daily streaks
• Unlock achievement badges
• Track your progress

🧠 ADAPTIVE LEARNING
• Automatic difficulty adjustment
• Recovery mode when struggling
• Personalized learning pace
• Weak area identification

📊 TRACK YOUR PROGRESS
• Detailed analytics
• Accuracy tracking
• Time spent per concept
• Mastery percentage

🎓 VEDIC MATH CONCEPTS:
• Ekadhikena Purvena (Squaring numbers ending in 5)
• Nikhilam Sutra (Multiplication near base)
• Urdhva Tiryak (Vertical and crosswise)
• More concepts coming soon!

💡 PERFECT FOR:
• Students learning mental math
• Competitive exam preparation
• Math enthusiasts
• Anyone wanting to calculate faster

🌟 WHY VEDIC MATHS?
Vedic Mathematics provides simple, fast mental calculation methods based on ancient Indian mathematics. Master these techniques to:
• Calculate faster in your head
• Improve mental math skills
• Boost confidence in mathematics
• Impress friends and teachers!

📱 LEARN ANYWHERE:
• Works offline (no internet required)
• Progress saved automatically
• Available on phone and tablet

Start your journey to mathematical mastery today! Download now and discover the power of Vedic Mathematics.

🎓 Free to download and use - no subscriptions, no ads!
```

#### Keywords (for App Store, 100 chars)
```
vedic math,mental math,math games,learn math,fast calculation,educational,students,math tricks
```

#### Promotional Text (170 chars)
```
Master Vedic Math through fun, gamified lessons! Learn ancient calculation techniques with adaptive difficulty, guided practice, and track your progress to 100% mastery.
```

### 9. Testing Before Launch

#### Internal Testing (Google Play)
- Create internal testing track
- Add testers by email
- Share testing link
- Gather feedback

#### TestFlight (iOS)
- Add internal testers (up to 100)
- Share TestFlight invite
- Collect feedback
- Fix bugs

### 10. Launch Checklist

Before submitting:
- [ ] All assets created and uploaded
- [ ] App tested on multiple devices
- [ ] No critical bugs
- [ ] Privacy policy created and hosted
- [ ] Terms of service (if needed)
- [ ] Support email/website set up
- [ ] Store listing content written
- [ ] Screenshots prepared
- [ ] App rated appropriately
- [ ] All store requirements met

### 11. Post-Launch

#### Monitor
- User reviews and ratings
- Crash reports
- Download statistics
- User feedback

#### Respond
- Reply to reviews
- Fix reported bugs
- Release updates regularly

#### Update
```bash
# Increase version number in app.json
# Build new version
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit update
eas submit --platform android
eas submit --platform ios
```

### 12. App Store Optimization (ASO)

#### Improve Discoverability
- Use relevant keywords
- Encourage positive reviews
- Respond to user feedback
- Update regularly
- Add new features based on feedback

#### A/B Testing (Google Play only)
- Test different icons
- Try various screenshots
- Experiment with descriptions

## Common Issues

### Build Fails
- Check error messages carefully
- Ensure all dependencies are compatible
- Clear cache: `npx expo start -c`
- Check EAS build logs

### Rejected by App Store
- Review Apple's guidelines carefully
- Address all feedback points
- Resubmit quickly

### Low Downloads
- Improve ASO
- Share on social media
- Get reviews from friends/family
- Consider paid advertising

## Resources

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [ASO Guide](https://developer.apple.com/app-store/product-page/)

## Support

Need help? Contact:
- Expo Community: https://forums.expo.dev/
- Stack Overflow: tag `expo` or `react-native`
- Expo Discord: https://chat.expo.dev/

Good luck with your launch! 🚀
