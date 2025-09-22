import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSettings } from '../contexts/SettingsContext';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import { StatusBar } from 'react-native';

export default function Navigation() {
  const { theme } = useSettings();
  
  // Create custom themes with consistent colors
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#16a34a',
      background: '#121212', // Dark background
      card: '#1e1e1e', // Dark card/tab bar background (this is important!)
      text: '#ffffff',
      border: '#333333',
      notification: '#16a34a',
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#16a34a',
      card: '#ffffff', // Light card/tab bar background
      background: '#f5f5f5',
    },
  };

  const navTheme = theme === 'dark' ? customDarkTheme : customLightTheme;

  return (
    <>
      <StatusBar 
        barStyle="light-content" // Always light content for green background
        backgroundColor="#16a34a" // Always green as requested
        translucent={false}
      />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}