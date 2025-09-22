import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSettings } from '../contexts/SettingsContext';

export default function SurahListItem({ surah }) {
  const navigation = useNavigation();
  const { bookmarks, addBookmark, removeBookmark } = useSettings();
  
  const isBookmarked = bookmarks.some(b => b.id === `surah-${surah.number}`);
  
  const handleBookmarkPress = () => {
    if (isBookmarked) {
      removeBookmark(`surah-${surah.number}`);
    } else {
      addBookmark({
        id: `surah-${surah.number}`,
        type: 'surah',
        name: surah.englishName,
        arabicName: surah.name,
        number: surah.number,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigation.navigate('SurahDetail', { surahNumber: surah.number })}
    >
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{surah.number}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.englishName}>{surah.englishName}</Text>
        <Text style={styles.arabicName}>{surah.name}</Text>
        <Text style={styles.meta}>
          {surah.revelationType} • {surah.numberOfAyahs} آيات
        </Text>
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
  englishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  arabicName: {
    fontSize: 20,
    fontFamily: 'ScheherazadeNew-Regular',
    color: '#0f172a',
    marginVertical: 4,
  },
  meta: {
    fontSize: 14,
    color: '#64748b',
  },
  bookmarkButton: {
    padding: 8,
  },
});