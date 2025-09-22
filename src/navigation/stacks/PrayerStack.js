import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PrayerScreen from '../../screens/PrayerScreen';

const Stack = createStackNavigator();

export default function PrayerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16a34a' },
        headerTintColor: 'white',
        headerShown: false
      }}
    >
      <Stack.Screen
        name="PrayerMain"
        component={PrayerScreen}
        options={{ title: 'Prayer Times' }}
      />
    </Stack.Navigator>
  );
}