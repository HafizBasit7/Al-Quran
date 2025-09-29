// src/screens/QuranPdf.js
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { quranPages, siparaData, pageNumbers } from "../data/quranImages";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function QuranPdf({ route, navigation }) {
  // Get initial page from navigation params, default to 0 if not provided
  const initialPageFromParams = route.params?.initialPage || 0;
  const siparaNumberFromParams = route.params?.siparaNumber || 1;
  
  const [currentPage, setCurrentPage] = useState(initialPageFromParams);
  const [selectedSipara, setSelectedSipara] = useState(siparaNumberFromParams);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const flatListRef = useRef(null);

  // Effect to handle initial page when component mounts
  useEffect(() => {
    if (flatListRef.current && initialPageFromParams > 0) {
      setTimeout(() => {
        const targetIndex = quranPages.length - 1 - initialPageFromParams;
        flatListRef.current?.scrollToIndex({
          index: targetIndex,
          animated: false,
          viewPosition: 0.5
        });
      }, 100);
    }
  }, [initialPageFromParams]);

  // Memoized page data - REVERSED for right-to-left movement
  const pageData = useMemo(() => 
    [...quranPages].reverse().map((source, index) => ({
      id: index,
      source,
      pageNumber: index + 1,
      actualPage: quranPages.length - index,
    })), []
  );

  // Get current sipara info
  const currentSipara = useMemo(() => {
    return siparaData.find(sipara => 
      currentPage + 1 >= sipara.startPage && currentPage + 1 <= sipara.endPage
    ) || siparaData[0];
  }, [currentPage]);

  // Handle scroll events for RIGHT TO LEFT movement
  const onMomentumScrollEnd = useCallback((event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex >= 0 && newIndex < quranPages.length) {
      setCurrentPage(quranPages.length - 1 - newIndex);
    }
  }, [quranPages.length]);

  // Handle image load
  const handleImageLoad = useCallback((pageId) => {
    setImageLoading(prev => ({ ...prev, [pageId]: false }));
  }, []);

  const handleImageLoadStart = useCallback((pageId) => {
    setImageLoading(prev => ({ ...prev, [pageId]: true }));
  }, []);

  // Go to next page - MOVES LEFT
  const goToNextPage = useCallback(() => {
    if (currentPage < quranPages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const targetIndex = quranPages.length - 1 - nextPage;
      flatListRef.current?.scrollToIndex({ 
        index: targetIndex, 
        animated: true 
      });
    }
  }, [currentPage, quranPages.length]);

  // Go to previous page - MOVES RIGHT
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const targetIndex = quranPages.length - 1 - prevPage;
      flatListRef.current?.scrollToIndex({ 
        index: targetIndex, 
        animated: true 
      });
    }
  }, [currentPage]);

  // Jump to specific Sipara
  const jumpToSipara = useCallback((siparaNumber) => {
    const sipara = siparaData.find(s => s.number === siparaNumber);
    if (sipara) {
      const pageIndex = sipara.startPage - 1;
      setSelectedSipara(siparaNumber);
      setCurrentPage(pageIndex);
      const targetIndex = quranPages.length - 1 - pageIndex;
      
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: targetIndex,
          animated: true,
          viewPosition: 0.5
        });
      }
      setShowJumpModal(false);
    }
  }, []);

  // Jump to specific page
  const jumpToPage = useCallback((pageNumber) => {
    const pageIndex = pageNumber - 1;
    setCurrentPage(pageIndex);
    const targetIndex = quranPages.length - 1 - pageIndex;
    
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0.5
      });
    }
    setShowJumpModal(false);
  }, []);

  // Render each page - FULL SCREEN with RTL swipe
  const renderPage = useCallback(({ item }) => (
    <View style={styles.pageContainer}>
      {imageLoading[item.id] && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading page {item.actualPage}</Text>
        </View>
      )}
      <Image
        source={item.source}
        style={styles.pageImage}
        resizeMode="contain"
        onLoadStart={() => handleImageLoadStart(item.id)}
        onLoadEnd={() => handleImageLoad(item.id)}
      />
      
      {/* Page Info Overlay */}
      <View style={styles.pageInfoOverlay}>
        <Text style={styles.pageNumberText}>Page {item.actualPage}</Text>
        <Text style={styles.siparaInfoText}>
          Sipara {currentSipara.number}: {currentSipara.name}
        </Text>
      </View>

      {/* Touch areas for navigation - LEFT SIDE FOR NEXT, RIGHT SIDE FOR PREVIOUS */}
      <TouchableOpacity 
        style={styles.leftTouchArea}
        onPress={goToNextPage}
        activeOpacity={0.7}
      />
      <TouchableOpacity 
        style={styles.rightTouchArea}
        onPress={goToPreviousPage}
        activeOpacity={0.7}
      />
    </View>
  ), [imageLoading, currentSipara, goToNextPage, goToPreviousPage]);

  // Enhanced Sipara Selector
  const SiparaSelector = useCallback(() => (
    <LinearGradient
      colors={['#16a34a', '#0d9488']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.selectorHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.selectorLabel}>
            Sipara {currentSipara.number}: {currentSipara.name}
          </Text>
          <Text style={styles.pageInfo}>
            Page {currentPage + 1} of {quranPages.length}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.jumpButton}
          onPress={() => setShowJumpModal(true)}
        >
          <Text style={styles.jumpButtonText}>📖 Jump</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  ), [currentSipara, currentPage]);

  // Enhanced Jump Modal with better Sipara display
  const JumpModal = useCallback(() => (
    <Modal
      visible={showJumpModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowJumpModal(false)}
    >
      <LinearGradient
        colors={['#16a34a', '#0d9488']}
        style={styles.modalContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Navigate Quran</Text>
          <TouchableOpacity 
            onPress={() => setShowJumpModal(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalScrollView}>
          {/* Sipara Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sipara (Para)</Text>
            <View style={styles.siparaGrid}>
              {siparaData.map(sipara => (
                <TouchableOpacity
                  key={sipara.number}
                  style={[
                    styles.siparaCard,
                    currentSipara.number === sipara.number && styles.activeSiparaCard
                  ]}
                  onPress={() => jumpToSipara(sipara.number)}
                >
                  <Text style={styles.siparaNumber}>{sipara.number}</Text>
                  <Text style={styles.siparaName} numberOfLines={2}>
                    {sipara.name}
                  </Text>
                  <Text style={styles.siparaPages}>
                    Pages {sipara.startPage}-{sipara.endPage}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Page Jump */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Page Jump</Text>
            <View style={styles.quickJumpRow}>
              {[1, 2, 3, 4, 5].map(num => (
                <TouchableOpacity
                  key={num}
                  style={styles.quickJumpButton}
                  onPress={() => jumpToPage(num)}
                >
                  <Text style={styles.quickJumpText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.quickJumpButton}
                onPress={() => jumpToPage(550)}
              >
                <Text style={styles.quickJumpText}>550</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Current Position */}
          <View style={styles.currentPosition}>
            <Text style={styles.currentPositionText}>
              Current: Page {currentPage + 1} • Sipara {currentSipara.number}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </Modal>
  ), [showJumpModal, currentPage, currentSipara]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" hidden={false} />
      
      <SiparaSelector />

      {/* Show message if no images */}
      {quranPages.length === 0 ? (
        <View style={styles.noImagesContainer}>
          <Text style={styles.noImagesText}>Loading Quran Pages</Text>
          <ActivityIndicator size="large" color="#16a34a" style={styles.loadingIndicator} />
          <Text style={styles.noImagesSubtext}>Images will be displayed soon</Text>
        </View>
      ) : (
        <>
          {/* Quran Pages - HORIZONTAL SWIPE RIGHT TO LEFT */}
          <FlatList
            ref={flatListRef}
            data={pageData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPage}
            pagingEnabled
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumScrollEnd}
            initialScrollIndex={quranPages.length - 1 - initialPageFromParams}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            maxToRenderPerBatch={3}
            windowSize={5}
            decelerationRate="fast"
            snapToInterval={width}
            snapToAlignment="center"
          />

          {/* Page Indicator */}
          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              {currentPage + 1} / {quranPages.length}
            </Text>
          </View>
        </>
      )}

      <JumpModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8fafc"
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 35,
    paddingBottom: 15,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  selectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    flex: 1,
  },
  selectorLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  pageInfo: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  jumpButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  jumpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pageContainer: {
    width: width,
    height: height,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    position: "absolute",
    zIndex: 1,
    alignItems: "center",
    backgroundColor: 'rgba(22, 163, 74, 0.8)',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 14,
  },
  pageImage: {
    width: width,
    height: height,
  },
  pageInfoOverlay: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  pageNumberText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  siparaInfoText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  // Touch areas - LEFT SIDE MOVES TO NEXT PAGE (LEFT), RIGHT SIDE MOVES TO PREVIOUS PAGE (RIGHT)
  leftTouchArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width / 3,
  },
  rightTouchArea: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width / 3,
  },
  pageIndicator: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  pageIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    marginTop: 40,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalScrollView: {
    flex: 1,
  },
  section: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  siparaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  siparaCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 15,
    borderRadius: 12,
    width: (width - 50) / 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeSiparaCard: {
    borderColor: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  siparaNumber: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  siparaName: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
  },
  siparaPages: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
  },
  quickJumpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickJumpButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  quickJumpText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  currentPosition: {
    backgroundColor: "rgba(255,255,255,0.15)",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  currentPositionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  noImagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#000',
  },
  noImagesText: {
    color: "#16a34a",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  noImagesSubtext: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});