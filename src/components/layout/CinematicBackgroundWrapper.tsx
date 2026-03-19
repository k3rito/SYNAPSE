"use client";

import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const CinematicBackground = dynamic(
  () => import('@/components/layout/CinematicBackground'),
  { ssr: false }
);

export default function CinematicBackgroundWrapper() {
  return (
    <ErrorBoundary>
      <CinematicBackground />
    </ErrorBoundary>
  );
}
