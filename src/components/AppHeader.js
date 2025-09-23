// src/components/AppHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../contexts/SettingsContext';

const { width } = Dimensions.get('window');

// Custom Khana Kaba Icon Component
const KhanaKabaIcon = ({ size = 24, color = "#fff" }) => (
  <View style={[styles.kabaIcon, { width: size, height: size }]}>
    <View style={[styles.kabaBase, { 
      backgroundColor: color, 
      width: size * 0.8, 
      height: size * 0.6,
      borderRadius: size * 0.1 
    }]} />
    <View style={[styles.kabaTop, { 
      backgroundColor: color, 
      width: size * 0.9, 
      height: size * 0.15,
      borderRadius: size * 0.05,
      top: -size * 0.05 
    }]} />
    <View style={[styles.kabaDoor, { 
      backgroundColor: 'transparent',
      borderColor: color === '#fff' ? '#000' : '#fff',
      borderWidth: 1,
      width: size * 0.2, 
      height: size * 0.3,
      position: 'absolute',
      bottom: size * 0.05,
      left: size * 0.3,
      borderRadius: size * 0.02
    }]} />
  </View>
);

// Custom Masjid Nabwi Icon Component
const MasjidNabwiIcon = ({ size = 24, color = "#fff" }) => (
  <View style={[styles.masjidIcon, { width: size, height: size }]}>
    {/* Main Dome */}
    <View style={[styles.mainDome, { 
      backgroundColor: color,
      width: size * 0.6,
      height: size * 0.3,
      borderTopLeftRadius: size * 0.3,
      borderTopRightRadius: size * 0.3,
      position: 'absolute',
      top: size * 0.1,
      left: size * 0.2
    }]} />
    
    {/* Base */}
    <View style={[styles.masjidBase, { 
      backgroundColor: color,
      width: size * 0.8,
      height: size * 0.4,
      position: 'absolute',
      bottom: 0,
      left: size * 0.1,
      borderRadius: size * 0.05
    }]} />
    
    {/* Minaret Left */}
    <View style={[styles.minaret, { 
      backgroundColor: color,
      width: size * 0.1,
      height: size * 0.7,
      position: 'absolute',
      left: size * 0.05,
      bottom: 0,
      borderRadius: size * 0.05
    }]} />
    
    {/* Minaret Right */}
    <View style={[styles.minaret, { 
      backgroundColor: color,
      width: size * 0.1,
      height: size * 0.7,
      position: 'absolute',
      right: size * 0.05,
      bottom: 0,
      borderRadius: size * 0.05
    }]} />
    
    {/* Small domes on minarets */}
    <View style={[styles.smallDome, { 
      backgroundColor: color,
      width: size * 0.12,
      height: size * 0.06,
      borderRadius: size * 0.06,
      position: 'absolute',
      left: size * 0.04,
      top: size * 0.05
    }]} />
    <View style={[styles.smallDome, { 
      backgroundColor: color,
      width: size * 0.12,
      height: size * 0.06,
      borderRadius: size * 0.06,
      position: 'absolute',
      right: size * 0.04,
      top: size * 0.05
    }]} />
  </View>
);

export default function AppHeader({ title, showDrawer = true, prayerData }) {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const islamicDate = getIslamicDate();



  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صبح بخیر';
    if (hour < 18) return 'دوپہر بخیر';
    return 'شام بخیر';
  };

  const handleKabaPress = () => {
    // Navigate to Qibla direction or Mecca info
    console.log('Khana Kaba pressed');
  };

  const handleMasjidPress = () => {
    // Navigate to Prayer times or Masjid finder
    console.log('Masjid Nabwi pressed');
  };

  return (
    <LinearGradient
      colors={isDark 
        ? ['#0f172a', '#1e293b', '#334155'] 
        : ['#047857', '#059669', '#10b981', '#34d399']
      }
      style={styles.headerContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decorative Islamic Pattern */}
      <View style={styles.patternOverlay}>
        {[...Array(8)].map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.patternDot, 
              { 
                left: (i * width/7) % width,
                top: i % 2 === 0 ? 5 : 15,
                opacity: 0.1
              }
            ]} 
          />
        ))}
      </View>

      {/* Top Bar */}
      <View style={styles.topBar}>
      <TouchableOpacity 
            style={[styles.iconButton, styles.iconButtonElevated]}
            onPress={handleKabaPress}
          >
            <KhanaKabaIcon size={22} color="#fff" />
          </TouchableOpacity>
       
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <View style={styles.titleRow}>
            <View style={styles.islamicBorder} />
            <Text style={styles.title}>{title || 'Easy Quran'}</Text>
            <View style={styles.islamicBorder} />
          </View>
          <Text style={styles.subtitle}>القرآن الكريم</Text>
        </View>

        <View style={styles.iconContainer}>
         
          
          <TouchableOpacity 
            style={[styles.iconButton, styles.iconButtonElevated]}
            onPress={handleMasjidPress}
          >
            <MasjidNabwiIcon size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.dateSection}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar" size={16} color="#fff" style={styles.dateIcon} />
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
          <Text style={styles.islamicDateText}>{islamicDate}</Text>
        </View>
        
        {prayerData && (
          <View style={styles.prayerInfo}>
            <View style={styles.prayerIndicator} />
            <View style={styles.prayerContent}>
              <Ionicons name="time-outline" size={14} color="#fff" />
              <Text style={styles.prayerLabel}>Next Prayer:</Text>
              <Text style={styles.prayerText}>{getNextPrayer(prayerData)}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom decorative line */}
      <View style={styles.bottomDecoration}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.decorativeLine}
        />
      </View>
    </LinearGradient>
  );
}

// Helper function to get next prayer
function getNextPrayer(prayerData) {
  if (!prayerData) return 'Loading...';
  
  const timings = prayerData?.data?.timings || prayerData?.timings || {};
  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ].filter(p => p.time);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const prayer of prayers) {
    const [time, period] = prayer.time.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const prayerMinutes = hours * 60 + minutes;
    if (prayerMinutes > currentMinutes) {
      return `${prayer.name} ${prayer.time}`;
    }
  }

  return prayers[0] ? `${prayers[0].name} ${prayers[0].time}` : 'No prayers';
}

// Enhanced Islamic date function
function getIslamicDate() {
  // You can integrate a proper Hijri date library later
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  
  // Simple approximation - replace with actual Hijri calculation
//   return `١٥ ${hijriMonths[8]} ١٤٤٥ هـ`;
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  patternDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    zIndex: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  islamicBorder: {
    width: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 8,
  },
  iconButtonElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
    zIndex: 1,
  },
  dateSection: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  dateIcon: {
    marginRight: 6,
    opacity: 0.9,
  },
  dateText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
    opacity: 0.9,
  },
  islamicDateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    textAlign: 'left',
    marginLeft: 22,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  prayerIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  prayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 4,
  },
  prayerText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  decorativeLine: {
    flex: 1,
    height: 2,
  },
  
  // Custom Icon Styles
  kabaIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  kabaBase: {
    position: 'relative',
  },
  kabaTop: {
    position: 'absolute',
  },
  kabaDoor: {
    borderRadius: 2,
  },
  
  masjidIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainDome: {},
  masjidBase: {},
  minaret: {},
  smallDome: {},
});