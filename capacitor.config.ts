import type { CapacitorConfig } from '@capacitor/cli';

// Set to true for development with live reload
const isDev = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: 'com.manifestwell.app',
  appName: 'ManifestWell',
  webDir: 'out',
  android: {
    // Ensure keyboard works properly with input fields
    webContentsDebuggingEnabled: isDev,
  },
  // Development server config - only used when isDev is true
  ...(isDev && {
    server: {
      url: 'http://10.0.2.2:3001', // Android emulator localhost
      cleartext: true,
    }
  }),
  // Production config
  ...(!isDev && {
    server: {
      androidScheme: 'https',
      iosScheme: 'https',
      hostname: 'app.manifestwell.com'
    }
  }),
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#8B5CF6',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'large',
      spinnerColor: '#8B5CF6'
    },
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/LocalDatabase',
      androidDatabaseLocation: 'default',
      androidIsEncryption: false
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#8B5CF6',
      sound: 'default'
    },
    Keyboard: {
      // Resize the app when keyboard appears
      resize: 'body',
      // Scroll to the input when focused
      style: 'dark',
      resizeOnFullScreen: true
    }
  }
};

export default config;