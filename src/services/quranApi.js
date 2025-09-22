// src/services/quranApi.js
import axios from 'axios';

const API_BASE = 'https://api.alquran.cloud/v1';

const AUDIO_SERVERS = {
  'ar.alafasy': 'https://server8.mp3quran.net/afs',
  'ar.minshawi': 'https://server10.mp3quran.net/minsh',
  'ar.sudais': 'https://server11.mp3quran.net/sds',
  'ar.ajamy': 'https://server10.mp3quran.net/ajm',
  'ar.ghamdi': 'https://server7.mp3quran.net/s_gmd',
  'ar.shuraim': 'https://server12.mp3quran.net/tnjy',
  'ar.balilah': 'https://server6.mp3quran.net/balilah',
  'ar.hudhaify': 'https://server8.mp3quran.net/ahmad_huth',
  'ar.shatri': 'https://server11.mp3quran.net/shatri',
  'ar.basfar': 'https://server6.mp3quran.net/bsfr',
  'ar.bukhatir': 'https://server14.mp3quran.net/bukheet',
  'ar.johany': 'https://server19.mp3quran.net/johany',
  'ar.hanyman': 'https://server6.mp3quran.net/hanyman',
  'ar.khalil': 'https://server13.mp3quran.net/husr',
  'ar.mutawalli': 'https://server8.mp3quran.net/mtrod',
  'ar.nabulsi': 'https://server9.mp3quran.net/nabil',
  'ar.quran': 'https://server8.mp3quran.net/afs',
  'ar.rashed': 'https://server12.mp3quran.net/ifrad',
  'ar.tablawi': 'https://server12.mp3quran.net/tblawi',
  'ar.warsh': 'https://server8.mp3quran.net/dlami',
  'ar.hafs': 'https://server12.mp3quran.net/malaysia/hfs'
};

