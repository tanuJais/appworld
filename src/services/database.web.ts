import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarEntry, PracticeSessionRecord } from '../types';

/**
 * Web fallback for the local structured-data store (AsyncStorage-backed JSON arrays).
 * expo-sqlite's web implementation requires extra wasm bundler setup, so web builds
 * use this simpler store instead. See database.native.ts for the SQLite version.
 */

const WEB_SESSIONS_KEY = 'web_practice_sessions';
const WEB_CALENDAR_KEY = 'web_calendar_entries';

async function webGetSessions(): Promise<PracticeSessionRecord[]> {
  const raw = await AsyncStorage.getItem(WEB_SESSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function webGetCalendar(): Promise<CalendarEntry[]> {
  const raw = await AsyncStorage.getItem(WEB_CALENDAR_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function initDatabase(): void {
  // no-op on web
}

export async function insertPracticeSession(session: PracticeSessionRecord): Promise<void> {
  const sessions = await webGetSessions();
  sessions.push(session);
  await AsyncStorage.setItem(WEB_SESSIONS_KEY, JSON.stringify(sessions));
}

export async function getPracticeSessions(profileId: string, conceptId?: string): Promise<PracticeSessionRecord[]> {
  const sessions = await webGetSessions();
  return sessions.filter(s => s.profileId === profileId && (!conceptId || s.conceptId === conceptId));
}

/** Adds minutes/topic/accuracy for a given day, creating the row if needed. */
export async function upsertCalendarEntry(
  profileId: string,
  date: string,
  minutesToAdd: number,
  conceptId: string,
  accuracy: number
): Promise<void> {
  const entries = await webGetCalendar();
  const existing = entries.find(e => e.profileId === profileId && e.date === date);
  if (existing) {
    existing.totalMinutes += minutesToAdd;
    if (!existing.topicsPracticed.includes(conceptId)) existing.topicsPracticed.push(conceptId);
    existing.accuracySummary[conceptId] = accuracy;
  } else {
    entries.push({
      profileId,
      date,
      totalMinutes: minutesToAdd,
      topicsPracticed: [conceptId],
      accuracySummary: { [conceptId]: accuracy },
    });
  }
  await AsyncStorage.setItem(WEB_CALENDAR_KEY, JSON.stringify(entries));
}

export async function getCalendarEntries(profileId: string, startDate: string, endDate: string): Promise<CalendarEntry[]> {
  const entries = await webGetCalendar();
  return entries.filter(e => e.profileId === profileId && e.date >= startDate && e.date <= endDate);
}

export async function getCalendarEntry(profileId: string, date: string): Promise<CalendarEntry | null> {
  const [entry] = await getCalendarEntries(profileId, date, date);
  return entry || null;
}

export async function clearProfileData(profileId: string): Promise<void> {
  const sessions = (await webGetSessions()).filter(s => s.profileId !== profileId);
  const entries = (await webGetCalendar()).filter(e => e.profileId !== profileId);
  await AsyncStorage.setItem(WEB_SESSIONS_KEY, JSON.stringify(sessions));
  await AsyncStorage.setItem(WEB_CALENDAR_KEY, JSON.stringify(entries));
}
