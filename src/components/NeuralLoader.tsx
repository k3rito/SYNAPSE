'use client';

import React, { memo } from 'react';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

/**
 * NeuralLoader - A high-performance optimized component for Synapse AI.
 * Implements a Hybrid Strategy:
 * - Premium: Optimized SVG Chip (WebGL enabled)
 * - Fallback: Minimalist CSS Glow (WebGL disabled)
 */
export const NeuralLoader = memo(() => {
  const isSupported = useWebGLSupport();

  // If not supported or still detecting, show the lightweight fallback instantly
  const showPremium = isSupported === true;

  return (
    <div className="w-[33vw] h-[33vh] grid place-items-center relative overflow-hidden bg-transparent">
      {showPremium ? (
        <div className="w-full max-w-[280px] scale-90 sm:scale-110">
          <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <defs>
              <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#050505" />
              </linearGradient>
              <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#083344" />
              </linearGradient>
              <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#333" />
                <stop offset="50%" stopColor="#222" />
                <stop offset="100%" stopColor="#111" />
              </linearGradient>
            </defs>

            <g id="traces">
              <path d="M100 100 H200 V210 H326" className="trace-bg" />
              <path d="M100 100 H200 V210 H326" className="trace-flow blue-flow" />
              <path d="M80 180 H180 V230 H326" className="trace-bg" />
              <path d="M80 180 H180 V230 H326" className="trace-flow blue-flow" />
              <path d="M100 350 H200 V270 H326" className="trace-bg" />
              <path d="M100 350 H200 V270 H326" className="trace-flow blue-flow" />
              <path d="M700 90 H560 V210 H474" className="trace-bg" />
              <path d="M700 90 H560 V210 H474" className="trace-flow blue-flow" />
              <path d="M740 160 H580 V230 H474" className="trace-bg" />
              <path d="M740 160 H580 V230 H474" className="trace-flow blue-flow" />
              <path d="M680 340 H570 V270 H474" className="trace-bg" />
              <path d="M680 340 H570 V270 H474" className="trace-flow blue-flow" />
            </g>

            <rect x="330" y="190" width="140" height="100" rx="20" fill="url(#chipGradient)" stroke="#22d3ee44" strokeWidth="2" />

            <g>
              {[205, 225, 245, 265].map(y => (
                <React.Fragment key={y}>
                  <rect x="322" y={y} width="8" height="10" fill="url(#pinGradient)" rx="2" />
                  <rect x="470" y={y} width="8" height="10" fill="url(#pinGradient)" rx="2" />
                </React.Fragment>
              ))}
            </g>

            <text x="400" y="245" fontSize="18" fill="url(#textGradient)" textAnchor="middle" className="chip-text">
              SYNAPSE
            </text>

            <g fill="#22d3ee22">
              <circle cx="100" cy="100" r="3" />
              <circle cx="80" cy="180" r="3" />
              <circle cx="100" cy="350" r="3" />
              <circle cx="700" cy="90" r="3" />
              <circle cx="740" cy="160" r="3" />
              <circle cx="680" cy="340" r="3" />
            </g>
          </svg>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full bg-brand-cyan/20 animate-ping" />
            <div className="relative w-full h-full rounded-full bg-brand-cyan shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-pulse" />
          </div>
          <p className="font-space text-[10px] uppercase tracking-[0.4em] text-brand-cyan animate-pulse">
            Neural Syncing
          </p>
        </div>
      )}
    </div>
  );
});

NeuralLoader.displayName = 'NeuralLoader';
