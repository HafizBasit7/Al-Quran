import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QuranScreen from '../../screens/QuranScreen';
import SurahDetailScreen from '../../screens/SurahDetailScreen';
import JuzDetailScreen from '../../screens/JuzDetailScreen';

const Stack = createStackNavigator();

export default function QuranStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16a34a' },
        headerTintColor: 'white',
        headerShown: false
      }}
    >
      <Stack.Screen
        name="QuranList"
        component={QuranScreen}
        options={{ title: 'The Holy Quran' }}
      />
      <Stack.Screen
        name="SurahDetail"
        component={SurahDetailScreen}
        options={({ route }) => ({
          title: `Surah ${route.params.surahName || route.params.surahNumber}`,
        })}
      />
      <Stack.Screen
        name="JuzDetail"
        component={JuzDetailScreen}
        options={({ route }) => ({
          title: `Juz ${route.params.juzNumber}`,
        })}
      />
    </Stack.Navigator>
  );
}