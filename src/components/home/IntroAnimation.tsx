'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          onComplete
        });
      }
    });

    // Initial state
    gsap.set(textRef.current, { opacity: 0, scale: 0.8, filter: 'blur(10px)' });
    gsap.set(networkRef.current, { scale: 0 });

    // Neural network forming
    tl.to(networkRef.current, {
      scale: 1,
      duration: 2,
      ease: 'elastic.out(1, 0.5)'
    })
    
    // SYNAPSE text appears with glow
    .to(textRef.current, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.5,
      ease: 'power3.out'
    }, '-=1')

    // Hold for a moment
    .to({}, { duration: 1.5 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-deep-black flex items-center justify-center flex-col overflow-hidden"
    >
      {/* Abstract Neural Network representing SVG/CSS animation before text */}
      <div 
        ref={networkRef}
        className="absolute w-64 h-64 border border-brand-cyan/30 rounded-full flex items-center justify-center"
      >
        <div className="w-48 h-48 border border-brand-cyan/20 rounded-full flex items-center justify-center rotate-45">
          <div className="w-32 h-32 border border-brand-cyan/40 rounded-full" />
        </div>
      </div>

      <h1 
        ref={textRef}
        className="relative z-10 text-6xl md:text-8xl font-sora font-bold tracking-[0.2em] text-white uppercase glow-subtle"
        style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}
      >
        Synapse
      </h1>
    </div>
  );
};
