import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import NotAdminScreen from '../screens/NotAdminScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, loading, isAdmin } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      {!token ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : !isAdmin() ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="NotAdmin" component={NotAdminScreen} />
        </Stack.Navigator>
      ) : (
        <MainTabs />
      )}
    </NavigationContainer>
  );
}
