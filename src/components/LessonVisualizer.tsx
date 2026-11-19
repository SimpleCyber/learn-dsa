'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VizData, VizFrame } from '@/data/lessons-data';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SkipBack,
  Sparkles
} from 'lucide-react';

interface LessonVisualizerProps {
  viz: VizData;
  title?: string;
}

const CELL_STYLES: Record<string, string> = {
  '': 'bg-white dark:bg-zinc-900 border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-100',
  a: 'bg-orange-100 dark:bg-orange-500/20 border-orange-500 text-orange-900 dark:text-orange-200 font-bold',
  b: 'bg-violet-100 dark:bg-violet-500/20 border-violet-500 text-violet-900 dark:text-violet-200 font-bold',
  ok: 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold',
  bad: 'bg-rose-100 dark:bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200 font-bold',
  dim: 'bg-stone-100 dark:bg-zinc-800/50 border-stone-200 dark:border-zinc-800 text-stone-400 dark:text-zinc-500 opacity-50'
};

const PTR_COLORS = [
  'text-orange-500 bg-orange-100 dark:bg-orange-950/60 border-orange-300 dark:border-orange-800',
  'text-violet-500 bg-violet-100 dark:bg-violet-950/60 border-violet-300 dark:border-violet-800',
  'text-sky-500 bg-sky-100 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800',
  'text-pink-500 bg-pink-100 dark:bg-pink-950/60 border-pink-300 dark:border-pink-800',
  'text-teal-500 bg-teal-100 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800'
];

