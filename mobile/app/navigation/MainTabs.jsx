import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import AddOrderScreen from '../screens/AddOrderScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MenuScreen from '../screens/MenuScreen';
import OrdersScreen from '../screens/OrdersScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  const icons = { Dashboard: '📊', Orders: '📋', Add: '➕', Menu: '📖', Account: '👤' };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.6 }}>{icons[name] || '•'}</Text>;
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#449031',
        tabBarInactiveTintColor: '#6b7280',
        headerTintColor: '#111',
        headerStyle: { backgroundColor: '#fff' },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
      <Tab.Screen name="Add" component={AddOrderScreen} options={{ title: 'Add Order' }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
      <Tab.Screen name="Account" component={SettingsScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}
