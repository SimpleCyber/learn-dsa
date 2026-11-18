'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VIZ, VizStep } from '@/data/visualizers';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface AlgorithmVisualizerProps {
  vizKey: string;
}

export function AlgorithmVisualizer({ vizKey }: AlgorithmVisualizerProps) {
  const viz = VIZ[vizKey];
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const steps: VizStep[] = viz ? viz.f() : [];
  const current = steps[stepIdx];

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [vizKey]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStepIdx(prev => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, steps.length]);

  if (!viz || !steps.length) return null;

  return (
    <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-50/80 dark:bg-zinc-900/80 p-4 space-y-3">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-xs font-bold text-stone-800 dark:text-zinc-200 flex items-center gap-1.5">
          <span>🎬</span>
          <span>Simulation: {viz.title}</span>
        </div>
        <div className="text-[11px] font-mono text-stone-500">
          Step {stepIdx + 1} / {steps.length}
        </div>
      </div>

      {/* Visualizer Cells */}
      <div className="flex gap-2 flex-wrap items-end min-h-[72px] py-2">
        {current.a.map((val, idx) => {
          const isHi = current.hi?.includes(idx);
          const inRange = current.range && idx >= current.range[0] && idx <= current.range[1];
          const pointers = current.p
            ? Object.entries(current.p)
                .filter(([, pIdx]) => pIdx === idx)
                .map(([name]) => name)
                .join(', ')
            : '';

          return (
            <div
              key={idx}
              className={`w-11 text-center border-2 rounded-lg py-1.5 transition-all duration-200 ${
                isHi
                  ? 'bg-orange-500/15 border-orange-500 -translate-y-1 scale-105'
                  : inRange
                  ? 'bg-violet-500/10 border-violet-500'
                  : 'border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
              }`}
            >
              <span className="block font-mono text-xs font-bold text-stone-800 dark:text-zinc-100">
                {val}
              </span>
              <span className="block text-[9px] opacity-60 text-stone-500 dark:text-zinc-400">
                idx {idx}
              </span>
              <span className="block min-h-[14px] text-[10px] font-bold text-orange-500 mt-0.5">
                {pointers}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stack display if present */}
      {current.stack && (
        <div className="text-xs font-mono flex items-center gap-2 text-stone-600 dark:text-zinc-300">
          <span className="font-bold text-[11px] uppercase tracking-wider text-stone-400">Stack:</span>
          <span>[{current.stack.join(', ')}]</span>
        </div>
      )}

      {/* Step Explanation Note */}
      <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-800/90 border border-stone-200 dark:border-zinc-700 text-xs font-mono text-stone-800 dark:text-zinc-200 leading-snug">
        💡 {current.note}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => { setStepIdx(0); setPlaying(false); }}
          className="px-2 py-1 rounded-md text-[11px] font-mono border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" /> Reset
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setStepIdx(p => Math.max(0, p - 1)); setPlaying(false); }}
            disabled={stepIdx === 0}
            className="p-1 rounded-md border border-stone-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setPlaying(p => !p)}
            className="px-2.5 py-1 rounded-md bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {playing ? 'Pause' : 'Play'}
          </button>

          <button
            onClick={() => { setStepIdx(p => Math.min(steps.length - 1, p + 1)); setPlaying(false); }}
            disabled={stepIdx >= steps.length - 1}
            className="p-1 rounded-md border border-stone-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
