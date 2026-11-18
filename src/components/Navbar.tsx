'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDsa } from '@/context/DsaContext';
import { useTheme } from '@/context/ThemeContext';
import { SettingsPopover } from '@/components/SettingsPopover';
import { Settings, Sun, Moon, Search } from 'lucide-react';

interface NavbarProps {
  onOpenPalette?: () => void;
}

export function Navbar({ onOpenPalette }: NavbarProps) {
  const { username, profile, overallStats } = useDsa();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = overallStats();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarUrl = profile?.profile?.userAvatar;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group transition-transform active:scale-95"
          >
            <img
              src="/images/logo.png"
              alt="DSA Logo"
              className="w-7 h-7 rounded-lg object-contain shrink-0 shadow-xs"
            />
            <span className="font-bold text-base tracking-tight text-stone-900 dark:text-white">
              DSA
            </span>
          </Link>
        </div>

        {/* Search Bar in Header (Middle) */}
        <div className="flex-1 max-w-sm hidden sm:block">
          <button
            onClick={onOpenPalette}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-stone-300 dark:hover:border-zinc-700 text-xs text-stone-400 transition-colors text-left cursor-pointer shadow-xs"
            title="Search topics, patterns, or problems (Ctrl+K or /)"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="text-stone-500 dark:text-zinc-400 truncate">
                Search topics, patterns, or problems
              </span>
            </span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 shrink-0 ml-2 text-stone-500">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenPalette}
            className="sm:hidden h-8 w-8 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 grid place-items-center text-stone-500 dark:text-zinc-400 transition-colors cursor-pointer"
            title="Search topics, patterns, questions"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          {/* Overall Solved Count */}
          <div
            className="hidden sm:flex items-center gap-2 font-mono text-xs text-stone-500 dark:text-zinc-400 mr-1"
            title={`${stats.done} of ${stats.total} total problems solved`}
          >
            <span className="font-semibold text-stone-800 dark:text-zinc-200">
              {stats.done}/{stats.total}
            </span>
            <div className="w-14 h-1.5 rounded-full bg-stone-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
          </div>

          {/* User Chip: Always expanded with avatar + username */}
          {username ? (
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="h-8 px-2 sm:px-2.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-medium transition-colors cursor-pointer max-w-[110px] xs:max-w-[140px] sm:max-w-none"
              title={`Connected as @${username}. Click for settings.`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-[10px] font-mono font-bold grid place-items-center shrink-0">
                  {username.slice(0, 2).toUpperCase()}
                </span>
              )}
              <span className="truncate">@{username}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowSettings(true)}
              className="h-8 px-2 sm:px-2.5 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-medium text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              Connect LC
            </button>
          )}

          {/* Settings In-Place Anchor */}
          <div className="relative" ref={containerRef}>
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="h-8 w-8 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 grid place-items-center transition-colors cursor-pointer text-stone-700 dark:text-zinc-300"
              title="Settings & Profile"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {showSettings && (
              <SettingsPopover onClose={() => setShowSettings(false)} />
            )}
          </div>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 grid place-items-center transition-colors cursor-pointer text-stone-700 dark:text-zinc-300"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-stone-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
