import React from 'react';
import { NeuralLoader } from '@/components/NeuralLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-deep-black grid place-items-center">
      {/* 1/9th Screen Constrained Container */}
      <div className="w-[33.33vw] h-[33.33vh] min-w-[300px] min-h-[250px] glass-card flex flex-col items-center justify-center relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden">
        {/* The Loader Component handles its own Hybrid logic internally */}
        <NeuralLoader />
        
        {/* Instant CSS Fallback Text (Pulse) */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          <p className="font-space text-[9px] uppercase tracking-[0.6em] text-brand-cyan/40 animate-pulse">
            Neural Handshake
          </p>
        </div>
      </div>

      {/* Background Decorative Grid */}
      <div className="absolute inset-0 css-grid-bg opacity-10 pointer-events-none" />
    </div>
  );
}
