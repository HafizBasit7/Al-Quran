// src/services/quranApi.js
import axios from 'axios';

const API_BASE = 'https://api.alquran.cloud/v1';


const AUDIO_SERVERS = {
  'ar.alafasy': 'https://server8.mp3quran.net/afs',
  'ar.abdulbasit': 'https://server7.mp3quran.net/basit',
  'ar.husary': 'https://server6.mp3quran.net/husary',
  'ar.minshawi': 'https://server10.mp3quran.net/minsh',
  'ar.sudais': 'https://server11.mp3quran.net/sds',
  // Add more reciters as needed
};

// Mapping between API reciter identifiers and audio file naming conventions
const RECITER_MAPPING = {
  // Popular reciters with known working URLs
  'ar.alafasy': {
    audioFormat: 'alafasy',
    baseUrl: 'https://cdn.islamic.network/quran/audio/128',
    fileFormat: 'mp3'
  },
  'ar.abdulbasit': {
    audioFormat: 'abdulbasit',
    baseUrl: 'https://cdn.islamic.network/quran/audio/128',
    fileFormat: 'mp3'
  },
  'ar.husary': {
    audioFormat: 'husary',
    baseUrl: 'https://cdn.islamic.network/quran/audio/128',
    fileFormat: 'mp3'
  },
  'ar.minshawi': {
    audioFormat: 'minshawi',
    baseUrl: 'https://cdn.islamic.network/quran/audio/128',
    fileFormat: 'mp3'
  },
  'ar.abdulsamad': {
    audioFormat: 'abdulsamad',
    baseUrl: 'https://everyayah.com/data',
    fileFormat: 'mp3'
  },
  // Add more reciters as needed
};

export const quranApi = {
  // Get all surahs
  getSurahs: () => axios.get(`${API_BASE}/surah`),
  
  // Get Arabic text with tashkeel (proper diacritics)
  getSurahArabic: (surahNumber) => 
    axios.get(`${API_BASE}/surah/${surahNumber}/ar.alafasy`),

  // Get reciter information
  // getReciterInfo: (reciterId) => 
  //   axios.get(`${API_BASE}/edition/${reciterId}`),
  // Get reciter info
  getReciterInfo: (reciterId) => {
    const reciters = {
      'ar.alafasy': {
        identifier: 'ar.alafasy',
        englishName: 'Mishary Rashid Alafasy',
        name: 'مشاري بن راشد العفاسي',
        hasAudio: true,
        country: 'Kuwait'
      },
      'ar.abdulbasit': {
        identifier: 'ar.abdulbasit',
        englishName: 'Abdul Basit Abdul Samad',
        name: 'عبد الباسط عبد الصمد',
        hasAudio: true,
        country: 'Egypt'
      },
      'ar.husary': {
        identifier: 'ar.husary',
        englishName: 'Mahmoud Khalil Al-Husary',
        name: 'محمود خليل الحصري',
        hasAudio: true,
        country: 'Egypt'
      },
      'ar.minshawi': {
        identifier: 'ar.minshawi',
        englishName: 'Mohamed Siddiq El-Minshawi',
        name: 'محمد صديق المنشاوي',
        hasAudio: true,
        country: 'Egypt'
      },
      'ar.sudais': {
        identifier: 'ar.sudais',
        englishName: 'Abdul Rahman Al-Sudais',
        name: 'عبد الرحمن السديس',
        hasAudio: true,
        country: 'Saudi Arabia'
      }
    };
    
    return Promise.resolve({ data: { data: reciters[reciterId] } });
  },

  
  // Get reciters list with enhanced information
  // getReciters: async () => {
  //   const response = await axios.get(`${API_BASE}/edition?format=audio`);
  //   const reciters = response.data.data;
    
  //   // Enhance reciter data with audio compatibility information
  //   return reciters.map(reciter => ({
  //     ...reciter,
  //     hasAudio: !!RECITER_MAPPING[reciter.identifier],
  //     audioInfo: RECITER_MAPPING[reciter.identifier] || null
  //   }));
  // },

  getReciters: () => {
    // Return our supported reciters instead of calling API
    const supportedReciters = [
      {
        identifier: 'ar.alafasy',
        englishName: 'Mishary Rashid Alafasy',
        name: 'مشاري بن راشد العفاسي',
        hasAudio: true
      },
      {
        identifier: 'ar.abdulbasit',
        englishName: 'Abdul Basit Abdul Samad',
        name: 'عبد الباسط عبد الصمد',
        hasAudio: true
      },
      {
        identifier: 'ar.husary',
        englishName: 'Mahmoud Khalil Al-Husary',
        name: 'محمود خليل الحصري',
        hasAudio: true
      },
      {
        identifier: 'ar.minshawi',
        englishName: 'Mohamed Siddiq El-Minshawi',
        name: 'محمد صديق المنشاوي',
        hasAudio: true
      },
      {
        identifier: 'ar.sudais',
        englishName: 'Abdul Rahman Al-Sudais',
        name: 'عبد الرحمن السديس',
        hasAudio: true
      }
    ];
    
    return Promise.resolve(supportedReciters);
  },
  
  // Get audio URL for a specific surah and reciter
  getAudioUrl: (surahNumber, reciterId) => {
    // const reciterInfo = RECITER_MAPPING[reciterId];
      const reciterInfo = AUDIO_SERVERS[reciterId];
    
    if (!reciterInfo) {
      throw new Error(`Reciter ${reciterId} not supported for audio playback`);
    }
    
    const { baseUrl, audioFormat, fileFormat } = reciterInfo;
    return `${baseUrl}/${audioFormat}/${surahNumber}.${fileFormat}`;
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
  },
  
};




