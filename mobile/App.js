import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './app/context/AuthContext';
import AppNavigator from './app/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync?.();

export default function App() {
  useEffect(() => {
    const t = setTimeout(() => {
      SplashScreen.hideAsync?.().catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
        <StatusBar barStyle="dark-content" hidden={false} animated={true} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
