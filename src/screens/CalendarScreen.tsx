import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useGame } from '../context/GameContext';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarEntry } from '../types';
import { colors, gradients, radii, spacing } from '../theme/theme';

const CalendarScreen: React.FC = () => {
  const { getCalendarEntries, concepts } = useGame();
  const [monthOffset, setMonthOffset] = useState(0);
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() + monthOffset);
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateKey = (day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

  const loadEntries = useCallback(async () => {
    const start = dateKey(1);
    const end = dateKey(daysInMonth);
    const data = await getCalendarEntries(start, end);
    setEntries(data);
  }, [year, month]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const entryFor = (day: number) => entries.find(e => e.date === dateKey(day));

  const intensityColor = (minutes: number) => {
    if (minutes <= 0) return colors.surfaceMuted;
    if (minutes < 5) return colors.goldLight;
    if (minutes < 15) return colors.gold;
    if (minutes < 30) return colors.primaryLight;
    return colors.primary;
  };

  const selectedEntry = entries.find(e => e.date === selectedDate);
  const monthLabel = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const totalMinutesThisMonth = Math.round(entries.reduce((sum, e) => sum + e.totalMinutes, 0));

  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = new Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={gradients.header} style={styles.header}>
          <Text style={styles.title}>📅 Practice Calendar</Text>
          <Text style={styles.subtitle}>{totalMinutesThisMonth} minutes this month</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => setMonthOffset(monthOffset - 1)}>
              <Text style={styles.navButtonText}>‹ Prev</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{monthLabel}</Text>
            <TouchableOpacity style={styles.navButton} onPress={() => setMonthOffset(monthOffset + 1)}>
              <Text style={styles.navButtonText}>Next ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekdayRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={i} style={styles.weekdayLabel}>{d}</Text>
            ))}
          </View>

          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                if (day === null) return <View key={di} style={styles.dayCell} />;
                const entry = entryFor(day);
                const minutes = entry?.totalMinutes ?? 0;
                const key = dateKey(day);
                return (
                  <TouchableOpacity
                    key={di}
                    style={[styles.dayCell, styles.dayBox, { backgroundColor: intensityColor(minutes) }]}
                    onPress={() => setSelectedDate(key === selectedDate ? null : key)}
                  >
                    <Text style={[styles.dayText, minutes > 0 && styles.dayTextActive]}>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {selectedEntry && (
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>{selectedEntry.date}</Text>
              <Text style={styles.detailMinutes}>{Math.round(selectedEntry.totalMinutes)} minutes practiced</Text>
              {selectedEntry.topicsPracticed.map(topicId => {
                const concept = concepts.find(c => c.id === topicId);
                const accuracy = selectedEntry.accuracySummary[topicId];
                return (
                  <View key={topicId} style={styles.detailRow}>
                    <Text style={styles.detailTopic}>{concept?.name || topicId}</Text>
                    <Text style={styles.detailAccuracy}>{Math.round(accuracy)}% accuracy</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    ...Platform.select({ web: { maxHeight: '100vh' as any } }),
  },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { padding: spacing.xxl, paddingTop: spacing.xl },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.textInverse, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.goldSurface },
  content: { padding: spacing.xl },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navButton: { padding: 8 },
  navButtonText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
  monthLabel: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  weekdayRow: { flexDirection: 'row', marginBottom: 8 },
  weekdayLabel: { flex: 1, textAlign: 'center', color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  dayCell: { flex: 1, aspectRatio: 1, marginHorizontal: 2, justifyContent: 'center', alignItems: 'center' },
  dayBox: { borderRadius: radii.sm },
  dayText: { fontSize: 12, color: colors.textSecondary },
  dayTextActive: { color: colors.textInverse, fontWeight: 'bold' },
  detailCard: { backgroundColor: colors.surface, borderRadius: radii.lg, padding: 16, marginTop: 16 },
  detailTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  detailMinutes: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderTopWidth: 1, borderTopColor: colors.surfaceMuted },
  detailTopic: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  detailAccuracy: { fontSize: 14, color: colors.success },
});

export default CalendarScreen;