// Juz data with proper Arabic names
export const JUZ_DATA = [
  { number: 1, arabicName: 'الٓمٓ', name: "Alif Lam Meem", start: { surah: 1, ayah: 1 }, end: { surah: 2, ayah: 141 } },
  { number: 2, arabicName: 'سَيَقُولُ', name: "Sayaqool", start: { surah: 2, ayah: 142 }, end: { surah: 2, ayah: 252 } },
  { number: 3, arabicName: 'تِلْكَ الرُّسُلُ', name: "Tilkal Rusul", start: { surah: 2, ayah: 253 }, end: { surah: 3, ayah: 92 } },
  { number: 4, arabicName: 'لَنْ تَنَالُوا', name: "Lan Tana Loo", start: { surah: 3, ayah: 93 }, end: { surah: 4, ayah: 23 } },
  { number: 5, arabicName: 'وَالْمُحْصَنَاتُ', name: "Wal Mohsanat", start: { surah: 4, ayah: 24 }, end: { surah: 4, ayah: 147 } },
  { number: 6, arabicName: 'لَا يُحِبُّ اللَّهُ', name: "La Yuhibbullah", start: { surah: 4, ayah: 148 }, end: { surah: 5, ayah: 81 } },
  { number: 7, arabicName: 'وَإِذَا سَمِعُوا', name: "Wa Iza Sami'oo", start: { surah: 5, ayah: 82 }, end: { surah: 6, ayah: 110 } },
  { number: 8, arabicName: 'وَلَوْ أَنَّنَا', name: "Wa Lau Annana", start: { surah: 6, ayah: 111 }, end: { surah: 7, ayah: 87 } },
  { number: 9, arabicName: 'قَالَ الْمَلَأُ', name: "Qalal Malao", start: { surah: 7, ayah: 88 }, end: { surah: 8, ayah: 40 } },
  { number: 10, arabicName: 'وَاعْلَمُوا', name: "Wa A'lamu", start: { surah: 8, ayah: 41 }, end: { surah: 9, ayah: 92 } },
  { number: 11, arabicName: 'يَعْتَذِرُونَ', name: "Yatazeroon", start: { surah: 9, ayah: 93 }, end: { surah: 11, ayah: 5 } },
  { number: 12, arabicName: 'وَمَا مِنْ دَابَّةٍ', name: "Wa Mamin Da'abat", start: { surah: 11, ayah: 6 }, end: { surah: 12, ayah: 52 } },
  { number: 13, arabicName: 'وَمَا أُبَرِّئُ', name: "Wa Ma Ubrioo", start: { surah: 12, ayah: 53 }, end: { surah: 14, ayah: 52 } },
  { number: 14, arabicName: 'رُبَمَا', name: "Rubama", start: { surah: 15, ayah: 1 }, end: { surah: 16, ayah: 128 } },
  { number: 15, arabicName: 'سُبْحَانَ الَّذِي', name: "Subhanallazi", start: { surah: 17, ayah: 1 }, end: { surah: 18, ayah: 74 } },
  { number: 16, arabicName: 'قَالَ أَلَمْ', name: "Qal Alam", start: { surah: 18, ayah: 75 }, end: { surah: 20, ayah: 135 } },
  { number: 17, arabicName: 'اقْتَرَبَ', name: "Aqtarabo", start: { surah: 21, ayah: 1 }, end: { surah: 22, ayah: 78 } },
  { number: 18, arabicName: 'قَدْ أَفْلَحَ', name: "Qadd Aflaha", start: { surah: 23, ayah: 1 }, end: { surah: 25, ayah: 20 } },
  { number: 19, arabicName: 'وَقَالَ الَّذِينَ', name: "Wa Qalallazeena", start: { surah: 25, ayah: 21 }, end: { surah: 27, ayah: 55 } },
  { number: 20, arabicName: 'أَمَّنْ خَلَقَ', name: "A'man Khalaq", start: { surah: 27, ayah: 56 }, end: { surah: 29, ayah: 45 } },
  { number: 21, arabicName: 'اتْلُ مَا أُوحِيَ', name: "Utlu Ma Oohi", start: { surah: 29, ayah: 46 }, end: { surah: 33, ayah: 30 } },
  { number: 22, arabicName: 'وَمَنْ يَقْنُتْ', name: "Wa Manyaqnut", start: { surah: 33, ayah: 31 }, end: { surah: 36, ayah: 27 } },
  { number: 23, arabicName: 'وَمَا لِي', name: "Wa Mali", start: { surah: 36, ayah: 28 }, end: { surah: 39, ayah: 31 } },
  { number: 24, arabicName: 'فَمَنْ أَظْلَمُ', name: "Faman Azlam", start: { surah: 39, ayah: 32 }, end: { surah: 41, ayah: 46 } },
  { number: 25, arabicName: 'إِلَيْهِ يُرَدُّ', name: "Elahe Yuruddo", start: { surah: 41, ayah: 47 }, end: { surah: 45, ayah: 37 } },
  { number: 26, arabicName: 'حم', name: "Ha'a Meem", start: { surah: 46, ayah: 1 }, end: { surah: 51, ayah: 30 } },
  { number: 27, arabicName: 'قَالَ فَمَا خَطْبُكُمْ', name: "Qal Fama Khatbukum", start: { surah: 51, ayah: 31 }, end: { surah: 57, ayah: 29 } },
  { number: 28, arabicName: 'قَدْ سَمِعَ اللَّهُ', name: "Qad Sami Allah", start: { surah: 58, ayah: 1 }, end: { surah: 66, ayah: 12 } },
  { number: 29, arabicName: 'تَبَارَكَ الَّذِي', name: "Tabarakallazi", start: { surah: 67, ayah: 1 }, end: { surah: 77, ayah: 50 } },
  { number: 30, arabicName: 'عَمَّ يَتَسَاءَلُونَ', name: "Amma Yatasa'aloon", start: { surah: 78, ayah: 1 }, end: { surah: 114, ayah: 6 } }
];