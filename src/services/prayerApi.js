// // src/services/quranApi.js
// import axios from 'axios';

// const API_BASE = 'https://api.alquran.cloud/v1';

// export const quranApi = {
//   getSurahs: () => axios.get(`${API_BASE}/surah`),
//   getSurah: (surahNumber, translation = 'en.asad') => 
//     axios.get(`${API_BASE}/surah/${surahNumber}/${translation}`),
//   getVerse: (surahNumber, verseNumber, translation = 'en.asad') => 
//     axios.get(`${API_BASE}/ayah/${surahNumber}:${verseNumber}/${translation}`),
//   getReciters: () => axios.get(`${API_BASE}/edition?format=audio`),
//   getTranslations: () => axios.get(`${API_BASE}/edition?format=text`),
//   getTafsir: (surahNumber, verseNumber, tafsir = 'en.tafisir') => 
//     axios.get(`${API_BASE}/ayah/${surahNumber}:${verseNumber}/${tafsir}`),
//   getJuz: (juzNumber, translation = 'en.asad') => 
//     axios.get(`${API_BASE}/juz/${juzNumber}/${translation}`),
// };


// src/services/prayerApi.js
import axios from 'axios';

const API_BASE = 'https://api.aladhan.com/v1';

export const prayerApi = {
  // Get prayer times by coordinates
  getPrayerTimesByCoords: (latitude, longitude, method = 2, month = null, year = null) => {
    let url = `${API_BASE}/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    if (month && year) {
      url += `&month=${month}&year=${year}`;
    }
    
    return axios.get(url);
  },
  
  // Get prayer times by city name
  getPrayerTimesByCity: (city, country, method = 2) => {
    return axios.get(`${API_BASE}/timingsByCity?city=${city}&country=${country}&method=${method}`);
  },
  
  // Get prayer times for current date
  getCurrentPrayerTimes: (latitude, longitude, method = 2) => {
    const now = new Date();
    return axios.get(
      `${API_BASE}/timings/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=${method}`
    );
  },
  
  // Get list of calculation methods
  getCalculationMethods: () => {
    return axios.get(`${API_BASE}/methods`);
  },
  
  // Get current date in Hijri calendar
  getHijriDate: () => {
    const now = new Date();
    return axios.get(`${API_BASE}/gToH/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`);
  }
};