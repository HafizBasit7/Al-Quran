// src/screens/SettingsScreen.js
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useQuery } from '@tanstack/react-query';
import { quranApi } from '../services/quranApi';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const renderTranslationOption = (option) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.optionButton,
        translationLang === option.value && styles.selectedOption
      ]}
      onPress={() => handleTranslationSelect(option.value)}
    >
      <Ionicons 
        name={option.icon} 
        size={20} 
        color={translationLang === option.value ? '#16a34a' : '#64748b'} 
      />
      <Text style={[
        styles.optionText,
        translationLang === option.value && styles.selectedOptionText
      ]}>
        {option.label}
      </Text>
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
    <SafeAreaView style={styles.container}>
    <ScrollView >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={24} color="#16a34a" />
            <Text style={styles.settingLabel}>Dark Mode</Text>
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
            <Text style={styles.settingLabel}>Font Size</Text>
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
        <Text style={styles.sectionTitle}>Content</Text>
        
        {/* Translation Language */}
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="language" size={24} color="#16a34a" />
            <Text style={styles.settingLabel}>Translation Language</Text>
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
            <Text style={styles.settingLabel}>Quran Reciter</Text>
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
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="information-circle" size={24} color="#16a34a" />
            <Text style={styles.settingLabel}>Version</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="heart" size={24} color="#16a34a" />
            <Text style={styles.settingLabel}>Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        </View>
      </View>

      {/* Reciter Selection Modal */}
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

      {/* Translation Selection Modal */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginBottom: 8,
    minWidth: '30%',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  optionText: {
    marginLeft: 8,
    color: '#64748b',
  },
  selectedOptionText: {
    color: '#16a34a',
    fontWeight: '500',
  },
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
});