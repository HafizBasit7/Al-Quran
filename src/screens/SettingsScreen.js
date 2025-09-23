// src/screens/SettingsScreen.js
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Modal, FlatList, ActivityIndicator, Image } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '../services/quranApi';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const translationOptions = [
  { value: 'en', label: 'English', icon: 'language' },
  { value: 'ur', label: 'Urdu', icon: 'language' },
  { value: 'ar', label: 'Arabic Tafseer', icon: 'language' }
];

export default function SettingsScreen() {
  const { 
    theme, 
    fontSize, 
    translationLang, 
    reciter, 
    saveTheme, 
    saveFontSize, 
    saveTranslation, 
    saveReciter 
  } = useSettings();

  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  const { data: reciters, isLoading: isLoadingReciters, error: recitersError } = useQuery({
    queryKey: ['reciters'],
    queryFn: () => quranApi.getReciters()
  });

  const handleThemeToggle = () => {
    saveTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleFontSizeChange = (newSize) => {
    setCurrentFontSize(newSize);
    saveFontSize(newSize);
  };

  const handleReciterSelect = (selectedReciter) => {
    console.log('Selected reciter:', selectedReciter.identifier);
    saveReciter(selectedReciter.identifier);
    setShowReciterModal(false);
  };

  const handleTranslationSelect = (lang) => {
    saveTranslation(lang);
    setShowTranslationModal(false);
  };

  const getCurrentReciterName = () => {
    if (!reciters || !reciter) return 'Alafasy';
    const foundReciter = reciters.find(r => r.identifier === reciter);
    return foundReciter ? foundReciter.englishName : 'Alafasy';
  };

  const getCurrentReciter = () => {
    if (!reciters || !reciter) return null;
    return reciters.find(r => r.identifier === reciter);
  };

  const renderReciterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        reciter === item.identifier && styles.selectedModalItem
      ]}
      onPress={() => handleReciterSelect(item)}
    >
      <View style={styles.modalItemContent}>
        <Text style={[
          styles.modalItemText,
          reciter === item.identifier && styles.selectedModalItemText
        ]}>
          {item.englishName}
        </Text>
        <Text style={styles.modalItemSubtext}>
          {item.identifier}
        </Text>
      </View>
      {reciter === item.identifier && (
        <Ionicons name="checkmark" size={20} color="#16a34a" />
      )}
    </TouchableOpacity>
  );

  const renderTranslationModalItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        translationLang === item.value && styles.selectedModalItem
      ]}
      onPress={() => handleTranslationSelect(item.value)}
    >
      <Text style={[
        styles.modalItemText,
        translationLang === item.value && styles.selectedModalItemText
      ]}>
        {item.label}
      </Text>
      {translationLang === item.value && (
        <Ionicons name="checkmark" size={20} color="#16a34a" />
      )}
    </TouchableOpacity>
  );

  // Filter supported reciters
  const supportedReciters = reciters?.filter(reciter => reciter.hasAudio) || [];
  const currentReciterInfo = getCurrentReciter();

  return (
    <LinearGradient
      colors={['#0d9488', '#059669', '#047857']}
      locations={[0, 0.5, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* User Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileContainer}>
              <Image 
                source={require("../../assets/icon.png")}
                style={styles.profileImage}
              />
              {/* <View style={styles.profileTextContainer}>
                <Text style={styles.userName}></Text>
                <Text style={styles.userStatus}>Hafiz Basit</Text>
                <Text style={styles.urduComment}>آپ کی دعاؤں کی ضرورت ہے</Text>
                <Text style={styles.urduCommentSmall}>(Your Dua's Needed)</Text>
              </View> */}
              {/* <Text style={styles.appName}>Al-Quran App</Text> */}
              <Text style={styles.featuresTitle}>App Features</Text>
            </View>
            <View style={styles.profileTextContainer}>
  
  
  <View style={styles.featuresGrid}>
    <View style={styles.featureItem}>
      <Ionicons name="book" size={16} color="#fef3c7" />
      <Text style={styles.featureText}>Reading Quran</Text>
    </View>
    <View style={styles.featureItem}>
      <Ionicons name="language" size={16} color="#fef3c7" />
      <Text style={styles.featureText}>With Tarjuma</Text>
    </View>
    <View style={styles.featureItem}>
      <Ionicons name="compass" size={16} color="#fef3c7" />
      <Text style={styles.featureText}>Qibla Direction</Text>
    </View>
    <View style={styles.featureItem}>
      <Ionicons name="apps" size={16} color="#fef3c7" />
      <Text style={styles.featureText}>Tasbih Counter</Text>
    </View>
    <View style={styles.featureItem}>
      <Ionicons name="business" size={16} color="#fef3c7" />
      <Text style={styles.featureText}>Nearby Mosque</Text>
    </View>
    <View style={styles.featureItem}>
      <Ionicons name="time" size={16} color="#fef3c7" />
      <Text style={styles.featureText}>Prayer Times</Text>
    </View>
    <View style={styles.featureItem}>
      <Ionicons name="musical-notes" size={16} color="#fef3c7" />
      <Text style={styles.featureText}>Multiple Reciters</Text>
    </View>
  </View>
  
  {/* <Text style={styles.urduComment}>آپ کی دعاؤں کی ضرورت ہے</Text>
  <Text style={styles.urduCommentSmall}>(Your Dua's Needed)</Text> */}
</View>
          </View>

          <View style={styles.header}>
            {/* <Text style={styles.headerTitle}>ترتیبات</Text> */}
            <Text style={styles.headerSubtitle}>Settings</Text>
          </View>

          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>ظہور</Text> */}
            <Text style={styles.sectionSubtitle}>Appearance</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon" size={24} color="#16a34a" />
                <View>
                  {/* <Text style={styles.settingLabel}>ڈارک موڈ</Text> */}
                  <Text style={styles.settingLabelEnglish}>Dark Mode</Text>
                </View>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={handleThemeToggle}
                thumbColor={theme === 'dark' ? '#16a34a' : '#f4f4f4'}
                trackColor={{ false: '#767577', true: '#86efac' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="text" size={24} color="#16a34a" />
                <View>
                  {/* <Text style={styles.settingLabel}>فونٹ سائز</Text> */}
                  <Text style={styles.settingLabelEnglish}>Font Size</Text>
                </View>
              </View>
              <View style={styles.fontSizeControls}>
                <TouchableOpacity 
                  onPress={() => handleFontSizeChange(Math.max(12, currentFontSize - 2))}
                  style={styles.fontSizeButton}
                >
                  <Text style={styles.fontSizeButtonText}>A-</Text>
                </TouchableOpacity>
                <Text style={styles.fontSizeDisplay}>{currentFontSize}px</Text>
                <TouchableOpacity 
                  onPress={() => handleFontSizeChange(Math.min(24, currentFontSize + 2))}
                  style={styles.fontSizeButton}
                >
                  <Text style={styles.fontSizeButtonText}>A+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>مواد</Text> */}
            <Text style={styles.sectionSubtitle}>Content</Text>
            
            {/* Translation Language */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="language" size={24} color="#16a34a" />
                <View>
                  <Text style={styles.settingLabel}>ترجمہ زبان</Text>
                  <Text style={styles.settingLabelEnglish}>Translation Language</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.picker}
                onPress={() => setShowTranslationModal(true)}
              >
                <Text style={styles.pickerText}>
                  {translationOptions.find(t => t.value === translationLang)?.label || 'English'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Reciter Selection */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="musical-notes" size={24} color="#16a34a" />
                <View>
                  <Text style={styles.settingLabel}>قاری انتخاب</Text>
                  <Text style={styles.settingLabelEnglish}>Quran Reciter</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.picker}
                onPress={() => setShowReciterModal(true)}
              >
                <View style={styles.reciterPickerContent}>
                  <Text style={styles.pickerText}>
                    {getCurrentReciterName()}
                  </Text>
                  {currentReciterInfo && (
                    <Text style={styles.reciterStatus}>
                      {currentReciterInfo.hasAudio ? '✅ Supported' : '❌ Not supported'}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-down" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>معلومات</Text> */}
            <Text style={styles.sectionSubtitle}>About</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="information-circle" size={24} color="#16a34a" />
                <View>
                  {/* <Text style={styles.settingLabel}>ورژن</Text> */}
                  <Text style={styles.settingLabelEnglish}>Version</Text>
                </View>
              </View>
              <Text style={styles.versionText}>1.0.0</Text>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="heart" size={24} color="#16a34a" />
                <View>
                  {/* <Text style={styles.settingLabel}>حافظ باسط</Text> */}
                  <Text style={styles.settingLabelEnglish}>By Hafiz Basit</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </View>
          </View>

          {/* Additional Urdu Comments Section */}
          <View style={styles.duaSection}>
            <Text style={styles.duaTitle}>📿 دعا کا مستقل ذکر</Text>
            <Text style={styles.duaText}>اللهم اغفر لي وارحمني واهدني وعافني وارزقني</Text>
            <Text style={styles.duaTranslation}>"O Allah, forgive me, have mercy on me, guide me, grant me health, and provide for me."</Text>
          </View>
          <View style={styles.duaSection}>
            <Text style={styles.duaTitle}>By HAFIZ BASIT ULLAH KHAN</Text>
            <Text style={styles.duaText}>Made with ❤️ for the Muslim Ummah.</Text>
            <Text style={styles.duaTranslation}>© 2025 Al-Quran App. All rights reserved.</Text>
          </View>

          {/* Modals remain the same */}
          <Modal
            visible={showReciterModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowReciterModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Quran Reciter</Text>
                  <TouchableOpacity onPress={() => setShowReciterModal(false)}>
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.modalSubtitle}>
                  Supported reciters have audio available
                </Text>
                
                {isLoadingReciters ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#16a34a" />
                    <Text style={styles.loadingText}>Loading reciters...</Text>
                  </View>
                ) : recitersError ? (
                  <Text style={styles.errorText}>Error loading reciters</Text>
                ) : (
                  <FlatList
                    data={supportedReciters}
                    keyExtractor={item => item.identifier}
                    renderItem={renderReciterItem}
                    ListEmptyComponent={
                      <Text style={styles.emptyText}>No supported reciters available</Text>
                    }
                  />
                )}
              </View>
            </View>
          </Modal>

          <Modal
            visible={showTranslationModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTranslationModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Translation Language</Text>
                  <TouchableOpacity onPress={() => setShowTranslationModal(false)}>
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={translationOptions}
                  keyExtractor={item => item.value}
                  renderItem={renderTranslationModalItem}
                />
              </View>
            </View>
          </Modal>
        </ScrollView>
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
  },
  profileHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    margin: 16,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10
  },
  profileTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
  },
  userStatus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    marginTop: 2,
  },
  urduComment: {
    fontSize: 18,
    color: '#fef3c7',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '600',
    fontFamily: 'System', // Use a font that supports Urdu
  },
  urduCommentSmall: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
    marginTop: 2,
    fontStyle: 'italic',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'right',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#0f172a',
    marginLeft: 12,
    textAlign: 'right',
  },
  settingLabelEnglish: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 12,
    textAlign: 'right',
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSizeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  fontSizeDisplay: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#64748b',
    minWidth: 40,
    textAlign: 'center',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    minWidth: 120,
  },
  reciterPickerContent: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  pickerText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'right',
  },
  reciterStatus: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  versionText: {
    fontSize: 14,
    color: '#64748b',
  },
  duaSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  duaText: {
    fontSize: 16,
    color: '#fef3c7',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'System',
  },
  duaTranslation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  // ... rest of your existing styles remain the same
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalItemContent: {
    flex: 1,
  },
  selectedModalItem: {
    backgroundColor: '#f0fdf4',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
  },
  modalItemSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  selectedModalItemText: {
    color: '#16a34a',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    padding: 20,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#64748b',
  },
  errorText: {
    textAlign: 'center',
    color: '#dc2626',
    padding: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 4,
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuresTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fef3c7',
    textAlign: 'center',
    marginBottom: 10,
    marginLeft: 10
  },
});