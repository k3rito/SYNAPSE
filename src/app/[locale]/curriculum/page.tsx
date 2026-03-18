'use client';

import React from 'react';
import { Link } from '@/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Code2, Server, Shield, Database, Cpu, Globe } from 'lucide-react';

const tracks = [
  {
    id: 'full-stack-engineering',
    title: 'Full-Stack Engineering',
    description: 'Master the complete web architecture from UI/UX to scalable backend systems.',
    icon: Code2,
    nodesCount: 12,
    difficulty: 'Intermediate'
  },
  {
    id: 'network-architecture',
    title: 'Network Architecture',
    description: 'Deep dive into protocols, routing, and modern distributed network scaling.',
    icon: Server,
    nodesCount: 7,
    difficulty: 'Advanced'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & InfoSec',
    description: 'Learn ethical hacking, cryptography, and securing infrastructure against breaches.',
    icon: Shield,
    nodesCount: 7,
    difficulty: 'Advanced'
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    description: 'Build robust pipelines, master SQL/NoSQL, and handle big data architecture.',
    icon: Database,
    nodesCount: 9,
    difficulty: 'Intermediate'
  },
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    description: 'Understand neural networks, model training, and AI application integration.',
    icon: Cpu,
    nodesCount: 14,
    difficulty: 'Advanced'
  },
  {
    id: 'web3-development',
    title: 'Web3 Development',
    description: 'Explore blockchain fundamentals, smart contracts, and decentralized apps.',
    icon: Globe,
    nodesCount: 9,
    difficulty: 'Beginner'
  }
];

export default function CurriculumPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-sora font-semibold mb-4">Mastery Tracks</h1>
        <p className="text-mid-gray text-lg max-w-2xl">
          Select a specialized pathway to begin your structured learning journey. 
          Each track contains a sequence of strictly evaluated nodes to build your expertise.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <Link href={`/curriculum/${track.id}`} key={track.id} className="block group">
            <GlassCard glowHover className="h-full p-8 flex flex-col transition-all duration-300 group-hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:text-brand-cyan group-hover:border-brand-cyan/30 group-hover:bg-brand-cyan/10 transition-colors shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] group-hover:shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]">
                <track.icon className="w-7 h-7" />
              </div>
              
              <h2 className="text-2xl font-sora font-semibold mb-3 group-hover:text-brand-cyan transition-colors">
                {track.title}
              </h2>
              
              <p className="text-mid-gray text-sm leading-relaxed mb-8 flex-1">
                {track.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                <span className="text-xs font-space tracking-widest uppercase text-mid-gray">
                  {track.nodesCount} Nodes
                </span>
                <span className={`text-xs font-space tracking-widest uppercase px-2 py-1 rounded border ${
                  track.difficulty === 'Beginner' ? 'text-green-400 border-green-400/20 bg-green-400/10' :
                  track.difficulty === 'Intermediate' ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10' :
                  'text-red-400 border-red-400/20 bg-red-400/10'
                }`}>
                  {track.difficulty}
                </span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
