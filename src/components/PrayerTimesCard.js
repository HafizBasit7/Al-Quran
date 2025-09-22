// src/components/PrayerTimesCard.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSettings } from '../contexts/SettingsContext';

export default function PrayerTimesCard({ prayerData }) {
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  // Memoized prayer times data
  const prayerTimes = useMemo(() => {
    if (!prayerData) return [];
    
    const timings = prayerData?.data?.timings || prayerData?.timings || {};
    
    return [
      { name: 'Fajr', arabic: 'الفجر', time: timings.Fajr, icon: 'moon' },
      { name: 'Sunrise', arabic: 'الشروق', time: timings.Sunrise, icon: 'sunny' },
      { name: 'Dhuhr', arabic: 'الظهر', time: timings.Dhuhr, icon: 'sunny' },
      { name: 'Asr', arabic: 'العصر', time: timings.Asr, icon: 'partly-sunny' },
      { name: 'Maghrib', arabic: 'المغرب', time: timings.Maghrib, icon: 'moon' },
      { name: 'Isha', arabic: 'العشاء', time: timings.Isha, icon: 'moon' },
    ].filter(prayer => prayer.time); // Filter out prayers with no time data
  }, [prayerData]);

  // Get next prayer with proper time parsing
  const nextPrayer = useMemo(() => {
    if (prayerTimes.length === 0) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Parse prayer times and convert to minutes of day
    const validPrayers = prayerTimes.map((prayer) => {
      const parts = ('' + prayer.time).match(/\d{1,2}:\d{2}/);
      if (!parts) return null;
      
      const [hours, minutes] = parts[0].split(':').map(Number);
      if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
      
      return {
        ...prayer,
        minutesOfDay: hours * 60 + minutes
      };
    }).filter(Boolean);

    if (validPrayers.length === 0) return null;

    // Find next prayer
    const next = validPrayers.find(p => p.minutesOfDay > currentMinutes);
    return next || validPrayers[0]; // Return first prayer if none left today
  }, [prayerTimes]);

  if (prayerTimes.length === 0) {
    return (
      <LinearGradient
        colors={isDark ? ['#1e293b', '#334155'] : ['#f8fafc', '#e2e8f0']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.title, isDark && styles.darkTitle]}>أوقات الصلاة</Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>Prayer Times</Text>
        <Text style={[styles.loadingText, isDark && styles.darkLoadingText]}>
          Loading prayer times...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={isDark ? ['#1e293b', '#334155'] : ['#ffffff', '#f8fafc']}
      style={[styles.card, isDark && styles.darkCard]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkTitle]}>أوقات الصلاة</Text>
        <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>Prayer Times</Text>
      </View>

      {/* Next Prayer Highlight */}
      {nextPrayer && (
        <View style={[styles.currentPrayer, isDark && styles.darkCurrentPrayer]}>
          <Ionicons 
            name={nextPrayer.icon} 
            size={24} 
            color={isDark ? '#60a5fa' : '#16a34a'} 
          />
          <View style={styles.currentPrayerTextContainer}>
            <Text style={[styles.currentPrayerText, isDark && styles.darkCurrentPrayerText]}>
              {nextPrayer.arabic} ({nextPrayer.name})
            </Text>
            <Text style={[styles.currentPrayerTime, isDark && styles.darkCurrentPrayerTime]}>
              {nextPrayer.time}
            </Text>
          </View>
        </View>
      )}

      {/* Prayer Times List */}
      <View style={styles.prayerList}>
        {prayerTimes.map((prayer, index) => {
          const isNext = nextPrayer && prayer.name === nextPrayer.name;
          
          return (
            <View
              key={prayer.name}
              style={[
                styles.prayerItem,
                isNext && styles.currentPrayerItem,
                isDark && styles.darkPrayerItem,
                isNext && isDark && styles.darkCurrentPrayerItem
              ]}
            >
              <View style={styles.prayerInfo}>
                <Ionicons 
                  name={prayer.icon} 
                  size={20} 
                  color={isDark ? '#94a3b8' : '#64748b'} 
                />
                <View style={styles.prayerNames}>
                  <Text style={[styles.prayerArabic, isDark && styles.darkPrayerArabic]}>
                    {prayer.arabic}
                  </Text>
                  <Text style={[styles.prayerName, isDark && styles.darkPrayerName]}>
                    {prayer.name}
                  </Text>
                </View>
              </View>
              
              <Text style={[
                styles.prayerTime,
                isNext && styles.currentPrayerTime,
                isDark && styles.darkPrayerTime,
                isNext && isDark && styles.darkCurrentPrayerTime
              ]}>
                {prayer.time}
              </Text>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  darkCard: {
    borderColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0.3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    fontFamily: 'ScheherazadeNew-Regular',
    marginBottom: 4,
  },
  darkTitle: {
    color: '#60a5fa',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  darkSubtitle: {
    color: '#94a3b8',
  },
  loadingText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    marginTop: 10,
  },
  darkLoadingText: {
    color: '#94a3b8',
  },
  currentPrayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  darkCurrentPrayer: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  currentPrayerTextContainer: {
    marginLeft: 12,
    alignItems: 'center',
  },
  currentPrayerText: {
    color: '#15803d',
    fontWeight: '600',
    fontSize: 16,
  },
  darkCurrentPrayerText: {
    color: '#60a5fa',
  },
  currentPrayerTime: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 2,
  },
  darkCurrentPrayerTime: {
    color: '#93c5fd',
  },
  prayerList: {
    gap: 8,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  darkPrayerItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  currentPrayerItem: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  darkCurrentPrayerItem: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prayerNames: {
    marginLeft: 12,
  },
  prayerArabic: {
    fontSize: 16,
    color: '#0f172a',
    fontFamily: 'ScheherazadeNew-Regular',
    fontWeight: '500',
  },
  darkPrayerArabic: {
    color: '#f1f5f9',
  },
  prayerName: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  darkPrayerName: {
    color: '#94a3b8',
  },
  prayerTime: {
    fontSize: 16,
    color: '#16a34a',
    fontWeight: '600',
  },
  darkPrayerTime: {
    color: '#60a5fa',
  },
  currentPrayerTime: {
    color: '#15803d',
    fontWeight: '700',
  },
  darkCurrentPrayerTime: {
    color: '#93c5fd',
    fontWeight: '700',
  },
});