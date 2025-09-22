// src/components/QuickBookmarks.js
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function QuickBookmarks({ bookmarks }) {
  const navigation = useNavigation();
  
  if (!bookmarks || bookmarks.length === 0) return null;

  const handleBookmarkPress = (bookmark) => {
    if (bookmark.type === 'surah') {
      navigation.navigate('SurahDetail', { surahNumber: bookmark.number });
    } else if (bookmark.type === 'ayah') {
      navigation.navigate('SurahDetail', { 
        surahNumber: bookmark.surahNumber,
        highlightAyah: bookmark.verseNumber
      });
    }
  };

  const renderBookmarkItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookmarkItem}
      onPress={() => handleBookmarkPress(item)}
    >
      <Ionicons name="bookmark" size={20} color="#16a34a" />
      <View style={styles.bookmarkInfo}>
        <Text style={styles.bookmarkName} numberOfLines={1}>
          {item.name || `Ayah ${item.verseNumber}`}
        </Text>
        <Text style={styles.bookmarkType}>{item.type}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#64748b" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Bookmarks</Text>
      <FlatList
        data={bookmarks.slice(0, 3)} // Show only 3 most recent
        keyExtractor={item => item.id}
        renderItem={renderBookmarkItem}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 12,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  bookmarkInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookmarkName: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  bookmarkType: {
    fontSize: 14,
    color: '#64748b',
    textTransform: 'capitalize',
  },
});