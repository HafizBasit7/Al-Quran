// src/contexts/SettingsContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quranApi } from '../services/quranApi';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Updated reciter options with all 21+ reciters
const AVAILABLE_RECITERS = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري بن راشد العفاسي',
    hasAudio: true,
    country: 'Kuwait'
  },
  {
    id: 'ar.minshawi',
    name: 'Mohamed Siddiq El-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    hasAudio: true,
    country: 'Egypt'
  },
  {
    id: 'ar.sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.ajamy',
    name: 'Ahmed Al-Ajamy',
    arabicName: 'أحمد العجمي',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.ghamdi',
    name: 'Saud Al-Shuraim & Abdullah Al-Ghamdi',
    arabicName: 'سعود الشريم وعبد الله الغامدي',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.shuraim',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.balilah',
    name: 'Maher Al Muaiqly',
    arabicName: 'ماهر المعيقلي',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.hudhaify',
    name: 'Ali Al-Hudhaify',
    arabicName: 'علي الحذيفي',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.shatri',
    name: 'Adel Al-Kalbani (Al-Shatri)',
    arabicName: 'عادل الكلباني',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.basfar',
    name: 'Abdullah Basfar',
    arabicName: 'عبد الله بصفر',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.bukhatir',
    name: 'Abu Bakr Al-Bukhatir',
    arabicName: 'أبو بكر الشاطري',
    hasAudio: true,
    country: 'UAE'
  },
  {
    id: 'ar.johany',
    name: 'Yasser Al-Dosari (Al-Johany)',
    arabicName: 'ياسر الدوسري',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.hanyman',
    name: 'Ibrahim Al-Akhdar (Al-Hanyman)',
    arabicName: 'إبراهيم الأخضر',
    hasAudio: true,
    country: 'Saudi Arabia'
  },
  {
    id: 'ar.khalil',
    name: 'Mahmoud Khalil Al-Husary (Tajweed)',
    arabicName: 'محمود خليل الحصري',
    hasAudio: true,
    country: 'Egypt'
  },
  {
    id: 'ar.mutawalli',
    name: 'Mohamed Al-Mutawalli',
    arabicName: 'محمد المتولي',
    hasAudio: true,
    country: 'Egypt'
  },
  {
    id: 'ar.nabulsi',
    name: 'Mohamed Al-Nabulsi',
    arabicName: 'محمد النابلسي',
    hasAudio: true,
    country: 'Syria'
  },
  {
    id: 'ar.quran',
    name: 'Mishary Rashid Alafasy (Quran Radio)',
    arabicName: 'مشاري العفاسي (راديو القرآن)',
    hasAudio: true,
    country: 'Kuwait'
  },
  {
    id: 'ar.rashed',
    name: 'Rashed Al-Fares',
    arabicName: 'راشد الفارس',
    hasAudio: true,
    country: 'Kuwait'
  },
  {
    id: 'ar.tablawi',
    name: 'Mohamed Al-Tablawi',
    arabicName: 'محمد الطبلاوي',
    hasAudio: true,
    country: 'Egypt'
  },
  {
    id: 'ar.warsh',
    name: 'Warsh Recitation',
    arabicName: 'رواية ورش',
    hasAudio: true,
    country: 'Various'
  },
  {
    id: 'ar.hafs',
    name: 'Hafs Recitation',
    arabicName: 'رواية حفص',
    hasAudio: true,
    country: 'Various'
  }
];

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);
  const [translationLang, setTranslationLang] = useState('en');
  const [reciter, setReciter] = useState('ar.alafasy');
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Storage keys
  const STORAGE_KEYS = {
    THEME: 'settings_theme',
    FONT_SIZE: 'settings_fontSize',
    TRANSLATION_LANG: 'settings_translationLang',
    RECITER: 'settings_reciter',
    BOOKMARKS: 'settings_bookmarks'
  };

  // Load settings once on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // console.log('Loading settings from storage...');

      const [
        savedTheme,
        savedFontSize,
        savedTranslationLang,
        savedReciter,
        savedBookmarks,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
        AsyncStorage.getItem(STORAGE_KEYS.TRANSLATION_LANG),
        AsyncStorage.getItem(STORAGE_KEYS.RECITER),
        AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
      ]);

      // Apply loaded settings with defaults
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        setTheme(savedTheme);
      }

      if (savedFontSize && !isNaN(Number(savedFontSize))) {
        const fontSize = Number(savedFontSize);
        if (fontSize >= 12 && fontSize <= 24) {
          setFontSize(fontSize);
        }
      }

      if (savedTranslationLang) {
        setTranslationLang(savedTranslationLang);
      }

      if (savedReciter) {
        // Validate that the saved reciter is supported
        const isValidReciter = AVAILABLE_RECITERS.some(r => r.id === savedReciter);
        if (isValidReciter) {
          setReciter(savedReciter);
          console.log('Loaded reciter:', savedReciter);
        } else {
          console.warn('Invalid reciter found, using default:', savedReciter);
          setReciter('ar.alafasy');
          await AsyncStorage.setItem(STORAGE_KEYS.RECITER, 'ar.alafasy');
        }
      } else {
        console.log('No saved reciter, using default: ar.alafasy');
      }

      if (savedBookmarks) {
        try {
          const parsedBookmarks = JSON.parse(savedBookmarks);
          if (Array.isArray(parsedBookmarks)) {
            setBookmarks(parsedBookmarks);
          }
        } catch (error) {
          console.warn('Invalid bookmarks data, resetting:', error);
          setBookmarks([]);
        }
      }
      
      // console.log('Settings loaded successfully');
    } catch (error) {
      console.error('Error loading settings:', error);
      // Set defaults on error
      setTheme('light');
      setFontSize(16);
      setTranslationLang('en');
      setReciter('ar.alafasy');
      setBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = useCallback(async (newTheme) => {
    try {
      if (!['light', 'dark'].includes(newTheme)) {
        throw new Error('Invalid theme value');
      }
      
      setTheme(newTheme);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
      console.log('Theme saved:', newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }, []);

  const saveFontSize = useCallback(async (newSize) => {
    try {
      const size = Number(newSize);
      if (isNaN(size) || size < 12 || size > 24) {
        throw new Error('Invalid font size value');
      }
      
      setFontSize(size);
      await AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
      console.log('Font size saved:', size);
    } catch (error) {
      console.error('Failed to save font size:', error);
    }
  }, []);

  const saveTranslationLang = useCallback(async (newLang) => {
    try {
      setTranslationLang(newLang);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSLATION_LANG, newLang);
      console.log('Translation language saved:', newLang);
    } catch (error) {
      console.error('Failed to save translation language:', error);
    }
  }, []);

  const saveReciter = useCallback(async (newReciter) => {
    try {
      // Validate reciter
      const isValidReciter = AVAILABLE_RECITERS.some(r => r.id === newReciter);
      if (!isValidReciter) {
        throw new Error(`Invalid reciter: ${newReciter}`);
      }

      console.log('Saving reciter:', newReciter);
      setReciter(newReciter);
      await AsyncStorage.setItem(STORAGE_KEYS.RECITER, newReciter);
      console.log('Reciter saved successfully:', newReciter);
    } catch (error) {
      console.error('Failed to save reciter:', error);
      throw error; // Re-throw so UI can handle the error
    }
  }, []);

  const addBookmark = useCallback(async (bookmark) => {
    try {
      // Validate bookmark structure
      if (!bookmark || !bookmark.id || !bookmark.surah || !bookmark.ayah) {
        throw new Error('Invalid bookmark structure');
      }

      // Check if bookmark already exists
      const existingIndex = bookmarks.findIndex(b => b.id === bookmark.id);
      if (existingIndex !== -1) {
        console.log('Bookmark already exists');
        return;
      }

      const newBookmarks = [...bookmarks, bookmark];
      setBookmarks(newBookmarks);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
      console.log('Bookmark added successfully');
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      throw error;
    }
  }, [bookmarks]);

  const removeBookmark = useCallback(async (bookmarkId) => {
    try {
      const newBookmarks = bookmarks.filter((b) => b.id !== bookmarkId);
      setBookmarks(newBookmarks);
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(newBookmarks));
      console.log('Bookmark removed successfully');
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      throw error;
    }
  }, [bookmarks]);

  const getReciterInfo = useCallback(async (reciterId) => {
    try {
      const reciterInfo = AVAILABLE_RECITERS.find(r => r.id === reciterId);
      if (!reciterInfo) {
        throw new Error(`Reciter not found: ${reciterId}`);
      }
      return reciterInfo;
    } catch (error) {
      console.error('Error getting reciter info:', error);
      return null;
    }
  }, []);

  const getCurrentReciterInfo = useCallback(() => {
    return AVAILABLE_RECITERS.find(r => r.id === reciter) || AVAILABLE_RECITERS[0];
  }, [reciter]);

  const getAvailableReciters = useCallback(() => {
    return AVAILABLE_RECITERS;
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.THEME),
        AsyncStorage.removeItem(STORAGE_KEYS.FONT_SIZE),
        AsyncStorage.removeItem(STORAGE_KEYS.TRANSLATION_LANG),
        AsyncStorage.removeItem(STORAGE_KEYS.RECITER),
        AsyncStorage.removeItem(STORAGE_KEYS.BOOKMARKS),
      ]);

      // Reset to defaults
      setTheme('light');
      setFontSize(16);
      setTranslationLang('en');
      setReciter('ar.alafasy');
      setBookmarks([]);

      console.log('Settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  }, []);

  // Log current reciter value when it changes
  useEffect(() => {
    if (!isLoading) {
      console.log('Current reciter updated:', reciter);
      const reciterInfo = getCurrentReciterInfo();
      console.log('Reciter info:', reciterInfo);
    }
  }, [reciter, isLoading, getCurrentReciterInfo]);

  const value = {
    // State
    theme,
    fontSize,
    translationLang,
    reciter,
    bookmarks,
    isLoading,
    
    // Actions
    saveTheme,
    saveFontSize,
    saveTranslation: saveTranslationLang,
    saveReciter,
    addBookmark,
    removeBookmark,
    resetSettings,
    
    // Helpers
    getReciterInfo,
    getCurrentReciterInfo,
    getAvailableReciters,
    
    // Constants
    availableReciters: AVAILABLE_RECITERS
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};