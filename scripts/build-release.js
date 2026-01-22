#!/usr/bin/env node

/**
 * ManifestWell Release Build Script
 *
 * This script prepares and builds the app for Google Play Store release.
 *
 * Prerequisites:
 * 1. Android Studio installed
 * 2. JDK 17+ installed
 * 3. Android SDK installed
 * 4. Keystore file created for signing
 *
 * Usage:
 *   node scripts/build-release.js
 *
 * Environment Variables (create a .env.local file):
 *   KEYSTORE_PATH - Path to your keystore file
 *   KEYSTORE_PASSWORD - Keystore password
 *   KEY_ALIAS - Key alias
 *   KEY_PASSWORD - Key password
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const ANDROID_DIR = path.join(ROOT_DIR, 'android');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[Step ${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function runCommand(command, options = {}) {
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: options.cwd || ROOT_DIR,
      ...options,
    });
    return true;
  } catch (error) {
    if (!options.ignoreError) {
      logError(`Command failed: ${command}`);
      throw error;
    }
    return false;
  }
}

async function main() {
  log('\n========================================', 'cyan');
  log('ManifestWell Release Build', 'cyan');
  log('========================================\n', 'cyan');

  // Step 1: Pre-flight checks
  logStep(1, 'Running pre-flight checks...');

  // Check if Android directory exists
  if (!fs.existsSync(ANDROID_DIR)) {
    logError('Android directory not found. Run: npm run cap:add:android');
    process.exit(1);
  }
  logSuccess('Android directory found');

  // Check for required files
  const requiredFiles = [
    'package.json',
    'capacitor.config.ts',
    'android/app/build.gradle',
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(ROOT_DIR, file))) {
      logError(`Required file not found: ${file}`);
      process.exit(1);
    }
  }
  logSuccess('All required files present');

  // Step 2: Install dependencies
  logStep(2, 'Installing dependencies...');
  runCommand('npm install');
  logSuccess('Dependencies installed');

  // Step 3: Generate Prisma client
  logStep(3, 'Generating Prisma client...');
  runCommand('npx prisma generate');
  logSuccess('Prisma client generated');

  // Step 4: Build the web app for mobile
  logStep(4, 'Building web app for mobile...');
  runCommand('npm run build:mobile');
  logSuccess('Web app built');

  // Step 5: Sync with Capacitor
  logStep(5, 'Syncing with Capacitor...');
  runCommand('npx cap sync android');
  logSuccess('Capacitor synced');

  // Step 6: Build Android Release
  logStep(6, 'Building Android release...');

  // Check if gradlew exists and is executable
  const gradlewPath = path.join(ANDROID_DIR, 'gradlew');
  const gradlewBatPath = path.join(ANDROID_DIR, 'gradlew.bat');

  const isWindows = process.platform === 'win32';
  const gradleCommand = isWindows ? 'gradlew.bat' : './gradlew';

  if (!fs.existsSync(isWindows ? gradlewBatPath : gradlewPath)) {
    logError('Gradle wrapper not found. Please run the project in Android Studio first.');
    process.exit(1);
  }

  // Build the release bundle (AAB for Play Store)
  log('\nBuilding release bundle (AAB)...', 'yellow');
  runCommand(`${gradleCommand} bundleRelease`, { cwd: ANDROID_DIR });
  logSuccess('Release bundle built');

  // Also build APK for testing
  log('\nBuilding release APK...', 'yellow');
  runCommand(`${gradleCommand} assembleRelease`, { cwd: ANDROID_DIR });
  logSuccess('Release APK built');

  // Step 7: Show output locations
  logStep(7, 'Build complete!');

  const aabPath = path.join(ANDROID_DIR, 'app/build/outputs/bundle/release/app-release.aab');
  const apkPath = path.join(ANDROID_DIR, 'app/build/outputs/apk/release/app-release-unsigned.apk');

  log('\n========================================', 'green');
  log('Build Artifacts:', 'green');
  log('========================================', 'green');

  if (fs.existsSync(aabPath)) {
    log(`\nAAB (for Play Store): ${aabPath}`, 'cyan');
  }

  if (fs.existsSync(apkPath)) {
    log(`APK (for testing): ${apkPath}`, 'cyan');
  }

  log('\n========================================', 'yellow');
  log('Next Steps:', 'yellow');
  log('========================================', 'yellow');
  log(`
1. SIGN YOUR APP (if not already configured):
   - Create a keystore: keytool -genkey -v -keystore release.keystore -alias manifestwell -keyalg RSA -keysize 2048 -validity 10000
   - Sign the AAB: jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore release.keystore app-release.aab manifestwell

2. FOR PLAY STORE UPLOAD:
   - Go to https://play.google.com/console
   - Create a new app or select existing
   - Go to "Production" > "Create new release"
   - Upload the signed AAB file
   - Fill in release notes
   - Submit for review

3. REQUIRED PLAY STORE ASSETS:
   - App icon: 512x512 PNG
   - Feature graphic: 1024x500 PNG
   - Screenshots: At least 2 phone screenshots
   - Short description: Max 80 characters
   - Full description: Max 4000 characters
   - Privacy policy URL

4. TEST BEFORE RELEASE:
   - Install APK on device: adb install ${apkPath}
   - Or use Android Studio to install
`, 'reset');

  logSuccess('Release build completed successfully!');
}

// Run the script
main().catch((error) => {
  logError(`Build failed: ${error.message}`);
  process.exit(1);
});
