// MosqueFinder.js
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

const { width, height } = Dimensions.get('window');

// Free APIs for mosque data
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

const MosqueFinder = () => {
  // State management
  const [location, setLocation] = useState(null);
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [mapType, setMapType] = useState('standard');
  const [showUserLocation, setShowUserLocation] = useState(true);

  const mapRef = useRef(null);

  // Initialize component
  useEffect(() => {
    initializeLocation();
    loadFavorites();
  }, []);

  // Load user's current location
  const initializeLocation = async () => {
    try {
      setLoading(true);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Please enable location services to find nearby mosques.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setLocation(userLocation);
      
      // Find nearby mosques
      await findNearbyMosques(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

    } catch (error) {
      console.error('Location initialization error:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Find mosques using OpenStreetMap Overpass API (Free!)
  const findNearbyMosques = async (lat, lon, radius = searchRadius) => {
    try {
      setLoading(true);

      // Overpass query for mosques
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
          way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
          relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
        );
        out geom;
      `;

      const response = await fetch(OVERPASS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Process the results
      const mosqueData = data.elements.map((element) => {
        const mosque = {
          id: element.id,
          type: element.type,
          name: element.tags?.name || element.tags?.['name:en'] || 'Unnamed Mosque',
          latitude: element.lat || element.center?.lat,
          longitude: element.lon || element.center?.lon,
          address: formatAddress(element.tags),
          phone: element.tags?.phone || element.tags?.contact?.phone,
          website: element.tags?.website || element.tags?.contact?.website,
          denomination: element.tags?.denomination,
          capacity: element.tags?.capacity,
          wheelchair: element.tags?.wheelchair,
          parking: element.tags?.parking,
          wudu: element.tags?.wudu || element.tags?.ablution,
          gender_segregated: element.tags?.['worship:gender_segregated'],
          prayer_times: element.tags?.prayer_times,
          friday_prayer: element.tags?.friday_prayer,
        };

        // Calculate distance
        if (mosque.latitude && mosque.longitude) {
          mosque.distance = calculateDistance(
            lat, lon,
            mosque.latitude, mosque.longitude
          );
        }

        return mosque;
      }).filter(mosque => mosque.latitude && mosque.longitude);

      // Sort by distance
      mosqueData.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setMosques(mosqueData);
      console.log(`Found ${mosqueData.length} mosques`);

    } catch (error) {
      console.error('Error finding mosques:', error);
      Alert.alert('Error', 'Failed to find nearby mosques. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Format address from OSM tags
  const formatAddress = (tags) => {
    if (!tags) return '';
    
    const addressParts = [];
    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
    if (tags['addr:street']) addressParts.push(tags['addr:street']);
    if (tags['addr:city']) addressParts.push(tags['addr:city']);
    if (tags['addr:state']) addressParts.push(tags['addr:state']);
    
    return addressParts.join(', ') || tags.address || '';
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  };

  // Search mosques by name or location
  const searchMosques = async (query) => {
    if (!query.trim()) {
      if (location) {
        await findNearbyMosques(location.latitude, location.longitude);
      }
      return;
    }

    try {
      setLoading(true);

      // Search using Nominatim (Free geocoding)
      const searchUrl = `${NOMINATIM_API}/search?q=${encodeURIComponent(query + ' mosque')}&format=json&limit=20&countrycodes=pk`; // Adjust country code as needed

      const response = await fetch(searchUrl);
      const searchResults = await response.json();

      if (searchResults.length > 0) {
        const searchedMosques = searchResults.map((result, index) => ({
          id: `search_${index}`,
          name: result.display_name.split(',')[0],
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: result.display_name,
          distance: location ? calculateDistance(
            location.latitude, location.longitude,
            parseFloat(result.lat), parseFloat(result.lon)
          ) : null,
          type: 'search_result'
        }));

        setMosques(searchedMosques);

        // Center map on first result
        if (mapRef.current && searchedMosques.length > 0) {
          mapRef.current.animateToRegion({
            latitude: searchedMosques[0].latitude,
            longitude: searchedMosques[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open directions in maps app
  const openDirections = (mosque) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${mosque.latitude},${mosque.longitude}`;
    const label = encodeURIComponent(mosque.name);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;
      Linking.openURL(googleMapsUrl);
    });
  };

  // Make phone call
  const makePhoneCall = (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('No Phone', 'Phone number not available for this mosque.');
      return;
    }
    const url = `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
    Linking.openURL(url);
  };

  // Open website
  const openWebsite = (website) => {
    if (!website) {
      Alert.alert('No Website', 'Website not available for this mosque.');
      return;
    }
    let url = website;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    Linking.openURL(url);
  };

  // Favorite management
  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorite_mosques');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Load favorites error:', error);
    }
  };

  const toggleFavorite = async (mosque) => {
    try {
      const isFavorite = favorites.some(fav => fav.id === mosque.id);
      let newFavorites;

      if (isFavorite) {
        newFavorites = favorites.filter(fav => fav.id !== mosque.id);
      } else {
        newFavorites = [...favorites, mosque];
      }

      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorite_mosques', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  const isFavorite = (mosqueId) => {
    return favorites.some(fav => fav.id === mosqueId);
  };

  // Change search radius
  const changeRadius = (newRadius) => {
    setSearchRadius(newRadius);
    if (location) {
      findNearbyMosques(location.latitude, location.longitude, newRadius);
    }
  };

  // Refresh data
  const onRefresh = () => {
    if (location) {
      findNearbyMosques(location.latitude, location.longitude);
    } else {
      initializeLocation();
    }
  };

  // Format distance
  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance}km`;
  };

  if (loading && !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        >
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1000, 2000, 5000, 10000, 20000,].map((radius) => (
            <TouchableOpacity
              key={radius}
              style={[
                styles.radiusButton,
                searchRadius === radius && styles.activeRadiusButton
              ]}
              onPress={() => changeRadius(radius)}
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
          >
            {/* Search radius circle */}
            {showUserLocation && (
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
            {mosques.map((mosque) => (
              <Marker
                key={mosque.id}
                coordinate={{
                  latitude: mosque.latitude,
                  longitude: mosque.longitude,
                }}
                title={mosque.name}
                description={mosque.address}
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
                    <Text style={styles.calloutTitle}>{mosque.name}</Text>
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
            ))}
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
          {mosques.map((mosque) => (
            <View key={mosque.id} style={styles.mosqueItem}>
              <View style={styles.mosqueHeader}>
                <View style={styles.mosqueInfo}>
                  <Text style={styles.mosqueName}>{mosque.name}</Text>
                  {mosque.distance && (
                    <Text style={styles.mosqueDistance}>
                      📍 {formatDistance(mosque.distance)} away
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorite(mosque)}
                  style={styles.favoriteButton}
                >
                  <Ionicons
                    name={isFavorite(mosque.id) ? "heart" : "heart-outline"}
                    size={20}
                    color={isFavorite(mosque.id) ? "#EF4444" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              {mosque.address && (
                <Text style={styles.mosqueAddress} numberOfLines={2}>
                  {mosque.address}
                </Text>
              )}

              {/* Additional Info */}
              <View style={styles.mosqueDetails}>
                {mosque.phone && (
                  <Text style={styles.mosqueDetailText}>📞 Phone available</Text>
                )}
                {mosque.website && (
                  <Text style={styles.mosqueDetailText}>🌐 Website available</Text>
                )}
                {mosque.wheelchair === 'yes' && (
                  <Text style={styles.mosqueDetailText}>♿ Wheelchair accessible</Text>
                )}
                {mosque.parking && (
                  <Text style={styles.mosqueDetailText}>🚗 Parking available</Text>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.mosqueActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openDirections(mosque)}
                >
                  <Ionicons name="navigate" size={16} color="#4F46E5" />
                  <Text style={styles.actionButtonText}>Directions</Text>
                </TouchableOpacity>

                {mosque.phone && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => makePhoneCall(mosque.phone)}
                  >
                    <Ionicons name="call" size={16} color="#10B981" />
                    <Text style={styles.actionButtonText}>Call</Text>
                  </TouchableOpacity>
                )}

                {mosque.website && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openWebsite(mosque.website)}
                  >
                    <Ionicons name="globe" size={16} color="#8B5CF6" />
                    <Text style={styles.actionButtonText}>Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

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
    paddingVertical: 4,
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
  favoriteButton: {
    padding: 4,
  },
  mosqueAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  mosqueDetails: {
    marginBottom: 12,
  },
  mosqueDetailText: {
    fontSize: 12,
    color: '#8B5CF6',
    marginBottom: 2,
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