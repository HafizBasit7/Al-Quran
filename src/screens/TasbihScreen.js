import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from '../contexts/SettingsContext';
import * as Haptics from 'expo-haptics';

const TasbihScreen = () => {
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentZikr, setCurrentZikr] = useState('سبحان الله');
  const [rounds, setRounds] = useState(0);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSessionDate, setLastSessionDate] = useState(null);
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  // Storage keys
  const STORAGE_KEYS = {
    CURRENT_COUNT: 'tasbih_current_count',
    TOTAL_COUNT: 'tasbih_total_count',
    CURRENT_ZIKR: 'tasbih_current_zikr',
    ROUNDS: 'tasbih_rounds',
    HISTORY: 'tasbih_history',
    LAST_SESSION_DATE: 'tasbih_last_session_date',
  };

  // Common Islamic Zikr phrases
  const ZikrOptions = [
    'سبحان الله',
    'الحمد لله',
    'الله أكبر',
    'لا إله إلا الله',
    'أستغفر الله',
    'ذكر مخصص'
  ];

  // Load data from AsyncStorage on component mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      saveDataToStorage();
    }
  }, [count, totalCount, currentZikr, rounds, history, isLoading]);

  // Load persisted data
  const loadPersistedData = async () => {
    try {
      setIsLoading(true);
      
      const [
        savedCount,
        savedTotalCount,
        savedZikr,
        savedRounds,
        savedHistory,
        savedLastDate,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_COUNT),
        AsyncStorage.getItem(STORAGE_KEYS.TOTAL_COUNT),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_ZIKR),
        AsyncStorage.getItem(STORAGE_KEYS.ROUNDS),
        AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SESSION_DATE),
      ]);

      // Check if it's a new day - reset daily totals
      const today = new Date().toDateString();
      const isNewDay = !savedLastDate || savedLastDate !== today;

      // Restore or initialize values
      if (savedCount && !isNewDay) {
        setCount(parseInt(savedCount));
      } else {
        setCount(0);
      }

      if (savedTotalCount && !isNewDay) {
        setTotalCount(parseInt(savedTotalCount));
      } else {
        setTotalCount(0);
      }

      if (savedZikr) {
        setCurrentZikr(savedZikr);
      }

      if (savedRounds && !isNewDay) {
        setRounds(parseInt(savedRounds));
      } else {
        setRounds(0);
      }

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Keep history but show new day message if applicable
        setHistory(parsedHistory);
        if (isNewDay && parsedHistory.length > 0) {
          setTimeout(() => {
            Alert.alert(
              'New Day, New Blessings! 🌅',
              'Your daily counter has been reset, but your history is preserved. May Allah bless your continuous Zikr!',
              [{ text: 'Barakallahu feek', style: 'default' }]
            );
          }, 1000);
        }
      }

      setLastSessionDate(today);
      
      // Show welcome back message if returning to existing session
      if (savedCount && parseInt(savedCount) > 0 && !isNewDay) {
        setTimeout(() => {
          Alert.alert(
            'Welcome Back! 🕌',
            `You can continue your ${currentZikr || 'Zikr'} from count ${savedCount}.\n\nMay Allah accept your remembrance.`,
            [
              { text: 'Start New Session', onPress: () => resetCounter(false) },
              { text: 'Continue', style: 'default' }
            ]
          );
        }, 500);
      }

    } catch (error) {
      console.error('Error loading persisted data:', error);
      // Initialize with default values if loading fails
      initializeDefaults();
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with default values
  const initializeDefaults = () => {
    setCount(0);
    setTotalCount(0);
    setCurrentZikr('سبحان الله');
    setRounds(0);
    setHistory([]);
    setLastSessionDate(new Date().toDateString());
  };

  // Save current state to AsyncStorage
  const saveDataToStorage = async () => {
    try {
      const today = new Date().toDateString();
      
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.CURRENT_COUNT, count.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.TOTAL_COUNT, totalCount.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.CURRENT_ZIKR, currentZikr),
        AsyncStorage.setItem(STORAGE_KEYS.ROUNDS, rounds.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history)),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_SESSION_DATE, today),
      ]);
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  };

  // Get current milestone (33, 99, or next 100)
  const getCurrentMilestone = () => {
    if (count < 33) return 33;
    if (count < 99) return 99;
    // For counts 99 and above, show next hundred
    return Math.ceil((count + 1) / 100) * 100;
  };

  // Haptic feedback on count
  const incrementWithFeedback = () => {
    if (isLoading) return;

    setCount(prev => {
      const newCount = prev + 1;
      setTotalCount(total => total + 1);
      
      // Check for milestone completions
      if (newCount === 33) {
        // Light milestone reached
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Vibration.vibrate([100, 50, 100]);
        showMilestoneAlert(33);
      } else if (newCount === 99) {
        // Major milestone reached
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Vibration.vibrate([200, 100, 200, 100, 200]);
        showMilestoneAlert(99);
      } else if (newCount === 100) {
        // Full round completed
        setRounds(prevRounds => prevRounds + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Vibration.vibrate([300, 150, 300, 150, 300]);
        showMilestoneAlert(100);
      } else if (newCount % 100 === 0 && newCount > 100) {
        // Additional hundreds (200, 300, 400, etc.)
        setRounds(prevRounds => prevRounds + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Vibration.vibrate([300, 150, 300, 150, 300]);
        showMilestoneAlert(newCount);
      } else {
        // Regular count
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Vibration.vibrate(30);
      }
      
      return newCount;
    });
  };

  // Show milestone celebration
  const showMilestoneAlert = (milestone) => {
    let message = '';
    if (milestone === 33) {
      message = `ماشاء الله! You've completed 33 ${currentZikr}`;
    } else if (milestone === 99) {
      message = `بارك الله فيك! You've completed 99 ${currentZikr}`;
    } else if (milestone === 100) {
      message = `الله أكبر! First 100 ${currentZikr} completed!`;
    } else {
      message = `الله أكبر! ${milestone} ${currentZikr} completed!\nMay Allah accept your Zikr.`;
    }
    
    Alert.alert('🎉 Milestone Reached!', message, [{ text: 'Continue', style: 'default' }]);
  };

  // Reset counter
  const resetCounter = (showAlert = true) => {
    if (count > 0 && showAlert) {
      Alert.alert(
        'Reset Counter',
        `Current count: ${count} ${currentZikr}\n\nWhat would you like to do?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Save & Reset', 
            onPress: () => {
              saveToHistory();
              setCount(0);
              setRounds(0);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
          { 
            text: 'Reset Only', 
            style: 'destructive',
            onPress: () => {
              setCount(0);
              setRounds(0);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          }
        ]
      );
    } else {
      setCount(0);
      setRounds(0);
    }
  };

  // Save to history
  const saveToHistory = () => {
    if (count > 0) {
      const newSession = {
        zikr: currentZikr,
        count: count,
        totalRounds: rounds,
        timestamp: new Date(),
        date: new Date().toLocaleDateString(),
        id: Date.now()
      };
      
      setHistory(prevHistory => [newSession, ...prevHistory.slice(0, 19)]); // Keep last 20 sessions
      
      Alert.alert(
        'Session Saved! 📝',
        `${count} ${currentZikr} saved to history.\n\nMay Allah reward your efforts.`,
        [{ text: 'Alhamdulillah', style: 'default' }]
      );
    }
  };

  // Change Zikr type
  const changeZikr = () => {
    const currentIndex = ZikrOptions.indexOf(currentZikr);
    const nextIndex = (currentIndex + 1) % ZikrOptions.length;
    setCurrentZikr(ZikrOptions[nextIndex]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Clear all data
  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will reset everything including your history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(Object.values(STORAGE_KEYS).map(key => AsyncStorage.removeItem(key)));
              initializeDefaults();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              Alert.alert('Data Cleared', 'All data has been cleared successfully.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data.');
            }
          }
        }
      ]
    );
  };

  // Clear only history
  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all history? Your current session will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear History', 
          style: 'destructive',
          onPress: () => {
            setHistory([]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }
      ]
    );
  };

  // Get progress to next milestone
  const getProgress = () => {
    const milestone = getCurrentMilestone();
    return (count / milestone) * 100;
  };

  // Format time for display
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Show loading screen while data is being loaded
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, isDark && styles.darkContainer]}>
        <Text style={[styles.loadingText, isDark && styles.darkLoadingText]}>
          Loading your Zikr data...
        </Text>
        <Text style={[styles.bismillah, isDark && styles.darkBismillah]}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Zikr Selection */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.ZikrSelector, isDark && styles.darkZikrSelector]}
            onPress={changeZikr}
          >
            <Text style={[styles.ZikrText, isDark && styles.darkZikrText]}>
              {currentZikr}
            </Text>
            <Text style={[styles.tapToChange, isDark && styles.darkTapToChange]}>
              Tap to change Zikr
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Counter Display */}
        <View style={styles.counterContainer}>
          <Text style={[styles.countText, isDark && styles.darkCountText]}>
            {count}
          </Text>
          
          {/* Progress Bar */}
          <View style={[styles.progressContainer, isDark && styles.darkProgressContainer]}>
            <View 
              style={[
                styles.progressBar, 
                isDark && styles.darkProgressBar,
                { width: `${getProgress()}%` }
              ]} 
            />
          </View>
          
          <Text style={[styles.milestoneText, isDark && styles.darkMilestoneText]}>
            Next: {getCurrentMilestone()} | Rounds: {rounds}
          </Text>
          
          <Text style={[styles.totalText, isDark && styles.darkTotalText]}>
            Total today: {totalCount}
          </Text>
        </View>

        {/* Main Count Button */}
        <TouchableOpacity
          style={[styles.countButton, isDark && styles.darkCountButton]}
          onPress={incrementWithFeedback}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {count === 0 ? 'Start Zikr' : 'Continue'}
          </Text>
          <Text style={styles.buttonSubText}>
            Tap to count
          </Text>
        </TouchableOpacity>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton, isDark && styles.darkResetButton]}
            onPress={() => resetCounter(true)}
            activeOpacity={0.7}
            disabled={count === 0}
          >
            <Text style={styles.controlButtonText}>Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.saveButton, isDark && styles.darkSaveButton]}
            onPress={saveToHistory}
            activeOpacity={0.7}
            disabled={count === 0}
          >
            <Text style={styles.controlButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* History Section */}
        {history.length > 0 && (
          <View style={[styles.historyContainer, isDark && styles.darkHistoryContainer]}>
            <View style={[styles.historyHeader, isDark && styles.darkHistoryHeader]}>
              <Text style={[styles.historyTitle, isDark && styles.darkHistoryTitle]}>
                Recent Sessions ({history.length})
              </Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={[styles.clearText, isDark && styles.darkClearText]}>
                  Clear History
                </Text>
              </TouchableOpacity>
            </View>
            
            {history.slice(0, 5).map((item) => (
              <View key={item.id} style={[styles.historyItem, isDark && styles.darkHistoryItem]}>
                <View style={styles.historyItemLeft}>
                  <Text style={[styles.historyZikr, isDark && styles.darkHistoryZikr]}>
                    {item.zikr}
                  </Text>
                  <Text style={[styles.historyCount, isDark && styles.darkHistoryCount]}>
                    {item.count} times • {item.totalRounds || 0} rounds
                  </Text>
                  <Text style={[styles.historyDate, isDark && styles.darkHistoryDate]}>
                    {item.date}
                  </Text>
                </View>
                <Text style={[styles.historyTime, isDark && styles.darkHistoryTime]}>
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            ))}
            
            {history.length > 5 && (
              <Text style={[styles.moreHistory, isDark && styles.darkMoreHistory]}>
                +{history.length - 5} more sessions
              </Text>
            )}
          </View>
        )}

        {/* Islamic Instructions */}
        <View style={[styles.instructionsContainer, isDark && styles.darkInstructionsContainer]}>
          <Text style={[styles.bismillah, isDark && styles.darkBismillah]}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </Text>
          <Text style={[styles.instructionText, isDark && styles.darkInstructionText]}>
            • Your progress is automatically saved
          </Text>
          <Text style={[styles.instructionText, isDark && styles.darkInstructionText]}>
            • Traditional counts: 33, 99, or 100 repetitions
          </Text>
          <Text style={[styles.instructionText, isDark && styles.darkInstructionText]}>
            • Daily totals reset each day at midnight
          </Text>
          <Text style={[styles.instructionText, isDark && styles.darkInstructionText]}>
            • May Allah accept your Zikr and remembrance
          </Text>
          
          {/* Clear all data button */}
          <TouchableOpacity 
            style={[styles.clearAllButton, isDark && styles.darkClearAllButton]}
            onPress={clearAllData}
          >
            <Text style={[styles.clearAllText, isDark && styles.darkClearAllText]}>
              Clear All Data
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TasbihScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf8',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#0f1419',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  darkLoadingText: {
    color: '#fff',
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  ZikrSelector: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkZikrSelector: {
    backgroundColor: '#1a2332',
  },
  ZikrText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 5,
  },
  darkZikrText: {
    color: '#64b5f6',
  },
  tapToChange: {
    fontSize: 12,
    color: '#666',
  },
  darkTapToChange: {
    color: '#999',
  },
  counterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  countText: {
    fontSize: 90,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
  },
  darkCountText: {
    color: '#81c784',
  },
  progressContainer: {
    width: 200,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
  },
  darkProgressContainer: {
    backgroundColor: '#333',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  darkProgressBar: {
    backgroundColor: '#81c784',
  },
  milestoneText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  darkMilestoneText: {
    color: '#999',
  },
  totalText: {
    fontSize: 14,
    color: '#888',
  },
  darkTotalText: {
    color: '#aaa',
  },
  countButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 30,
    paddingHorizontal: 60,
    borderRadius: 60,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  darkCountButton: {
    backgroundColor: '#388e3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  darkResetButton: {
    backgroundColor: '#d32f2f',
  },
  saveButton: {
    backgroundColor: '#2196f3',
  },
  darkSaveButton: {
    backgroundColor: '#1976d2',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  darkHistoryContainer: {
    backgroundColor: '#1a2332',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  darkHistoryHeader: {
    borderBottomColor: '#333',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  darkHistoryTitle: {
    color: '#fff',
  },
  clearText: {
    color: '#f44336',
    fontWeight: '600',
    fontSize: 12,
  },
  darkClearText: {
    color: '#ef5350',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  darkHistoryItem: {
    borderBottomColor: '#2a3441',
  },
  historyItemLeft: {
    flex: 1,
  },
  historyZikr: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 2,
  },
  darkHistoryZikr: {
    color: '#64b5f6',
  },
  historyCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4caf50',
    marginBottom: 2,
  },
  darkHistoryCount: {
    color: '#81c784',
  },
  historyDate: {
    fontSize: 11,
    color: '#888',
  },
  darkHistoryDate: {
    color: '#aaa',
  },
  historyTime: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  darkHistoryTime: {
    color: '#999',
  },
  moreHistory: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  darkMoreHistory: {
    color: '#666',
  },
  instructionsContainer: {
    marginTop: 'auto',
    padding: 20,
    backgroundColor: '#e8f5e8',
    borderRadius: 15,
    marginBottom: 20,
  },
  darkInstructionsContainer: {
    backgroundColor: '#1a2e1a',
  },
  bismillah: {
    fontSize: 18,
    textAlign: 'center',
    color: '#2e7d32',
    marginBottom: 15,
    fontWeight: '600',
  },
  darkBismillah: {
    color: '#81c784',
  },
  instructionText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 5,
    lineHeight: 20,
  },
  darkInstructionText: {
    color: '#81c784',
  },
  clearAllButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 10,
    alignItems: 'center',
  },
  darkClearAllButton: {
    backgroundColor: '#2e1a1a',
  },
  clearAllText: {
    fontSize: 12,
    color: '#f44336',
    fontWeight: '600',
  },
  darkClearAllText: {
    color: '#ef5350',
  },
});