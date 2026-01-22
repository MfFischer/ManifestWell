# Mobile App Resources

This directory contains assets for iOS and Android apps.

## Splash Screens

### Generating Splash Screens

You can generate splash screens using the Capacitor Assets tool:

```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#8B5CF6' --iconBackgroundColorDark '#7C3AED' --splashBackgroundColor '#8B5CF6' --splashBackgroundColorDark '#7C3AED'
```

### Manual Creation

Place your icon and splash screen source files in this directory:

- `icon.png` - App icon (1024x1024px minimum)
- `splash.png` - Splash screen image (2732x2732px for best quality)

The tool will automatically generate all required sizes for both platforms.

## App Icons

Required sizes will be generated automatically, including:

### iOS
- 20x20@2x, 20x20@3x (iPhone notification)
- 29x29@2x, 29x29@3x (iPhone settings)
- 40x40@2x, 40x40@3x (iPhone spotlight)
- 60x60@2x, 60x60@3x (iPhone app)
- 76x76, 76x76@2x (iPad app)
- 83.5x83.5@2x (iPad Pro app)
- 1024x1024 (App Store)

### Android
- 48x48 (mdpi)
- 72x72 (hdpi)
- 96x96 (xhdpi)
- 144x144 (xxhdpi)
- 192x192 (xxxhdpi)
- 512x512 (Play Store)

## Current Theme Colors

- Primary: `#8B5CF6` (Purple 500)
- Primary Dark: `#7C3AED` (Purple 600)
- Background: `#FFFFFF` (White)

## Updating Resources

After updating icons or splash screens:

1. Regenerate assets: `npx capacitor-assets generate`
2. Sync with native projects: `npm run cap:sync`
3. Rebuild native apps in Xcode/Android Studio
