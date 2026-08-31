# Assets Folder

This folder should contain your app's visual assets.

## Required Assets

Create the following image files:

### 1. `icon.png`
- Size: 1024x1024 pixels
- Format: PNG
- Purpose: App icon for both iOS and Android
- Recommendation: Simple, recognizable design with Vedic Maths theme

### 2. `adaptive-icon.png`
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Purpose: Android adaptive icon
- Note: Center 768x768 pixels will be visible

### 3. `splash.png`
- Size: 1284x2778 pixels (iPhone 14 Pro Max size)
- Format: PNG
- Purpose: Splash screen shown when app launches
- Background color: #4C1D95 (purple, set in app.json)

### 4. `favicon.png`
- Size: 48x48 pixels
- Format: PNG
- Purpose: Web version favicon

## Quick Asset Creation

### Option 1: Use Online Tools
- [Figma](https://figma.com) - Free design tool
- [Canva](https://canva.com) - Template-based design
- [App Icon Generator](https://appicon.co/) - Generate all sizes

### Option 2: Placeholder Assets
For development, you can use simple colored squares:
- Icon: Purple square with "VM" text
- Splash: Purple background with app name

### Option 3: Use Expo's Asset Generator
```bash
npx expo-asset-generator path/to/your/image.png
```

## Design Tips

### App Icon
- Keep it simple and memorable
- Use 2-3 colors maximum
- Avoid text (unless it's a logo)
- Test at small sizes
- Make it stand out on home screen

### Splash Screen
- Match your brand colors
- Include app name or logo
- Keep it clean and simple
- Center important elements

## Image Requirements Summary

| Asset | Size | Purpose |
|-------|------|---------|
| icon.png | 1024x1024 | App icon |
| adaptive-icon.png | 1024x1024 | Android icon |
| splash.png | 1284x2778 | Splash screen |
| favicon.png | 48x48 | Web icon |

## Note

The app will run without these assets, but you'll see warnings. For production builds, proper assets are required.

## Creating Placeholder Assets

You can create simple placeholder images using any image editor or online tool:

1. **Icon**: Create a 1024x1024 purple square with "VM" in white
2. **Splash**: Create a 1284x2778 purple rectangle with "Vedic Maths Mastery" in white
3. **Favicon**: Resize the icon to 48x48

Or use online generators:
- [Placeholder.com](https://placeholder.com/)
- [DummyImage](https://dummyimage.com/)

For a professional app, hire a designer or use design tools to create proper assets.
