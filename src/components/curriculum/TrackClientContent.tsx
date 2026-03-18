'use client';

import React from 'react';
import { useRouter } from '@/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { curriculumData, DifficultyLevel } from '@/utils/curriculumData';
import { useTranslations } from 'next-intl';

interface TrackClientContentProps {
  trackSlug: string;
}

export function TrackClientContent({ trackSlug }: TrackClientContentProps) {
  const router = useRouter();
  const t = useTranslations('Curriculum');
  const commonT = useTranslations('Common');
  
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

  const difficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-400 border-green-400/20 bg-green-400/5';
      case 'Intermediate': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5';
      case 'Advanced': return 'text-orange-400 border-orange-400/20 bg-orange-400/5';
      case 'Pro': return 'text-red-400 border-red-400/20 bg-red-400/5';
      default: return 'text-white border-white/20';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in relative pb-32">
      <button 
        onClick={() => router.push('/curriculum')} 
        className="flex items-center gap-2 text-mid-gray hover:text-white transition-colors mb-8 font-space text-sm tracking-widest uppercase rtl:flex-row-reverse"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {commonT('back')}
      </button>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-[10px] font-space tracking-widest uppercase rounded">Track Mastery</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-sora font-semibold mb-4">{trackData.title}</h1>
        <p className="text-lg text-mid-gray leading-relaxed max-w-2xl">{trackData.description}</p>
        <div className="h-1 w-24 bg-brand-cyan rounded-full mt-6 glow-accent" />
      </header>

      <div className="space-y-6">
        <h2 className="text-xl font-sora font-semibold mb-8 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-brand-cyan" />
          {t('selectDifficulty')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {difficulties.map((level) => (
            <GlassCard 
              key={level}
              onClick={() => router.push(`/curriculum/${trackSlug}/${level}`)}
              glowHover
              className="p-8 cursor-pointer flex flex-col justify-between group hover:border-brand-cyan/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className={`inline-block px-3 py-1 rounded border text-[10px] font-space tracking-widest uppercase mb-4 ${getDifficultyColor(level)}`}>
                  {level}
                </div>
                <h3 className="text-2xl font-sora font-semibold mb-2 group-hover:text-brand-cyan transition-colors">{level}</h3>
                <p className="text-mid-gray">{t('specializedDifficulty')} {level} {t('masteryIn')} {trackData.title}.</p>
              </div>
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                <span className="text-[10px] font-space text-brand-cyan uppercase tracking-widest">{t('initializeTier')}</span>
                <ChevronRight className="w-4 h-4 text-brand-cyan group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
