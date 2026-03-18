import React from 'react';
import { curriculumData, DifficultyLevel } from '@/utils/curriculumData';
import { TopicClientContent } from '@/components/curriculum/TopicClientContent';

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const params: any[] = [];

  Object.keys(curriculumData).forEach(trackSlug => {
    const track = curriculumData[trackSlug];
    track.topics.forEach(topic => {
      ['Beginner', 'Intermediate', 'Advanced', 'Pro'].forEach(difficulty => {
        locales.forEach(locale => {
          params.push({
            locale,
            trackSlug,
            difficulty,
            topicSlug: topic.id
          });
        });
      });
    });
  });

  return params;
}

export const dynamicParams = true;

export default async function DifficultyRoadmapPage({
  params
}: {
  params: Promise<{
    locale: string;
    trackSlug: string;
    difficulty: string;
    topicSlug: string;
  }>;
}) {
  const rawParams = await params;
  const locale = decodeURIComponent(rawParams.locale);
  const trackSlug = decodeURIComponent(rawParams.trackSlug);
  const difficulty = decodeURIComponent(rawParams.difficulty);
  const topicSlug = decodeURIComponent(rawParams.topicSlug);

  return (
    <TopicClientContent
      locale={locale}
      trackSlug={trackSlug}
      difficulty={difficulty as DifficultyLevel}
      topicSlug={topicSlug}
    />
  );
}
