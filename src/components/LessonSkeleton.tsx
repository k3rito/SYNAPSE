import React from 'react';
import { GlassCard } from './ui/GlassCard';

export const LessonSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-pulse">
      {/* Title Skeleton */}
      <div className="h-4 w-32 bg-white/5 rounded-full mb-6 border border-white/10" />
      <div className="h-12 w-3/4 bg-white/5 rounded-2xl mb-4 border border-white/10" />
      <div className="h-6 w-1/2 bg-white/5 rounded-xl mb-12 border border-white/10" />

      {/* Content Blocks Skeletons */}
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-6">
            <div className="h-8 w-1/3 bg-brand-cyan/5 rounded-xl border border-brand-cyan/10" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/5 rounded-lg border border-white/10" />
              <div className="h-4 w-full bg-white/5 rounded-lg border border-white/10" />
              <div className="h-4 w-2/3 bg-white/5 rounded-lg border border-white/10" />
            </div>
            
            {/* "Floating Image" Placeholder */}
            {i === 2 && (
              <div className="w-full aspect-video rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
              </div>
            )}

            {/* "Code Block" Placeholder */}
            {i === 1 && (
              <div className="w-full h-48 rounded-xl bg-black/40 border border-white/5" />
            )}
          </div>
        ))}
      </div>

      {/* Quiz Section Skeleton */}
      <div className="mt-20">
        <div className="h-10 w-48 bg-white/5 rounded-full mb-8 border border-white/10 mx-auto" />
        <GlassCard className="p-8 space-y-6 opacity-30">
          <div className="h-6 w-3/4 bg-white/5 rounded-lg border border-white/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="h-14 bg-white/5 rounded-xl border border-white/10" />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