export const quranApi = {
  // Get all surahs
  getSurahs: () => axios.get(`${API_BASE}/surah`),
  
  // Get Arabic text with tashkeel (proper diacritics)
  getSurahArabic: (surahNumber) => 
    axios.get(`${API_BASE}/surah/${surahNumber}/ar.alafasy`),

  // Get reciter info
  getReciterInfo: (reciterId) => {
    const reciters = {
      'ar.sudais': {
        identifier: 'ar.sudais',
        englishName: 'Abdul Rahman Al-Sudais',
        name: 'عبد الرحمن السديس',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.alafasy': {
        identifier: 'ar.alafasy',
        englishName: 'Mishary Rashid Alafasy',
        name: 'مشاري بن راشد العفاسي',
        hasAudio: true,
        country: 'Kuwait'
      },
      'ar.minshawi': {
        identifier: 'ar.minshawi',
        englishName: 'Mohamed Siddiq El-Minshawi',
        name: 'محمد صديق المنشاوي',
        hasAudio: true,
        country: 'Egypt'
      },
    
      'ar.ajamy': {
        identifier: 'ar.ajamy',
        englishName: 'Ahmed Al-Ajamy',
        name: 'أحمد العجمي',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.ghamdi': {
        identifier: 'ar.ghamdi',
        englishName: 'Saud Al-Shuraim & Abdullah Al-Ghamdi',
        name: 'سعود الشريم وعبد الله الغامدي',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.shuraim': {
        identifier: 'ar.shuraim',
        englishName: 'Saud Al-Shuraim',
        name: 'سعود الشريم',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.balilah': {
        identifier: 'ar.balilah',
        englishName: 'Maher Al Muaiqly',
        name: 'ماهر المعيقلي',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.hudhaify': {
        identifier: 'ar.hudhaify',
        englishName: 'Ali Al-Hudhaify',
        name: 'علي الحذيفي',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.shatri': {
        identifier: 'ar.shatri',
        englishName: 'Adel Al-Kalbani (Al-Shatri)',
        name: 'عادل الكلباني',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.basfar': {
        identifier: 'ar.basfar',
        englishName: 'Abdullah Basfar',
        name: 'عبد الله بصفر',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.bukhatir': {
        identifier: 'ar.bukhatir',
        englishName: 'Abu Bakr Al-Bukhatir',
        name: 'أبو بكر الشاطري',
        hasAudio: true,
        country: 'UAE'
      },
      'ar.johany': {
        identifier: 'ar.johany',
        englishName: 'Yasser Al-Dosari (Al-Johany)',
        name: 'ياسر الدوسري',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.hanyman': {
        identifier: 'ar.hanyman',
        englishName: 'Ibrahim Al-Akhdar (Al-Hanyman)',
        name: 'إبراهيم الأخضر',
        hasAudio: true,
        country: 'Saudi Arabia'
      },
      'ar.khalil': {
        identifier: 'ar.khalil',
        englishName: 'Mahmoud Khalil Al-Husary (Tajweed)',
        name: 'محمود خليل الحصري',
        hasAudio: true,
        country: 'Egypt'
      },
      'ar.mutawalli': {
        identifier: 'ar.mutawalli',
        englishName: 'Mohamed Al-Mutawalli',
        name: 'محمد المتولي',
        hasAudio: true,
        country: 'Egypt'
      },
      'ar.nabulsi': {
        identifier: 'ar.nabulsi',
        englishName: 'Mohamed Al-Nabulsi',
        name: 'محمد النابلسي',
        hasAudio: true,
        country: 'Syria'
      },
      'ar.quran': {
        identifier: 'ar.quran',
        englishName: 'Mishary Rashid Alafasy (Quran Radio)',
        name: 'مشاري العفاسي (راديو القرآن)',
        hasAudio: true,
        country: 'Kuwait'
      },
      'ar.rashed': {
        identifier: 'ar.rashed',
        englishName: 'Rashed Al-Fares',
        name: 'راشد الفارس',
        hasAudio: true,
        country: 'Kuwait'
      },
      'ar.tablawi': {
        identifier: 'ar.tablawi',
        englishName: 'Mohamed Al-Tablawi',
        name: 'محمد الطبلاوي',
        hasAudio: true,
        country: 'Egypt'
      },
      'ar.warsh': {
        identifier: 'ar.warsh',
        englishName: 'Warsh Recitation',
        name: 'رواية ورش',
        hasAudio: true,
        country: 'Various'
      },
      'ar.hafs': {
        identifier: 'ar.hafs',
        englishName: 'Hafs Recitation',
        name: 'رواية حفص',
        hasAudio: true,
        country: 'Various'
      }
    };
    
    return Promise.resolve({ data: { data: reciters[reciterId] } });
  },

  getReciters: () => {
    // Return our supported reciters instead of calling API
    const supportedReciters = [
      {
        identifier: 'ar.sudais',
        englishName: 'Abdul Rahman Al-Sudais',
        name: 'عبد الرحمن السديس',
        hasAudio: true
      },
      {
        identifier: 'ar.alafasy',
        englishName: 'Mishary Rashid Alafasy',
        name: 'مشاري بن راشد العفاسي',
        hasAudio: true
      },
      {
        identifier: 'ar.minshawi',
        englishName: 'Mohamed Siddiq El-Minshawi',
        name: 'محمد صديق المنشاوي',
        hasAudio: true
      },
      {
        identifier: 'ar.balilah',
        englishName: 'Maher Al Muaiqly',
        name: 'ماهر المعيقلي',
        hasAudio: true
      },
      {
        identifier: 'ar.ajamy',
        englishName: 'Ahmed Al-Ajamy',
        name: 'أحمد العجمي',
        hasAudio: true
      },
      {
        identifier: 'ar.ghamdi',
        englishName: 'Saud Al-Shuraim & Abdullah Al-Ghamdi',
        name: 'سعود الشريم وعبد الله الغامدي',
        hasAudio: true
      },
      {
        identifier: 'ar.shuraim',
        englishName: 'Saud Al-Shuraim',
        name: 'سعود الشريم',
        hasAudio: true
      },
    
      {
        identifier: 'ar.hudhaify',
        englishName: 'Ali Al-Hudhaify',
        name: 'علي الحذيفي',
        hasAudio: true
      },
      {
        identifier: 'ar.shatri',
        englishName: 'Adel Al-Kalbani (Al-Shatri)',
        name: 'عادل الكلباني',
        hasAudio: true
      },
      {
        identifier: 'ar.basfar',
        englishName: 'Abdullah Basfar',
        name: 'عبد الله بصفر',
        hasAudio: true
      },
      {
        identifier: 'ar.bukhatir',
        englishName: 'Abu Bakr Al-Bukhatir',
        name: 'أبو بكر الشاطري',
        hasAudio: true
      },
      // {
      //   identifier: 'ar.johany',
      //   englishName: 'Yasser Al-Dosari (Al-Johany)',
      //   name: 'ياسر الدوسري',
      //   hasAudio: true
      // },
      // {
      //   identifier: 'ar.hanyman',
      //   englishName: 'Ibrahim Al-Akhdar (Al-Hanyman)',
      //   name: 'إبراهيم الأخضر',
      //   hasAudio: true
      // },
      {
        identifier: 'ar.khalil',
        englishName: 'Mahmoud Khalil Al-Husary (Tajweed)',
        name: 'محمود خليل الحصري',
        hasAudio: true
      },
      {
        identifier: 'ar.mutawalli',
        englishName: 'Mohamed Al-Mutawalli',
        name: 'محمد المتولي',
        hasAudio: true
      },
      {
        identifier: 'ar.nabulsi',
        englishName: 'Mohamed Al-Nabulsi',
        name: 'محمد النابلسي',
        hasAudio: true
      },
      {
        identifier: 'ar.quran',
        englishName: 'Mishary Rashid Alafasy (Quran Radio)',
        name: 'مشاري العفاسي (راديو القرآن)',
        hasAudio: true
      },
      {
        identifier: 'ar.rashed',
        englishName: 'Rashed Al-Fares',
        name: 'راشد الفارس',
        hasAudio: true
      },
      {
        identifier: 'ar.tablawi',
        englishName: 'Mohamed Al-Tablawi',
        name: 'محمد الطبلاوي',
        hasAudio: true
      },
      {
        identifier: 'ar.warsh',
        englishName: 'Warsh Recitation',
        name: 'رواية ورش',
        hasAudio: true
      },
      {
        identifier: 'ar.hafs',
        englishName: 'Hafs Recitation',
        name: 'رواية حفص',
        hasAudio: true
      }
    ];
    
    return Promise.resolve(supportedReciters);
  },
  
  // Get audio URL for a specific surah and reciter
  getAudioUrl: (surahNumber, reciterId) => {
    const reciterInfo = AUDIO_SERVERS[reciterId];
    
    if (!reciterInfo) {
      throw new Error(`Reciter ${reciterId} not supported for audio playback`);
    }
    
    const formattedNumber = surahNumber.toString().padStart(3, '0');
    return `${reciterInfo}/${formattedNumber}.mp3`;
  },
  
  // Get multiple translation options
  getSurahTranslation: (surahNumber, language = 'en') => {
    const translations = {
      en: 'en.asad',     // English - Muhammad Asad
      ur: 'ur.jalandhry', // Urdu - Fateh Muhammad Jalandhry
      ar: 'ar.jawadi'    // Arabic Tafseer
    };
    return axios.get(`${API_BASE}/surah/${surahNumber}/${translations[language]}`);
  },
  
  // Get verse by verse with multiple translations
  getVerse: (surahNumber, verseNumber, language = 'en') => {
    const translations = {
      en: 'en.asad',
      ur: 'ur.jalandhry', 
      ar: 'ar.jawadi'
    };
    return axios.get(`${API_BASE}/ayah/${surahNumber}:${verseNumber}/${translations[language]}`);
  },
  
  // Get available translations
  getTranslations: () => axios.get(`${API_BASE}/edition?format=text`),
  
  // Get Juz data
  getJuz: (juzNumber, language = 'en') => {
    const translations = {
      en: 'en.asad',
      ur: 'ur.jalandhry',
      ar: 'ar.jawadi'
    };
    return axios.get(`${API_BASE}/juz/${juzNumber}/${translations[language]}`);
  },

  // Check if a reciter supports audio
  isReciterSupported: (reciterId) => {
    return AUDIO_SERVERS.hasOwnProperty(reciterId);
  },
  
  // Get supported reciter IDs
  getSupportedReciters: () => {
    return Object.keys(AUDIO_SERVERS);
  },

  validateAudioUrl: async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
      return response.ok;
    } catch (error) {
      console.error('Audio URL validation failed:', error);
      return false;
    }
  }
};

