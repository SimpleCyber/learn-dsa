import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { TOPICS } from '@/data/topics';
import { LESSONS_DATA } from '@/data/lessons-data';
import { PatternLessonView } from '@/components/PatternLessonView';

export function generateStaticParams() {
  const params: { topicId: string; patternIndex: string }[] = [];
  TOPICS.forEach(t => {
    t.patterns.forEach((_, pIdx) => {
      params.push({
        topicId: String(t.id),
        patternIndex: String(pIdx),
      });
    });
  });
  return params;
}

interface PageProps {
  params: Promise<{
    topicId: string;
    patternIndex: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topicId, patternIndex } = await params;
  const tId = parseInt(topicId, 10);
  const pIdx = parseInt(patternIndex, 10);
  const topic = TOPICS.find(t => t.id === tId);
  const lesson = LESSONS_DATA[String(tId)]?.[String(pIdx)];
  const name = lesson?.name || topic?.patterns[pIdx]?.[0] || 'Pattern Lesson';

  return {
    title: `${name} | Pattern #${pIdx + 1} | DSA Patterns`,
    description: lesson?.when || topic?.patterns[pIdx]?.[1] || 'Algorithmic pattern breakdown, C++ template, and visual simulation.'
  };
}

async function LearnPatternWrapper({ params }: PageProps) {
  const { topicId, patternIndex } = await params;
  const tId = parseInt(topicId, 10);
  const pIdx = parseInt(patternIndex, 10);

  return <PatternLessonView topicId={tId} patternIndex={pIdx} />;
}

export default function LearnPatternPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-stone-400">Loading pattern lesson...</div>}>
      <LearnPatternWrapper {...props} />
    </Suspense>
  );
}
