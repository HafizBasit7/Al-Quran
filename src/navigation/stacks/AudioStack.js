import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AudioScreen from '../../screens/AudioScreen';

const Stack = createStackNavigator();

export default function AudioStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16a34a' },
        headerTintColor: 'white',
        headerShown: false
      }}
    >
      <Stack.Screen
        name="AudioMain"
        component={AudioScreen}
        options={{ title: 'Audio Recitations' }}
      />
    </Stack.Navigator>
  );
}