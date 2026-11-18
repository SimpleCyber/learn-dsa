'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOPICS, Topic } from '@/data/topics';
import { useDsa } from '@/context/DsaContext';
import { pad2 } from '@/lib/utils';
import { Search, ChevronRight, CheckCircle2, Flame } from 'lucide-react';

export default function TopicsPage() {
  const { topicStats, overallStats } = useDsa();
  const [search, setSearch] = useState('');

  const stats = overallStats();

  const filteredTopics = TOPICS.filter(t => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const inName = t.name.toLowerCase().includes(q);
    const inPatterns = t.patterns.some(p => p[0].toLowerCase().includes(q) || p[1].toLowerCase().includes(q));
    const inQuestions = t.q.some(prob => prob[1].toLowerCase().includes(q) || `#${prob[0]}`.includes(q));
    return inName || inPatterns || inQuestions;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 w-full min-w-0">
      {/* Hero Stats Card */}
      <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-8 shadow-xs w-full min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 font-mono text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Pattern-Based DSA Mastery</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white leading-tight">
              Stop watching 500 videos. Learn the patterns.
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              Every coding interview problem stems from fundamental algorithmic patterns. Master the core intuition, walkthrough, and C++ template for each category.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full md:w-auto font-mono shrink-0">
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-800 text-center min-w-0">
              <div className="text-lg sm:text-xl font-bold text-stone-900 dark:text-zinc-100">
                {stats.done}
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-400 uppercase tracking-wide truncate">
                Problems
              </div>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-800 text-center min-w-0">
              <div className="text-lg sm:text-xl font-bold text-orange-500">
                {stats.pct}%
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-400 uppercase tracking-wide truncate">
                Completed
              </div>
            </div>
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-800 text-center min-w-0">
              <div className="text-lg sm:text-xl font-bold text-emerald-500">
                {stats.topicsDone}/12
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-400 uppercase tracking-wide truncate">
                Mastered
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-stone-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-mono text-stone-500">
          <div className="flex items-center gap-2">
            <span>Overall Progress:</span>
            <span className="font-bold text-stone-800 dark:text-zinc-200">
              {stats.done} / {stats.total} Solved
            </span>
          </div>
          <div className="w-full sm:flex-1 sm:max-w-md h-2 rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search & Topic Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-zinc-100">
            Roadmap Topics
          </h2>
          <span className="text-xs font-mono text-stone-400">
            ({filteredTopics.length} of 12)
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 sm:top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search topic or pattern..."
            className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl text-xs border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredTopics.map((t: Topic) => {
          const s = topicStats(t);
          return (
            <Link
              key={t.id}
              href={`/topic/${t.id}`}
              className="group p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Topic Top Line */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold grid place-items-center">
                      {pad2(t.id)}
                    </span>
                    <span className="text-xs font-mono text-stone-400 font-normal">
                      {t.weeks}
                    </span>
                  </div>

                  {s.complete ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Mastered
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-stone-500 dark:text-zinc-400 font-semibold">
                      {s.done}/{s.total} Solved
                    </span>
                  )}
                </div>

                {/* Topic Name */}
                <h3 className="font-bold text-base text-stone-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center justify-between">
                  <span>{t.name}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-500 transition-transform group-hover:translate-x-0.5" />
                </h3>

                {/* Short Intro */}
                <p className="text-xs text-stone-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {t.intro}
                </p>

                {/* Pattern Highlights Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.patterns.slice(0, 3).map(([pName], pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-zinc-800 text-[10px] font-mono text-stone-600 dark:text-zinc-400"
                    >
                      {pName}
                    </span>
                  ))}
                  {t.patterns.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono text-stone-400">
                      +{t.patterns.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800/80">
                <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      s.complete ? 'bg-emerald-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
