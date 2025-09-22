// src/components/PrayerTimesCard.js
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PrayerTimesCard({ prayerData }) {
  if (!prayerData || !prayerData.data) return null;

  const timings = prayerData.data.timings;
  const prayerTimes = [
    { name: 'Fajr', arabic: 'الفجر', time: timings.Fajr, icon: 'moon' },
    { name: 'Sunrise', arabic: 'الشروق', time: timings.Sunrise, icon: 'sunny' },
    { name: 'Dhuhr', arabic: 'الظهر', time: timings.Dhuhr, icon: 'sunny' },
    { name: 'Asr', arabic: 'العصر', time: timings.Asr, icon: 'partly-sunny' },
    { name: 'Maghrib', arabic: 'المغرب', time: timings.Maghrib, icon: 'moon' },
    { name: 'Isha', arabic: 'العشاء', time: timings.Isha, icon: 'moon' },
  ];

  // Return next upcoming prayer. If none remain today, return the first (Fajr) as next (tomorrow).
  const getNextPrayer = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Build array with parsed minute values, ignore invalid/missing times
    const valid = prayerTimes
      .map((p) => {
        if (!p.time) return null;
        const parts = ('' + p.time).match(/\d{1,2}:\d{2}/);
        if (!parts) return null;
        const [hours, minutes] = parts[0].split(':').map(Number);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
        return { ...p, minutesOfDay: hours * 60 + minutes };
      })
      .filter(Boolean);

    if (valid.length === 0) return null;

    // Find first prayer time strictly after now
    const next = valid.find((p) => p.minutesOfDay > currentMinutes);
    if (next) return next;

    // If none found today, return first valid prayer (Fajr) as next (tomorrow)
    return valid[0];
  };

  const nextPrayer = getNextPrayer();
  if (!nextPrayer) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>أوقات الصلاة</Text>
      <Text style={styles.subtitle}>Prayer Times</Text>

      <View style={styles.currentPrayer}>
        <Ionicons name={nextPrayer.icon} size={24} color="#16a34a" />
        <Text style={styles.currentPrayerText}>
          {nextPrayer.arabic} ({nextPrayer.name}): {nextPrayer.time}
        </Text>
      </View>

      <View style={styles.prayerList}>
        {prayerTimes.map((prayer, index) => {
          // handle missing times gracefully
          if (!prayer.time) return null;
          const isNext = prayer.name === nextPrayer.name;
          return (
            <View
              key={index}
              style={[
                styles.prayerItem,
                isNext && styles.currentPrayerItem
              ]}
            >
              <View style={styles.prayerInfo}>
                <Ionicons name={prayer.icon} size={20} color="#16a34a" />
                <View style={styles.prayerNames}>
                  <Text style={styles.prayerArabic}>{prayer.arabic}</Text>
                  <Text style={styles.prayerName}>{prayer.name}</Text>
                </View>
              </View>
              <Text style={[
                styles.prayerTime,
                isNext && styles.currentPrayerTime
              ]}>
                {prayer.time}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    fontFamily: 'ScheherazadeNew-Regular',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  currentPrayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  currentPrayerText: {
    marginLeft: 8,
    color: '#16a34a',
    fontWeight: '500',
  },
  prayerList: {
    gap: 8,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  currentPrayerItem: {
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
    borderBottomWidth: 0,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerNames: {
    marginLeft: 12,
  },
  prayerArabic: {
    fontSize: 16,
    color: '#0f172a',
    fontFamily: 'ScheherazadeNew-Regular',
  },
  prayerName: {
    fontSize: 12,
    color: '#64748b',
  },
  prayerTime: {
    fontSize: 16,
    color: '#16a34a',
    fontWeight: '600',
  },
  currentPrayerTime: {
    color: '#15803d',
    fontWeight: '700',
  },
});
