// MosqueFinder.js - Fixed for Production
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Linking,
  Platform,
  Dimensions,
  TextInput,
  RefreshControl,
} from 'react-native';
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

// Free APIs for mosque data
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

const MosqueFinder = () => {
  // State management with safer defaults
  const [location, setLocation] = useState(null);
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [mapType, setMapType] = useState('standard');
  const [showUserLocation, setShowUserLocation] = useState(true);
  const [error, setError] = useState(null);

  const mapRef = useRef(null);
  const isComponentMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  // Initialize component
  useEffect(() => {
    const initApp = async () => {
      try {
        await loadFavorites();
        await initializeLocation();
      } catch (error) {
        console.error('App initialization error:', error);
        if (isComponentMounted.current) {
          setError('Failed to initialize app');
        }
      }
    };

    initApp();
  }, []);

  // Load user's current location with better error handling
  const initializeLocation = async () => {
    try {
      if (!isComponentMounted.current) return;
      
      setLoading(true);
      setError(null);
      
      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        throw new Error('Location services are disabled');
      }

      // Request location permissions with better error handling
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get current location with timeout and error handling
      const locationOptions = {
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000, // 15 second timeout
        maximumAge: 10000, // Accept 10-second old location
      };

      const currentLocation = await Location.getCurrentPositionAsync(locationOptions);

      if (!currentLocation?.coords) {
        throw new Error('Unable to get location coordinates');
      }

      const userLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      if (isComponentMounted.current) {
        setLocation(userLocation);
        // Find nearby mosques with error handling
        await findNearbyMosques(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
      }

    } catch (error) {
      console.error('Location initialization error:', error);
      if (isComponentMounted.current) {
        setError(error.message);
        // Show user-friendly alert
        Alert.alert(
          'Location Error',
          'Unable to get your location. Please check your GPS settings and permissions.',
          [
            { text: 'Retry', onPress: initializeLocation },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } finally {
      if (isComponentMounted.current) {
        setLoading(false);
      }
    }
  };

  // Enhanced mosque finder with better error handling
  const findNearbyMosques = async (lat, lon, radius = searchRadius) => {
    try {
      if (!isComponentMounted.current) return;
      
      setLoading(true);
      setError(null);

      // Validate coordinates
      if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        throw new Error('Invalid coordinates provided');
      }

      // Validate radius
      const validRadius = Math.min(Math.max(radius, 500), 50000); // Between 500m and 50km

      // Overpass query with better formatting
      const overpassQuery = `
        [out:json][timeout:30];
        (
          node["amenity"="place_of_worship"]["religion"="muslim"](around:${validRadius},${lat},${lon});
          way["amenity"="place_of_worship"]["religion"="muslim"](around:${validRadius},${lat},${lon});
        );
        out center meta;
      `;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

      const response = await fetch(OVERPASS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'MosqueFinder/1.0',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.elements || !Array.isArray(data.elements)) {
        console.warn('No mosque data received');
        if (isComponentMounted.current) {
          setMosques([]);
        }
        return;
      }

      // Process the results with better error handling
      const mosqueData = data.elements
        .map((element) => {
          try {
            // Get coordinates based on element type
            let elementLat, elementLon;
            
            if (element.type === 'node') {
              elementLat = element.lat;
              elementLon = element.lon;
            } else if (element.center) {
              elementLat = element.center.lat;
              elementLon = element.center.lon;
            }

            // Skip if no valid coordinates
            if (!elementLat || !elementLon || isNaN(elementLat) || isNaN(elementLon)) {
              return null;
            }

            const mosque = {
              id: `${element.type}_${element.id}`,
              type: element.type,
              name: element.tags?.name || 
                    element.tags?.['name:en'] || 
                    element.tags?.['name:ur'] ||
                    'Unnamed Mosque',
              latitude: elementLat,
              longitude: elementLon,
              address: formatAddress(element.tags),
              phone: element.tags?.phone || element.tags?.['contact:phone'],
              website: element.tags?.website || element.tags?.['contact:website'],
              denomination: element.tags?.denomination,
              capacity: element.tags?.capacity,
              wheelchair: element.tags?.wheelchair,
              parking: element.tags?.parking,
              wudu: element.tags?.wudu || element.tags?.ablution,
              gender_segregated: element.tags?.['worship:gender_segregated'],
              prayer_times: element.tags?.prayer_times,
              friday_prayer: element.tags?.friday_prayer,
            };

            // Calculate distance safely
            try {
              mosque.distance = calculateDistance(lat, lon, elementLat, elementLon);
            } catch (distanceError) {
              console.warn('Distance calculation error:', distanceError);
              mosque.distance = null;
            }

            return mosque;
          } catch (elementError) {
            console.warn('Error processing mosque element:', elementError);
            return null;
          }
        })
        .filter(mosque => mosque !== null); // Remove failed entries

      // Sort by distance safely
      mosqueData.sort((a, b) => {
        const distA = a.distance || Number.MAX_SAFE_INTEGER;
        const distB = b.distance || Number.MAX_SAFE_INTEGER;
        return distA - distB;
      });

      if (isComponentMounted.current) {
        setMosques(mosqueData);
        // console.log(`Found ${mosqueData.length} mosques`);
      }

    } catch (error) {
      console.error('Error finding mosques:', error);
      if (isComponentMounted.current) {
        setError('Failed to find mosques');
        if (error.name !== 'AbortError') {
          Alert.alert(
            'Search Error', 
            'Unable to find nearby mosques. Please check your internet connection and try again.',
            [{ text: 'OK' }]
          );
        }
      }
    } finally {
      if (isComponentMounted.current) {
        setLoading(false);
      }
    }
  };

  // Enhanced address formatting with null checks
  const formatAddress = (tags) => {
    if (!tags || typeof tags !== 'object') return '';
    
    try {
      const addressParts = [];
      if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
      if (tags['addr:street']) addressParts.push(tags['addr:street']);
      if (tags['addr:city']) addressParts.push(tags['addr:city']);
      if (tags['addr:state']) addressParts.push(tags['addr:state']);
      
      const formattedAddress = addressParts.join(', ') || tags.address || '';
      return formattedAddress.slice(0, 200); // Limit address length
    } catch (error) {
      console.warn('Error formatting address:', error);
      return '';
    }
  };

  // Enhanced distance calculation with input validation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Validate inputs
    const coords = [lat1, lon1, lat2, lon2];
    if (coords.some(coord => typeof coord !== 'number' || isNaN(coord))) {
      throw new Error('Invalid coordinates for distance calculation');
    }

    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Ensure valid result
    const result = Math.round(distance * 100) / 100;
    return isNaN(result) ? 0 : result;
  };

  // Enhanced search with better error handling
  const searchMosques = async (query) => {
    try {
      if (!query?.trim()) {
        if (location) {
          await findNearbyMosques(location.latitude, location.longitude);
        }
        return;
      }

      setLoading(true);
      setError(null);

      // Search using Nominatim with timeout
      const searchUrl = `${NOMINATIM_API}/search?q=${encodeURIComponent(query + ' mosque')}&format=json&limit=10&countrycodes=pk&addressdetails=1`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'MosqueFinder/1.0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const searchResults = await response.json();

      if (!Array.isArray(searchResults)) {
        throw new Error('Invalid search response');
      }

      if (searchResults.length > 0) {
        const searchedMosques = searchResults
          .map((result, index) => {
            try {
              const lat = parseFloat(result.lat);
              const lon = parseFloat(result.lon);
              
              if (isNaN(lat) || isNaN(lon)) {
                return null;
              }

              return {
                id: `search_${index}`,
                name: result.display_name?.split(',')[0] || 'Unknown',
                latitude: lat,
                longitude: lon,
                address: result.display_name || '',
                distance: location ? calculateDistance(
                  location.latitude, location.longitude, lat, lon
                ) : null,
                type: 'search_result'
              };
            } catch (error) {
              console.warn('Error processing search result:', error);
              return null;
            }
          })
          .filter(mosque => mosque !== null);

        if (isComponentMounted.current) {
          setMosques(searchedMosques);

          // Center map on first result safely
          if (mapRef.current && searchedMosques.length > 0) {
            try {
              mapRef.current.animateToRegion({
                latitude: searchedMosques[0].latitude,
                longitude: searchedMosques[0].longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }, 1000);
            } catch (mapError) {
              console.warn('Map animation error:', mapError);
            }
          }
        }
      } else {
        if (isComponentMounted.current) {
          setMosques([]);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      if (isComponentMounted.current && error.name !== 'AbortError') {
        setError('Search failed');
        Alert.alert('Search Error', 'Search failed. Please try again.');
      }
    } finally {
      if (isComponentMounted.current) {
        setLoading(false);
      }
    }
  };

  // Enhanced directions with better error handling
  const openDirections = (mosque) => {
    try {
      if (!mosque?.latitude || !mosque?.longitude) {
        Alert.alert('Error', 'Unable to get mosque coordinates for navigation.');
        return;
      }

      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      
      const latLng = `${mosque.latitude},${mosque.longitude}`;
      const label = encodeURIComponent(mosque.name || 'Mosque');
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to Google Maps web
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;
          return Linking.openURL(googleMapsUrl);
        }
      }).catch(error => {
        console.error('Navigation error:', error);
        Alert.alert('Navigation Error', 'Unable to open navigation app.');
      });
    } catch (error) {
      console.error('Direction error:', error);
      Alert.alert('Error', 'Unable to open directions.');
    }
  };

  // Safe favorites loading
  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorite_mosques');
      if (savedFavorites && isComponentMounted.current) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.warn('Load favorites error:', error);
      // Don't show alert for this non-critical error
    }
  };

  // Safe radius change
  const changeRadius = (newRadius) => {
    try {
      if (typeof newRadius === 'number' && newRadius > 0) {
        setSearchRadius(newRadius);
        if (location) {
          findNearbyMosques(location.latitude, location.longitude, newRadius);
        }
      }
    } catch (error) {
      console.error('Change radius error:', error);
    }
  };

  // Safe refresh
  const onRefresh = () => {
    try {
      if (location) {
        findNearbyMosques(location.latitude, location.longitude);
      } else {
        initializeLocation();
      }
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  // Safe distance formatting
  const formatDistance = (distance) => {
    try {
      if (typeof distance !== 'number' || isNaN(distance) || distance <= 0) {
        return '';
      }
      return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance}km`;
    } catch (error) {
      console.warn('Format distance error:', error);
      return '';
    }
  };

  // Loading screen for initial load
  if (loading && !location && !error) {
    return (
      <View style={styles.loadingContainer}>
        {/* <StatusBar style="dark" /> */}
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  // Error screen
  if (error && !location) {
    return (
      <View style={styles.errorContainer}>
        {/* <StatusBar style="dark" /> */}
        <Ionicons name="warning-outline" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Unable to Load</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeLocation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <StatusBar style="dark" /> */}
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search mosques or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => searchMosques(searchQuery)}
            returnKeyType="search"
            maxLength={100}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                onRefresh();
              }}
            >
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => searchMosques(searchQuery)}
          disabled={loading}
        >
          <Ionicons 
            name="search" 
            size={20} 
            color={loading ? "#9CA3AF" : "white"} 
          />
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1000, 2000, 5000, 10000, 20000].map((radius) => (
            <TouchableOpacity
              key={radius}
              style={[
                styles.radiusButton,
                searchRadius === radius && styles.activeRadiusButton
              ]}
              onPress={() => changeRadius(radius)}
              disabled={loading}
            >
              <Text style={[
                styles.radiusButtonText,
                searchRadius === radius && styles.activeRadiusButtonText
              ]}>
                {radius >= 1000 ? `${radius/1000}km` : `${radius}m`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={loading}
        >
          <Ionicons 
            name="refresh" 
            size={20} 
            color={loading ? "#9CA3AF" : "#4F46E5"} 
          />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={location}
            mapType={mapType}
            showsUserLocation={showUserLocation}
            showsMyLocationButton={true}
            onMapReady={() => setMapReady(true)}
            onError={(error) => console.warn('Map error:', error)}
            loadingEnabled={true}
            loadingIndicatorColor="#4F46E5"
          >
            {/* Search radius circle */}
            {showUserLocation && mapReady && (
              <Circle
                center={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                radius={searchRadius}
                fillColor="rgba(79, 70, 229, 0.1)"
                strokeColor="rgba(79, 70, 229, 0.3)"
                strokeWidth={1}
              />
            )}

            {/* Mosque markers */}
            {mosques.map((mosque) => {
              if (!mosque?.latitude || !mosque?.longitude) return null;
              
              return (
                <Marker
                  key={mosque.id}
                  coordinate={{
                    latitude: mosque.latitude,
                    longitude: mosque.longitude,
                  }}
                  title={mosque.name || 'Mosque'}
                  description={mosque.address || ''}
                  pinColor="#10B981"
                >
                  <View style={styles.markerContainer}>
                    <Ionicons name="business" size={24} color="#10B981" />
                  </View>
                  
                  <Callout
                    style={styles.callout}
                    onPress={() => setSelectedMosque(mosque)}
                  >
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutTitle} numberOfLines={2}>
                        {mosque.name || 'Mosque'}
                      </Text>
                      {mosque.distance && (
                        <Text style={styles.calloutDistance}>
                          {formatDistance(mosque.distance)} away
                        </Text>
                      )}
                      {mosque.address && (
                        <Text style={styles.calloutAddress} numberOfLines={2}>
                          {mosque.address}
                        </Text>
                      )}
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        )}

        {loading && (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.mapLoadingText}>Finding mosques...</Text>
          </View>
        )}
      </View>

      {/* Mosque List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Nearby Mosques ({mosques.length})
          </Text>
          <TouchableOpacity
            onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <Ionicons 
              name={mapType === 'standard' ? 'satellite' : 'map'} 
              size={20} 
              color="#4F46E5" 
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.mosqueList}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          {mosques.map((mosque) => {
            if (!mosque?.id) return null;
            
            return (
              <View key={mosque.id} style={styles.mosqueItem}>
                <View style={styles.mosqueHeader}>
                  <View style={styles.mosqueInfo}>
                    <Text style={styles.mosqueName} numberOfLines={2}>
                      {mosque.name || 'Unnamed Mosque'}
                    </Text>
                    {mosque.distance && (
                      <Text style={styles.mosqueDistance}>
                        📍 {formatDistance(mosque.distance)} away
                      </Text>
                    )}
                  </View>
                </View>

                {mosque.address && (
                  <Text style={styles.mosqueAddress} numberOfLines={2}>
                    {mosque.address}
                  </Text>
                )}

                {/* Action Buttons */}
                <View style={styles.mosqueActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openDirections(mosque)}
                  >
                    <Ionicons name="navigate" size={16} color="#4F46E5" />
                    <Text style={styles.actionButtonText}>Directions</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {mosques.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No mosques found</Text>
              <Text style={styles.emptyStateText}>
                Try increasing the search radius or searching in a different location.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  radiusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeRadiusButton: {
    backgroundColor: '#4F46E5',
  },
  radiusButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeRadiusButtonText: {
    color: 'white',
  },
  refreshButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  mapContainer: {
    flex: 0.5,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  mapLoadingText: {
    marginTop: 8,
    color: '#6B7280',
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  callout: {
    width: 200,
  },
  calloutContent: {
    padding: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  calloutDistance: {
    fontSize: 12,
    color: '#10B981',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#6B7280',
  },
  listContainer: {
    flex: 0.4,
    backgroundColor: 'white',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  mosqueList: {
    flex: 1,
  },
  mosqueItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mosqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mosqueInfo: {
    flex: 1,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  mosqueDistance: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  mosqueAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  mosqueActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MosqueFinder;