'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TOPICS } from '@/data/topics';
import { pad2 } from '@/lib/utils';
import { Search, BookOpen, Layers, Code2 } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Keyboard toggle
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Default view: Show all 12 roadmap topics
    if (!q) {
      return TOPICS.map(t => ({
        type: 'topic' as const,
        title: `Topic ${pad2(t.id)}: ${t.name}`,
        sub: `${t.weeks} pace · ${t.patterns.length} patterns · ${t.q.length + t.cp.length} problems`,
        action: () => {
          router.push(`/topic/${t.id}`);
          onClose();
        }
      }));
    }

    const items: Array<{
      type: 'topic' | 'pattern' | 'question';
      title: string;
      sub: string;
      action: () => void;
    }> = [];

    // Search topics
    for (const t of TOPICS) {
      if (t.name.toLowerCase().includes(q) || `topic ${t.id}`.includes(q)) {
        items.push({
          type: 'topic',
          title: `Topic ${pad2(t.id)}: ${t.name}`,
          sub: `${t.weeks} pace · ${t.patterns.length} patterns`,
          action: () => {
            router.push(`/topic/${t.id}`);
            onClose();
          }
        });
      }

      // Search patterns
      t.patterns.forEach(([name, desc]) => {
        if (name.toLowerCase().includes(q) || desc.toLowerCase().includes(q)) {
          items.push({
            type: 'pattern',
            title: name,
            sub: `Topic ${pad2(t.id)}: ${t.name}`,
            action: () => {
              router.push(`/topic/${t.id}`);
              onClose();
            }
          });
        }
      });

      // Search questions (clean title, no hashtag)
      t.q.concat(t.cp).forEach(([num, title, diff, tag]) => {
        if (`${num} ${title} ${tag}`.toLowerCase().includes(q)) {
          items.push({
            type: 'question',
            title: `${title} (${diff === 'E' ? 'Easy' : diff === 'M' ? 'Medium' : 'Hard'})`,
            sub: `${t.name} · ${tag}`,
            action: () => {
              router.push(`/topic/${t.id}`);
              onClose();
            }
          });
        }
      });
    }

    return items.slice(0, 20);
  }, [query, router, onClose]);

  if (!isOpen) return null;

  const isDefaultView = !query.trim();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 dark:border-zinc-800">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search topics, patterns, or problems"
            autoFocus
            className="flex-1 bg-transparent text-sm text-stone-900 dark:text-zinc-100 outline-none placeholder:text-stone-400"
          />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-100 dark:bg-zinc-800 text-stone-500 border border-stone-200 dark:border-zinc-700 shrink-0">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {isDefaultView && (
            <div className="px-3 pt-1.5 pb-1 text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold">
              Roadmap Topics (12)
            </div>
          )}

          {results.length > 0 ? (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={res.action}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-800/80 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-stone-400 group-hover:text-orange-500 transition-colors shrink-0">
                    {res.type === 'topic' ? (
                      <Layers className="w-4 h-4" />
                    ) : res.type === 'pattern' ? (
                      <BookOpen className="w-4 h-4" />
                    ) : (
                      <Code2 className="w-4 h-4" />
                    )}
                  </span>
                  <div className="truncate">
                    <span className="font-semibold text-stone-800 dark:text-zinc-200">
                      {res.title}
                    </span>
                    <span className="text-stone-400 text-[11px] ml-2">
                      {res.sub}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-500 shrink-0">
                  {res.type}
                </span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-stone-400">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
