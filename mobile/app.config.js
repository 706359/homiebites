import 'dotenv/config';

export default {
  expo: {
    name: 'HomieBites Admin',
    slug: 'homiebites-admin',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#449031',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.homiebites.admin',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#449031',
      },
      edgeToEdgeEnabled: false,
      package: 'com.homiebites.admin',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || '',
    },
  },
};
