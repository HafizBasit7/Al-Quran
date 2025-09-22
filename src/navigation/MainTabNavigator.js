import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import stack navigators
import HomeStack from './stacks/HomeStack.js';
import QuranStack from './stacks/QuranStack';
import PrayerStack from './stacks/PrayerStack';
import AudioStack from './stacks/AudioStack';
import SettingsStack from './stacks/SettingsStack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { colors } = useTheme(); // Get colors from the current theme
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'QuranTab') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'AudioTab') iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          else if (route.name === 'PrayerTab') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'SettingsTab') iconName = focused ? 'settings' : 'settings-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        // Add tabBarStyle to match theme colors
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          elevation: 8,
          height: 60 + insets.bottom, // Account for bottom inset
          paddingBottom: 5 + insets.bottom,
          paddingTop: 5,
        },
        // Ensure tab bar has consistent label styling
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="PrayerTab" 
        component={PrayerStack} 
        options={{ title: 'Prayer' }}
      />
      <Tab.Screen 
        name="QuranTab" 
        component={QuranStack} 
        options={{ title: 'Quran' }}
      />
      <Tab.Screen 
        name="AudioTab" 
        component={AudioStack} 
        options={{ title: 'Audio' }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStack} 
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}