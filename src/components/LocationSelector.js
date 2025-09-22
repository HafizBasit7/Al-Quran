// src/components/LocationSelector.js
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LocationSelector({ selectedLocation, onLocationChange }) {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use your current location');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      onLocationChange({ type: 'current' });
      Alert.alert('Success', 'Using your current location');
    } catch (error) {
      Alert.alert('Error', 'Could not get your current location');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCustomLocation = () => {
    if (!city || !country) {
      Alert.alert('Error', 'Please enter both city and country');
      return;
    }
    
    onLocationChange({ type: 'custom', city: city.trim(), country: country.trim() });
    Alert.alert('Success', `Location set to ${city}, ${country}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إعدادات الموقع</Text>
      <Text style={styles.subtitle}>Location Settings</Text>
      
      <TouchableOpacity 
        style={[styles.locationButton, isLoading && styles.disabledButton]}
        onPress={handleUseCurrentLocation}
        disabled={isLoading}
      >
        {isLoading ? (
          <Ionicons name="time" size={20} color="#64748b" />
        ) : (
          <Ionicons name="locate" size={20} color="#16a34a" />
        )}
        <Text style={styles.buttonText}>
          {isLoading ? 'Loading...' : 'Use Current Location'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.divider}>Or</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="City"
          placeholderTextColor="#9ca3af"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Country"
          placeholderTextColor="#9ca3af"
          value={country}
          onChangeText={setCountry}
        />
        <TouchableOpacity 
          style={[styles.customButton, (!city || !country) && styles.disabledButton]}
          onPress={handleUseCustomLocation}
          disabled={!city || !country}
        >
          <Text style={styles.buttonText}>Check out specific Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'ScheherazadeNew-Regular',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    marginLeft: 12,
    color: '#16a34a',
    fontWeight: '500',
  },
  divider: {
    textAlign: 'center',
    color: '#64748b',
    // marginVertical: 12,
    fontFamily: 'ScheherazadeNew-Regular',
    marginBottom: 10
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    textAlign: 'left',
  },
  customButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.7,
  },
});