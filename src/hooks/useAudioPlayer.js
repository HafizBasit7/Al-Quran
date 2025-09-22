// src/hooks/useAudioPlayer.js
import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';

export const useAudioPlayer = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  }, []);

  const playAudio = useCallback(async (audioUrl) => {
    try {
      setIsLoading(true);
      
      // Stop current audio if playing
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsPlaying(true);
      return newSound;
      
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sound, onPlaybackStatusUpdate]);

  const togglePlayPause = useCallback(async () => {
    if (!sound) return;
    
    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }, [sound, isPlaying]);

  const stopAudio = useCallback(async () => {
    if (!sound) return;
    
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setPosition(0);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }, [sound]);

  const seekAudio = useCallback(async (value) => {
    if (sound) {
      try {
        await sound.setPositionAsync(value);
        setPosition(value);
      } catch (error) {
        console.error('Error seeking audio:', error);
      }
    }
  }, [sound]);

  return {
    sound,
    isPlaying,
    position,
    duration,
    isLoading,
    playAudio,
    togglePlayPause,
    stopAudio,
    seekAudio,
  };
};