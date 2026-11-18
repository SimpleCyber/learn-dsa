'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TOPICS, Topic } from '@/data/topics';
import { norm } from '@/lib/utils';
import {
  fetchUserProfile,
  fetchUserSubmissions,
  LeetCodeProfileResponse,
  saveUserProgress,
  getUserProgress
} from '@/api';

export type LeetCodeProfile = LeetCodeProfileResponse;

export interface TopicStat {
  done: number;
  total: number;
  pct: number;
  req: number;
  reqDone: number;
  cpDone: number;
  complete: boolean;
}

export interface OverallStat {
  done: number;
  total: number;
  pct: number;
  topicsDone: number;
}

interface DsaContextType {
  username: string;
  profile: LeetCodeProfile | null;
  solved: Record<string, Record<string, number>>;
  hideSolved: boolean;
  syncing: boolean;
  error: string | null;
  setHideSolved: (val: boolean | ((prev: boolean) => boolean)) => void;
  syncUser: (uname: string) => Promise<boolean>;
  disconnectUser: () => void;
  isSolved: (title: string) => boolean;
  getSolvedTs: (title: string) => number;
  topicStats: (t: Topic) => TopicStat;
  overallStats: () => OverallStat;
}

const DsaContext = createContext<DsaContextType | null>(null);

export function DsaProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string>('');
  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [solved, setSolved] = useState<Record<string, Record<string, number>>>({});
  const [hideSolved, setHideSolved] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dsa.user') || '';
      const savedProfile = localStorage.getItem('dsa.profile');
      const savedSolved = localStorage.getItem('dsa.solved');
      const savedHide = localStorage.getItem('dsa.hide');

      if (savedUser) {
        const u = JSON.parse(savedUser);
        setUsername(u);
        // Sync with Firestore in background
        getUserProgress(u).then(cloudData => {
          if (cloudData) {
            if (cloudData.profile) setProfile(cloudData.profile);
            if (cloudData.solved) {
              setSolved(prev => {
                const next = { ...prev, [u]: { ...(prev[u] || {}), ...cloudData.solved } };
                localStorage.setItem('dsa.solved', JSON.stringify(next));
                return next;
              });
            }
          }
        }).catch(() => {});
      }
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedSolved) setSolved(JSON.parse(savedSolved));
      if (savedHide) setHideSolved(JSON.parse(savedHide));
    } catch {
      // Ignore localstorage parse issues
    }
  }, []);

  const getSolvedMap = useCallback(() => {
    return (username && solved[username]) || {};
  }, [username, solved]);

  const getSolvedTs = useCallback((title: string): number => {
    return getSolvedMap()[norm(title)] || 0;
  }, [getSolvedMap]);

  const isSolved = useCallback((title: string): boolean => {
    return getSolvedTs(title) > 0;
  }, [getSolvedTs]);

  const topicStats = useCallback((t: Topic): TopicStat => {
    const isQSolved = (q: Topic['q'][number]) => isSolved(q[1]);
    const reqQuestions = t.q.filter(q => q[2] !== 'H');
    const reqDone = reqQuestions.filter(isQSolved).length;
    const allDone = t.q.filter(isQSolved).length;
    const cpDone = t.cp.filter(isQSolved).length;
    const total = t.q.length + t.cp.length;
    const done = allDone + cpDone;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const complete = reqDone >= reqQuestions.length && cpDone >= Math.min(4, t.cp.length);

    return {
      done,
      total,
      pct,
      req: reqQuestions.length,
      reqDone,
      cpDone,
      complete
    };
  }, [isSolved]);

  const overallStats = useCallback((): OverallStat => {
    let total = 0;
    let done = 0;
    let topicsDone = 0;

    for (const t of TOPICS) {
      const st = topicStats(t);
      total += st.total;
      done += st.done;
      if (st.complete) topicsDone++;
    }

    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct, topicsDone };
  }, [topicStats]);

  const syncUser = useCallback(async (rawUsername: string): Promise<boolean> => {
    const clean = (rawUsername || '').trim();
    if (!clean) return false;

    setSyncing(true);
    setError(null);

    try {
      // 1. Fetch Profile Info via API module
      const profData = await fetchUserProfile(clean);

      // 2. Fetch Recent Submissions (Strictly filter Accepted)
      const subsList = await fetchUserSubmissions(clean, 100);

      const map: Record<string, number> = {};
      for (const s of subsList) {
        // ONLY count when actually accepted
        if (s.statusDisplay === 'Accepted' || s.status === 10) {
          const key = norm(s.title);
          const ts = (typeof s.timestamp === 'string' ? parseInt(s.timestamp, 10) : s.timestamp) * 1000;
          if (!map[key] || ts > map[key]) {
            map[key] = ts;
          }
        }
      }

      // 3. Fetch any existing cloud progress from Firestore
      const cloudData = await getUserProgress(clean);
      const cloudSolved = cloudData?.solved || {};
      const combinedMap = { ...cloudSolved, ...map };

      // Update state & LocalStorage
      setUsername(clean);
      setProfile(profData);
      setSolved(prev => {
        const next = { ...prev, [clean]: { ...(prev[clean] || {}), ...combinedMap } };
        localStorage.setItem('dsa.solved', JSON.stringify(next));
        return next;
      });

      const syncTs = Date.now();
      localStorage.setItem('dsa.user', JSON.stringify(clean));
      localStorage.setItem('dsa.profile', JSON.stringify(profData));
      localStorage.setItem('dsa.lastSync', JSON.stringify(syncTs));

      // 4. Save directly to Firestore partitioned by user ID
      await saveUserProgress(clean, {
        profile: profData,
        solved: combinedMap,
        lastSync: syncTs
      });

      setSyncing(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      setError(msg);
      setSyncing(false);
      return false;
    }
  }, []);

  const disconnectUser = useCallback(() => {
    setUsername('');
    setProfile(null);
    localStorage.removeItem('dsa.user');
    localStorage.removeItem('dsa.profile');
  }, []);

  return (
    <DsaContext.Provider
      value={{
        username,
        profile,
        solved,
        hideSolved,
        syncing,
        error,
        setHideSolved,
        syncUser,
        disconnectUser,
        isSolved,
        getSolvedTs,
        topicStats,
        overallStats
      }}
    >
      {children}
    </DsaContext.Provider>
  );
}

export function useDsa() {
  const ctx = useContext(DsaContext);
  if (!ctx) throw new Error('useDsa must be used within DsaProvider');
  return ctx;
}
