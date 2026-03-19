"use client";

import dynamic from 'next/dynamic';

const CinematicBackground = dynamic(
  () => import('./CinematicBackground').then((mod) => mod.CinematicBackground),
  { ssr: false }
);

export default function CinematicBackgroundWrapper() {
  return <CinematicBackground />;
}
