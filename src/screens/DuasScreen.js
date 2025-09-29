// DuasScreen.js - React Native Expo Component
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import BackButton from '../components/BackButton';

const { width, height } = Dimensions.get('window');

const QuranReader = () => {
  const [currentSurah, setCurrentSurah] = useState(2); // Al-Baqarah
  const [currentPage, setCurrentPage] = useState(1);
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(28); // Increased for better readability
  const [showSettings, setShowSettings] = useState(false);
  const [showSurahList, setShowSurahList] = useState(false);
  
  // Auto-scroll states
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(50); // 1-100
  const [isScrolling, setIsScrolling] = useState(false);

  // Refs for auto-scroll
  const scrollViewRef = useRef(null);
  const scrollInterval = useRef(null);
  const scrollY = useRef(0);
  const scrollOffset = useRef(new Animated.Value(0)).current;

  // Surah names 
  const surahNames = [
    { id: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', verses: 7 },
    { id: 2, name: 'البقرة', englishName: 'Al-Baqarah', verses: 286 },
    { id: 3, name: 'آل عمران', englishName: 'Ali Imran', verses: 200 },
    { id: 4, name: 'النساء', englishName: 'An-Nisa', verses: 176 },
    { id: 5, name: 'المائدة', englishName: 'Al-Maidah', verses: 120 },
    { id: 6, name: 'الأنعام', englishName: 'Al-Anam', verses: 165 },
    { id: 7, name: 'الأعراف', englishName: 'Al-Araf', verses: 206 },
    { id: 8, name: 'الأنفال', englishName: 'Al-Anfal', verses: 75 },
    { id: 9, name: 'التوبة', englishName: 'At-Tawbah', verses: 129 },
    { id: 10, name: 'يونس', englishName: 'Yunus', verses: 109 },
    { id: 11, name: 'هود', englishName: 'Hud', verses: 123 },
    { id: 12, name: 'يوسف', englishName: 'Yusuf', verses: 111 },
    { id: 13, name: 'الرعد', englishName: 'Ar-Rad', verses: 43 },
    { id: 14, name: 'إبراهيم', englishName: 'Ibrahim', verses: 52 },
    { id: 15, name: 'الحجر', englishName: 'Al-Hijr', verses: 99 },
    { id: 16, name: 'النحل', englishName: 'An-Nahl', verses: 128 },
    { id: 17, name: 'الإسراء', englishName: 'Al-Isra', verses: 111 },
    { id: 18, name: 'الكهف', englishName: 'Al-Kahf', verses: 110 },
    { id: 19, name: 'مريم', englishName: 'Maryam', verses: 98 },
    { id: 20, name: 'طه', englishName: 'Ta-Ha', verses: 135 },
    { id: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', verses: 112 },
    { id: 22, name: 'الحج', englishName: 'Al-Hajj', verses: 78 },
    { id: 23, name: 'المؤمنون', englishName: 'Al-Muminun', verses: 118 },
    { id: 24, name: 'النور', englishName: 'An-Nur', verses: 64 },
    { id: 25, name: 'الفرقان', englishName: 'Al-Furqan', verses: 77 },
    { id: 26, name: 'الشعراء', englishName: 'Ash-Shuara', verses: 227 },
    { id: 27, name: 'النمل', englishName: 'An-Naml', verses: 93 },
    { id: 28, name: 'القصص', englishName: 'Al-Qasas', verses: 88 },
    { id: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', verses: 69 },
    { id: 30, name: 'الروم', englishName: 'Ar-Rum', verses: 60 },
    { id: 31, name: 'لقمان', englishName: 'Luqman', verses: 34 },
    { id: 32, name: 'السجدة', englishName: 'As-Sajda', verses: 30 },
    { id: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', verses: 73 },
    { id: 34, name: 'سبإ', englishName: 'Saba', verses: 54 },
    { id: 35, name: 'فاطر', englishName: 'Fatir', verses: 45 },
    { id: 36, name: 'يس', englishName: 'Ya-Sin', verses: 83 },
    { id: 37, name: 'الصافات', englishName: 'As-Saffat', verses: 182 },
    { id: 38, name: 'ص', englishName: 'Sad', verses: 88 },
    { id: 39, name: 'الزمر', englishName: 'Az-Zumar', verses: 75 },
    { id: 40, name: 'غافر', englishName: 'Ghafir', verses: 85 },
    { id: 41, name: 'فصلت', englishName: 'Fussilat', verses: 54 },
    { id: 42, name: 'الشورى', englishName: 'Ash-Shuraa', verses: 53 },
    { id: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', verses: 89 },
    { id: 44, name: 'الدخان', englishName: 'Ad-Dukhan', verses: 59 },
    { id: 45, name: 'الجاثية', englishName: 'Al-Jathiya', verses: 37 },
    { id: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', verses: 35 },
    { id: 47, name: 'محمد', englishName: 'Muhammad', verses: 38 },
    { id: 48, name: 'الفتح', englishName: 'Al-Fath', verses: 29 },
    { id: 49, name: 'الحجرات', englishName: 'Al-Hujurat', verses: 18 },
    { id: 50, name: 'ق', englishName: 'Qaf', verses: 45 },
    { id: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', verses: 60 },
    { id: 52, name: 'الطور', englishName: 'At-Tur', verses: 49 },
    { id: 53, name: 'النجم', englishName: 'An-Najm', verses: 62 },
    { id: 54, name: 'القمر', englishName: 'Al-Qamar', verses: 55 },
    { id: 55, name: 'الرحمن', englishName: 'Ar-Rahman', verses: 78 },
    { id: 56, name: 'الواقعة', englishName: 'Al-Waqia', verses: 96 },
    { id: 57, name: 'الحديد', englishName: 'Al-Hadid', verses: 29 },
    { id: 58, name: 'المجادلة', englishName: 'Al-Mujadila', verses: 22 },
    { id: 59, name: 'الحشر', englishName: 'Al-Hashr', verses: 24 },
    { id: 60, name: 'الممتحنة', englishName: 'Al-Mumtahina', verses: 13 },
    { id: 61, name: 'الصف', englishName: 'As-Saff', verses: 14 },
    { id: 62, name: 'الجمعة', englishName: 'Al-Jumua', verses: 11 },
    { id: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', verses: 11 },
    { id: 64, name: 'التغابن', englishName: 'At-Taghabun', verses: 18 },
    { id: 65, name: 'الطلاق', englishName: 'At-Talaq', verses: 12 },
    { id: 66, name: 'التحريم', englishName: 'At-Tahrim', verses: 12 },
    { id: 67, name: 'الملك', englishName: 'Al-Mulk', verses: 30 },
    { id: 68, name: 'القلم', englishName: 'Al-Qalam', verses: 52 },
    { id: 69, name: 'الحاقة', englishName: 'Al-Haaqqa', verses: 52 },
    { id: 70, name: 'المعارج', englishName: 'Al-Maarij', verses: 44 },
    { id: 71, name: 'نوح', englishName: 'Nuh', verses: 28 },
    { id: 72, name: 'الجن', englishName: 'Al-Jinn', verses: 28 },
    { id: 73, name: 'المزمل', englishName: 'Al-Muzzammil', verses: 20 },
    { id: 74, name: 'المدثر', englishName: 'Al-Muddathir', verses: 56 },
    { id: 75, name: 'القيامة', englishName: 'Al-Qiyama', verses: 40 },
    { id: 76, name: 'الإنسان', englishName: 'Al-Insan', verses: 31 },
    { id: 77, name: 'المرسلات', englishName: 'Al-Mursalat', verses: 50 },
    { id: 78, name: 'النبإ', englishName: 'An-Naba', verses: 40 },
    { id: 79, name: 'النازعات', englishName: 'An-Naziat', verses: 46 },
    { id: 80, name: 'عبس', englishName: 'Abasa', verses: 42 },
    { id: 81, name: 'التكوير', englishName: 'At-Takwir', verses: 29 },
    { id: 82, name: 'الإنفطار', englishName: 'Al-Infitar', verses: 19 },
    { id: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', verses: 36 },
    { id: 84, name: 'الإنشقاق', englishName: 'Al-Inshiqaq', verses: 25 },
    { id: 85, name: 'البروج', englishName: 'Al-Buruj', verses: 22 },
    { id: 86, name: 'الطارق', englishName: 'At-Tariq', verses: 17 },
    { id: 87, name: 'الأعلى', englishName: 'Al-Ala', verses: 19 },
    { id: 88, name: 'الغاشية', englishName: 'Al-Ghashiya', verses: 26 },
    { id: 89, name: 'الفجر', englishName: 'Al-Fajr', verses: 30 },
    { id: 90, name: 'البلد', englishName: 'Al-Balad', verses: 20 },
    { id: 91, name: 'الشمس', englishName: 'Ash-Shams', verses: 15 },
    { id: 92, name: 'الليل', englishName: 'Al-Lail', verses: 21 },
    { id: 93, name: 'الضحى', englishName: 'Ad-Duha', verses: 11 },
    { id: 94, name: 'الشرح', englishName: 'Ash-Sharh', verses: 8 },
    { id: 95, name: 'التين', englishName: 'At-Tin', verses: 8 },
    { id: 96, name: 'العلق', englishName: 'Al-Alaq', verses: 19 },
    { id: 97, name: 'القدر', englishName: 'Al-Qadr', verses: 5 },
    { id: 98, name: 'البينة', englishName: 'Al-Bayyina', verses: 8 },
    { id: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', verses: 8 },
    { id: 100, name: 'العاديات', englishName: 'Al-Adiyat', verses: 11 },
    { id: 101, name: 'القارعة', englishName: 'Al-Qaria', verses: 11 },
    { id: 102, name: 'التكاثر', englishName: 'At-Takathur', verses: 8 },
    { id: 103, name: 'العصر', englishName: 'Al-Asr', verses: 3 },
    { id: 104, name: 'الهمزة', englishName: 'Al-Humaza', verses: 9 },
    { id: 105, name: 'الفيل', englishName: 'Al-Fil', verses: 5 },
    { id: 106, name: 'قريش', englishName: 'Quraish', verses: 4 },
    { id: 107, name: 'الماعون', englishName: 'Al-Maun', verses: 7 },
    { id: 108, name: 'الكوثر', englishName: 'Al-Kawthar', verses: 3 },
    { id: 109, name: 'الكافرون', englishName: 'Al-Kafirun', verses: 6 },
    { id: 110, name: 'النصر', englishName: 'An-Nasr', verses: 3 },
    { id: 111, name: 'المسد', englishName: 'Al-Masad', verses: 5 },
    { id: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', verses: 4 },
    { id: 113, name: 'الفلق', englishName: 'Al-Falaq', verses: 5 },
    { id: 114, name: 'الناس', englishName: 'An-Nas', verses: 6 },
  ];
  

  // Fetch verses from API
  const fetchVerses = async (surahNumber, page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
      const data = await response.json();
      
      if (data.status === "OK") {
        const allVerses = data.data.ayahs;
        const versesPerPage = 10;
        const startIndex = (page - 1) * versesPerPage;
        const endIndex = startIndex + versesPerPage;
        const pageVerses = allVerses.slice(startIndex, endIndex);
        
        setVerses(pageVerses);
        setSurahInfo({
          name: data.data.name,
          englishName: data.data.englishName,
          englishNameTranslation: data.data.englishNameTranslation,
          totalVerses: data.data.numberOfAyahs,
          totalPages: Math.ceil(allVerses.length / versesPerPage),
          revelationType: data.data.revelationType
        });
      }
    } catch (error) {
      console.error('Error fetching verses:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحميل البيانات');
      // Fallback data
      const selectedSurah = surahNames.find(s => s.id === surahNumber);
      setVerses([
        { numberInSurah: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
        { numberInSurah: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
        { numberInSurah: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ" },
        { numberInSurah: 4, text: "مَالِكِ يَوْمِ الدِّينِ" }
      ]);
      setSurahInfo({
        name: selectedSurah?.name || 'السورة',
        englishName: selectedSurah?.englishName || 'Surah',
        totalVerses: selectedSurah?.verses || 7,
        totalPages: 1,
        revelationType: 'Meccan'
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVerses(currentSurah, currentPage);
  }, [currentSurah, currentPage]);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && verses.length > 0) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    
    return () => stopAutoScroll();
  }, [autoScroll, scrollSpeed, verses]);

  const startAutoScroll = () => {
    stopAutoScroll();
    
    // Convert speed to milliseconds (1-100 to 20-120ms)
    const speedInterval = Math.max(20, 120 - scrollSpeed);
    
    scrollInterval.current = setInterval(() => {
      if (scrollViewRef.current) {
        scrollY.current += 2;
        
        scrollViewRef.current.scrollTo({
          y: scrollY.current,
          animated: false,
        });

        // Check if we need to go to next page
        if (scrollY.current > height * 1.5 && currentPage < (surahInfo?.totalPages || 1)) {
          handleNextPage();
        }
      }
    }, speedInterval);
    
    setIsScrolling(true);
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
    setIsScrolling(false);
  };

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  const handleScroll = (event) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      scrollY.current = 0;
      stopAutoScroll();
    }
  };

  const handleNextPage = () => {
    if (surahInfo && currentPage < surahInfo.totalPages) {
      setCurrentPage(currentPage + 1);
      scrollY.current = 0;
      stopAutoScroll();
    }
  };

  const handleSurahChange = (surahNumber) => {
    setCurrentSurah(surahNumber);
    setCurrentPage(1);
    setShowSurahList(false);
    scrollY.current = 0;
    stopAutoScroll();
  };

  const resetScroll = () => {
    scrollY.current = 0;
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    stopAutoScroll();
  };

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.surahItem,
        currentSurah === item.id && styles.selectedSurahItem
      ]}
      onPress={() => handleSurahChange(item.id)}
    >
      <View style={styles.surahItemContent}>
        <Text style={[
          styles.surahNumber,
          currentSurah === item.id && styles.selectedText
        ]}>
          {item.id}
        </Text>
        <View style={styles.surahTextContainer}>
          <Text style={[
            styles.surahNameArabic,
            currentSurah === item.id && styles.selectedText
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.surahNameEnglish,
            currentSurah === item.id && styles.selectedTextSmall
          ]}>
            {item.englishName} • {item.verses} آية
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVerse = (verse, index) => (
    <View key={verse.numberInSurah} style={styles.verseContainer}>
      <View style={styles.verseContent}>
        <Text style={[styles.verseText, { fontSize, lineHeight: fontSize * 2.2 }]}>
          {verse.text}
        </Text>
        <View style={styles.verseNumberContainer}>
          <Text style={styles.verseNumber}>{verse.numberInSurah}</Text>
        </View>
      </View>
      {index < verses.length - 1 && <View style={styles.verseSeparator} />}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#15803d" /> */}
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <BackButton />
            <Ionicons name="book" size={24} color="white" />
            <Text style={styles.headerTitle}>القرآن الكريم</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={() => setShowSettings(!showSettings)}
              style={styles.headerButton}
            >
              <Ionicons name="settings" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowSurahList(true)}
              style={styles.headerButton}
            >
              <Ionicons name="list" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={toggleAutoScroll}
              style={[styles.headerButton, autoScroll && styles.activeAutoScroll]}
            >
              <Ionicons 
                name={autoScroll ? 'pause' : 'play'} 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Auto Scroll Controls */}
        {autoScroll && (
          <View style={styles.autoScrollPanel}>
            <Text style={styles.autoScrollLabel}>AUTO SCROLL</Text>
            <View style={styles.speedContainer}>
              <Text style={styles.speedText}>Slow</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                value={scrollSpeed}
                onValueChange={setScrollSpeed}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#FFFFFF"
                thumbTintColor="#4CAF50"
              />
              <Text style={styles.speedText}>Fast</Text>
            </View>
          </View>
        )}

        {/* Surah Info Bar */}
        <View style={styles.surahInfoBar}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>{surahInfo?.name}</Text>
            <Text style={styles.infoSubtitle}>{surahInfo?.englishName}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoValue}>{currentPage}</Text>
            <Text style={styles.infoLabel}>الصفحة</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoValue}>{currentSurah}</Text>
            <Text style={styles.infoLabel}>سورة</Text>
          </View>
        </View>
      </View>

      {/* Settings Panel */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Text Size</Text>
            <View style={styles.fontControls}>
              <TouchableOpacity 
                onPress={() => setFontSize(Math.max(20, fontSize - 2))}
                style={styles.fontButton}
              >
                <Text style={styles.fontButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.fontSizeText}>{fontSize}</Text>
              <TouchableOpacity 
                onPress={() => setFontSize(Math.min(36, fontSize + 2))}
                style={styles.fontButton}
              >
                <Text style={styles.fontButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Main Content */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#15803d" />
            <Text style={styles.loadingText}>جاري التحميل...</Text>
          </View>
        ) : (
          <View style={styles.mainContent}>
            {/* Bismillah */}
            {currentPage === 1 && currentSurah !== 1 && currentSurah !== 9 && (
              <View style={styles.bismillahContainer}>
                <Text style={styles.bismillahText}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </Text>
              </View>
            )}

            {/* Verses */}
            <View style={styles.versesContainer}>
              {verses.map((verse, index) => renderVerse(verse, index))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={!surahInfo || currentPage >= surahInfo.totalPages}
          style={[
            styles.navButton,
            (!surahInfo || currentPage >= surahInfo.totalPages) && styles.navButtonDisabled
          ]}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageInfoMain}>
            الصفحة {currentPage} من {surahInfo?.totalPages || 1}
          </Text>
          <Text style={styles.pageInfoSub}>
            {surahInfo?.totalVerses} آية
          </Text>
          {autoScroll && (
            <TouchableOpacity onPress={resetScroll} style={styles.resetButton}>
              <Text style={styles.resetText}>إعادة</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={handlePreviousPage}
          disabled={currentPage <= 1}
          style={[
            styles.navButton,
            currentPage <= 1 && styles.navButtonDisabled
          ]}
        >
          <Text style={styles.navButtonText}>Previous</Text>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Surah List Modal */}
      <Modal
        visible={showSurahList}
        animationType="slide"
        onRequestClose={() => setShowSurahList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>All Surah</Text>
            <TouchableOpacity 
              onPress={() => setShowSurahList(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={surahNames}
            renderItem={renderSurahItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.surahList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#15803d',
    paddingTop: 10,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
  },
  activeAutoScroll: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  autoScrollPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  autoScrollLabel: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  speedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  speedText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 30,
  },
  slider: {
    flex: 1,
    height: 30,
  },
  surahInfoBar: {
    backgroundColor: '#166534',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoSection: {
    alignItems: 'center',
  },
  infoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  settingsPanel: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  fontButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  fontSizeText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  mainContent: {
    padding: 16,
  },
  bismillahContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bbf7d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bismillahText: {
    fontSize: 24,
    color: '#15803d',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ScheherazadeNew-Regular',
  },
  versesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  verseContainer: {
    marginVertical: 8,
  },
  verseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verseText: {
    flex: 1,
    color: '#1f2937',
    textAlign: 'right',
    paddingRight: 12,
    fontFamily: 'ScheherazadeNew-Regular', // Taj Company Quran font
  },
  verseNumberContainer: {
    backgroundColor: '#15803d',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verseSeparator: {
    height: 1,
    backgroundColor: '#bbf7d0',
    marginVertical: 12,
  },
  navigation: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  navButton: {
    backgroundColor: '#15803d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  pageInfo: {
    alignItems: 'center',
  },
  pageInfoMain: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  pageInfoSub: {
    fontSize: 12,
    color: '#6b7280',
  },
  resetButton: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  resetText: {
    fontSize: 10,
    color: '#374151',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  modalHeader: {
    backgroundColor: '#15803d',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  surahList: {
    flex: 1,
    padding: 16,
  },
  surahItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedSurahItem: {
    backgroundColor: '#15803d',
    borderColor: '#15803d',
  },
  surahItemContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  surahNumber: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginRight: 12,
  },
  surahTextContainer: {
    flex: 1,
  },
  surahNameArabic: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    fontFamily: 'ScheherazadeNew-Regular',
  },
  surahNameEnglish: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 2,
  },
  selectedText: {
    color: 'white',
  },
  selectedTextSmall: {
    color: 'rgba(255,255,255,0.8)',
  },
});

export default QuranReader;