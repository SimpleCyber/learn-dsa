'use client';

import React from 'react';
import { ExternalLink, Check, X as CloseIcon } from 'lucide-react';
import { useDsa } from '@/context/DsaContext';

interface ProblemModalProps {
  problem: { num: number; title: string } | null;
  onClose: () => void;
}

export function ProblemModal({ problem, onClose }: ProblemModalProps) {
  const { isSolved } = useDsa();

  if (!problem) return null;

  const slug = problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const leetCodeUrl = `https://leetcode.com/problems/${slug}/`;
  const solved = isSolved(problem.title);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl p-4 sm:p-6 space-y-3.5 sm:space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-xs text-orange-500 font-bold">
              LeetCode #{problem.num}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-zinc-100 mt-0.5 break-words">
              {problem.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 p-1 rounded-lg shrink-0"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-800 text-xs text-stone-600 dark:text-zinc-400 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-zinc-200">Status:</span>
            {solved ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Solved & Verified
              </span>
            ) : (
              <span className="text-stone-400">Unsolved</span>
            )}
          </div>
          <p className="text-[11px] leading-relaxed pt-1">
            Solve this problem on LeetCode. When your code is accepted, your progress will automatically sync here.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-zinc-700 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
          <a
            href={leetCodeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            Open in LeetCode <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
