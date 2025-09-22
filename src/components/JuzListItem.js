// src/components/JuzListItem.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSettings } from '../contexts/SettingsContext';

export default function JuzListItem({ juz }) {
  const navigation = useNavigation();
  const { bookmarks, addBookmark, removeBookmark } = useSettings();
  
  const isBookmarked = bookmarks.some(b => b.id === `juz-${juz.number}`);
  
  const handleBookmarkPress = () => {
    if (isBookmarked) {
      removeBookmark(`juz-${juz.number}`);
    } else {
      addBookmark({
        id: `juz-${juz.number}`,
        type: 'juz',
        name: `Juz ${juz.number}`,
        number: juz.number,
        startSurah: juz.start.surah,
        startAyah: juz.start.ayah,
        endSurah: juz.end.surah,
        endAyah: juz.end.ayah,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleJuzPress = () => {
    navigation.navigate('JuzDetail', { 
      juzNumber: juz.number,
      juzName: juz.name,
      startSurah: juz.start.surah,
      startAyah: juz.start.ayah,
      endSurah: juz.end.surah,
      endAyah: juz.end.ayah
    });
  };

  // Get surah names for display
  const getSurahRange = () => {
    if (juz.start.surah === juz.end.surah) {
      return `Surah ${juz.start.surah} (Ayah ${juz.start.ayah}-${juz.end.ayah})`;
    } else {
      return `Surah ${juz.start.surah}:${juz.start.ayah} to Surah ${juz.end.surah}:${juz.end.ayah}`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleJuzPress}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{juz.number}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.juzName}>جزء {juz.number}</Text>
        <Text style={styles.arabicName}>{juz.arabicName}</Text>
        <Text style={styles.surahRange}>{getSurahRange()}</Text>
      </View>
      
      {/* <TouchableOpacity onPress={handleBookmarkPress} style={styles.bookmarkButton}>
        <Ionicons 
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
          size={24} 
          color={isBookmarked ? '#16a34a' : '#64748b'} 
        />
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  number: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
  },
  juzName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  arabicName: {
    fontSize: 16,
    color: '#16a34a',
    marginVertical: 2,
    fontStyle: 'italic',
  },
  surahRange: {
    fontSize: 14,
    color: '#64748b',
  },
  bookmarkButton: {
    padding: 8,
  },
});