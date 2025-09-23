// src/screens/QuranScreen.js
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../contexts/SettingsContext';
import { quranApi } from '../services/quranApi';
import SurahListItem from '../components/SurahListItem';
import JuzListItem from '../components/JuzListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Juz data with start and end surah/ayah information
const JUZ_DATA = [
  { number: 1, start: { surah: 1, ayah: 1 }, end: { surah: 2, ayah: 141 }, name: "Alif Lam Meem" },
  { number: 2, start: { surah: 2, ayah: 142 }, end: { surah: 2, ayah: 252 }, name: "Sayaqool" },
  { number: 3, start: { surah: 2, ayah: 253 }, end: { surah: 3, ayah: 92 }, name: "Tilkal Rusul" },
  { number: 4, start: { surah: 3, ayah: 93 }, end: { surah: 4, ayah: 23 }, name: "Lan Tana Loo" },
  { number: 5, start: { surah: 4, ayah: 24 }, end: { surah: 4, ayah: 147 }, name: "Wal Mohsanat" },
  { number: 6, start: { surah: 4, ayah: 148 }, end: { surah: 5, ayah: 81 }, name: "La Yuhibbullah" },
  { number: 7, start: { surah: 5, ayah: 82 }, end: { surah: 6, ayah: 110 }, name: "Wa Iza Sami'oo" },
  { number: 8, start: { surah: 6, ayah: 111 }, end: { surah: 7, ayah: 87 }, name: "Wa Lau Annana" },
  { number: 9, start: { surah: 7, ayah: 88 }, end: { surah: 8, ayah: 40 }, name: "Qalal Malao" },
  { number: 10, start: { surah: 8, ayah: 41 }, end: { surah: 9, ayah: 92 }, name: "Wa A'lamu" },
  { number: 11, start: { surah: 9, ayah: 93 }, end: { surah: 11, ayah: 5 }, name: "Yatazeroon" },
  { number: 12, start: { surah: 11, ayah: 6 }, end: { surah: 12, ayah: 52 }, name: "Wa Mamin Da'abat" },
  { number: 13, start: { surah: 12, ayah: 53 }, end: { surah: 14, ayah: 52 }, name: "Wa Ma Ubrioo" },
  { number: 14, start: { surah: 15, ayah: 1 }, end: { surah: 16, ayah: 128 }, name: "Rubama" },
  { number: 15, start: { surah: 17, ayah: 1 }, end: { surah: 18, ayah: 74 }, name: "Subhanallazi" },
  { number: 16, start: { surah: 18, ayah: 75 }, end: { surah: 20, ayah: 135 }, name: "Qal Alam" },
  { number: 17, start: { surah: 21, ayah: 1 }, end: { surah: 22, ayah: 78 }, name: "Aqtarabo" },
  { number: 18, start: { surah: 23, ayah: 1 }, end: { surah: 25, ayah: 20 }, name: "Qadd Aflaha" },
  { number: 19, start: { surah: 25, ayah: 21 }, end: { surah: 27, ayah: 55 }, name: "Wa Qalallazeena" },
  { number: 20, start: { surah: 27, ayah: 56 }, end: { surah: 29, ayah: 45 }, name: "A'man Khalaq" },
  { number: 21, start: { surah: 29, ayah: 46 }, end: { surah: 33, ayah: 30 }, name: "Utlu Ma Oohi" },
  { number: 22, start: { surah: 33, ayah: 31 }, end: { surah: 36, ayah: 27 }, name: "Wa Manyaqnut" },
  { number: 23, start: { surah: 36, ayah: 28 }, end: { surah: 39, ayah: 31 }, name: "Wa Mali" },
  { number: 24, start: { surah: 39, ayah: 32 }, end: { surah: 41, ayah: 46 }, name: "Faman Azlam" },
  { number: 25, start: { surah: 41, ayah: 47 }, end: { surah: 45, ayah: 37 }, name: "Elahe Yuruddo" },
  { number: 26, start: { surah: 46, ayah: 1 }, end: { surah: 51, ayah: 30 }, name: "Ha'a Meem" },
  { number: 27, start: { surah: 51, ayah: 31 }, end: { surah: 57, ayah: 29 }, name: "Qal Fama Khatbukum" },
  { number: 28, start: { surah: 58, ayah: 1 }, end: { surah: 66, ayah: 12 }, name: "Qad Sami Allah" },
  { number: 29, start: { surah: 67, ayah: 1 }, end: { surah: 77, ayah: 50 }, name: "Tabarakallazi" },
  { number: 30, start: { surah: 78, ayah: 1 }, end: { surah: 114, ayah: 6 }, name: "Amma Yatasa'aloon" }
];

export default function QuranScreen() {
  const [viewMode, setViewMode] = useState('surahs'); // 'surahs' or 'juz'
  const { data: surahs, isLoading } = useQuery({
    queryKey: ['surahs'],
    queryFn: () => quranApi.getSurahs().then(res => res.data.data)
  });

  const renderSurahItem = ({ item }) => (
    <SurahListItem surah={item} />
  );

  const renderJuzItem = ({ item }) => (
    <JuzListItem juz={item} />
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading Quran...</Text>
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
      <View style={styles.header}>
        <Text style={styles.title}>The Holy Quran</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, viewMode === 'surahs' && styles.activeFilter]}
            onPress={() => setViewMode('surahs')}
          >
            <Text style={[styles.filterText, viewMode === 'surahs' && styles.activeFilterText]}>
              Surahs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, viewMode === 'juz' && styles.activeFilter]}
            onPress={() => setViewMode('juz')}
          >
            <Text style={[styles.filterText, viewMode === 'juz' && styles.activeFilterText]}>
              Juz (Siparah)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'surahs' ? (
        <FlatList
          data={surahs}
          keyExtractor={item => item.number.toString()}
          renderItem={renderSurahItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          data={JUZ_DATA}
          keyExtractor={item => item.number.toString()}
          renderItem={renderJuzItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: { flex: 1, },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8fafc'
  },
  header: { 
    padding: 16, 
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#16a34a', 
    marginBottom: 12,
    textAlign: 'center'
  },
  filterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center',
    marginBottom: 8 
  },
  filterButton: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    marginHorizontal: 8,
    backgroundColor: '#e2e8f0',
    minWidth: 100,
    alignItems: 'center'
  },
  activeFilter: { 
    backgroundColor: '#16a34a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: { 
    color: '#64748b',
    fontWeight: '500'
  },
  activeFilterText: { 
    color: 'white',
    fontWeight: '600'
  },
  listContainer: { 
    padding: 8,
    paddingBottom: 20
  }
});