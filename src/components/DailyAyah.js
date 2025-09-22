// src/components/DailyAyah.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../contexts/SettingsContext';
import { quranApi } from '../services/quranApi';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DailyAyah({ ayah }) {
  const { theme, addBookmark, removeBookmark, bookmarks, translationLang } = useSettings();
  const isDark = theme === 'dark';

  // Fetch the daily ayah with proper translation like SurahDetailScreen
  const { data: dailyAyah, isLoading, error } = useQuery({
    queryKey: ['daily-ayah', translationLang],
    queryFn: async () => {
      // If ayah is passed as prop, use it (for testing/static data)
      if (ayah) {
        // If the passed ayah doesn't have translation, fetch it
        if (!ayah.translation) {
          const translationResponse = await quranApi.getSurahTranslation(
            ayah.surah.number, 
            translationLang
          );
          const translationAyahs = translationResponse.data.data.ayahs;
          const translation = translationAyahs[ayah.numberInSurah - 1]?.text || '';
          
          return {
            ...ayah,
            translation: translation
          };
        }
        return ayah;
      }

      // Otherwise fetch a random ayah for daily inspiration
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      
      const [arabicResponse, translationResponse] = await Promise.all([
        quranApi.getSurahArabic(randomSurah),
        quranApi.getSurahTranslation(randomSurah, translationLang)
      ]);

      const arabicSurah = arabicResponse.data.data;
      const translationSurah = translationResponse.data.data;
      
      // Get a random ayah from the surah
      const randomAyahIndex = Math.floor(Math.random() * arabicSurah.ayahs.length);
      const arabicAyah = arabicSurah.ayahs[randomAyahIndex];
      const translationAyah = translationSurah.ayahs[randomAyahIndex];

      return {
        ...arabicAyah,
        translation: translationAyah?.text || '',
        surah: {
          number: arabicSurah.number,
          name: arabicSurah.name,
          englishName: arabicSurah.englishName,
          numberOfAyahs: arabicSurah.numberOfAyahs
        }
      };
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  if (isLoading) {
    return (
      <LinearGradient
        colors={isDark ? ['#1e293b', '#334155'] : ['#f8fafc', '#e2e8f0']}
        style={[styles.container, isDark && styles.darkContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.title, isDark && styles.darkTitle]}>Daily Inspiration</Text>
        <Text style={[styles.loadingText, isDark && styles.darkLoadingText]}>
          Loading today's verse...
        </Text>
      </LinearGradient>
    );
  }

  if (error || !dailyAyah) {
    return (
      <LinearGradient
        colors={isDark ? ['#1e293b', '#334155'] : ['#f8fafc', '#e2e8f0']}
        style={[styles.container, isDark && styles.darkContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.title, isDark && styles.darkTitle]}>Daily Inspiration</Text>
        <Text style={[styles.errorText, isDark && styles.darkErrorText]}>
          Failed to load daily verse
        </Text>
      </LinearGradient>
    );
  }

  const isBookmarked = bookmarks.some(b => b.id === `ayah-${dailyAyah.number}`);
  
  const handleBookmarkPress = () => {
    if (isBookmarked) {
      removeBookmark(`ayah-${dailyAyah.number}`);
    } else {
      addBookmark({
        id: `ayah-${dailyAyah.number}`,
        type: 'ayah',
        surahNumber: dailyAyah.surah.number,
        verseNumber: dailyAyah.numberInSurah,
        text: dailyAyah.text,
        translation: dailyAyah.translation,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#1e3a8a', '#0f766e'] : ['#16a34a', '#0d9488']}
      style={[styles.container, isDark && styles.darkContainer]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkTitle]}>Daily Inspiration</Text>
        <Text style={[styles.urduTitle, isDark && styles.darkUrduTitle]}>روزانہ قرآن کی آیت</Text>
      </View>

      {/* Arabic Text */}
      <View style={styles.arabicContainer}>
        <Text style={styles.arabicText}>{dailyAyah.text}</Text>
      </View>

      {/* Translation */}
      <View style={styles.translationContainer}>
        <Text style={[styles.translationLabel, isDark && styles.darkTranslationLabel]}>
          {translationLang === 'ur' ? 'Translation:' : 'Translation:'}
        </Text>
        <Text style={[styles.translationText, isDark && styles.darkTranslationText]}>
          "{dailyAyah.translation}"
        </Text>
      </View>

      {/* Reference - Showing Arabic Surah Name like in SurahDetailScreen */}
      {/* <View style={styles.referenceContainer}>
        <Text style={[styles.referenceArabic, isDark && styles.darkReferenceArabic]}>
          سورة {dailyAyah.surah.name} - آية {dailyAyah.numberInSurah}
        </Text>
        <Text style={[styles.referenceEnglish, isDark && styles.darkReferenceEnglish]}>
          Surah {dailyAyah.surah.englishName} - Verse {dailyAyah.numberInSurah}
        </Text>
      </View> */}

      {/* Bookmark Button */}
      {/* <TouchableOpacity 
        onPress={handleBookmarkPress} 
        style={[styles.bookmarkButton, isDark && styles.darkBookmarkButton]}
      >
        <Ionicons 
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
          size={20} 
          color={isDark ? '#60a5fa' : '#16a34a'} 
        />
        <Text style={[styles.bookmarkText, isDark && styles.darkBookmarkText]}>
          {isBookmarked ? 'Bookmarked' : 'Bookmark this verse'}
        </Text>
      </TouchableOpacity> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  darkContainer: {
    borderColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0.3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  darkTitle: {
    color: '#f0f9ff',
  },
  urduTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  darkUrduTitle: {
    color: 'rgba(240, 249, 255, 0.9)',
  },
  arabicContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  arabicText: {
    fontSize: 22,
    textAlign: 'right',
    lineHeight: 36,
    color: '#ffffff',
    fontFamily: 'ScheherazadeNew-Regular',
  },
  translationContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  translationLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    textAlign: 'left',
    fontWeight: '600',
  },
  darkTranslationLabel: {
    color: 'rgba(240, 249, 255, 0.8)',
  },
  translationText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  darkTranslationText: {
    color: '#f0f9ff',
  },
  referenceContainer: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  referenceArabic: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'ScheherazadeNew-Regular',
    marginBottom: 4,
    textAlign: 'center',
  },
  darkReferenceArabic: {
    color: '#f0f9ff',
  },
  referenceEnglish: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  darkReferenceEnglish: {
    color: 'rgba(240, 249, 255, 0.8)',
  },
  bookmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  darkBookmarkButton: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  bookmarkText: {
    marginLeft: 8,
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  darkBookmarkText: {
    color: '#93c5fd',
  },
  loadingText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontStyle: 'italic',
  },
  darkLoadingText: {
    color: 'rgba(240, 249, 255, 0.8)',
  },
  errorText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontStyle: 'italic',
  },
  darkErrorText: {
    color: 'rgba(240, 249, 255, 0.8)',
  },
});