// Juz data with proper Arabic names (unchanged)
export const JUZ_DATA = [
  { number: 1, name: "Alif Lam Meem", arabicName: "الٓمّٓ", start: { surah: 1, ayah: 1 }, end: { surah: 2, ayah: 141 } },
  { number: 2, name: "Sayaqool", arabicName: "سَيَقُولُ", start: { surah: 2, ayah: 142 }, end: { surah: 2, ayah: 252 } },
  { number: 3, name: "Tilkal Rusul", arabicName: "تِلْكَ الرُّسُلُ", start: { surah: 2, ayah: 253 }, end: { surah: 3, ayah: 92 } },
  { number: 4, name: "Lan Tana Loo", arabicName: "لَنْ تَنَالُوا", start: { surah: 3, ayah: 93 }, end: { surah: 4, ayah: 23 } },
  { number: 5, name: "Wal Mohsanat", arabicName: "وَالْمُحْصَنَاتُ", start: { surah: 4, ayah: 24 }, end: { surah: 4, ayah: 147 } },
  { number: 6, name: "La Yuhibbullah", arabicName: "لَا يُحِبُّ اللَّهُ", start: { surah: 4, ayah: 148 }, end: { surah: 5, ayah: 81 } },
  { number: 7, name: "Wa Iza Samiu", arabicName: "وَإِذَا سَمِعُوا", start: { surah: 5, ayah: 82 }, end: { surah: 6, ayah: 110 } },
  { number: 8, name: "Wa Lau Annana", arabicName: "وَلَوْ أَنَّنَا", start: { surah: 6, ayah: 111 }, end: { surah: 7, ayah: 87 } },
  { number: 9, name: "Qalal Malao", arabicName: "قَالَ الْمَلَأُ", start: { surah: 7, ayah: 88 }, end: { surah: 8, ayah: 40 } },
  { number: 10, name: "Wa A'lamu", arabicName: "وَاعْلَمُوا", start: { surah: 8, ayah: 41 }, end: { surah: 9, ayah: 92 } },
  { number: 11, name: "Yatazeroon", arabicName: "يَعْتَذِرُونَ", start: { surah: 9, ayah: 93 }, end: { surah: 11, ayah: 5 } },
  { number: 12, name: "Wa Mamin Da'abat", arabicName: "وَمَا مِنْ دَابَّةٍ", start: { surah: 11, ayah: 6 }, end: { surah: 12, ayah: 52 } },
  { number: 13, name: "Wa Ma Ubrioo", arabicName: "وَمَا أُبَرِّئُ", start: { surah: 12, ayah: 53 }, end: { surah: 15, ayah: 1 } },
  { number: 14, name: "Rubama", arabicName: "رُبَمَا", start: { surah: 15, ayah: 2 }, end: { surah: 16, ayah: 128 } },
  { number: 15, name: "Subhanallazi", arabicName: "سُبْحَانَ الَّذِي", start: { surah: 17, ayah: 1 }, end: { surah: 18, ayah: 74 } },
  { number: 16, name: "Qal Alam", arabicName: "قَالَ أَلَمْ", start: { surah: 18, ayah: 75 }, end: { surah: 20, ayah: 135 } },
  { number: 17, name: "Aqtarabo", arabicName: "اقْتَرَبَ", start: { surah: 21, ayah: 1 }, end: { surah: 22, ayah: 78 } },
  { number: 18, name: "Qadd Aflaha", arabicName: "قَدْ أَفْلَحَ", start: { surah: 23, ayah: 1 }, end: { surah: 25, ayah: 20 } },
  { number: 19, name: "Wa Qalallazina", arabicName: "وَقَالَ الَّذِينَ", start: { surah: 25, ayah: 21 }, end: { surah: 27, ayah: 55 } },
  { number: 20, name: "A'man Khalaq", arabicName: "أَمَّنْ خَلَقَ", start: { surah: 27, ayah: 56 }, end: { surah: 29, ayah: 45 } },
  { number: 21, name: "Utlu Ma Oohi", arabicName: "اتْلُ مَا أُوحِيَ", start: { surah: 29, ayah: 46 }, end: { surah: 33, ayah: 30 } },
  { number: 22, name: "Wa Man Yaqnut", arabicName: "وَمَنْ يَقْنُتْ", start: { surah: 33, ayah: 31 }, end: { surah: 36, ayah: 27 } },
  { number: 23, name: "Wa Mali", arabicName: "وَمَا لِي", start: { surah: 36, ayah: 28 }, end: { surah: 39, ayah: 31 } },
  { number: 24, name: "Faman Azlam", arabicName: "فَمَنْ أَظْلَمُ", start: { surah: 39, ayah: 32 }, end: { surah: 41, ayah: 46 } },
  { number: 25, name: "Ilahe", arabicName: "إِلَيْهِ", start: { surah: 41, ayah: 47 }, end: { surah: 45, ayah: 37 } },
  { number: 26, name: "Haa", arabicName: "حم", start: { surah: 46, ayah: 1 }, end: { surah: 51, ayah: 30 } },
  { number: 27, name: "Qala Fama Khatbukum", arabicName: "قَالَ فَمَا خَطْبُكُمْ", start: { surah: 51, ayah: 31 }, end: { surah: 57, ayah: 29 } },
  { number: 28, name: "Qadd Sami Allah", arabicName: "قَدْ سَمِعَ اللَّهُ", start: { surah: 58, ayah: 1 }, end: { surah: 66, ayah: 12 } },
  { number: 29, name: "Tabarakallazi", arabicName: "تَبَارَكَ الَّذِي", start: { surah: 67, ayah: 1 }, end: { surah: 77, ayah: 50 } },
  { number: 30, name: "Amma", arabicName: "عَمَّ", start: { surah: 78, ayah: 1 }, end: { surah: 114, ayah: 6 } }
];