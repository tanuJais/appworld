import * as SQLite from 'expo-sqlite';
import { CalendarEntry, PracticeSessionRecord } from '../types';

/**
 * Native (iOS/Android) local structured-data store using expo-sqlite.
 * See database.web.ts for the web fallback.
 */

let sqliteDb: SQLite.SQLiteDatabase | null = null;

function getDb(): SQLite.SQLiteDatabase {
  if (!sqliteDb) {
    sqliteDb = SQLite.openDatabaseSync('vedicmath.db');
    sqliteDb.execSync(`
      CREATE TABLE IF NOT EXISTS practice_sessions (
        sessionId TEXT PRIMARY KEY NOT NULL,
        profileId TEXT NOT NULL,
        conceptId TEXT NOT NULL,
        mode TEXT NOT NULL,
        startTime INTEGER NOT NULL,
        endTime INTEGER NOT NULL,
        questionsAttempted INTEGER NOT NULL,
        correctCount INTEGER NOT NULL,
        avgTimePerQuestion REAL NOT NULL
      );
      CREATE TABLE IF NOT EXISTS calendar_entries (
        profileId TEXT NOT NULL,
        date TEXT NOT NULL,
        totalMinutes REAL NOT NULL,
        topicsPracticed TEXT NOT NULL,
        accuracySummary TEXT NOT NULL,
        PRIMARY KEY (profileId, date)
      );
    `);
  }
  return sqliteDb;
}

export function initDatabase(): void {
  getDb();
}

export async function insertPracticeSession(session: PracticeSessionRecord): Promise<void> {
  getDb().runSync(
    `INSERT INTO practice_sessions (sessionId, profileId, conceptId, mode, startTime, endTime, questionsAttempted, correctCount, avgTimePerQuestion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      session.sessionId,
      session.profileId,
      session.conceptId,
      session.mode,
      session.startTime,
      session.endTime,
      session.questionsAttempted,
      session.correctCount,
      session.avgTimePerQuestion,
    ]
  );
}

export async function getPracticeSessions(profileId: string, conceptId?: string): Promise<PracticeSessionRecord[]> {
  const rows = conceptId
    ? getDb().getAllSync<PracticeSessionRecord>(
        `SELECT * FROM practice_sessions WHERE profileId = ? AND conceptId = ? ORDER BY startTime DESC`,
        [profileId, conceptId]
      )
    : getDb().getAllSync<PracticeSessionRecord>(
        `SELECT * FROM practice_sessions WHERE profileId = ? ORDER BY startTime DESC`,
        [profileId]
      );
  return rows;
}

/** Adds minutes/topic/accuracy for a given day, creating the row if needed. */
export async function upsertCalendarEntry(
  profileId: string,
  date: string,
  minutesToAdd: number,
  conceptId: string,
  accuracy: number
): Promise<void> {
  const db = getDb();
  const existing = db.getFirstSync<{ totalMinutes: number; topicsPracticed: string; accuracySummary: string }>(
    `SELECT totalMinutes, topicsPracticed, accuracySummary FROM calendar_entries WHERE profileId = ? AND date = ?`,
    [profileId, date]
  );

  if (existing) {
    const topics: string[] = JSON.parse(existing.topicsPracticed);
    if (!topics.includes(conceptId)) topics.push(conceptId);
    const accuracySummary = JSON.parse(existing.accuracySummary);
    accuracySummary[conceptId] = accuracy;

    db.runSync(
      `UPDATE calendar_entries SET totalMinutes = ?, topicsPracticed = ?, accuracySummary = ? WHERE profileId = ? AND date = ?`,
      [existing.totalMinutes + minutesToAdd, JSON.stringify(topics), JSON.stringify(accuracySummary), profileId, date]
    );
  } else {
    db.runSync(
      `INSERT INTO calendar_entries (profileId, date, totalMinutes, topicsPracticed, accuracySummary) VALUES (?, ?, ?, ?, ?)`,
      [profileId, date, minutesToAdd, JSON.stringify([conceptId]), JSON.stringify({ [conceptId]: accuracy })]
    );
  }
}

export async function getCalendarEntries(profileId: string, startDate: string, endDate: string): Promise<CalendarEntry[]> {
  const rows = getDb().getAllSync<{ profileId: string; date: string; totalMinutes: number; topicsPracticed: string; accuracySummary: string }>(
    `SELECT * FROM calendar_entries WHERE profileId = ? AND date >= ? AND date <= ? ORDER BY date ASC`,
    [profileId, startDate, endDate]
  );
  return rows.map(r => ({
    profileId: r.profileId,
    date: r.date,
    totalMinutes: r.totalMinutes,
    topicsPracticed: JSON.parse(r.topicsPracticed),
    accuracySummary: JSON.parse(r.accuracySummary),
  }));
}

export async function getCalendarEntry(profileId: string, date: string): Promise<CalendarEntry | null> {
  const [entry] = await getCalendarEntries(profileId, date, date);
  return entry || null;
}

export async function clearProfileData(profileId: string): Promise<void> {
  const db = getDb();
  db.runSync(`DELETE FROM practice_sessions WHERE profileId = ?`, [profileId]);
  db.runSync(`DELETE FROM calendar_entries WHERE profileId = ?`, [profileId]);
}
