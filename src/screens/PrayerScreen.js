// src/screens/PrayerScreen.js
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import PrayerTimesCard from '../components/PrayerTimesCard';
import PrayerCountdown from '../components/PrayerCountdown';
import LocationSelector from '../components/LocationSelector';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrayerScreen() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: prayerData, isLoading, error, refetch } = usePrayerTimes(selectedCity, selectedCountry);

  const handleLocationChange = (location) => {
    if (location.type === 'custom' && location.city && location.country) {
      setSelectedCity(location.city);
      setSelectedCountry(location.country);
    } else if (location.type === 'current') {
      setSelectedCity(null);
      setSelectedCountry(null);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="time" size={48} color="#16a34a" />
        <Text style={styles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color="#dc2626" />
        <Text style={styles.errorText}>Error loading prayer times</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
        <TouchableOpacity onPress={refetch} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
    colors={['#0d9488', '#059669', '#047857']}
    locations={[0, 0.5, 1]}
    style={styles.gradient}
  >
    <SafeAreaView style={styles.container}>
    <ScrollView 
      
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* <View style={styles.header}>
        <Text style={styles.title}>أوقات الصلاة</Text>
        <Text style={styles.subtitle}>Prayer Times</Text>
      </View> */}

      <LocationSelector 
        selectedLocation={selectedCity ? { type: 'custom', city: selectedCity, country: selectedCountry } : { type: 'current' }}
        onLocationChange={handleLocationChange}
      />

      {prayerData && (
        <>
          <PrayerCountdown prayerData={prayerData} />
          <PrayerTimesCard prayerData={prayerData} />
          
          {/* Additional Prayer Information */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={20} color="#16a34a" />
              <Text style={styles.infoText}>
                {prayerData.data.date.gregorian.date}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="moon" size={20} color="#16a34a" />
              <Text style={styles.infoText}>
                {prayerData.data.date.hijri.date} ({prayerData.data.date.hijri.day} {prayerData.data.date.hijri.month.en})
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color="#16a34a" />
              <Text style={styles.infoText}>
                {prayerData.location.city || 'Current Location'}
                {prayerData.location.country ? `, ${prayerData.location.country}` : ''}
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    // backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16a34a',
    fontFamily: 'ScheherazadeNew-Regular',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    color: '#374151',
    fontSize: 14,
  },
});