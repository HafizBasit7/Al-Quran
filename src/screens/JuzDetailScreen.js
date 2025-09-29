// src/screens/JuzDetailScreen.js
import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Animated } from 'react-native';
import Slider from '@react-native-community/slider';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../contexts/SettingsContext';
import { quranApi } from '../services/quranApi';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';

const { width, height } = Dimensions.get('window');
const VERSES_PER_PAGE = 15;

export default function JuzDetailScreen({ route, navigation }) {
  const { juzNumber, juzName, startSurah, startAyah, endSurah, endAyah, } = route.params;
  const [showTranslation, setShowTranslation] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(50); // pixels per second
  const [showSettings, setShowSettings] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollHeight, setMaxScrollHeight] = useState(0);
  
  const scrollViewRef = useRef();
  const scrollInterval = useRef();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { translationLang, fontSize, addBookmark, removeBookmark, bookmarks } = useSettings();

  // Fetch all verses for the juz with proper translation handling
  const { data: verses, isLoading, error } = useQuery({
    queryKey: ['juz', juzNumber, translationLang],
    queryFn: async () => {
      const allVerses = [];
      
      // Fetch verses from each surah in the juz
      for (let surah = startSurah; surah <= endSurah; surah++) {
        const startVerse = surah === startSurah ? startAyah : 1;
        const endVerse = surah === endSurah ? endAyah : 999; // Large number to get all verses
        
        try {
          const [arabicResponse, translationResponse] = await Promise.all([
            quranApi.getSurahArabic(surah),
            quranApi.getSurahTranslation(surah, translationLang)
          ]);
          
          const arabicVerses = arabicResponse.data.data.ayahs;
          const translationVerses = translationResponse.data.data.ayahs;
          
          // Add verses for this surah within the juz range
          for (let i = startVerse - 1; i < Math.min(endVerse, arabicVerses.length); i++) {
            if (arabicVerses[i]) {
              allVerses.push({
                ...arabicVerses[i],
                translation: translationVerses[i]?.text || 'Translation not available',
                surahNumber: surah
              });
            }
          }
        } catch (err) {
          console.error(`Error fetching surah ${surah}:`, err);
        }
      }
      
      return allVerses;
    },
    enabled: !!startSurah && !!endSurah // Only run if we have valid surah range
  });

  const totalPages = verses ? Math.ceil(verses.length / VERSES_PER_PAGE) : 0;
  const versePages = verses ? 
    Array.from({ length: totalPages }, (_, i) => 
      verses.slice(i * VERSES_PER_PAGE, (i + 1) * VERSES_PER_PAGE)
    ) : [];

  // Auto-scroll functionality with proper implementation
  useEffect(() => {
    if (autoScroll && maxScrollHeight > 0) {
      let currentScroll = scrollPosition;
      const scrollStep = scrollSpeed / 10; // Adjust for 100ms interval
      
      scrollInterval.current = setInterval(() => {
        currentScroll += scrollStep;
        
        if (currentScroll >= maxScrollHeight) {
          // Reached bottom, go to next page or stop
          if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
            currentScroll = 0;
          } else {
            setAutoScroll(false); // Stop at last page
          }
        } else {
          scrollViewRef.current?.scrollTo({ y: currentScroll, animated: false });
          setScrollPosition(currentScroll);
        }
      }, 100);
    } else {
      clearInterval(scrollInterval.current);
    }

    return () => clearInterval(scrollInterval.current);
  }, [autoScroll, scrollSpeed, maxScrollHeight, currentPage, totalPages]);

  // Reset scroll position when page changes
  useEffect(() => {
    if (scrollViewRef.current && versePages[currentPage]?.length > 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
        setScrollPosition(0);
      }, 100);
    }
  }, [currentPage]);

  // Calculate max scroll height based on content
  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setMaxScrollHeight(contentHeight - height + 100); // Account for header/footer
  };

  // Hide controls after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showControls]);

  const toggleTranslation = () => setShowTranslation(!showTranslation);
  const toggleAutoScroll = () => setAutoScroll(!autoScroll);
  const toggleSettings = () => setShowSettings(!showSettings);

  const goToPage = (page) => {
    setCurrentPage(page);
    setScrollPosition(0);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  const handleBookmarkAyah = (ayah) => {
    const bookmarkId = `ayah-${ayah.number}`;
    const isBookmarked = bookmarks.some(b => b.id === bookmarkId);
    
    if (isBookmarked) {
      removeBookmark(bookmarkId);
    } else {
      addBookmark({
        id: bookmarkId,
        type: 'ayah',
        surahNumber: ayah.surahNumber,
        verseNumber: ayah.numberInSurah,
        text: ayah.text,
        translation: ayah.translation,
        timestamp: new Date().toISOString()
      });
    }
  };

  const isAyahBookmarked = (ayahNumber) => {
    return bookmarks.some(b => b.id === `ayah-${ayahNumber}`);
  };

  const handleScroll = (event) => {
    const currentScroll = event.nativeEvent.contentOffset.y;
    setScrollPosition(currentScroll);
    setShowControls(true);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading Juz {juzNumber}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading juz</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }
  

  return (
    <LinearGradient
    colors={['#0d9488', '#059669', '#047857']}
    locations={[0, 0.5, 1]}
    style={styles.gradient}
  >
    <SafeAreaView style={styles.container}>
      {/* Juz Page Content */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        onTouchStart={() => setShowControls(true)}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        showsVerticalScrollIndicator={false}
      >
        {/* Juz Header */}
        <View style={styles.back}>
          <BackButton />
          </View>
        <View style={styles.pageHeader}>
          <Text style={styles.juzNumber}>Juz {juzNumber}</Text>
          {/* <Text style={styles.juzNameArabic}>{juzName}</Text> */}
          <Text style={styles.juzInfo}>
            Page {currentPage + 1} of {totalPages}
          </Text>
        </View>

        <View style={styles.bismillahContainer}>
                <Text style={styles.bismillahText}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </Text>
              </View>

        

        {/* Verses for current page */}
        {versePages[currentPage]?.map((ayah) => (
          <View 
            key={ayah.number} 
            style={styles.verseContainer}
          >
            <View style={styles.verseHeader}>
              <View style={styles.verseNumberContainer}>
                <Text style={styles.verseNumber}>{ayah.numberInSurah}</Text>
              </View>
              
              <Text style={styles.surahName}>
                Surah {ayah.surahNumber}
              </Text>
              
              {/* <TouchableOpacity 
                onPress={() => handleBookmarkAyah(ayah)}
                style={styles.bookmarkButton}
              >
                <Ionicons 
                  name={isAyahBookmarked(ayah.number) ? 'bookmark' : 'bookmark-outline'} 
                  size={20} 
                  color={isAyahBookmarked(ayah.number) ? '#16a34a' : '#64748b'} 
                />
              </TouchableOpacity> */}
            </View>

            <Text selectable={true} style={[styles.arabicText, { fontSize: fontSize + 8, lineHeight: (fontSize + 8) * 2 }]}>
              {ayah.text}
            </Text>
            
            {showTranslation && ayah.translation && (
              <Text style={[styles.translationText, { fontSize, lineHeight: fontSize * 1.6 }]}>
                {ayah.translation}
              </Text>
            )}
          </View>
        ))}

        {/* Page Footer */}
        <View style={styles.pageFooter}>
          <Text style={styles.pageNumber}>
            Juz {juzNumber} • Page {currentPage + 1} of {totalPages}
          </Text>
          {autoScroll && (
            <Text style={styles.autoScrollInfo}>
              Auto-scroll: {scrollSpeed}px/s
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Navigation Controls */}
      {showControls && (
        <View style={styles.navigationControls}>
          <TouchableOpacity onPress={prevPage} disabled={currentPage === 0} style={styles.navButton}>
            <Ionicons 
              name="chevron-back" 
              size={28} 
              color={currentPage === 0 ? '#ccc' : '#16a34a'} 
            />
            <Text style={[styles.navText, currentPage === 0 && styles.disabledText]}>
              Previous
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>
            {currentPage + 1} / {totalPages}
          </Text>

          <TouchableOpacity onPress={nextPage} disabled={currentPage === totalPages - 1} style={styles.navButton}>
            <Text style={[styles.navText, currentPage === totalPages - 1 && styles.disabledText]}>
              Next
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={28} 
              color={currentPage === totalPages - 1 ? '#ccc' : '#16a34a'} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Action Controls */}
      {showControls && (
        <View style={styles.controlsContainer}>
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={toggleTranslation} style={styles.actionButton}>
              <Ionicons 
                name={showTranslation ? 'eye-off' : 'eye'} 
                size={24} 
                color="#16a34a" 
              />
              <Text style={styles.actionText}>
                {showTranslation ? 'Hide Trans' : 'Show Trans'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleAutoScroll} style={styles.actionButton}>
              <Ionicons 
                name={autoScroll ? 'pause' : 'play'} 
                size={24} 
                color={autoScroll ? '#dc2626' : '#16a34a'} 
              />
              <Text style={styles.actionText}>
                {autoScroll ? 'Pause' : 'Auto'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleSettings} style={styles.actionButton}>
              <Ionicons name="settings" size={24} color="#16a34a" />
              <Text style={styles.actionText}>Speed</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Speed Settings Modal */}
      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Auto-Scroll Settings</Text>
            
            <View style={styles.speedControl}>
              <Text style={styles.speedLabel}>Scroll Speed: {scrollSpeed}px/s</Text>
              <Slider
                value={scrollSpeed}
                onValueChange={setScrollSpeed}
                minimumValue={10}
                maximumValue={200}
                step={10}
                minimumTrackTintColor="#16a34a"
                maximumTrackTintColor="#d1d5db"
                thumbTintColor="#16a34a"
                style={styles.slider}
              />
              
              <View style={styles.speedPresets}>
                <TouchableOpacity onPress={() => setScrollSpeed(30)} style={styles.presetButton}>
                  <Text style={styles.presetText}>Slow</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setScrollSpeed(50)} style={styles.presetButton}>
                  <Text style={styles.presetText}>Medium</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setScrollSpeed(100)} style={styles.presetButton}>
                  <Text style={styles.presetText}>Fast</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={toggleSettings} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Apply Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  container: {
    flex: 1,
    // backgroundColor: '#f8f6f0',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    marginBottom: 10,
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageHeader: {
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
    backgroundColor: 'rgba(22, 163, 74, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
  },
  juzNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  juzNameArabic: {
    fontSize: 38,
    fontFamily: 'ScheherazadeNew-Regular',
    color: '#2c5530',
    marginBottom: 8,
    textAlign: 'center',
  },
  juzInfo: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
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
  verseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  verseNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  surahName: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  bookmarkButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  arabicText: {
    textAlign: 'right',
    color: '#2c5530',
    marginBottom: 16,
    fontFamily: 'ScheherazadeNew-Regular',
    lineHeight: 48,
  },
  translationText: {
    color: '#4b5563',
    lineHeight: 24,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    fontSize: 16,
  },
  pageFooter: {
    alignItems: 'center',
    marginTop: 24,
    padding: 20,
    backgroundColor: 'rgba(22, 163, 74, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.1)',
  },
  pageNumber: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  autoScrollInfo: {
    fontSize: 14,
    color: '#16a34a',
    marginTop: 8,
    fontStyle: 'italic',
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    minWidth: 100,
    justifyContent: 'center',
  },
  navText: {
    color: '#16a34a',
    fontWeight: '600',
    marginHorizontal: 8,
  },
  disabledText: {
    color: '#ccc',
  },
  pageIndicator: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controlsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 4,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 24,
    textAlign: 'center',
  },
  speedControl: {
    marginBottom: 24,
  },
  speedLabel: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  speedPresets: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  presetButton: {
    padding: 12,
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  presetText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});