'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import { TOPICS } from '@/data/topics';
import { LESSONS_DATA } from '@/data/lessons-data';
import { useDsa } from '@/context/DsaContext';
import { PatternLessonInPlace } from '@/components/PatternLessonInPlace';
import { pad2, LEVEL_MAP, problemUrl } from '@/lib/utils';
import {
  ChevronDown,
  Search,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Tag,
  Target,
  Sparkles,
  Layers,
  ExternalLink,
  ListFilter
} from 'lucide-react';

interface TopicDetailClientProps {
  topicId: number;
}

export function TopicDetailClient({ topicId }: TopicDetailClientProps) {
  const topic = TOPICS.find(t => t.id === topicId);
  const { isSolved, topicStats, patternMode, setPatternMode, displayClassic } = useDsa();
  const searchParams = useSearchParams();

  // State
  const [bannerExpanded, setBannerExpanded] = useState<boolean>(false);
  const [activePatternIdx, setActivePatternIdx] = useState<number | null>(null);
  const [readPatterns, setReadPatterns] = useState<Record<string, boolean>>({});

  // Sync active pattern from URL query param if present (?pattern=0)
  useEffect(() => {
    const pParam = searchParams.get('pattern');
    if (pParam !== null) {
      const idx = parseInt(pParam, 10);
      if (!isNaN(idx) && topic && topic.patterns[idx]) {
        setActivePatternIdx(idx);
      }
    }
  }, [searchParams, topic]);

  // Sync read status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dsa.read');
      if (saved) {
        setReadPatterns(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleRead = (tId: number, pIdx: number) => {
    const key = `${tId}.${pIdx}`;
    setReadPatterns(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('dsa.read', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

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
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0 animate-in fade-in duration-300">
      {/* Topic Header Banner: Expandable & Collapsible (Collapsed by default) */}
      <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 sm:p-4 transition-all w-full min-w-0">
        <button
          onClick={() => setBannerExpanded(p => !p)}
          className="w-full flex items-center justify-between gap-2.5 sm:gap-3 text-left cursor-pointer group min-w-0"
          title="Click to expand/collapse topic strategy"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <span className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold grid place-items-center shrink-0">
              {pad2(topic.id)}
            </span>
            <div className="min-w-0 flex-1 flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-sm sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-1.5 truncate">
                <span className="truncate">Topic {pad2(topic.id)}: {topic.name}</span>
                {stats.complete && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              </h1>
              <span className="text-xs text-stone-400 font-normal hidden sm:inline">
                ({topic.weeks})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
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
            <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed max-w-3xl font-sans break-words">
              {topic.intro}
            </p>
            <div className="mt-2 text-[11px] font-mono text-stone-400">
              Recommended pace: <span className="text-stone-700 dark:text-zinc-300 font-semibold">{topic.weeks}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Patterns Sidebar (Left) + Questions Content (Right) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* LEFT SIDE: Pattern Options List */}
        <aside className="lg:col-span-4 rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 space-y-3 lg:sticky lg:top-20 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-zinc-800 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-orange-500" />
              <h2 className="font-bold text-sm text-stone-900 dark:text-zinc-100">
                Patterns
              </h2>
              <span className="text-[11px] font-mono text-stone-400 ml-1">
                ({topic.patterns.length})
              </span>
            </div>

            {/* Action buttons / Toggles */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {activePatternIdx !== null && (
                <button
                  onClick={() => setActivePatternIdx(null)}
                  className="px-2 py-0.5 rounded-lg border border-orange-200 dark:border-orange-900/60 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-orange-100 transition-colors"
                  title="Switch right panel to question list"
                >
                  <ListFilter className="w-3 h-3" />
                  <span>Questions</span>
                </button>
              )}

              {/* Pattern Version Toggle Tabs - Only if displayClassic is enabled */}
              {displayClassic && (
                <div className="inline-flex rounded-lg border border-stone-200 dark:border-zinc-700 p-0.5 bg-stone-50 dark:bg-zinc-800 text-[11px] font-medium">
                  <button
                    onClick={() => setPatternMode('new')}
                    className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                      patternMode === 'new'
                        ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-orange-400 font-bold shadow-2xs'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200'
                    }`}
                    title="New pattern lessons"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>New</span>
                  </button>
                  <button
                    onClick={() => setPatternMode('old')}
                    className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                      patternMode === 'old'
                        ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 font-bold shadow-2xs'
                        : 'text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200'
                    }`}
                    title="Classic pattern summary"
                  >
                    <Layers className="w-3 h-3 text-stone-400" />
                    <span>Classic</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-snug">
            {activePatternIdx !== null
              ? 'Click any pattern below to switch lesson:'
              : 'Click any pattern to study its lesson directly on the right:'}
          </p>

          <div className="space-y-1.5 max-h-72 lg:max-h-[calc(100vh-16rem)] overflow-y-auto no-scrollbar w-full min-w-0">
            {topic.patterns.map((p, idx) => {
              const lesson = LESSONS_DATA[String(topic.id)]?.[String(idx)];
              const pTitle = patternMode === 'new' && lesson?.name ? lesson.name : p[0];
              const pSubtitle = patternMode === 'new' && lesson?.when ? lesson.when : p[1];
              const isPatternRead = !!readPatterns[`${topic.id}.${idx}`];
              const isActive = activePatternIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePatternIdx(prev => prev === idx ? null : idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-start gap-2.5 group cursor-pointer min-w-0 ${
                    isActive
                      ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold shadow-xs ring-1 ring-orange-500/30'
                      : 'border-stone-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 bg-white dark:bg-zinc-900 hover:bg-orange-50/40 dark:hover:bg-zinc-800/80 text-stone-800 dark:text-zinc-200'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md font-mono text-[11px] font-bold grid place-items-center shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-orange-600 text-white'
                        : 'bg-stone-100 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-950 text-stone-600 dark:text-zinc-400 group-hover:text-orange-700 dark:group-hover:text-orange-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="font-semibold text-xs leading-snug break-words flex items-center justify-between gap-1.5">
                      <span className="truncate">{pTitle}</span>
                      {isPatternRead && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-snug break-words">
                      {pSubtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT SIDE: Curated Questions and Checkpoints OR Pattern Lesson In-Place */}
        <div className="lg:col-span-8 space-y-6 w-full min-w-0">
          {activePatternIdx !== null ? (
            <PatternLessonInPlace
              topic={topic}
              patternIndex={activePatternIdx}
              isRead={!!readPatterns[`${topic.id}.${activePatternIdx}`]}
              onToggleRead={() => toggleRead(topic.id, activePatternIdx)}
              onBackToQuestions={() => setActivePatternIdx(null)}
              onSelectPattern={idx => {
                setActivePatternIdx(idx);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <>
          {/* Filter Toolbar */}
          <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 sm:p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 text-xs w-full min-w-0">
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
                          <a
                            href={problemUrl(q[1])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 text-left transition-colors cursor-pointer block break-words"
                          >
                            {q[1]}
                          </a>
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

                        <a
                          href={problemUrl(q[1])}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 ${
                            solved
                              ? 'border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                              : 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                          }`}
                        >
                          <span>{solved ? 'Review' : 'Solve'}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
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
                        <a
                          href={problemUrl(q[1])}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer text-left block break-words"
                        >
                          {q[1]}
                        </a>
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

                      <a
                        href={problemUrl(q[1])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all inline-flex items-center gap-1 ${
                          solved
                            ? 'border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                            : 'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                      >
                        <span>{solved ? 'Review' : 'Solve'}</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
            </>
          )}
        </div>
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
    </div>
  );
}
