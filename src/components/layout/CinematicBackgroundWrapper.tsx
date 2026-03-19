"use client";

import dynamic from 'next/dynamic';

const CinematicBackground = dynamic(
  () => import('@/components/layout/CinematicBackground'),
  { ssr: false }
);

export default function CinematicBackgroundWrapper() {
  return <CinematicBackground />;
}
