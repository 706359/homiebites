import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'

// Screens
import HomeScreen from './screens/HomeScreen'
import MenuScreen from './screens/MenuScreen'
import CartScreen from './screens/CartScreen'
import AccountScreen from './screens/AccountScreen'
import LoginScreen from './screens/LoginScreen'
import OrdersScreen from './screens/OrdersScreen'
import ProfileScreen from './screens/ProfileScreen'
import AddressesScreen from './screens/AddressesScreen'

// Utils - Mobile-compatible versions
import { getCurrentUser } from './utils/userAuthMobile'
import { LanguageProvider } from './contexts/LanguageContext'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline'
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline'
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#FF6B35', // var(--primary-orange)
        tabBarInactiveTintColor: '#666666', // var(--gray)
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  )
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={HomeTabs} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser()
      setIsLoggedIn(!!user)
    } catch (error) {
      setIsLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null // You can add a loading screen here
  }

  return (
    <LanguageProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainStack} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  )
}

