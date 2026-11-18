'use client';

import React, { useState, useEffect } from 'react';
import { Topic } from '@/data/topics';
import { DET, X, Y } from '@/data/patterns-data';
import { VIZ } from '@/data/visualizers';
import { AlgorithmVisualizer } from '@/components/AlgorithmVisualizer';
import { useToast } from '@/components/Toast';
import { pad2, LEVEL_MAP } from '@/lib/utils';
import { useDsa } from '@/context/DsaContext';
import { Copy, Check, X as CloseIcon, AlertTriangle } from 'lucide-react';

interface PatternModalProps {
  topic: Topic;
  patternIndex: number;
  onClose: () => void;
  onOpenProblem: (num: number, title: string) => void;
}

export function PatternModal({ topic, patternIndex, onClose, onOpenProblem }: PatternModalProps) {
  const { isSolved } = useDsa();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const key = `${topic.id}:${patternIndex}`;
  const pattern = topic.patterns[patternIndex];
  const det = DET[topic.id]?.[patternIndex];
  const deep = X[key];
  const why = Y[key];
  const code = why?.[2] || deep?.[3] || '';
  const hasViz = !!VIZ[key];

  // Match related questions
  const pWords = (pattern?.[0] || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);

  let relatedQuestions = topic.q.concat(topic.cp).filter(q => {
    const tag = (q[3] || '').toLowerCase();
    return pWords.some(w => tag.includes(w));
  });
  if (!relatedQuestions.length) {
    relatedQuestions = topic.q.slice(0, 3);
  }

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast('Copied C++ code to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Failed to copy', true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-100 dark:border-zinc-800">
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-mono text-xs sm:text-sm font-bold grid place-items-center shrink-0 mt-0.5">
              {pad2(patternIndex + 1)}
            </span>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold truncate">
                Topic {pad2(topic.id)}: {topic.name}
              </div>
              <h3 className="text-base sm:text-xl font-bold text-stone-900 dark:text-zinc-100 mt-0.5 break-words">
                {pattern[0]}
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
                {pattern[1]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 grid place-items-center text-lg cursor-pointer shrink-0"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Intuition & Walkthrough */}
        {(det || why) && (
          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <span>💡</span> Core Intuition & Logic
              </div>
              <p className="mt-2 text-stone-800 dark:text-zinc-100 leading-relaxed font-sans text-sm">
                {det?.[0] || why?.[0]}
              </p>
            </div>

            {det?.[1] && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/50 border border-stone-200 dark:border-zinc-700/80">
                <div className="text-[11px] font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
                  Example Walkthrough
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono">
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
        )}

        {/* Pitfalls & Complexity */}
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
              <p className="mt-0.5 leading-relaxed">
                <strong className="text-stone-900 dark:text-white">Use when:</strong> {deep[0]}
              </p>
            </div>
          </div>
        )}

        {/* Step-by-Step Algorithm */}
        {why?.[1] && (
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-1.5">
              Algorithm Steps
            </div>
            <ol className="space-y-1.5 text-xs text-stone-800 dark:text-zinc-200">
              {why[1].split('|').map((st, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-700 dark:text-zinc-300 font-mono text-[10px] grid place-items-center mt-0.5 shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{st}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Interactive Visualizer */}
        {hasViz && <AlgorithmVisualizer vizKey={key} />}

        {/* C++ Reference Code */}
        {code && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <span>⚡</span> C++ Reference Template
              </span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-md text-xs font-mono border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center gap-1 text-stone-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-3 sm:p-4 rounded-xl bg-stone-900 text-zinc-100 dark:bg-zinc-950 dark:border dark:border-zinc-800 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        )}

        {/* Related Questions */}
        {relatedQuestions.length > 0 && (
          <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                Related Questions ({relatedQuestions.length})
              </div>
              <span className="text-[11px] text-stone-400">Practice in {topic.name}</span>
            </div>
            <div className="space-y-2">
              {relatedQuestions.map(rq => {
                const solved = isSolved(rq[1]);
                const [lvlName, lvlCls] = LEVEL_MAP[rq[2]];
                return (
                  <div
                    key={rq[0]}
                    className="p-3 rounded-xl border border-stone-200 dark:border-zinc-700/80 bg-stone-50/70 dark:bg-zinc-800/60 hover:bg-stone-100/80 dark:hover:bg-zinc-800/90 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          solved
                            ? 'bg-emerald-500 text-white'
                            : 'border border-stone-300 dark:border-zinc-600 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span className="font-mono text-xs text-stone-400 dark:text-zinc-400 shrink-0">
                        #{rq[0]}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenProblem(rq[0], rq[1]);
                        }}
                        className="font-semibold text-xs text-stone-800 dark:text-zinc-100 hover:text-orange-600 dark:hover:text-orange-400 text-left truncate cursor-pointer transition-colors"
                      >
                        {rq[1]}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${lvlCls} font-mono font-bold`}>
                        {lvlName}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenProblem(rq[0], rq[1]);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          solved
                            ? 'border border-stone-300 dark:border-zinc-700 text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-700'
                            : 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90'
                        }`}
                      >
                        {solved ? 'Review' : 'Solve'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
