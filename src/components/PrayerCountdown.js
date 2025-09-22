// src/components/PrayerCountdown.js
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PrayerCountdown({ prayerData }) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!prayerData?.data?.timings) return;
      
      const now = new Date();
      const prayers = [
        { name: 'Fajr', arabic: 'الفجر', time: prayerData.data.timings.Fajr },
        { name: 'Dhuhr', arabic: 'الظهر', time: prayerData.data.timings.Dhuhr },
        { name: 'Asr', arabic: 'العصر', time: prayerData.data.timings.Asr },
        { name: 'Maghrib', arabic: 'المغرب', time: prayerData.data.timings.Maghrib },
        { name: 'Isha', arabic: 'العشاء', time: prayerData.data.timings.Isha },
      ];

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);
        
        if (prayerTime > now) {
          const diff = prayerTime - now;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          setNextPrayer(prayer.arabic);
          setTimeRemaining(`${hours} Hours ${minutes} minutes`);
          return;
        }
      }
      
      // If all prayers have passed for today, show first prayer of next day
      setNextPrayer('الفجر');
      setTimeRemaining('غدا');
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, [prayerData]);

  return (
    <View style={styles.container}>
      <Ionicons name="time" size={32} color="#16a34a" />
      <Text style={styles.title}>الصلاة القادمة</Text>
      <Text style={styles.nextPrayer}>{nextPrayer}</Text>
      <Text style={styles.timeRemaining}>{timeRemaining}</Text>
      <Text style={styles.englishText}>Next Prayer: {nextPrayer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 24,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'ScheherazadeNew-Regular',
  },
  nextPrayer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    fontFamily: 'ScheherazadeNew-Regular',
  },
  timeRemaining: {
    fontSize: 20,
    color: '#16a34a',
    fontWeight: '600',
    marginBottom: 8,
  },
  englishText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
});