// src/hooks/usePrayerTimes.js
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { prayerApi } from '../services/prayerApi';

export const usePrayerTimes = (city = null, country = null) => {
  return useQuery({
    queryKey: ['prayerTimes', city, country],
    queryFn: async () => {
      try {
        // If city and country are provided, use them
        if (city && country) {
          const response = await prayerApi.getPrayerTimesByCity(city, country);
          return {
            data: response.data.data,
            location: { city, country },
            source: 'city'
          };
        }
        
        // Otherwise, try to get user's location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          // Fallback to Mecca if location permission not granted
          const response = await prayerApi.getPrayerTimesByCity('Mecca', 'Saudi Arabia');
          return {
            data: response.data.data,
            location: { city: 'Mecca', country: 'Saudi Arabia' },
            source: 'fallback'
          };
        }
        
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        // Get prayer times based on coordinates
        const response = await prayerApi.getPrayerTimesByCoords(latitude, longitude);
        return {
          data: response.data.data,
          location: { latitude, longitude },
          source: 'gps'
        };
      } catch (error) {
        console.error('Error getting prayer times:', error);
        // Final fallback to Mecca
        const response = await prayerApi.getPrayerTimesByCity('Mecca', 'Saudi Arabia');
        return {
          data: response.data.data,
          location: { city: 'Mecca', country: 'Saudi Arabia' },
          source: 'error-fallback'
        };
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};