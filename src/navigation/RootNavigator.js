import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';

// Import any auth screens or other root-level screens here
// import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* If you have authentication, you can conditionally render screens here */}
      <Stack.Screen name="Main" component={MainTabNavigator} />
      
      
      {/* Add other root-level screens that shouldn't be in tabs */}
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
    </Stack.Navigator>
  );
}