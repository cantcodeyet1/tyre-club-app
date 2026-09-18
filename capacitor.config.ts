import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kwanix.tyreclub',
  appName: 'Tyre Club',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#f0ede8',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    App: {
      urlScheme: 'tyreclub',
    },
  },
};

export default config;
