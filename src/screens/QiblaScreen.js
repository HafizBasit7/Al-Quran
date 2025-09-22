// src/screens/QiblaScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
  TouchableOpacity,
  Animated,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.8;

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function QiblaScreen() {
  const [location, setLocation] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [heading, setHeading] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [distance, setDistance] = useState(0);
  
  // Animation values
  const compassRotation = useRef(new Animated.Value(0)).current;
  const qiblaRotation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const scaleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestLocationPermission();
    startPulseAnimation();
    
    // Animate screen entrance
    Animated.spring(scaleAnimation, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.3,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access in your device settings to determine Qibla direction.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        setLoading(false);
        return;
      }
      
      setLocationPermission(true);
      getCurrentLocation();
    } catch (error) {
      console.error('Location permission error:', error);
      Alert.alert('Permission Error', 'Failed to request location permission. Please enable location manually in settings.');
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      console.log('Requesting location...');
      
      // Check if location services are enabled
      const hasLocationService = await Location.hasServicesEnabledAsync();
      if (!hasLocationService) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Get initial location
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
        maximumAge: 10000,
      });
      
      console.log('Location obtained:', locationResult);
      
      setLocation(locationResult);
      const calculatedDirection = calculateQiblaDirection(
        locationResult.coords.latitude, 
        locationResult.coords.longitude
      );
      
      const calculatedDistance = calculateDistance(
        locationResult.coords.latitude,
        locationResult.coords.longitude
      );
      
      setDistance(calculatedDistance);
      
      // Start location updates
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (newLocation) => {
          console.log('Location updated:', newLocation);
          setLocation(newLocation);
          calculateQiblaDirection(newLocation.coords.latitude, newLocation.coords.longitude);
          const newDistance = calculateDistance(newLocation.coords.latitude, newLocation.coords.longitude);
          setDistance(newDistance);
        }
      );
      
      setLocationSubscription(subscription);
      setLoading(false);
      
    } catch (error) {
      console.error('Get location error:', error);
      let errorMessage = 'Unable to get your location. ';
      
      if (error.code === 'E_LOCATION_TIMEOUT') {
        errorMessage += 'Location request timed out. Please try again.';
      } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
        errorMessage += 'Location services are not available.';
      } else {
        errorMessage += 'Please ensure GPS is enabled and try again.';
      }
      
      Alert.alert('Location Error', errorMessage, [
        { text: 'Retry', onPress: getCurrentLocation },
        { text: 'Cancel', style: 'cancel' }
      ]);
      setLoading(false);
    }
  };

  const calculateDistance = (userLat, userLng) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (KAABA_LAT - userLat) * Math.PI / 180;
    const dLon = (KAABA_LNG - userLng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLat * Math.PI / 180) * Math.cos(KAABA_LAT * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const calculateQiblaDirection = (userLat, userLng) => {
    try {
      // Convert degrees to radians
      const dLng = (KAABA_LNG - userLng) * (Math.PI / 180);
      const lat1 = userLat * (Math.PI / 180);
      const lat2 = KAABA_LAT * (Math.PI / 180);
      
      // Calculate bearing using Haversine formula
      const y = Math.sin(dLng) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
      
      let bearing = Math.atan2(y, x) * (180 / Math.PI);
      bearing = (bearing + 360) % 360; // Normalize to 0-360
      
      setQiblaDirection(bearing);
      
      // Animate Qibla indicator
      Animated.timing(qiblaRotation, {
        toValue: bearing,
        duration: 800,
        useNativeDriver: true,
      }).start();

      console.log('Qibla direction calculated:', bearing);
      return bearing;
      
    } catch (error) {
      console.error('Qibla calculation error:', error);
      return 0;
    }
  };

  // Simulate compass heading changes for demo purposes
  // In a real app, you would integrate with device compass
  useEffect(() => {
    if (!loading && location) {
      const interval = setInterval(() => {
        const newHeading = (heading + (Math.random() * 4 - 2)) % 360;
        const normalizedHeading = newHeading < 0 ? newHeading + 360 : newHeading;
        setHeading(normalizedHeading);
        
        Animated.timing(compassRotation, {
          toValue: -normalizedHeading,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [loading, location, heading]);

  const getQiblaAlignment = () => {
    const diff = Math.abs(qiblaDirection - heading);
    const alignmentDiff = Math.min(diff, 360 - diff);
    
    if (alignmentDiff < 10) {
      return { 
        status: 'Perfect Alignment', 
        color: '#00C851', 
        accuracy: 'Excellent', 
        icon: 'checkmark-circle' 
      };
    }
    if (alignmentDiff < 20) {
      return { 
        status: 'Good Alignment', 
        color: '#ffbb33', 
        accuracy: 'Good', 
        icon: 'warning' 
      };
    }
    return { 
      status: 'Keep Adjusting', 
      color: '#ff4444', 
      accuracy: 'Poor', 
      icon: 'close-circle' 
    };
  };

  const alignment = getQiblaAlignment();

  if (loading) {
    return (
      <LinearGradient colors={['#1a472a', '#2d5a3d', '#4a7c59']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[styles.loadingContainer, { transform: [{ scale: scaleAnimation }] }]}>
          <Animated.View style={[styles.loadingIcon, { transform: [{ scale: pulseAnimation }] }]}>
            <Ionicons name="location" size={80} color="#fff" />
          </Animated.View>
          <Text style={styles.loadingText}>Finding Your Location...</Text>
          <Text style={styles.loadingSubtext}>Please ensure GPS is enabled</Text>
          
          {/* Loading indicators */}
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [{
                      scale: pulseAnimation.interpolate({
                        inputRange: [1, 1.3],
                        outputRange: [0.8, 1.2],
                      })
                    }]
                  }
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (!locationPermission) {
    return (
      <LinearGradient colors={['#1a472a', '#2d5a3d', '#4a7c59']} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[styles.errorContainer, { transform: [{ scale: scaleAnimation }] }]}>
          <Ionicons name="location-outline" size={100} color="#fff" />
          <Text style={styles.errorTitle}>Location Permission Required</Text>
          <Text style={styles.errorText}>
            To determine the accurate Qibla direction, we need access to your device's location services.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={requestLocationPermission}>
            <Ionicons name="refresh" size={20} color="#1a472a" />
            <Text style={styles.retryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a472a', '#2d5a3d', '#4a7c59']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnimation }] }]}>
        {/* Header */}
        <ScrollView>
        <View style={styles.header}>
          <Ionicons name="compass" size={30} color="#fff" />
          <Text style={styles.headerTitle}>Qibla Compass</Text>
          <Text style={styles.headerSubtitle}>Direction to the Holy Kaaba</Text>
        </View>

        {/* Status Indicator */}
        <Animated.View style={[styles.statusContainer, { backgroundColor: alignment.color }]}>
          <Ionicons name={alignment.icon} size={20} color="#fff" />
          <Text style={styles.statusText}>{alignment.status}</Text>
        </Animated.View>

        {/* Compass Container */}
        <View style={styles.compassContainer}>
          {/* Outer Compass Ring */}
          <View style={styles.compassRing}>
            {/* Degree Markings */}
            {Array.from({ length: 36 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.degreeMark,
                  {
                    transform: [
                      { rotate: `${i * 10}deg` },
                      { translateY: -COMPASS_SIZE / 2 + 10 }
                    ]
                  }
                ]}
              >
                <View style={[
                  styles.markLine,
                  { 
                    height: i % 9 === 0 ? 20 : 10, 
                    backgroundColor: i % 9 === 0 ? '#fff' : '#ccc' 
                  }
                ]} />
              </View>
            ))}
            
            {/* Cardinal Directions */}
            <Animated.View 
              style={[
                styles.compassDirections,
                { transform: [{ rotate: `${heading}deg` }] }
              ]}
            >
              {/* North */}
              <View style={[styles.directionMarker, styles.northMarker]}>
                <Text style={styles.directionText}>N</Text>
              </View>
              
              {/* East */}
              <View style={[styles.directionMarker, styles.eastMarker]}>
                <Text style={styles.directionText}>E</Text>
              </View>
              
              {/* South */}
              <View style={[styles.directionMarker, styles.southMarker]}>
                <Text style={styles.directionText}>S</Text>
              </View>
              
              {/* West */}
              <View style={[styles.directionMarker, styles.westMarker]}>
                <Text style={styles.directionText}>W</Text>
              </View>
            </Animated.View>

            {/* Qibla Direction Indicator */}
            <Animated.View 
              style={[
                styles.qiblaIndicator,
                { 
                  transform: [
                    { rotate: `${qiblaDirection - heading}deg` },
                    { scale: alignment.status.includes('Perfect') ? pulseAnimation : 1 }
                  ] 
                }
              ]}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF8C00']}
                style={styles.qiblaArrow}
              >
                <Ionicons name="navigate" size={35} color="#fff" />
                <Text style={styles.qiblaText}>QIBLA</Text>
              </LinearGradient>
            </Animated.View>

            {/* Center Point */}
            <View style={styles.centerDot}>
              <Ionicons name="radio-button-on" size={15} color="#fff" />
            </View>
          </View>
        </View>

        {/* Information Cards */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Ionicons name="compass-outline" size={24} color="#4a7c59" />
              <Text style={styles.infoLabel}>Qibla Direction</Text>
              <Text style={styles.infoValue}>{Math.round(qiblaDirection)}°</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Ionicons name="location-outline" size={24} color="#4a7c59" />
              <Text style={styles.infoLabel}>Distance to Kaaba</Text>
              <Text style={styles.infoValue}>{distance.toLocaleString()} km</Text>
            </View>
          </View>
          
          {location && (
            <View style={styles.locationCard}>
              <Ionicons name="pin" size={18} color="#4a7c59" />
              <Text style={styles.locationText}>
                Your Location: {location.coords.latitude.toFixed(4)}°, {location.coords.longitude.toFixed(4)}°
              </Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📱 How to Use:</Text>
          <Text style={styles.instructionsText}>
            1. Hold your device horizontally and level{'\n'}
            2. Rotate slowly until the golden arrow points upward{'\n'}
            3. The direction the arrow points is your Qibla{'\n'}
            4. Face that direction for prayer
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={getCurrentLocation}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>Refresh Location</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.calibrateButton]}
            onPress={() => {
              Alert.alert(
                'Compass Calibration', 
                'For better accuracy:\n\n1. Move away from metal objects\n2. Hold device flat\n3. Rotate in figure-8 pattern\n4. Avoid magnetic interference',
                [{ text: 'Got it!' }]
              );
            }}
          >
            <Ionicons name="settings" size={20} color="#fff" />
            <Text style={styles.buttonText}>Help</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },
  content: {
    flex: 1,
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingIcon: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#b8d4c2',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  
  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 25,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#b8d4c2',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  retryButtonText: {
    color: '#1a472a',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  
  // Header
  header: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#b8d4c2',
  },
  
  // Status
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  
  // Compass
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  compassRing: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  degreeMark: {
    position: 'absolute',
    top: COMPASS_SIZE / 2,
    left: COMPASS_SIZE / 2,
  },
  markLine: {
    width: 2,
    backgroundColor: '#ccc',
  },
  compassDirections: {
    width: COMPASS_SIZE - 40,
    height: COMPASS_SIZE - 40,
    position: 'relative',
  },
  directionMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  northMarker: { top: -20, left: '50%', marginLeft: -20 },
  eastMarker: { right: -20, top: '50%', marginTop: -20 },
  southMarker: { bottom: -20, left: '50%', marginLeft: -20 },
  westMarker: { left: -20, top: '50%', marginTop: -20 },
  directionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(26, 71, 42, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  // Qibla Indicator
  qiblaIndicator: {
    position: 'absolute',
    top: 10,
    left: '50%',
    marginLeft: -35,
  },
  qiblaArrow: {
    width: 70,
    height: 80,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  qiblaText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  
  // Center Dot
  centerDot: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Info Cards
  infoContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#4a7c59',
    marginVertical: 8,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#4a7c59',
    marginLeft: 8,
    flex: 1,
  },
  
  // Instructions
  instructionsCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#4a7c59',
    lineHeight: 22,
  },
  
  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a7c59',
    paddingVertical: 15,
    borderRadius: 25,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  calibrateButton: {
    backgroundColor: '#2d5a3d',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
});