import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import IslamicCalendarService from '../services/islamicCalendarService';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const Events = () => {
  const [islamicDate, setIslamicDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(null);

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading calendar data...');
      
      // Load data sequentially to avoid overwhelming the API
      const status = await IslamicCalendarService.getServiceStatus();
      setServiceStatus(status);
      
      const currentDate = await IslamicCalendarService.getCurrentIslamicDate();
      setIslamicDate(currentDate);
      
      const upcomingEvents = await IslamicCalendarService.getUpcomingEvents();
      // console.log('Loaded events:', upcomingEvents);
      setEvents(upcomingEvents);
      
      if (!upcomingEvents || upcomingEvents.length === 0) {
        setError('No upcoming events found in the next year');
      }
      
    } catch (error) {
      console.error('Error loading calendar data:', error);
      setError('Failed to load calendar data. Using fallback data.');
      
      // Use fallback data
      const fallbackDate = IslamicCalendarService.getFallbackIslamicDate();
      const fallbackEvents = IslamicCalendarService.getFallbackEvents();
      
      setIslamicDate(fallbackDate);
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    IslamicCalendarService.clearCache();
    await loadCalendarData();
    setRefreshing(false);
  }, [loadCalendarData]);

  const getEventColor = (type) => {
    const colors = {
      'eid': '#FFD700',
      'ramadan': '#4CAF50',
      'new-year': '#2196F3',
      'ashura': '#FF6B6B',
      'mawlid': '#9C27B0',
      'qadr': '#673AB7',
      'hajj': '#795548',
      'arafah': '#607D8B',
      'miraj': '#E91E63',
      'general': '#9E9E9E'
    };
    return colors[type] || '#2196F3';
  };

  const getEventIcon = (type) => {
    const icons = {
      'eid': 'star',
      'ramadan': 'moon',
      'new-year': 'calendar',
      'ashura': 'heart',
      'mawlid': 'book',
      'qadr': 'sparkles',
      'hajj': 'location',
      'arafah': 'sunny',
      'miraj': 'airplane',
      'general': 'calendar-outline'
    };
    return icons[type] || 'calendar';
  };

  const formatEventDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Date not available';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilText = (daysUntil) => {
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil < 7) return `${daysUntil} days`;
    if (daysUntil < 30) return `${Math.ceil(daysUntil/7)} weeks`;
    return `${Math.ceil(daysUntil/30)} months`;
  };

  const handleEventPress = (event) => {
    Alert.alert(
      event.name,
      `${event.description || 'Islamic event'}\n\nHijri Date: ${event.hijriDate}\nGregorian Date: ${formatEventDate(event.date)}\n\n${getDaysUntilText(event.daysUntil)} remaining${event.isApproximate ? ' (Approximate)' : ''}`,
      [{ text: 'OK' }]
    );
  };

  const renderServiceStatus = () => {
    if (!serviceStatus) return null;
    
    return (
      <View style={[
        styles.statusBanner,
        { backgroundColor: serviceStatus.status === 'online' ? '#E8F5E8' : '#FFF3E0' }
      ]}>
        <Ionicons 
          name={serviceStatus.status === 'online' ? 'checkmark-circle' : 'warning'} 
          size={16} 
          color={serviceStatus.status === 'online' ? '#4CAF50' : '#FF9800'} 
        />
        <Text style={[
          styles.statusText,
          { color: serviceStatus.status === 'online' ? '#2E7D32' : '#E65100' }
        ]}>
          {serviceStatus.message}
        </Text>
      </View>
    );
  };

  if (loading && !islamicDate) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Islamic Calendar...</Text>
      </View>
    );
  }

  const validEvents = events.filter(event => 
    event && event.date && !isNaN(event.date.getTime())
  );

  return (
    <SafeAreaView style={styles.container}>
           {/* Header */}
      <LinearGradient
        colors={['#1a5e1a', '#2E7D32']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Islamic Calendar</Text>
        <Text style={styles.headerSubtitle}>
          Upcoming Islamic Events
        </Text>
      </LinearGradient>

      {/* Current Date Card */}
      {islamicDate && (
        <View style={styles.dateCardContainer}>
          <LinearGradient
            colors={['#4CAF50', '#2E7D32']}
            style={styles.dateCard}
          >
            <Text style={styles.gregorianDate}>
              {islamicDate.gregorianDate}
            </Text>
            <Text style={styles.islamicDateLarge}>
              {islamicDate.formatted}
            </Text>
            {islamicDate.formattedAr && (
              <Text style={styles.islamicDateArabic}>
                {islamicDate.formattedAr}
              </Text>
            )}
            <View style={styles.dateFooter}>
              <Text style={styles.dayName}>
                {islamicDate.dayName} • {islamicDate.year} AH
              </Text>
              <View style={styles.accuracyIndicator}>
                <Ionicons 
                  name={islamicDate.isApiData ? 'checkmark-circle' : 'warning'} 
                  size={14} 
                  color="white" 
                />
                <Text style={styles.accuracyText}>
                  {islamicDate.isApiData ? 'Accurate' : 'Approximate'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

<View style={styles.sectionHeader}>
          <Ionicons name="calendar" size={24} color="#333" />
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {/* <Text style={styles.eventsCount}>
            {validEvents.length} events
          </Text> */}
        </View>
    
    <ScrollView
    //   style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Service Status */}
      {renderServiceStatus()}

   

      {/* Events Section */}
      <View style={styles.eventsSection}>
        
        
        {loading ? (
          <View style={styles.eventsLoading}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.eventsLoadingText}>Loading events...</Text>
          </View>
        ) : validEvents.length === 0 ? (
          <View style={styles.noEvents}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.noEventsText}>No upcoming events</Text>
            <Text style={styles.noEventsSubtext}>
              Check back later for new events
            </Text>
          </View>
        ) : (
            validEvents.slice(0, 10).map((event, index) => (
            <TouchableOpacity 
              key={`${event.name}-${index}`} 
              style={styles.eventCard}
              onPress={() => handleEventPress(event)}
            >
              <View style={[styles.eventIcon, { backgroundColor: getEventColor(event.type) }]}>
                <Ionicons name={getEventIcon(event.type)} size={20} color="white" />
              </View>
              
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventName}>{event.name}</Text>
                  <View style={styles.eventBadges}>
                    {event.isToday && (
                      <View style={styles.todayBadge}>
                        <Text style={styles.todayText}>Today</Text>
                      </View>
                    )}
                    {event.isApproximate && (
                      <Ionicons name="warning" size={14} color="#FF9800" />
                    )}
                  </View>
                </View>
                
                <Text style={styles.hijriDate}>{event.hijriDate}</Text>
                <Text style={styles.eventDate}>{formatEventDate(event.date)}</Text>
                
                <View style={styles.eventFooter}>
                  <Text style={styles.daysUntil}>
                    {getDaysUntilText(event.daysUntil)}
                  </Text>
                  <View style={[styles.daysBadge, { backgroundColor: getEventColor(event.type) + '20' }]}>
                    <Text style={[styles.daysBadgeText, { color: getEventColor(event.type) }]}>
                      {event.daysUntil}d
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Info Footer */}
      <View style={styles.infoFooter}>
        <Text style={styles.infoText}>
          Dates are calculated based on astronomical data and may vary by location
        </Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
  },
  dateCardContainer: {
    marginTop: -20,
    marginHorizontal: 16,
  },
  dateCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gregorianDate: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 4,
    textAlign: 'center',
  },
  islamicDateLarge: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  islamicDateArabic: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    textAlign: 'right',
  },
  dateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  accuracyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyText: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  errorText: {
    color: '#1976D2',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  eventsSection: {
    margin: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 16,
    marginTop: 16,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
    
  },
  eventsCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  eventsLoadingText: {
    marginLeft: 8,
    color: '#666',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  eventBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  todayBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  hijriDate: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysUntil: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  daysBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  daysBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  noEvents: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  infoFooter: {
    padding: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  bottomPadding: {
    height: 20,
  },
});

export default Events;