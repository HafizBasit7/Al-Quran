// src/components/DailyAyah.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DailyAyah({ ayah }) {
  const { addBookmark, removeBookmark, bookmarks } = useSettings();
  
  if (!ayah) return null;
  
  const isBookmarked = bookmarks.some(b => b.id === `ayah-${ayah.number}`);
  
  const handleBookmarkPress = () => {
    if (isBookmarked) {
      removeBookmark(`ayah-${ayah.number}`);
    } else {
      addBookmark({
        id: `ayah-${ayah.number}`,
        type: 'ayah',
        surahNumber: ayah.surah.number,
        verseNumber: ayah.numberInSurah,
        text: ayah.text,
        translation: ayah.translation,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Inspiration</Text>
      <Text style={styles.arabicText}>{ayah.text}</Text>
      <Text style={styles.translation}>"{ayah.translation}"</Text>
      <Text style={styles.reference}>
        {/* Surah {ayah.surah.englishName} ({ayah.surah.name}), Ayah {ayah.numberInSurah} */}
        
      </Text>
      
      {/* <TouchableOpacity onPress={handleBookmarkPress} style={styles.bookmarkButton}>
        <Ionicons 
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
          size={24} 
          color={isBookmarked ? '#16a34a' : '#64748b'} 
        />
        <Text style={styles.bookmarkText}>
          {isBookmarked ? 'Bookmarked' : 'Bookmark this verse'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
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
    marginBottom: 16,
    textAlign: 'center',
  },
  arabicText: {
    fontSize: 24,
    textAlign: 'right',
    lineHeight: 40,
    color: '#0f172a',
    marginBottom: 16,
  },
  translation: {
    fontSize: 16,
    color: '#334155',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 24,
  },
  reference: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  bookmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  bookmarkText: {
    marginLeft: 8,
    color: '#16a34a',
    fontWeight: '500',
  },
});