export function LessonVisualizer({ viz, title }: LessonVisualizerProps) {
  const [frameIdx, setFrameIdx] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const frames: VizFrame[] = viz?.frames || [];
  const currentFrame = frames[frameIdx] || frames[0];

  useEffect(() => {
    setFrameIdx(0);
    setPlaying(false);
  }, [viz]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setFrameIdx(prev => {
          if (prev >= frames.length - 1) {
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
  }, [playing, frames.length]);

  if (!viz || !frames.length) return null;

  // Resolve active cells (either from current frame or root viz)
  const cells: any[] = currentFrame.cells || viz.cells || [];
  const kind = viz.kind || 'array';
  const gridCells: any[][] = kind === 'grid' && Array.isArray(cells) && Array.isArray(cells[0])
    ? cells
    : [];

  return (
    <div className="rounded-2xl border border-stone-200 dark:border-zinc-800 bg-stone-50/80 dark:bg-zinc-900/90 p-4 sm:p-5 space-y-3.5 shadow-xs">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-200/80 dark:border-zinc-800">
        <div className="text-xs font-bold text-stone-800 dark:text-zinc-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Interactive Simulation{title ? `: ${title}` : ''}</span>
        </div>
        <div className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
          Step {frameIdx + 1} of {frames.length}
        </div>
      </div>

      {/* Main Stage: Dynamic rendering based on kind */}
      <div className="py-2 overflow-x-auto no-scrollbar min-h-[90px] flex flex-col justify-center">
        {/* Array / Linear representation */}
        {cells.length > 0 && kind !== 'graph' && kind !== 'grid' && (
          <div className="flex items-end gap-2 pb-3 pt-2 px-1 mx-auto min-w-min">
            {cells.map((val, idx) => {
              const hlKey = (currentFrame.hl && currentFrame.hl[idx]) || '';
              const style = CELL_STYLES[hlKey] || CELL_STYLES[''];

              // Match pointers targeting this cell
              const ptrMatches = currentFrame.ptrs
                ? Object.entries(currentFrame.ptrs).filter(([, pIdx]) => Number(pIdx) === idx)
                : [];

              return (
                <div key={idx} className="flex flex-col items-center shrink-0 w-12 sm:w-13">
                  {/* Pointers above or in cell */}
                  <div className="min-h-[18px] flex items-center justify-center gap-1 mb-1 flex-wrap">
                    {ptrMatches.map(([name], pK) => (
                      <span
                        key={name}
                        className={`text-[10px] font-mono font-bold px-1 py-0.2 rounded border ${
                          PTR_COLORS[pK % PTR_COLORS.length]
                        }`}
                      >
                        {name}
                      </span>
                    ))}
                  </div>

                  {/* Cell Box */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 border-2 rounded-xl grid place-items-center font-mono font-bold text-sm transition-all duration-300 shadow-2xs ${style}`}
                  >
                    {val}
                  </div>

                  {/* Index Label */}
                  <span className="text-[10px] font-mono text-stone-400 dark:text-zinc-500 mt-1">
                    {idx}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Graph representation if present */}
        {kind === 'graph' && viz.nodes && (
          <div className="py-2 flex justify-center">
            <svg viewBox="0 0 100 100" className="w-56 h-44 sm:w-64 sm:h-52">
              {/* Edges */}
              {viz.edges?.map(([u, v], eIdx) => {
                const nodeU = viz.nodes?.find(n => n.id === u);
                const nodeV = viz.nodes?.find(n => n.id === v);
                if (!nodeU || !nodeV) return null;
                return (
                  <line
                    key={eIdx}
                    x1={nodeU.x}
                    y1={nodeU.y}
                    x2={nodeV.x}
                    y2={nodeV.y}
                    stroke="currentColor"
                    className="text-stone-300 dark:text-zinc-700"
                    strokeWidth="1.5"
                  />
                );
              })}
              {/* Nodes */}
              {viz.nodes?.map(n => {
                const hl = currentFrame.hl && currentFrame.hl[n.id];
                const isHi = hl === 'a' || hl === 'ok' || hl === 'b';
                return (
                  <g key={n.id}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="6.5"
                      className={`transition-colors duration-300 ${
                        isHi
                          ? 'fill-orange-500 stroke-orange-300'
                          : 'fill-white dark:fill-zinc-800 stroke-stone-400 dark:stroke-zinc-600'
                      }`}
                      strokeWidth="1.5"
                    />
                    <text
                      x={n.x}
                      y={n.y + 2.5}
                      textAnchor="middle"
                      className={`text-[7px] font-bold font-mono ${
                        isHi ? 'fill-white' : 'fill-stone-800 dark:fill-zinc-200'
                      }`}
                    >
                      {n.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* 2D Grid representation if present */}
        {kind === 'grid' && gridCells.length > 0 && (
          <div className="overflow-x-auto py-1 max-w-full">
            <div className="flex flex-col items-center gap-1.5 min-w-max mx-auto">
              {gridCells.map((row: any[], rIdx: number) => (
                <div key={rIdx} className="flex gap-1.5 items-center">
                  {Array.isArray(viz.rows) && viz.rows[rIdx] !== undefined && (
                    <span className="w-6 text-[10px] font-mono text-stone-400 text-right pr-1">
                      {viz.rows[rIdx]}
                    </span>
                  )}
                  {Array.isArray(row) && row.map((cell: any, cIdx: number) => {
                    const cellKey = `${rIdx},${cIdx}`;
                    const hlKey = (currentFrame.hl && currentFrame.hl[cellKey]) || '';
                    const style = CELL_STYLES[hlKey] || CELL_STYLES[''];
                    return (
                      <div
                        key={cIdx}
                        className={`w-9 h-9 sm:w-10 sm:h-10 border rounded-lg grid place-items-center font-mono text-xs font-semibold transition-all duration-200 ${style}`}
                      >
                        {cell === null || cell === undefined ? '' : String(cell)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Auxiliary Display: Variables, Stack, Queue, Map */}
      <div className="space-y-2 pt-1">
        {/* Live Variables Chips */}
        {currentFrame.vars && Object.keys(currentFrame.vars).length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mr-1">
              Vars:
            </span>
            {Object.entries(currentFrame.vars).map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-xs font-mono shadow-2xs"
              >
                <span className="text-stone-400 font-semibold">{k}:</span>
                <span className="font-bold text-stone-900 dark:text-zinc-100">{String(v)}</span>
              </span>
            ))}
          </div>
        )}

        {/* Stack Display */}
        {currentFrame.stack && currentFrame.stack.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="text-[11px] uppercase tracking-wider text-stone-400">Stack:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {currentFrame.stack.map((item, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold"
                >
                  {String(item)}
                </span>
              ))}
              <span className="text-[11px] text-stone-400">← top</span>
            </div>
          </div>
        )}

        {/* Output Banner if present */}
        {currentFrame.out && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 text-xs font-mono font-bold animate-in fade-in">
            <span>🎉</span>
            <span>{currentFrame.out}</span>
          </div>
        )}
      </div>

      {/* Note Callout */}
      <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 text-xs sm:text-sm text-stone-800 dark:text-zinc-200 leading-relaxed font-sans">
        💡 {currentFrame.note}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => {
            setFrameIdx(0);
            setPlaying(false);
          }}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-stone-200 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 flex items-center gap-1 text-stone-600 dark:text-zinc-300 cursor-pointer transition-colors"
          title="Restart simulation"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setFrameIdx(0);
              setPlaying(false);
            }}
            disabled={frameIdx === 0}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            title="First frame"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setFrameIdx(p => Math.max(0, p - 1));
              setPlaying(false);
            }}
            disabled={frameIdx === 0}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            title="Previous step"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setPlaying(p => !p)}
            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => {
              setFrameIdx(p => Math.min(frames.length - 1, p + 1));
              setPlaying(false);
            }}
            disabled={frameIdx >= frames.length - 1}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-zinc-700 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            title="Next step"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
