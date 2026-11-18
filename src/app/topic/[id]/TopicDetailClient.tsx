'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOPICS } from '@/data/topics';
import { useDsa } from '@/context/DsaContext';
import { PatternModal } from '@/components/PatternModal';
import { ProblemModal } from '@/components/ProblemModal';
import { pad2, LEVEL_MAP } from '@/lib/utils';
import {
  ChevronDown,
  Search,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Tag,
  Target
} from 'lucide-react';

interface TopicDetailClientProps {
  topicId: number;
}

export function TopicDetailClient({ topicId }: TopicDetailClientProps) {
  const topic = TOPICS.find(t => t.id === topicId);
  const { isSolved, topicStats } = useDsa();

  // State
  const [bannerExpanded, setBannerExpanded] = useState<boolean>(false);
  const [activePatternIdx, setActivePatternIdx] = useState<number | null>(null);
  const [activeProblem, setActiveProblem] = useState<{ num: number; title: string } | null>(null);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [diffFilter, setDiffFilter] = useState<Record<string, boolean>>({ E: true, M: true, H: true });
  const [hideSolved, setHideSolved] = useState<boolean>(false);

  if (!topic) {
    notFound();
  }

  const topicIdx = TOPICS.findIndex(t => t.id === topicId);
  const prevTopic = TOPICS[topicIdx - 1];
  const nextTopic = TOPICS[topicIdx + 1];
  const stats = topicStats(topic);

  // Filter curated questions
  const filteredQuestions = useMemo(() => {
    return topic.q.filter(q => {
      if (!diffFilter[q[2]]) return false;
      if (hideSolved && isSolved(q[1])) return false;
      if (search.trim()) {
        const text = `#${q[0]} ${q[1]} ${q[3]}`.toLowerCase();
        if (!text.includes(search.toLowerCase().trim())) return false;
      }
      return true;
    });
  }, [topic.q, diffFilter, hideSolved, search, isSolved]);

  const toggleDiff = (k: string) => {
    setDiffFilter(prev => ({ ...prev, [k]: !prev[k] }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Topic Header Banner: Expandable & Collapsible (Collapsed by default) */}
      <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 sm:p-4 transition-all">
        <button
          onClick={() => setBannerExpanded(p => !p)}
          className="w-full flex items-center justify-between gap-2.5 sm:gap-3 text-left cursor-pointer group"
          title="Click to expand/collapse topic strategy"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold grid place-items-center shrink-0">
              {pad2(topic.id)}
            </span>
            <div className="min-w-0 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-sm sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-1.5 truncate">
                <span className="truncate">Topic {pad2(topic.id)}: {topic.name}</span>
                {stats.complete && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              </h1>
              <span className="text-xs text-stone-400 font-normal hidden sm:inline">
                ({topic.weeks})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-stone-100 dark:bg-zinc-800 text-[11px] sm:text-xs font-mono font-bold text-stone-800 dark:text-zinc-200">
              <span className="sm:hidden">{stats.done}/{stats.total}</span>
              <span className="hidden sm:inline">{stats.done} / {stats.total} Solved ({stats.pct}%)</span>
            </span>
            <span
              className={`w-7 h-7 rounded-lg border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 grid place-items-center text-stone-500 transition-transform duration-200 ${
                bannerExpanded ? 'rotate-180' : ''
              }`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>

        {/* Collapsible Content */}
        {bannerExpanded && (
          <div className="mt-3.5 pt-3 border-t border-stone-100 dark:border-zinc-800 animate-in fade-in">
            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed max-w-3xl font-sans">
              {topic.intro}
            </p>
            <div className="mt-2 text-[11px] font-mono text-stone-400">
              Recommended pace: <span className="text-stone-700 dark:text-zinc-300 font-semibold">{topic.weeks}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Patterns Sidebar (Left) + Questions Content (Right) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDE: Pattern Options List */}
        <aside className="lg:col-span-4 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 space-y-3 lg:sticky lg:top-20">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800">
            <h2 className="font-bold text-sm text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-orange-500" />
              <span>Patterns to Learn</span>
            </h2>
            <span className="text-[11px] font-mono text-stone-400">
              {topic.patterns.length} options
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-snug">
            Click any pattern to view its logic, walkthrough, C++ template, and visualizer:
          </p>

          <div className="space-y-1.5 max-h-72 lg:max-h-[calc(100vh-16rem)] overflow-y-auto no-scrollbar">
            {topic.patterns.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePatternIdx(idx)}
                className="w-full text-left p-2.5 sm:p-3 rounded-xl border border-stone-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 bg-white dark:bg-zinc-900 hover:bg-orange-50/40 dark:hover:bg-zinc-800/80 transition-all flex items-start gap-2.5 group cursor-pointer"
              >
                <span className="w-5 h-5 rounded-md bg-stone-100 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-950 text-stone-600 dark:text-zinc-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 font-mono text-[11px] font-bold grid place-items-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-stone-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                    {p[0]}
                  </div>
                  <div className="text-[11px] text-stone-400 dark:text-zinc-400 truncate mt-0.5">
                    {p[1]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT SIDE: Curated Questions and Checkpoints */}
        <main className="lg:col-span-8 space-y-6">
          {/* Filter Toolbar */}
          <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 sm:p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter questions..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-orange-500 text-stone-900 dark:text-zinc-100 text-xs"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap w-full sm:w-auto">
              {/* Difficulty Toggles */}
              <div className="inline-flex rounded-lg border border-stone-200 dark:border-zinc-700 p-0.5 bg-stone-50 dark:bg-zinc-800">
                {(['E', 'M', 'H'] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => toggleDiff(k)}
                    className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      diffFilter[k]
                        ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 shadow-xs'
                        : 'text-stone-400 opacity-60'
                    }`}
                  >
                    {k === 'E' ? 'Easy' : k === 'M' ? 'Medium' : 'Hard'}
                  </button>
                ))}
              </div>

              {/* Unsolved Only */}
              <button
                onClick={() => setHideSolved(p => !p)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-medium transition-colors ${
                  hideSolved ? 'bg-stone-100 dark:bg-zinc-800 text-orange-600 dark:text-orange-400' : ''
                }`}
              >
                {hideSolved ? 'Unsolved Only' : 'All Problems'}
              </button>
            </div>
          </div>

          {/* Curated Questions Table */}
          <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-stone-50 dark:bg-zinc-900/90 border-b border-stone-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-500">
                Core Curated Questions
              </span>
              <span className="font-mono text-stone-400 text-[11px] sm:text-xs">
                {stats.reqDone} / {stats.req} non-hard solved
              </span>
            </div>

            <ul className="divide-y divide-stone-100 dark:divide-zinc-800">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map(q => {
                  const solved = isSolved(q[1]);
                  const [lvlName, lvlClasses] = LEVEL_MAP[q[2]];

                  return (
                    <li
                      key={q[0]}
                      className="p-3.5 sm:p-4 transition-colors hover:bg-stone-100/70 dark:hover:bg-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-2.5 sm:gap-4 min-w-0">
                        {/* Solved Checkmark Circle */}
                        <span
                          className={`shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-xs mt-0.5 sm:mt-0 ${
                            solved
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-stone-300 dark:border-zinc-700 text-transparent'
                          }`}
                        >
                          ✓
                        </span>

                        <span className="font-mono text-xs text-stone-400 w-9 sm:w-11 shrink-0 mt-0.5 sm:mt-0">
                          #{q[0]}
                        </span>

                        {/* Title & Details */}
                        <div className="min-w-0 flex-1">
                          <button
                            onClick={() => setActiveProblem({ num: q[0], title: q[1] })}
                            className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 text-left transition-colors cursor-pointer block break-words"
                          >
                            {q[1]}
                          </button>
                          <div className="mt-1 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-400 flex-wrap">
                            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 inline-flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" /> {q[3]}
                            </span>
                            {solved && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                solved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-zinc-800/60 pl-8 sm:pl-0">
                        <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border text-[11px] sm:text-xs font-mono font-bold ${lvlClasses}`}>
                          {lvlName}
                        </span>

                        <button
                          onClick={() => setActiveProblem({ num: q[0], title: q[1] })}
                          className={`px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            solved
                              ? 'border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                              : 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                          }`}
                        >
                          {solved ? 'Review' : 'Solve'}
                        </button>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="p-6 text-center text-stone-400 text-xs">
                  No questions match your filter.
                </li>
              )}
            </ul>
          </div>

          {/* Checkpoints Section */}
          <div className="rounded-2xl border border-violet-200 dark:border-violet-900/40 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-violet-50/60 dark:bg-violet-950/30 border-b border-violet-100 dark:border-violet-900/40 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-zinc-100 flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-500" />
                  <span>Checkpoint Challenge</span>
                  <span className="text-xs font-normal text-stone-500 hidden sm:inline">
                    (Solve 4 of 5 to master topic)
                  </span>
                </h3>
              </div>
              <span
                className={`font-mono text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full ${
                  stats.cpDone >= 4
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300'
                }`}
              >
                {stats.cpDone} / 5 Solved
              </span>
            </div>

            <ul className="divide-y divide-stone-100 dark:divide-zinc-800">
              {topic.cp.map((q, idx) => {
                const solved = isSolved(q[1]);
                const [lvlName, lvlClasses] = LEVEL_MAP[q[2]];
                return (
                  <li
                    key={q[0]}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-stone-100/70 dark:hover:bg-zinc-800/60 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <span
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0 ${
                          solved
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-stone-300 dark:border-zinc-700 text-stone-400'
                        }`}
                      >
                        {solved ? '✓' : idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => setActiveProblem({ num: q[0], title: q[1] })}
                          className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer text-left block break-words"
                        >
                          {q[1]}
                        </button>
                        <div className="text-[11px] sm:text-xs text-stone-400 mt-1 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span>#{q[0]} · {q[3]}</span>
                          {solved && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              solved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-zinc-800/60 pl-8 sm:pl-0">
                      <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border text-[11px] sm:text-xs font-mono font-bold ${lvlClasses}`}>
                        {lvlName}
                      </span>

                      <button
                        onClick={() => setActiveProblem({ num: q[0], title: q[1] })}
                        className={`px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          solved
                            ? 'border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                            : 'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                      >
                        {solved ? 'Review' : 'Solve'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      </div>

      {/* Bottom Navigation: Topic Grid & Prev/Next Topic (No Footer!) */}
      <div className="pt-4 pb-8 border-t border-stone-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-500">
        <Link
          href="/"
          className="px-3 sm:px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1.5 transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Topic</span> Grid
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {prevTopic && (
            <Link
              href={`/topic/${prevTopic.id}`}
              className="px-3 sm:px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1 transition-all shadow-xs"
            >
              ← <span className="hidden sm:inline">Prev: {prevTopic.name}</span><span className="sm:hidden">Prev</span>
            </Link>
          )}
          {nextTopic && (
            <Link
              href={`/topic/${nextTopic.id}`}
              className="px-3 sm:px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1 transition-all shadow-xs"
            >
              <span className="hidden sm:inline">Next: {nextTopic.name}</span><span className="sm:hidden">Next</span> →
            </Link>
          )}
        </div>
      </div>

      {/* Pattern Modal */}
      {activePatternIdx !== null && (
        <PatternModal
          topic={topic}
          patternIndex={activePatternIdx}
          onClose={() => setActivePatternIdx(null)}
          onOpenProblem={(num, title) => setActiveProblem({ num, title })}
        />
      )}

      {/* Problem Modal */}
      {activeProblem && (
        <ProblemModal
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
        />
      )}
    </div>
  );
}
