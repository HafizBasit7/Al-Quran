// src/screens/AudioScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../contexts/SettingsContext';
import { quranApi } from '../services/quranApi';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AudioScreen() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [soundStatus, setSoundStatus] = useState('unloaded');
  
  const { reciter } = useSettings();
  
  // Available reciters with their audio support
  const availableReciters = {
    'ar.alafasy': {
      name: 'Mishary Rashid Alafasy',
      hasAudio: true,
      baseUrl: 'https://server8.mp3quran.net/afs'
    },
    'ar.abdulbasit': {
      name: 'Abdul Basit Abdul Samad',
      hasAudio: true,
      baseUrl: 'https://server7.mp3quran.net/basit'
    },
    'ar.husary': {
      name: 'Mahmoud Khalil Al-Husary',
      hasAudio: true,
      baseUrl: 'https://server6.mp3quran.net/husary'
    },
    'ar.minshawi': {
      name: 'Mohamed Siddiq El-Minshawi',
      hasAudio: true,
      baseUrl: 'https://server10.mp3quran.net/minsh'
    },
    'ar.sudais': {
      name: 'Abdul Rahman Al-Sudais',
      hasAudio: true,
      baseUrl: 'https://server11.mp3quran.net/sds'
    }
  };

  // Fixed query for reciters - return our available reciters
  const { data: reciters, isLoading: isLoadingReciters } = useQuery({
    queryKey: ['reciters'],
    queryFn: () => Promise.resolve(Object.entries(availableReciters).map(([key, value]) => ({
      identifier: key,
      englishName: value.name,
      hasAudio: value.hasAudio
    })))
  });

  const { data: surahs, isLoading: isLoadingSurahs } = useQuery({
    queryKey: ['surahs'],
    queryFn: async () => {
      try {
        const response = await quranApi.getSurahs();
        return response.data.data;
      } catch (error) {
        console.error('Error fetching surahs:', error);
        throw error;
      }
    }
  });

  // Get current reciter info
  const currentReciter = availableReciters[reciter] || availableReciters['ar.alafasy'];

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        console.log('Unloading sound on unmount');
        sound.unloadAsync().catch(error => {
          console.log('Error unloading sound on unmount:', error);
        });
      }
    };
  }, [sound]);

  // Get audio URL - Fixed implementation
  const getAudioUrl = (surahNumber) => {
    try {
      const reciterData = availableReciters[reciter];
      if (!reciterData || !reciterData.hasAudio) {
        return null;
      }
      
      // Format surah number with leading zeros (e.g., 001, 002, 114)
      const formattedNumber = surahNumber.toString().padStart(3, '0');
      
      // Different URL patterns for different reciters
      switch (reciter) {
        case 'ar.alafasy':
          return `${reciterData.baseUrl}/${formattedNumber}.mp3`;
        case 'ar.abdulbasit':
          return `${reciterData.baseUrl}/${formattedNumber}.mp3`;
        case 'ar.husary':
          return `${reciterData.baseUrl}/${formattedNumber}.mp3`;
        case 'ar.minshawi':
          return `${reciterData.baseUrl}/${formattedNumber}.mp3`;
        case 'ar.sudais':
          return `${reciterData.baseUrl}/${formattedNumber}.mp3`;
        default:
          return `${availableReciters['ar.alafasy'].baseUrl}/${formattedNumber}.mp3`;
      }
    } catch (error) {
      console.error('Error getting audio URL:', error);
      return null;
    }
  };

  const playAudio = async (surah) => {
    try {
      setIsLoadingAudio(true);
      setSoundStatus('loading');
      
      // Stop current audio if playing
      if (sound) {
        console.log('Stopping current audio');
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
            await sound.unloadAsync();
          }
        } catch (error) {
          console.log('Error stopping previous sound:', error);
        }
        setSound(null);
        setIsPlaying(false);
      }
      
      const audioUrl = getAudioUrl(surah.number);
      
      if (!audioUrl) {
        Alert.alert(
          'Reciter Not Supported', 
          `The selected reciter does not support audio playback. Please choose a different reciter from Settings.`
        );
        setSoundStatus('error');
        return;
      }
      
      console.log('Attempting to play:', audioUrl);
      
      // Configure audio mode first
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false,
      });
      
      // Load and play audio
      console.log('Creating sound instance');
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { 
          shouldPlay: false, // Don't auto play, let user control
          progressUpdateIntervalMillis: 500,
          positionMillis: 0,
          isLooping: false,
          volume: 1.0,
          rate: 1.0,
        },
        onPlaybackStatusUpdate
      );
      
      console.log('Sound created with status:', status);
      
      if (status.isLoaded) {
        setSound(newSound);
        setCurrentSurah(surah);
        setSoundStatus('loaded');
        
        // Now play the audio
        await newSound.playAsync();
        setIsPlaying(true);
      } else {
        throw new Error('Failed to load audio');
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setSoundStatus('error');
      
      let errorMessage = 'Failed to play audio. ';
      if (error.message.includes('404')) {
        errorMessage += 'Audio file not found for this Surah with the selected reciter.';
      } else if (error.message.includes('network')) {
        errorMessage += 'Please check your internet connection.';
      } else {
        errorMessage += 'Please try another reciter or check your connection.';
      }
      
      Alert.alert('Playback Error', errorMessage);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);
      
      if (status.didJustFinish) {
        console.log('Playback finished');
        setIsPlaying(false);
        setPosition(0);
      }
      
      if (status.error) {
        console.error('Playback error:', status.error);
        setSoundStatus('error');
        Alert.alert('Playback Error', 'An error occurred during playback.');
      }
    } else if (status.error) {
      console.error('Sound loading error:', status.error);
      setSoundStatus('error');
    }
  };

  const togglePlayPause = async () => {
    if (!sound || soundStatus !== 'loaded') {
      console.log('Sound not loaded, cannot toggle');
      return;
    }
    
    try {
      const status = await sound.getStatusAsync();
      
      if (status.isLoaded) {
        if (status.isPlaying) {
          console.log('Pausing audio');
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          console.log('Playing audio');
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      setSoundStatus('error');
    }
  };

  const stopAudio = async () => {
    if (!sound) return;
    
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      setSound(null);
      setIsPlaying(false);
      setPosition(0);
      setCurrentSurah(null);
      setSoundStatus('unloaded');
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const restartAudio = async () => {
    if (!sound || soundStatus !== 'loaded') return;
    
    try {
      await sound.setPositionAsync(0);
      setPosition(0);
      
      if (!isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error restarting audio:', error);
    }
  };

  const seekAudio = async (value) => {
    if (sound && soundStatus === 'loaded') {
      try {
        await sound.setPositionAsync(value);
        setPosition(value);
      } catch (error) {
        console.error('Error seeking audio:', error);
      }
    }
  };

  const formatTime = (millis) => {
    if (!millis || isNaN(millis)) return '0:00';
    
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getCurrentReciterName = () => {
    return currentReciter?.name || 'Unknown Reciter';
  };

  const isReciterSupported = () => {
    return currentReciter?.hasAudio || false;
  };

  const isSoundLoaded = () => {
    return soundStatus === 'loaded';
  };

  const renderSurahItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.surahItem,
        currentSurah?.number === item.number && styles.activeSurahItem,
        !isReciterSupported() && styles.disabledSurahItem
      ]}
      onPress={() => isReciterSupported() && playAudio(item)}
      disabled={isLoadingAudio || !isReciterSupported()}
    >
      <View style={styles.surahInfo}>
        <View style={styles.surahNumberContainer}>
          <Text style={styles.surahNumber}>{item.number}</Text>
        </View>
        <View style={styles.surahTextContainer}>
          <Text style={styles.surahArabic}>{item.name}</Text>
          <Text style={styles.surahName}>{item.englishName}</Text>
          <Text style={styles.surahTranslation}>{item.englishNameTranslation}</Text>
        </View>
      </View>
      
      {currentSurah?.number === item.number && isLoadingAudio ? (
        <ActivityIndicator size="small" color="#16a34a" />
      ) : (
        <Ionicons 
          name={currentSurah?.number === item.number && isPlaying ? "pause-circle" : "play-circle"} 
          size={28} 
          color={
            !isReciterSupported() ? "#9ca3af" : 
            currentSurah?.number === item.number ? "#16a34a" : "#64748b"
          } 
        />
      )}
    </TouchableOpacity>
  );

  if (isLoadingSurahs) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading Quran content...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Audio Player Controls */}
      {currentSurah && (
        <View style={styles.playerContainer}>
          <Text style={styles.playerTitle}>Now Playing</Text>
          
          <View style={styles.surahInfoContainer}>
            <Text style={styles.currentSurahArabic}>{currentSurah.name}</Text>
            <Text style={styles.currentSurahName}>{currentSurah.englishName}</Text>
            <Text style={styles.reciterName}>Reciter: {getCurrentReciterName()}</Text>
            
            {/* Sound Status Indicator */}
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusIndicator,
                soundStatus === 'loaded' && styles.statusLoaded,
                soundStatus === 'loading' && styles.statusLoading,
                soundStatus === 'error' && styles.statusError
              ]} />
              <Text style={styles.statusText}>
                {soundStatus === 'loaded' ? 'Ready' : 
                 soundStatus === 'loading' ? 'Loading...' : 
                 soundStatus === 'error' ? 'Error' : 'Idle'}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration || 1}
              value={position}
              onSlidingComplete={seekAudio}
              minimumTrackTintColor="#16a34a"
              maximumTrackTintColor="#d1d5db"
              thumbTintColor="#16a34a"
              disabled={!isSoundLoaded()}
            />
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity 
              onPress={stopAudio} 
              style={styles.controlButton}
              disabled={!isSoundLoaded()}
            >
              <Ionicons 
                name="stop-circle" 
                size={32} 
                color={isSoundLoaded() ? "#dc2626" : "#9ca3af"} 
              />
              <Text style={styles.controlText}>Stop</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={restartAudio} 
              style={styles.controlButton}
              disabled={!isSoundLoaded()}
            >
              <Ionicons 
                name="reload-circle" 
                size={32} 
                color={isSoundLoaded() ? "#16a34a" : "#9ca3af"} 
              />
              <Text style={styles.controlText}>Restart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={togglePlayPause} 
              disabled={!isSoundLoaded()} 
              style={styles.mainControlButton}
            >
              <Ionicons 
                name={isPlaying ? 'pause-circle' : 'play-circle'} 
                size={64} 
                color={isSoundLoaded() ? '#16a34a' : '#9ca3af'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Reciter Info */}
      <View style={styles.reciterContainer}>
        <Text style={styles.reciterTitle}>Current Reciter</Text>
        <Text style={styles.reciterName}>{getCurrentReciterName()}</Text>
        
        {!isReciterSupported() ? (
          <Text style={styles.reciterError}>
            This reciter does not support audio playback. Please change reciter in Settings.
          </Text>
        ) : (
          <Text style={styles.reciterHint}>
            You can change the Reciter from settings.
          </Text>
        )}
      </View>

      {/* Supported Reciters List */}
      {!isReciterSupported() && (
        <View style={styles.supportedRecitersContainer}>
          <Text style={styles.supportedTitle}>Available Reciters</Text>
          <Text style={styles.supportedText}>
            • Mishary Rashid Alafasy (ar.alafasy){'\n'}
            • Abdul Basit Abdul Samad (ar.abdulbasit){'\n'}
            • Mahmoud Khalil Al-Husary (ar.husary){'\n'}
            • Mohamed Siddiq El-Minshawi (ar.minshawi){'\n'}
            • Abdul Rahman Al-Sudais (ar.sudais)
          </Text>
        </View>
      )}

      {/* Surah List */}
      <FlatList
        data={surahs}
        keyExtractor={item => item.number.toString()}
        renderItem={renderSurahItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.listHeader}>
            {isReciterSupported() ? 'Select a Surah to Listen' : 'Please select a supported reciter from Settings'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>No surahs available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  playerContainer: {
    backgroundColor: 'white',
    padding: 5,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: 16,
  },
  surahInfoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentSurahArabic: {
    fontSize: 24,
    color: '#2c5530',
    textAlign: 'center',
    marginBottom: 4,
  },
  currentSurahName: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  reciterName: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#6b7280',
  },
  statusLoaded: {
    backgroundColor: '#16a34a',
  },
  statusLoading: {
    backgroundColor: '#f59e0b',
  },
  statusError: {
    backgroundColor: '#dc2626',
  },
  statusText: {
    fontSize: 12,
    color: '#64748b',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
    height: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#64748b',
    minWidth: 40,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    minWidth: 60,
  },
  mainControlButton: {
    alignItems: 'center',
  },
  controlText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  reciterContainer: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  reciterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 4,
  },
  reciterName: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  reciterError: {
    fontSize: 12,
    color: '#dc2626',
    fontStyle: 'italic',
  },
  reciterHint: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  supportedRecitersContainer: {
    backgroundColor: '#fffbeb',
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  supportedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d97706',
    marginBottom: 8,
  },
  supportedText: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 16,
    textAlign: 'center',
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activeSurahItem: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  disabledSurahItem: {
    opacity: 0.6,
    backgroundColor: '#f3f4f6',
  },
  surahInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  surahNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  surahTextContainer: {
    flex: 1,
  },
  surahArabic: {
    fontSize: 18,
    color: '#0f172a',
  },
  surahName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 2,
  },
  surahTranslation: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontStyle: 'italic',
  },
});