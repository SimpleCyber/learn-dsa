import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LeetCodeProfileResponse } from './leetcode';

export interface UserFirestoreData {
  userId: string;
  profile?: LeetCodeProfileResponse | null;
  solved: Record<string, number>;
  lastSync?: number;
  updatedAt?: unknown;
}

/**
 * Save user progress directly to Firestore under `users/{userId}`
 */
export async function saveUserProgress(
  userId: string,
  data: {
    profile?: LeetCodeProfileResponse | null;
    solved: Record<string, number>;
    lastSync?: number;
  }
): Promise<void> {
  const cleanId = (userId || '').trim().toLowerCase();
  if (!cleanId) return;

  try {
    const userRef = doc(db, 'users', cleanId);
    await setDoc(
      userRef,
      {
        userId: cleanId,
        profile: data.profile || null,
        solved: data.solved || {},
        lastSync: data.lastSync || Date.now(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('[Firestore] Failed to save user data:', err);
  }
}

/**
 * Retrieve user progress directly from Firestore under `users/{userId}`
 */
export async function getUserProgress(userId: string): Promise<UserFirestoreData | null> {
  const cleanId = (userId || '').trim().toLowerCase();
  if (!cleanId) return null;

  try {
    const userRef = doc(db, 'users', cleanId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserFirestoreData;
    }
    return null;
  } catch (err) {
    console.warn('[Firestore] Failed to read user data:', err);
    return null;
  }
}
