import { Suspense } from 'react';
import { TOPICS } from '@/data/topics';
import { TopicDetailClient } from './TopicDetailClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return TOPICS.map(t => ({
    id: String(t.id),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function TopicDetailWrapper({ params }: PageProps) {
  const { id } = await params;
  const topicId = Number(id);
  const topic = TOPICS.find(t => t.id === topicId);

  if (!topic) {
    notFound();
  }

  return <TopicDetailClient topicId={topicId} />;
}

export default function TopicPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-stone-400">Loading topic...</div>}>
      <TopicDetailWrapper {...props} />
    </Suspense>
  );
}
