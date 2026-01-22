# Testing Guide - Mobile Devices

Complete guide for testing ManifestWell on real iOS and Android devices.

## Prerequisites

### iOS Testing
- Mac computer with Xcode 15+ installed
- Apple Developer account (free or paid)
- iOS device with iOS 14+ (iPhone/iPad)
- USB cable (Lightning or USB-C)

### Android Testing
- Android Studio installed
- Android device with Android 7.0+ (API 24+)
- USB cable
- USB debugging enabled on device

## Setup

### 1. Build the Web App

```bash
# Build for mobile
npm run build:mobile

# Verify build output
ls -la out/
```

### 2. Sync with Native Projects

```bash
# Sync web assets to native projects
npm run cap:sync
```

## iOS Testing

### Step 1: Open iOS Project

```bash
npm run cap:open:ios
```

This opens the project in Xcode.

### Step 2: Configure Signing

1. In Xcode, select the project in the left sidebar
2. Select the "ManifestWell" target
3. Go to "Signing & Capabilities" tab
4. Select your Team (Apple Developer account)
5. Xcode will automatically generate a provisioning profile

### Step 3: Connect Device

1. Connect your iPhone/iPad via USB
2. Unlock the device
3. Trust the computer when prompted
4. Select your device from the device menu (top-left in Xcode)

### Step 4: Build and Run

1. Click the Play button (▶️) in Xcode
2. App will build and install on your device
3. First time: Go to Settings > General > Device Management > Trust Developer

### Step 5: Test Features

Test these critical features:
- [ ] App launches successfully
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Offline mode (turn off WiFi)
- [ ] Data persistence (close and reopen app)
- [ ] Sync when back online
- [ ] Push notifications (if implemented)
- [ ] Camera/photo library access
- [ ] Splash screen displays

## Android Testing

### Step 1: Enable Developer Mode

On your Android device:
1. Go to Settings > About phone
2. Tap "Build number" 7 times
3. Go back to Settings > Developer options
4. Enable "USB debugging"

### Step 2: Open Android Project

```bash
npm run cap:open:android
```

This opens the project in Android Studio.

### Step 3: Connect Device

1. Connect your Android device via USB
2. On device, accept "USB debugging" prompt
3. In Android Studio, device should appear in device dropdown
4. If not detected, check USB connection mode (should be "Transfer files" or "PTP")

### Step 4: Build and Run

1. Click Run button (▶️) in Android Studio
2. Select your device from the list
3. App will build and install

### Step 5: Test Features

Test these critical features:
- [ ] App launches successfully
- [ ] Biometric authentication (Fingerprint/Face)
- [ ] Offline mode (turn off WiFi)
- [ ] Data persistence
- [ ] Sync when back online
- [ ] Permissions (storage, camera, etc.)
- [ ] Back button behavior
- [ ] Splash screen displays

## Common Issues & Solutions

### iOS

**Issue: "Untrusted Developer"**
- Solution: Go to Settings > General > Device Management > Trust Developer

**Issue: "App installation failed"**
- Solution: Clean build folder (Xcode > Product > Clean Build Folder), rebuild

**Issue: "Code signing error"**
- Solution: Ensure Apple Developer account is properly configured

**Issue: "Biometric auth not working"**
- Solution: Ensure device has Face ID/Touch ID enabled in Settings > Face ID & Passcode

### Android

**Issue: "Device not detected"**
- Solution: Install device drivers, try different USB port, check USB debugging enabled

**Issue: "Installation failed"**
- Solution: Uninstall old version, check storage space, rebuild

**Issue: "App crashes on launch"**
- Solution: Check Android Studio Logcat for error messages

**Issue: "Permissions not working"**
- Solution: Check AndroidManifest.xml for proper permission declarations

## Performance Testing

### Metrics to Check

1. **Launch Time**
   - Cold start: < 3 seconds
   - Warm start: < 1 second

2. **Memory Usage**
   - iOS: Xcode > Debug > Memory
   - Android: Android Studio > Profiler > Memory

3. **Network Performance**
   - Test on WiFi and cellular
   - Monitor API response times
   - Check offline functionality

4. **Battery Usage**
   - Run app for 30 minutes
   - Check Settings > Battery to see consumption

### Testing Scenarios

1. **Offline First**
   ```
   1. Enable airplane mode
   2. Create/edit data
   3. Disable airplane mode
   4. Verify data syncs
   ```

2. **Background Sync**
   ```
   1. Make changes
   2. Close app (force quit)
   3. Wait 5 minutes
   4. Reopen app
   5. Verify changes persisted
   ```

3. **Biometric Auth**
   ```
   1. Enable biometric auth in settings
   2. Close app
   3. Reopen app
   4. Verify biometric prompt appears
   5. Authenticate
   6. Verify access granted
   ```

4. **Large Dataset**
   ```
   1. Create 100+ journal entries
   2. Test scroll performance
   3. Test search functionality
   4. Verify no memory leaks
   ```

## Debugging

### iOS (Xcode)

```bash
# View console logs
Xcode > View > Debug Area > Show Debug Area

# Inspect SQLite database
# Device path: ~/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Containers/Data/Application/[APP_ID]/Documents/
```

### Android (Android Studio)

```bash
# View logcat
Android Studio > Logcat

# Inspect database
Device File Explorer > data/data/com.manifestwell.app/databases/

# ADB commands
adb devices                    # List connected devices
adb logcat                     # View logs
adb shell                      # Access device shell
adb uninstall com.manifestwell.app  # Uninstall app
```

## Automated Testing

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run specific test
npx playwright test tests/e2e/journal.spec.ts
```

### Unit Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage
```

## Submitting to App Stores

### iOS - App Store

1. Archive app in Xcode (Product > Archive)
2. Upload to App Store Connect
3. Fill in app information, screenshots, etc.
4. Submit for review

### Android - Google Play

1. Generate signed APK/AAB (Build > Generate Signed Bundle/APK)
2. Upload to Google Play Console
3. Fill in store listing
4. Submit for review

## Performance Benchmarks

Target metrics:
- **Load time**: < 2s on 4G
- **Offline sync**: < 5s for 100 items
- **Memory**: < 150MB idle
- **Battery**: < 5% per hour active use
- **Crash rate**: < 0.1%

## Reporting Issues

When reporting issues, include:
- Device model and OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/video if applicable
- Console logs/crash reports
