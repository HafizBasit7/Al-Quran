// src/screens/HomeScreen.js
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../contexts/SettingsContext';
import { prayerApi } from '../services/prayerApi';
import { quranApi } from '../services/quranApi';
import PrayerTimesCard from '../components/PrayerTimesCard';
import DailyAyah from '../components/DailyAyah';
import QuickBookmarks from '../components/QuickBookmarks';
import HeaderCard from '../components/HeaderCard';
import QuickAccess from '../components/QuickAccess';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { bookmarks } = useSettings();
  
  const { data: prayerData } = useQuery({
    queryKey: ['prayerTimes'],
    queryFn: async () => {
      const response = await prayerApi.getPrayerTimesByCity('Mecca', 'Saudi Arabia');
      return response.data;
    }
  });

  const { data: dailyAyah } = useQuery({
    queryKey: ['dailyAyah'],
    queryFn: async () => {
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const response = await quranApi.getSurahArabic(randomSurah);
      const verses = response.data.data.ayahs;
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      
      const translationResponse = await quranApi.getSurahTranslation(randomSurah);
      const translationVerse = translationResponse.data.data.ayahs.find(
        v => v.numberInSurah === randomVerse.numberInSurah
      );
      
      return {
        ...randomVerse,
        translation: translationVerse?.text || ''
      };
    }
  });

  return (
    <LinearGradient
      colors={['#0d9488', '#059669', '#047857']}
      locations={[0, 0.5, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <AppHeader title="Al-Quran" prayerData={prayerData} />
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <HeaderCard prayerData={prayerData} />
          {prayerData && <PrayerTimesCard prayerData={prayerData} />}
          {dailyAyah && <DailyAyah ayah={dailyAyah} />}
          <QuickAccess />
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
  },
  scrollView: {
    flex: 1,
  },
});

// Alternative gradient options - choose your favorite:

// Option 1: Green Islamic Theme
// const greenGradient = ['#0d9488', '#059669', '#047857'];

// // Option 2: Gold Luxury Theme  
// const goldGradient = ['#1e1b18', '#423928', '#d4af37'];

// // Option 3: Purple Spiritual Theme
// const purpleGradient = ['#1e1b4b', '#3730a3', '#7e22ce'];

// // Option 4: Blue Sky Theme
// const blueGradient = ['#0369a1', '#0ea5e9', '#bae6fd'];