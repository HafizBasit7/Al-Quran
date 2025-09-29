// src/screens/SurahReader.js
import React, { useState, useRef, useCallback, useMemo } from "react";
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
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { getSurahImages } from "../data/surahData";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function SurahReader({ route, navigation }) {
  const { surahNumber, surahName, englishName, pageStart, pageEnd } = route.params;
  const [currentPage, setCurrentPage] = useState(0);
  const [imageLoading, setImageLoading] = useState({});
  const flatListRef = useRef(null);

  // Get surah images from existing page images
  const surahImages = useMemo(() => 
    getSurahImages(surahNumber), [surahNumber]
  );

  // Memoized page data - REVERSED for right-to-left movement
  const pageData = useMemo(() => 
    [...surahImages].reverse().map((source, index) => ({
      id: index,
      source,
      pageNumber: pageStart + (surahImages.length - 1 - index),
      actualPage: index + 1,
    })), [surahImages, pageStart]
  );

  // Handle scroll events for RIGHT TO LEFT movement
  const onMomentumScrollEnd = useCallback((event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex >= 0 && newIndex < surahImages.length) {
      setCurrentPage(surahImages.length - 1 - newIndex);
    }
  }, [surahImages.length]);

  // Handle image load
  const handleImageLoad = useCallback((pageId) => {
    setImageLoading(prev => ({ ...prev, [pageId]: false }));
  }, []);

  const handleImageLoadStart = useCallback((pageId) => {
    setImageLoading(prev => ({ ...prev, [pageId]: true }));
  }, []);

  // Go to next page - MOVES LEFT
  const goToNextPage = useCallback(() => {
    if (currentPage < surahImages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const targetIndex = surahImages.length - 1 - nextPage;
      flatListRef.current?.scrollToIndex({ 
        index: targetIndex, 
        animated: true 
      });
    }
  }, [currentPage, surahImages.length]);

  // Go to previous page - MOVES RIGHT
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const targetIndex = surahImages.length - 1 - prevPage;
      flatListRef.current?.scrollToIndex({ 
        index: targetIndex, 
        animated: true 
      });
    }
  }, [currentPage]);

  // Render each page
  const renderPage = useCallback(({ item }) => (
    <View style={styles.pageContainer}>
      {imageLoading[item.id] && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading page {item.pageNumber}</Text>
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
        <Text style={styles.pageNumberText}>Page {item.pageNumber}</Text>
        <Text style={styles.surahInfoText}>
          {surahName} - {currentPage + 1} of {surahImages.length}
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
  ), [imageLoading, surahImages.length, surahName, currentPage, goToNextPage, goToPreviousPage]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor="#000" barStyle="light-content" hidden={false} /> */}
      
      {/* Header */}
      <LinearGradient
        colors={['rgba(22, 163, 74, 0.9)', 'rgba(13, 148, 136, 0.9)']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.surahName}>{surahName}</Text>
          <Text style={styles.englishName}>{englishName}</Text>
        </View>
        <View style={styles.pageInfo}>
          <Text style={styles.currentPage}>
            {currentPage + 1}/{surahImages.length}
          </Text>
        </View>
      </LinearGradient>

      {/* Show message if no images */}
      {surahImages.length === 0 ? (
        <View style={styles.noImagesContainer}>
          <Text style={styles.noImagesText}>Loading Surah {surahName}</Text>
          <ActivityIndicator size="large" color="#16a34a" style={styles.loadingIndicator} />
          <Text style={styles.noImagesSubtext}>Images will be displayed soon</Text>
        </View>
      ) : (
        <>
          {/* Quran Pages - REVERSED FOR RIGHT TO LEFT MOVEMENT */}
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
            initialScrollIndex={surahImages.length - 1} // Start from the "end" which is actually page 1
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
              {currentPage + 1} / {surahImages.length}
            </Text>
          </View>

          {/* Navigation Dots */}
          {/* <View style={styles.dotsContainer}>
            {surahImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentPage && styles.activeDot
                ]}
              />
            ))}
          </View> */}
        </>
      )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  titleContainer: {
    alignItems: "center",
    flex: 1,
  },
  surahName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  englishName: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  pageInfo: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  currentPage: {
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
  surahInfoText: {
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
  dotsContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#16a34a',
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