import React from 'react';
import { curriculumData } from '@/utils/curriculumData';
import { DifficultyClientContent } from '@/components/curriculum/DifficultyClientContent';

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const params: any[] = [];

  Object.keys(curriculumData).forEach(trackSlug => {
    ['Beginner', 'Intermediate', 'Advanced', 'Pro'].forEach(difficulty => {
      locales.forEach(locale => {
        params.push({
          locale,
          trackSlug,
          difficulty
        });
      });
    });
  });

  return params;
}

export const dynamicParams = true;

export default async function DifficultyTopicsPage({
  params
}: {
  params: Promise<{
    locale: string;
    trackSlug: string;
    difficulty: string;
  }>;
}) {
  const rawParams = await params;
  const locale = decodeURIComponent(rawParams.locale);
  const trackSlug = decodeURIComponent(rawParams.trackSlug);
  const difficulty = decodeURIComponent(rawParams.difficulty);

  return (
    <DifficultyClientContent
      trackSlug={trackSlug}
      difficulty={difficulty}
    />
  );
}
