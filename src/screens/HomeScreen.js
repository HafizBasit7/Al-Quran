// src/screens/HomeScreen.js
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../contexts/SettingsContext';
import { prayerApi } from '../services/prayerApi'; // Fixed import path
import { quranApi } from '../services/quranApi'; // Fixed import path
import PrayerTimesCard from '../components/PrayerTimesCard';
import DailyAyah from '../components/DailyAyah';
import QuickBookmarks from '../components/QuickBookmarks';
import HeaderCard from '../components/HeaderCard';
import QuickAccess from '../components/QuickAccess';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';

export default function HomeScreen() {
  const { bookmarks } = useSettings();
  
  const { data: prayerData } = useQuery({
    queryKey: ['prayerTimes'],
    queryFn: async () => {
      // Use city-based API for simplicity
      const response = await prayerApi.getPrayerTimesByCity('Mecca', 'Saudi Arabia');
      return response.data;
    }
  });

//   const { data: dailyAyah } = useQuery({
//     queryKey: ['dailyAyah'],
//     queryFn: async () => {
//       // Get a random verse for daily inspiration
//       const randomSurah = Math.floor(Math.random() * 114) + 1;
//       const response = await quranApi.getSurah(randomSurah);
//       const verses = response.data.data.ayahs;
//       const randomVerse = verses[Math.floor(Math.random() * verses.length)];
//       return randomVerse;
//     }
//   });
// In src/screens/HomeScreen.js, update the dailyAyah query:
const { data: dailyAyah } = useQuery({
    queryKey: ['dailyAyah'],
    queryFn: async () => {
      // Get a random verse for daily inspiration
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const response = await quranApi.getSurahArabic(randomSurah);
      const verses = response.data.data.ayahs;
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      
      // Get translation for the same verse
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
    <SafeAreaView style={styles.container}>
      <AppHeader title="Al-Quran" prayerData={prayerData} />
    <ScrollView >
     <HeaderCard prayerData={prayerData} />

      
      {prayerData && <PrayerTimesCard prayerData={prayerData} />}
      {dailyAyah && <DailyAyah ayah={dailyAyah} />}
      <QuickAccess />
      {/* {bookmarks.length > 0 && <QuickBookmarks bookmarks={bookmarks} />} */}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#16a34a' },
  date: { fontSize: 16, color: '#64748b' }
});