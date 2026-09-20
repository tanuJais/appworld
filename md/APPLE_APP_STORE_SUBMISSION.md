# Apple App Store Submission

## Release configuration

The iOS bundle identifier is `com.vedicmaths.mastery`. The app is configured for iPhone only, requires no special device permissions, and declares no non-exempt encryption. EAS increments the iOS build number for each production build.

The privacy policy is hosted at `https://tanujais.github.io/appworld/privacy-policy.html` (GitHub Pages, served from `docs/` on `master`). Use that URL for both the App Store Connect Privacy Policy URL and Support URL fields.

## App Store Connect metadata

Use these values when creating the app record:

| Field | Value |
| --- | --- |
| Name | Vedic Maths Mastery |
| Bundle ID | `com.vedicmaths.mastery` |
| SKU | `vedic-maths-mastery-ios` |
| Category | Education |
| Price | Free |
| Age rating | Complete the Apple questionnaire from the final build; answer from actual app behavior only. |
| App privacy | Data Not Collected, provided the released build remains local-only. |

### Subtitle

Master mental maths skills

### Promotional text

Learn Vedic mathematics with guided examples, adaptive practice, and progress tracking.

### Description

Learn Vedic mathematics through clear lessons and focused practice. Vedic Maths Mastery guides learners from worked examples to independent challenges, helping them build confidence with mental calculation techniques.

- Explore step-by-step Vedic mathematics concepts
- Practice with hints and immediate feedback
- Build mastery through guided, rigorous, and challenge modes
- Track accuracy, confidence, XP, streaks, and concept progress
- Keep learner profiles and progress on the device
- Learn without an account, advertisements, or subscriptions

### Keywords

vedic maths,mental math,math practice,arithmetic,learning,students,education,calculation

### App Review Notes

Vedic Maths Mastery is fully functional without login, subscription, or in-app purchase. It does not require a reviewer account. All learner profiles, progress, and practice history are stored locally on the device. To evaluate the learning flow, choose a concept from the Home learning path, review its worked examples, then start Guided Practice.

## Screenshot set

Use a 6.7-inch iPhone Simulator and capture the app at its native resolution. Upload 4 to 6 portrait screenshots; the first three should be the strongest.

1. Home: the learning path, daily practice goal, XP, streak, and level.
2. Concept introduction: a Vedic technique and a worked example.
3. Guided practice: an active question with its hint visible.
4. Progress: accuracy, level, XP, and concept progress.
5. Calendar: daily practice activity, if it has meaningful sample activity.

Avoid setup, empty states, alerts, unfinished screens, device frames, marketing claims, and text overlays not found in the app. Do not use the existing `1080x1920` Android screenshots for iOS.

On a Mac, install the production build on a booted 6.7-inch simulator, navigate to each screen, and run:

```bash
xcrun simctl io booted screenshot --type=png assets/store/ios-iphone-6-7-01-home.png
```

Repeat with sequential names for each screen. App Store Connect displays the accepted iPhone dimensions for the currently selected device class; verify each PNG there before submission.

## Build and submit

```bash
npx eas-cli login
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios --profile production
```

After the build appears in App Store Connect, select it for the release, attach the screenshots and metadata above, complete export compliance and the age-rating questionnaire, then submit for review.

## Pre-submission check

- Test the production build on a physical iPhone.
- Verify every visible Settings action works and no unavailable cloud, sign-in, export, or import feature is advertised.
- Confirm the hosted privacy policy and support URL load without authentication.
- Reconfirm the App Privacy form is Data Not Collected only if the final binary remains local-only.
- Use the final app name, category, availability, and age rating approved by the publisher.