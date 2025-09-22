// src/components/JuzListItem.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSettings } from '../contexts/SettingsContext';

// Complete Juz Arabic names array
const JUZ_ARABIC_NAMES = {
  1: "الٓمّٓ",
  2: "سَيَقُولُ",
  3: "تِلْكَ الرُّسُلُ",
  4: "لَنْ تَنَالُوا",
  5: "وَالْمُحْصَنَاتُ",
  6: "لَا يُحِبُّ اللَّهُ",
  7: "وَإِذَا سَمِعُوا",
  8: "وَلَوْ أَنَّنَا",
  9: "قَالَ الْمَلَأُ",
  10: "وَاعْلَمُوا",
  11: "يَعْتَذِرُونَ",
  12: "وَمَا مِنْ دَابَّةٍ",
  13: "وَمَا أُبَرِّئُ",
  14: "رُبَمَا",
  15: "سُبْحَانَ الَّذِي",
  16: "قَالَ أَلَمْ",
  17: "اقْتَرَبَ",
  18: "قَدْ أَفْلَحَ",
  19: "وَقَالَ الَّذِينَ",
  20: "أَمَّنْ خَلَقَ",
  21: "اتْلُ مَا أُوحِيَ",
  22: "وَمَنْ يَقْنُتْ",
  23: "وَمَا لِي",
  24: "فَمَنْ أَظْلَمُ",
  25: "إِلَيْهِ",
  26: "حم",
  27: "قَالَ فَمَا خَطْبُكُمْ",
  28: "قَدْ سَمِعَ اللَّهُ",
  29: "تَبَارَكَ الَّذِي",
  30: "عَمَّ"
};

// Complete Juz English names array
const JUZ_ENGLISH_NAMES = {
  1: "Alif Lam Meem",
  2: "Sayaqool",
  3: "Tilkal Rusul",
  4: "Lan Tana Loo",
  5: "Wal Mohsanat",
  6: "La Yuhibbullah",
  7: "Wa Iza Samiu",
  8: "Wa Lau Annana",
  9: "Qalal Malao",
  10: "Wa A'lamu",
  11: "Yatazeroon",
  12: "Wa Mamin Da'abat",
  13: "Wa Ma Ubrioo",
  14: "Rubama",
  15: "Subhanallazi",
  16: "Qal Alam",
  17: "Aqtarabo",
  18: "Qadd Aflaha",
  19: "Wa Qalallazina",
  20: "A'man Khalaq",
  21: "Utlu Ma Oohi",
  22: "Wa Man Yaqnut",
  23: "Wa Mali",
  24: "Faman Azlam",
  25: "Ilahe",
  26: "Haa",
  27: "Qala Fama Khatbukum",
  28: "Qadd Sami Allah",
  29: "Tabarakallazi",
  30: "Amma"
};

export default function JuzListItem({ juz }) {
  const navigation = useNavigation();
  const { bookmarks, addBookmark, removeBookmark } = useSettings();
  
  const isBookmarked = bookmarks.some(b => b.id === `juz-${juz.number}`);
  
  // Get all names with fallbacks
  const displayArabicName = juz.arabicName || JUZ_ARABIC_NAMES[juz.number] || `جزء ${juz.number}`;
  const displayEnglishName = juz.name || JUZ_ENGLISH_NAMES[juz.number] || `Juz ${juz.number}`;
  
  // Extract all parameters from juz object with fallbacks
  const juzNumber = juz.number || 1;
  const startSurah = juz.start?.surah || 1;
  const startAyah = juz.start?.ayah || 1;
  const endSurah = juz.end?.surah || 1;
  const endAyah = juz.end?.ayah || 1;

  const handleBookmarkPress = () => {
    if (isBookmarked) {
      removeBookmark(`juz-${juzNumber}`);
    } else {
      addBookmark({
        id: `juz-${juzNumber}`,
        type: 'juz',
        name: `Juz ${juzNumber}`,
        arabicName: displayArabicName,
        englishName: displayEnglishName,
        number: juzNumber,
        startSurah: startSurah,
        startAyah: startAyah,
        endSurah: endSurah,
        endAyah: endAyah,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleJuzPress = () => {
    navigation.navigate('JuzDetail', { 
      juzNumber: juzNumber,
      juzName: displayEnglishName,
      juzArabicName: displayArabicName,
      startSurah: startSurah,
      startAyah: startAyah,
      endSurah: endSurah,
      endAyah: endAyah
    });
  };

  // Get surah names for display
  const getSurahRange = () => {
    if (startSurah === endSurah) {
      return `Surah ${startSurah} (Ayah ${startAyah}-${endAyah})`;
    } else {
      return `Surah ${startSurah}:${startAyah} to Surah ${endSurah}:${endAyah}`;
    }
  };

  // Get surah range in Arabic
  const getSurahRangeArabic = () => {
    if (startSurah === endSurah) {
      return `سورة ${startSurah} (آية ${startAyah}-${endAyah})`;
    } else {
      return `سورة ${startSurah}:${startAyah} إلى سورة ${endSurah}:${endAyah}`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleJuzPress}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{juzNumber}</Text>
        <Text style={styles.numberLabel}>جزء</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.juzName}>{displayArabicName}</Text>
        <Text style={styles.englishName}>{displayEnglishName}</Text>
        <Text style={styles.arabicName}></Text>
        
        <View style={styles.surahRangeContainer}>
          <Text style={styles.surahRange}>{getSurahRange()}</Text>
          {/* <Text style={styles.surahRangeArabic}>{getSurahRangeArabic()}</Text> */}
        </View>
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
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  numberLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
  },
  juzName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  englishName: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  arabicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
    includeFontPadding: false,
  },
  surahRangeContainer: {
    marginTop: 4,
  },
  surahRange: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  surahRangeArabic: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  bookmarkButton: {
    padding: 8,
    marginLeft: 8,
  },
});