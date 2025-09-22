import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettings } from '../contexts/SettingsContext';

const { width } = Dimensions.get('window');

export default function HeaderCard({ prayerData }) {
  const [now, setNow] = useState(new Date());
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  // update clock every second
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // robustly extract timings (supports several response shapes)
  const timings = useMemo(() => {
    return (
      prayerData?.data?.timings ||
      prayerData?.timings ||
      (typeof prayerData === 'object' ? prayerData : null)
    );
  }, [prayerData]);

  const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const sanitizeTimeString = (s) => {
    if (!s) return null;
    const m = ('' + s).match(/\d{1,2}:\d{2}/);
    return m ? m[0] : null;
  };

  const makeDateFromTime = (timeStr, baseDate) => {
    const sanitized = sanitizeTimeString(timeStr);
    if (!sanitized) return null;
    const [h, m] = sanitized.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const info = useMemo(() => {
    if (!timings) return null;

    const today = new Date();
    const items = prayerOrder
      .map((name) => {
        const timeStr =
          timings[name] ||
          timings[name.toLowerCase()] ||
          timings[name.toUpperCase()];
        const date = timeStr ? makeDateFromTime(timeStr, today) : null;
        return { name, timeStr, date };
      })
      .filter((i) => i.date);

    if (items.length === 0) return null;

    // find next upcoming prayer
    let next = items.find((i) => i.date > now);

    // if none left today, pick first prayer and shift to tomorrow
    if (!next) {
      next = { ...items[0], date: new Date(items[0].date.getTime() + 24 * 3600 * 1000) };
    }

    const nextIndex = items.findIndex((i) => i.name === next.name);
    // find previous prayer (the one before next)
    let prev = null;
    if (nextIndex === 0) {
      const last = items[items.length - 1];
      prev = last ? new Date(last.date) : null;
      // if prev is after next, move prev back a day
      if (prev && prev > next.date) prev.setDate(prev.getDate() - 1);
    } else {
      prev = items[nextIndex - 1] ? new Date(items[nextIndex - 1].date) : null;
    }
    if (prev && prev > now) prev.setDate(prev.getDate() - 1);

    const msUntil = Math.max(0, next.date - now);
    const totalSpan = prev ? next.date - prev : Math.max(1, next.date - now);
    const elapsed = prev ? now - prev : 0;
    let progress = totalSpan > 0 ? Math.max(0, Math.min(1, elapsed / totalSpan)) : 0;

    // format time (12-hour with AM/PM)
    const timeDisplay = next.date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

    // format countdown
    const totalSeconds = Math.max(0, Math.floor(msUntil / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const countdown = hours > 0 
      ? `${hours}h ${minutes}m` 
      : minutes > 0 
        ? `${minutes}m ${seconds}s` 
        : `${seconds}s`;

    return {
      name: next.name,
      timeDisplay,
      countdown,
      progress,
      nextDate: next.date,
    };
  }, [timings, now]);

  if (!info) {
    // fallback: simple card when no data
    return (
      <LinearGradient
        colors={isDark ? ['#1e3a8a', '#0f766e'] : ['#16a34a', '#0d9488']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <Text style={styles.smallLeft}>Next Prayer</Text>
          <Text style={styles.dateText}>{now.toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' })}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.prayerName}>Loading...</Text>
          <Text style={styles.timeText}>--:--</Text>
        </View>
      </LinearGradient>
    );
  }

  const cardDate = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <LinearGradient
      colors={isDark ? ['#1e3a8a', '#0f766e'] : ['#16a34a', '#0d9488']}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerRow}>
        <Text style={styles.smallLeft}>Next Prayer</Text>
        <Text style={styles.dateText}>{cardDate}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.prayerName}>{info.name}</Text>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{info.timeDisplay}</Text>
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownText}>{`in ${info.countdown}`}</Text>
          </View>
        </View>

        <View style={styles.progressWrap}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.round(info.progress * 100)}%` }]} />
            <View style={styles.knob} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Previous</Text>
            <Text style={styles.progressLabel}>Next</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  smallLeft: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  body: {
    marginTop: 5,
  },
  prayerName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  countdownBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  countdownText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  progressWrap: {
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  knob: {
    position: 'absolute',
    top: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
});