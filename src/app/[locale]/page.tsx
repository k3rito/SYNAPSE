'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { WebGLErrorBoundary } from '@/components/home/ErrorBoundary';
import { IntroAnimation } from '@/components/home/IntroAnimation';
import { NeuralNetwork3D } from '@/components/home/NeuralNetwork3D';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowRight, Brain, Code, Terminal, Zap } from 'lucide-react';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

export default function Home() {
  const [introDone, setIntroDone] = useState(false);
  const isWebGLSupported = useWebGLSupport();

  return (
    <>
      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}

      <div className={`relative min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${introDone ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* 3D Background OR Fallback */}
        <div className="absolute inset-0 -z-10">
          {isWebGLSupported ? (
            <WebGLErrorBoundary>
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <NeuralNetwork3D />
              </Canvas>
            </WebGLErrorBoundary>
          ) : (
            /* High-Tech Grid Fallback */
            <div className="absolute inset-0 css-grid-bg opacity-20" />
          )}
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-deep-black/90 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center mt-20">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan font-space text-sm tracking-wide shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            SYSTEM ONLINE: v1.0.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-sora font-bold mb-6 tracking-tight">
            Learn at the speed of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white glow-text">thought.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-mid-gray max-w-2xl mb-10 font-inter leading-relaxed">
            An AI-powered tech learning platform that adapts to your mental model. Dive deep into code, concepts, and architecture with interactive nodes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 bg-brand-cyan text-deep-black font-sora font-semibold rounded-lg hover:bg-white transition-all animate-glow-pulse flex items-center justify-center gap-2 group"
            >
              <span>Initialize Node</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="container mx-auto px-4 mt-32 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard glowHover className="p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-sora font-semibold text-xl">Adaptive Learning</h3>
              <p className="text-mid-gray text-sm leading-relaxed">
                Lessons generate dynamically based on your existing knowledge and selected path.
              </p>
            </GlassCard>

            <GlassCard glowHover className="p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="font-sora font-semibold text-xl">Interactive Snippets</h3>
              <p className="text-mid-gray text-sm leading-relaxed">
                Code playgrounds evaluated in real-time, giving instant feedback and suggestions.
              </p>
            </GlassCard>

            <GlassCard glowHover className="p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-sora font-semibold text-xl">AI Assistant Orb</h3>
              <p className="text-mid-gray text-sm leading-relaxed">
                Your co-pilot is always running in the background, ready to explain complex architectures.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}
