'use client';

import React from 'react';
import { useRouter } from '@/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, ChevronRight, Zap } from 'lucide-react';
import { curriculumData, DifficultyLevel } from '@/utils/curriculumData';
import { useTranslations } from 'next-intl';

interface DifficultyClientContentProps {
  trackSlug: string;
  difficulty: string;
}

export function DifficultyClientContent({ trackSlug, difficulty }: DifficultyClientContentProps) {
  const router = useRouter();
  const t = useTranslations('Curriculum');
  
  const trackData = curriculumData[trackSlug];

  if (!trackData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-sora font-bold mb-4">{t('offlineTitle')}</h1>
        <p className="text-mid-gray">{t('offlineDesc')}</p>
        <button onClick={() => router.push('/curriculum')} className="mt-8 px-6 py-2 bg-brand-cyan text-deep-black rounded font-sora hover:bg-white">
          {t('returnToHub')}
        </button>
      </div>
    );
  }

  // Filter topics that have content for this difficulty
  const availableTopics = trackData.topics.filter(topic => topic.difficulties[difficulty as DifficultyLevel]?.length > 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in relative pb-32">
      <button 
        onClick={() => router.push(`/curriculum/${trackSlug}`)} 
        className="flex items-center gap-2 text-mid-gray hover:text-white transition-colors mb-8 font-space text-sm tracking-widest uppercase rtl:flex-row-reverse"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t('backToDifficulty')}
      </button>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-[10px] font-space tracking-widest uppercase rounded">
            {difficulty} {t('masteryFlow')}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-sora font-semibold mb-4">{trackData.title}</h1>
        <p className="text-lg text-mid-gray leading-relaxed max-w-2xl">
          {t('orderedSequence')} {difficulty}.
        </p>
        <div className="h-1 w-24 bg-brand-cyan rounded-full mt-6 glow-accent" />
      </header>

      <div className="space-y-6">
        <h2 className="text-xl font-sora font-semibold mb-8 flex items-center gap-3">
          <Zap className="w-5 h-5 text-brand-cyan" />
          {t('activePhases')}
        </h2>
        
        {availableTopics.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {availableTopics.map((topic) => (
              <GlassCard 
                key={topic.id}
                onClick={() => router.push(`/curriculum/${trackSlug}/${difficulty}/${topic.id}`)}
                glowHover
                className="p-8 cursor-pointer flex items-center justify-between group hover:border-brand-cyan/50 transition-all duration-300"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-sora font-semibold mb-2 group-hover:text-brand-cyan transition-colors">{topic.title}</h3>
                  <p className="text-mid-gray max-w-xl">{topic.description}</p>
                </div>
                <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-brand-cyan group-hover:text-deep-black transition-all">
                  <ChevronRight className="w-6 h-6 rtl:rotate-180" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-white/10 rounded-2xl bg-white/5 text-center">
            <p className="text-mid-gray">{t('noPhases')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
