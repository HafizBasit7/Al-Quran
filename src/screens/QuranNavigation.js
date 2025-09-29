// src/screens/QuranNavigation.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { surahData } from "../data/surahData";
import { siparaData } from "../data/quranImages";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Memoized list items for better performance
const SurahItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity
    style={styles.itemCard}
    onPress={onPress}
  >
    <View style={styles.itemNumber}>
      <Text style={styles.itemNumberText}>{item.number}</Text>
    </View>
    <View style={styles.itemInfo}>
      <Text style={styles.arabicName}>{item.name}</Text>
      <Text style={styles.englishName}>{item.englishName}</Text>
      <Text style={styles.translation}>{item.translation}</Text>
    </View>
    <View style={styles.itemMeta}>
      <Text style={styles.pagesInfo}>{item.pages} pages</Text>
      <Text style={styles.pagesRange}>pp. {item.pageStart}-{item.pageEnd}</Text>
    </View>
  </TouchableOpacity>
));

const SiparaItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity
    style={styles.itemCard}
    onPress={onPress}
  >
    <View style={styles.itemNumber}>
      <Text style={styles.itemNumberText}>{item.number}</Text>
    </View>
    <View style={styles.itemInfo}>
      <Text style={styles.arabicName}>{item.name}</Text>
      <Text style={styles.siparaPages}>
        من الصفحة {item.startPage} إلى {item.endPage}
      </Text>
    </View>
    <View style={styles.itemMeta}>
      <Text style={styles.pagesInfo}>
        {item.endPage - item.startPage + 1} pages
      </Text>
    </View>
  </TouchableOpacity>
));

export default function QuranNavigation({ navigation }) {
  const [activeTab, setActiveTab] = useState("surah"); // "surah" or "sipara"

  // Memoize data arrays to prevent unnecessary re-renders
  const surahList = useMemo(() => surahData, []);
  const siparaList = useMemo(() => siparaData, []);

  const navigateToSurah = (surah) => {
    navigation.navigate("SurahReader", { 
      surahNumber: surah.number,
      surahName: surah.name,
      englishName: surah.englishName,
      pageStart: surah.pageStart,
      pageEnd: surah.pageEnd
    });
  };

  const navigateToSipara = (sipara) => {
    navigation.navigate("QuranPdf", { 
      initialPage: sipara.startPage - 1,
      siparaNumber: sipara.number
    });
  };

  const renderSurahItem = ({ item }) => (
    <SurahItem 
      item={item} 
      onPress={() => navigateToSurah(item)} 
    />
  );

  const renderSiparaItem = ({ item }) => (
    <SiparaItem 
      item={item} 
      onPress={() => navigateToSipara(item)} 
    />
  );

  const ListHeader = () => (
    <Text style={styles.sectionTitle}>
      {activeTab === "surah" ? "سور القرآن الكريم" : "أجزاء القرآن الكريم"}
    </Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#16a34a', '#0d9488']}
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

        <Text style={styles.headerTitle}>القرآن الكريم</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "surah" && styles.activeTab]}
          onPress={() => setActiveTab("surah")}
        >
          <Text style={[styles.tabText, activeTab === "surah" && styles.activeTabText]}>
            السور
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "sipara" && styles.activeTab]}
          onPress={() => setActiveTab("sipara")}
        >
          <Text style={[styles.tabText, activeTab === "sipara" && styles.activeTabText]}>
            الأجزاء
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content with key to force clean re-render */}
      <View style={styles.content} key={activeTab}>
        {activeTab === "surah" ? (
          <FlatList
            data={surahList}
            renderItem={renderSurahItem}
            keyExtractor={(item) => `surah-${item.number}`}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.listContainer}
            initialNumToRender={15}
            maxToRenderPerBatch={20}
            windowSize={10}
            removeClippedSubviews={true}
          />
        ) : (
          <FlatList
            data={siparaList}
            renderItem={renderSiparaItem}
            keyExtractor={(item) => `sipara-${item.number}`}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeader}
            contentContainerStyle={styles.listContainer}
            initialNumToRender={10}
            maxToRenderPerBatch={15}
            windowSize={10}
            removeClippedSubviews={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    flexDirection: "row"
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
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    justifyContent: "center",
    marginLeft: 40
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(22, 163, 74, 0.1)",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: "rgba(22, 163, 74, 0.2)",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#16a34a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    color: "#16a34a",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    marginTop: 15,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  sectionTitle: {
    color: "#16a34a",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    marginBottom: 25,
  },
  itemCard: {
    backgroundColor: "rgba(22, 163, 74, 0.08)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  itemNumber: {
    backgroundColor: "#16a34a",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  itemNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemInfo: {
    flex: 1,
  },
  arabicName: {
    color: "#1e293b",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "right",
  },
  englishName: {
    color: "#16a34a",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  translation: {
    color: "#64748b",
    fontSize: 12,
    fontStyle: "italic",
  },
  siparaPages: {
    color: "#16a34a",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  itemMeta: {
    alignItems: "flex-end",
  },
  pagesInfo: {
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "rgba(22, 163, 74, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pagesRange: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 4,
  },
});