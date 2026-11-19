'use client';

import React, { useState } from 'react';
import { Topic } from '@/data/topics';
import { DET, X, Y } from '@/data/patterns-data';
import { LESSONS_DATA } from '@/data/lessons-data';
import { VIZ } from '@/data/visualizers';
import { AlgorithmVisualizer } from '@/components/AlgorithmVisualizer';
import { LessonVisualizer } from '@/components/LessonVisualizer';
import { useToast } from '@/components/Toast';
import { pad2, LEVEL_MAP, problemUrl } from '@/lib/utils';
import { useDsa } from '@/context/DsaContext';
import {
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Layers,
  Target,
  Lightbulb,
  Code2,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ListFilter
} from 'lucide-react';

interface PatternLessonInPlaceProps {
  topic: Topic;
  patternIndex: number;
  isRead: boolean;
  onToggleRead: () => void;
  onBackToQuestions: () => void;
  onSelectPattern: (idx: number) => void;
}

export function PatternLessonInPlace({
  topic,
  patternIndex,
  isRead,
  onToggleRead,
  onBackToQuestions,
  onSelectPattern
}: PatternLessonInPlaceProps) {
  const { isSolved, patternMode, setPatternMode, displayClassic } = useDsa();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const key = `${topic.id}:${patternIndex}`;
  const pattern = topic.patterns[patternIndex];

  // New Lesson Data
  const lesson = LESSONS_DATA[String(topic.id)]?.[String(patternIndex)];

  // Classic Data
  const det = DET[topic.id]?.[patternIndex];
  const deep = X[key];
  const why = Y[key];
  const classicCode = why?.[2] || deep?.[3] || '';
  const hasClassicViz = !!VIZ[key];

  // Active code depending on mode
  const currentCode = patternMode === 'new' ? (lesson?.code || classicCode) : classicCode;

  // Match practice questions
  const pWords = (pattern?.[0] || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);

  let practiceQuestions = topic.q.concat(topic.cp).filter(q => {
    if (lesson?.practice?.includes(q[0])) return true;
    const tag = (q[3] || '').toLowerCase();
    return pWords.some(w => tag.includes(w));
  });

  if (!practiceQuestions.length) {
    practiceQuestions = topic.q.slice(0, 3);
  }

  const handleCopyCode = async () => {
    if (!currentCode) return;
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      toast('Copied C++ code to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Failed to copy', true);
    }
  };

  const patternTitle = (patternMode === 'new' && lesson?.name) || pattern[0];
  const patternSubtitle = (patternMode === 'new' && lesson?.when) || pattern[1];

  const prevPatternIdx = patternIndex > 0 ? patternIndex - 1 : null;
  const nextPatternIdx = patternIndex < topic.patterns.length - 1 ? patternIndex + 1 : null;

  return (
    <div className="space-y-6 w-full min-w-0 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onBackToQuestions}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs sm:text-sm font-semibold text-stone-700 dark:text-zinc-200 transition-colors cursor-pointer"
          title="Return to questions and checkpoint challenges"
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>Back to Questions</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {/* Mark As Read */}
          <button
            onClick={onToggleRead}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isRead
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-300'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`} />
            <span>{isRead ? 'Lesson Read' : 'Mark as Read'}</span>
          </button>

          {/* Pattern Mode Toggle - Only if displayClassic is enabled */}
          {displayClassic && (
            <div className="inline-flex rounded-lg border border-stone-200 dark:border-zinc-700 p-0.5 bg-stone-50 dark:bg-zinc-800 text-xs font-medium">
              <button
                onClick={() => setPatternMode('new')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  patternMode === 'new'
                    ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-orange-400 font-bold shadow-2xs'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200'
                }`}
                title="New pattern lesson"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>New</span>
              </button>
              <button
                onClick={() => setPatternMode('old')}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                  patternMode === 'old'
                    ? 'bg-white dark:bg-zinc-700 text-stone-900 dark:text-zinc-100 font-bold shadow-2xs'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200'
                }`}
                title="Classic summary"
              >
                <Layers className="w-3 h-3 text-stone-400" />
                <span>Classic</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-7 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-mono text-xs font-bold">
            Pattern #{pad2(patternIndex + 1)}
          </span>
          <span className="text-xs text-stone-400">·</span>
          <span className="text-xs text-stone-500 dark:text-zinc-400 font-mono">
            Topic {pad2(topic.id)}: {topic.name}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          {patternTitle}
        </h2>

        <p className="text-sm text-stone-600 dark:text-zinc-300 leading-relaxed font-sans">
          {patternSubtitle}
        </p>
      </div>

      {/* ---------------- NEW PATTERN LESSON ---------------- */}
      {patternMode === 'new' && lesson ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Core Idea */}
          {lesson.idea && (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Core Idea & Intuition
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-zinc-300 leading-relaxed">
                {lesson.idea}
              </p>
            </div>
          )}

          {/* Step-by-Step Algorithm */}
          {lesson.steps && lesson.steps.length > 0 && (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-orange-500" /> Step-by-Step Recipe
              </h3>
              <ol className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-zinc-300">
                {lesson.steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-stone-100 dark:bg-zinc-800 font-mono text-xs font-bold grid place-items-center shrink-0 mt-0.5 text-stone-600 dark:text-zinc-400">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{st}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Concrete Example & Interactive Simulation */}
          {lesson.example && (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Concrete Example & Simulation
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {lesson.example.problem}
                </p>
              </div>

              {lesson.example.viz && (
                <LessonVisualizer viz={lesson.example.viz} />
              )}

              {lesson.example.walk && (
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-800 text-xs text-stone-600 dark:text-zinc-300 leading-relaxed font-sans">
                  <strong className="text-stone-800 dark:text-zinc-200 block mb-1">
                    How to think through this:
                  </strong>
                  {lesson.example.walk}
                </div>
              )}
            </div>
          )}

          {/* C++ Code Template */}
          {lesson.code && (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-orange-500" /> C++ Implementation Template
                </h3>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-mono text-stone-600 dark:text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-stone-900 text-zinc-100 dark:bg-zinc-950 dark:border dark:border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{lesson.code}</code>
              </pre>
            </div>
          )}

          {/* Complexity Analysis */}
          {lesson.complexity && (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 text-xs text-stone-600 dark:text-zinc-300 flex items-start gap-2.5">
              <span className="font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider shrink-0 mt-0.5">
                Complexity:
              </span>
              <span className="leading-relaxed font-mono">{lesson.complexity}</span>
            </div>
          )}

          {/* Common Pitfalls / Gotchas */}
          {lesson.mistakes && lesson.mistakes.length > 0 && (
            <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 p-5 sm:p-6 space-y-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Common Mistakes & Pitfalls
              </h3>
              <ul className="space-y-1.5 text-xs text-rose-800 dark:text-rose-300/90 list-disc list-inside leading-relaxed">
                {lesson.mistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* ---------------- CLASSIC PATTERN VIEW ---------------- */
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-orange-500" /> Core Intuition & Logic
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-zinc-300 leading-relaxed">
              {det?.[0] || why?.[0] || pattern[1]}
            </p>

            {det?.[1] && (
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80 mt-3">
                <div className="text-[11px] font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Example Walkthrough
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {det[1].split('|').map((step, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-800 dark:text-zinc-200"
                    >
                      <span className="text-orange-500 font-bold">{sIdx + 1}.</span> {step}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {deep && (
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-stone-900 dark:text-rose-100">
                <div className="font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Common Pitfall
                </div>
                <p className="mt-1 leading-relaxed text-stone-800 dark:text-rose-100">
                  {deep[2]}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700/80 text-stone-800 dark:text-zinc-200">
                <div className="font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                  Complexity & Use Case
                </div>
                <p className="mt-1 leading-relaxed">
                  <strong className="text-stone-900 dark:text-white">Time / Space:</strong> {deep[1]}
                </p>
              </div>
            </div>
          )}

          {hasClassicViz && (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6">
              <AlgorithmVisualizer vizKey={key} />
            </div>
          )}

          {classicCode && (
            <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-orange-500" /> C++ Implementation Template
                </h3>
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-mono text-stone-600 dark:text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-stone-900 text-zinc-100 dark:bg-zinc-950 dark:border dark:border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{classicCode}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Practice Problems for this Pattern */}
      <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-zinc-100 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-orange-500" /> Practice Problems for this Pattern
        </h3>

        <div className="space-y-2">
          {practiceQuestions.map(q => {
            const solved = isSolved(q[1]);
            const [lvlName, lvlClasses] = LEVEL_MAP[q[2]];
            return (
              <div
                key={q[0]}
                className="p-3 rounded-xl border border-stone-100 dark:border-zinc-800/80 bg-stone-50/50 dark:bg-zinc-900/60 flex items-center justify-between gap-3 flex-wrap"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      solved
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-stone-300 dark:border-zinc-700 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className="font-mono text-xs text-stone-400 shrink-0">
                    #{q[0]}
                  </span>
                  <a
                    href={problemUrl(q[1])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-xs sm:text-sm text-stone-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate"
                  >
                    {q[1]}
                  </a>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${lvlClasses}`}>
                    {lvlName}
                  </span>
                  <a
                    href={problemUrl(q[1])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      solved
                        ? 'border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-2xs'
                    }`}
                  >
                    {solved ? 'Review' : 'Solve'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation: Prev / Next Pattern / Back to Questions */}
      <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs sm:text-sm">
        {prevPatternIdx !== null ? (
          <button
            onClick={() => onSelectPattern(prevPatternIdx)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev Pattern</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onBackToQuestions}
          className="text-stone-500 hover:text-orange-600 dark:hover:text-orange-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ListFilter className="w-4 h-4 text-orange-500" />
          <span>Back to All Questions</span>
        </button>

        {nextPatternIdx !== null ? (
          <button
            onClick={() => onSelectPattern(nextPatternIdx)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>Next Pattern</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
