import React from 'react';
import { curriculumData } from '@/utils/curriculumData';
import { TrackClientContent } from '@/components/curriculum/TrackClientContent';

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const params: any[] = [];

  Object.keys(curriculumData).forEach(trackSlug => {
    locales.forEach(locale => {
      params.push({
        locale,
        trackSlug
      });
    });
  });

  return params;
}

export const dynamicParams = true;

export default async function TrackPage({
  params
}: {
  params: Promise<{
    locale: string;
    trackSlug: string;
  }>;
}) {
  const rawParams = await params;
  const locale = decodeURIComponent(rawParams.locale);
  const trackSlug = decodeURIComponent(rawParams.trackSlug);

  return (
    <TrackClientContent
      trackSlug={trackSlug}
    />
  );
}
