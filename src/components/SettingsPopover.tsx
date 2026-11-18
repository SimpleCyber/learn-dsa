'use client';

import React, { useState } from 'react';
import { useDsa } from '@/context/DsaContext';
import { useToast } from '@/components/Toast';
import { ExternalLink, RefreshCw, Unlink, User } from 'lucide-react';

interface SettingsPopoverProps {
  onClose: () => void;
}

export function SettingsPopover({ onClose }: SettingsPopoverProps) {
  const { username, profile, syncing, syncUser, disconnectUser } = useDsa();
  const { toast } = useToast();
  const [inputVal, setInputVal] = useState(username || '');

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const ok = await syncUser(inputVal.trim());
    if (ok) {
      toast(`Synced @${inputVal.trim()}`);
    } else {
      toast('Failed to sync user', true);
    }
  };

  const handleDisconnect = () => {
    disconnectUser();
    setInputVal('');
    toast('Disconnected account');
  };

  const acStats = profile?.submitStats?.acSubmissionNum || [];
  const getAc = (diff: string) => acStats.find(s => s.difficulty === diff)?.count ?? 0;

  return (
    <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 z-50 p-4 shadow-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl space-y-3.5 animate-in fade-in zoom-in-95">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-orange-500" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-zinc-100">
            LeetCode Profile
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 text-xs p-1"
        >
          ✕
        </button>
      </div>

      {/* Connected User Overview */}
      {username && profile ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {profile.profile?.userAvatar ? (
              <img
                src={profile.profile.userAvatar}
                alt="Avatar"
                className="w-11 h-11 rounded-full object-cover border border-stone-200 dark:border-zinc-700 shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-300 font-bold grid place-items-center text-sm shrink-0">
                {username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-stone-900 dark:text-zinc-100 truncate">
                {profile.profile?.realName || username}
              </div>
              <div className="text-xs text-stone-500 dark:text-zinc-400 font-mono">
                @{username}
              </div>
              {profile.profile?.ranking ? (
                <div className="text-[11px] text-stone-400">
                  Rank #{profile.profile.ranking.toLocaleString()}
                </div>
              ) : null}
            </div>
          </div>

          {/* Social Links */}
          {(profile.githubUrl || profile.linkedinUrl) && (
            <div className="flex items-center gap-2 pt-1">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded-md text-[11px] font-mono text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800 hover:text-orange-500 flex items-center gap-1"
                >
                  GitHub <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded-md text-[11px] font-mono text-stone-600 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800 hover:text-orange-500 flex items-center gap-1"
                >
                  LinkedIn <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          )}

          {/* Platform Stats Grid */}
          <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-800 text-center font-mono">
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-zinc-100">{getAc('All')}</div>
              <div className="text-[10px] text-stone-400">Solved</div>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{getAc('Easy')}</div>
              <div className="text-[10px] text-stone-400">Easy</div>
            </div>
            <div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{getAc('Medium')}</div>
              <div className="text-[10px] text-stone-400">Med</div>
            </div>
            <div>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{getAc('Hard')}</div>
              <div className="text-[10px] text-stone-400">Hard</div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
          Connect your LeetCode account to automatically verify and mark your solved questions.
        </p>
      )}

      {/* Username Sync Form */}
      <form onSubmit={handleSync} className="space-y-2 pt-1">
        <div className="flex gap-1.5">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="LeetCode username"
            className="flex-1 px-2.5 py-1.5 rounded-lg text-xs border border-stone-200 dark:border-zinc-700 bg-stone-50 dark:bg-zinc-800 text-stone-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={syncing || !inputVal.trim()}
            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing' : username ? 'Sync' : 'Connect'}
          </button>
        </div>
      </form>

      {/* Disconnect Option */}
      {username && (
        <div className="pt-2 border-t border-stone-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={handleDisconnect}
            className="text-[11px] text-stone-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Unlink className="w-3 h-3" /> Disconnect account
          </button>
        </div>
      )}
    </div>
  );
}
