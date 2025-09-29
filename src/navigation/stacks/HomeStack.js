// src/navigation/stacks/HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import QiblaScreen from '../../screens/QiblaScreen';
import TasbihScreen from '../../screens/TasbihScreen';
import DuasScreen from '../../screens/DuasScreen';
import HadithScreen from '../../screens/HadithScreen';
import ZakatCalculator from '../../screens/ZakatCalculator';
import Events from '../../screens/Events'
import HajjUmrahGuide from '../../screens/HajjUmrahGuide';
import QuranPdf from '../../screens/QuranPdf';
import QuranNavigation from '../../screens/QuranNavigation';
import SurahReader from '../../screens/SurahReader';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#16a34a' },
        headerTintColor: 'white',
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Home', headerShown: false }} // Hide header for HomeScreen
      />
      <Stack.Screen 
        name="QiblaScreen" 
        component={QiblaScreen} 
        options={{ title: 'Qibla Direction' }}
      />
      <Stack.Screen 
        name="TasbihScreen" 
        component={TasbihScreen} 
        options={{ title: 'Tasbih Counter' }}
      />
      <Stack.Screen 
        name="DuasScreen" 
        component={DuasScreen} 
        options={{ title: 'Duas', headerShown: false }}
      />
      <Stack.Screen 
        name="HadithScreen" 
        component={HadithScreen} 
        options={{ title: 'Mosque Finder' }}
      />
       <Stack.Screen 
        name="Zakat Calculator" 
        component={ZakatCalculator} 
        options={{ title: 'Calculator', headerShown: false }}
      />
      <Stack.Screen 
        name="Events" 
        component={Events} 
        options={{ title: 'Islamic Calendar', headerShown: false }}
      />

<Stack.Screen 
  name="HajjUmrahGuide" 
  component={HajjUmrahGuide}
  options={{ title: 'Hajj & Umrah Guide' }}
/>

<Stack.Screen 
          name="QuranPdf" 
          component={QuranPdf}
          options={{
            title: 'القرآن الكريم',
            headerStyle: {
              backgroundColor: '#2e7d32',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShown: false
          }}
        />

<Stack.Screen name="QuranNavigation" component={QuranNavigation} options={{headerShown: false }} />
<Stack.Screen name="SurahReader" component={SurahReader} options={{  headerShown: false }}/>
    
    </Stack.Navigator>
  );
}