"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, Play, CheckCircle2, Lock, Loader2, Award, LogIn, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import { curriculumData, DifficultyLevel } from '@/utils/curriculumData';
import { NeuralLoader } from '@/components/NeuralLoader';

interface TopicClientContentProps {
  locale: string;
  trackSlug: string;
  difficulty: DifficultyLevel;
  topicSlug: string;
}

export function TopicClientContent({ locale, trackSlug, difficulty, topicSlug }: TopicClientContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [generatingNodeId, setGeneratingNodeId] = useState<string | null>(null);
  const [showNeuralHandshake, setShowNeuralHandshake] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const t = useTranslations('Curriculum');
  const commonT = useTranslations('Common');

  // Normalize slugs for matching
  const trackKey = Object.keys(curriculumData).find(key => key.toLowerCase() === trackSlug.toLowerCase());
  const trackData = trackKey ? curriculumData[trackKey] : null;

  const topicData = trackData?.topics.find(t => t.id.toLowerCase() === topicSlug.toLowerCase());
  
  const difficultyKey = Object.keys(topicData?.difficulties || {}).find(
    d => d.toLowerCase() === difficulty.toLowerCase()
  ) as DifficultyLevel | undefined;

  const lessons = (difficultyKey && topicData) ? topicData.difficulties[difficultyKey] : [];

  useEffect(() => {
    const fetchUserProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('generated_lessons')
        .select('topic, status')
        .eq('user_id', user.id);

      if (data) {
        const completed = data.filter(d => d.status === 'completed').map(d => d.topic);
        setCompletedNodes(completed);
      }
      setLoading(false);
    };

    fetchUserProgress();
  }, [supabase]);

  if (!topicData || !lessons.length) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-sora font-bold mb-4">{t('offlineTitle')}</h1>
        <p className="text-mid-gray">{t('offlineDesc')}</p>
        <button onClick={() => router.push(`/curriculum/${trackSlug}/${difficulty}`)} className="mt-8 px-6 py-2 bg-brand-cyan text-deep-black rounded font-sora hover:bg-white">
          {t('returnToHub')}
        </button>
      </div>
    );
  }

  const handleNodeClick = async (nodeTitle: string) => {
    if (generatingNodeId) return;

    // SKILL 4: Auth Gatekeeping
    if (!user) {
      setShowLoginWarning(true);
      return;
    }

    setGeneratingNodeId(nodeTitle);

    try {
      const { data: existingLesson } = await supabase
        .from('generated_lessons')
        .select('id')
        .eq('user_id', user.id)
        .eq('topic', nodeTitle)
        .single();

      if (existingLesson?.id) {
        router.push(`/lesson/${existingLesson.id}`);
        return;
      }

      setShowNeuralHandshake(true);
      const handshakeDelay = new Promise(resolve => setTimeout(resolve, 2000));

      const apiCall = fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: nodeTitle, 
          context: `Track: ${trackData?.title || 'Unknown'}, Topic: ${topicData?.title || 'Unknown'}, Difficulty: ${difficulty}`,
          locale
        }),
      });

      const [response] = await Promise.all([apiCall, handshakeDelay]);
      const data = await response.json();
      
      if (data.lessonId) {
        router.push(`/lesson/${data.lessonId}`);
      }
    } catch (error) {
      console.error('Failed to trigger node:', error);
      setGeneratingNodeId(null);
      setShowNeuralHandshake(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in relative pb-32">
      <button 
        onClick={() => router.push(`/curriculum/${trackSlug}/${difficulty}`)} 
        className="flex items-center gap-2 text-mid-gray hover:text-white transition-colors mb-8 font-space text-sm tracking-widest uppercase rtl:flex-row-reverse"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {commonT('back')}
      </button>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-5 h-5 text-brand-cyan" />
          <span className="text-brand-cyan text-[10px] font-space tracking-widest uppercase">{difficulty} {t('masteryFlow')}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-sora font-semibold mb-4">{topicData.title}</h1>
        <p className="text-lg text-mid-gray leading-relaxed max-w-2xl">{t('orderedSequence')} {difficulty}.</p>
        <div className="h-1 w-24 bg-brand-cyan rounded-full mt-6 glow-accent" />
      </header>

      <div className="relative pl-4 md:pl-8 space-y-12 before:absolute before:inset-0 before:ml-[31px] md:before:ml-[47px] before:-translate-x-px md:before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-cyan before:to-transparent before:opacity-30">
        {loading ? (
          <div className="flex items-center gap-4 text-brand-cyan pl-12 py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-space tracking-widest uppercase">{commonT('loading')}</span>
          </div>
        ) : (
          lessons.map((node, index) => {
            const isCompleted = completedNodes.includes(node.title);
            const isUnlocked = index === 0 || completedNodes.includes(lessons[index - 1].title) || isCompleted;
            const isGenerating = generatingNodeId === node.title;

            return (
              <div key={node.id} className="relative flex items-center md:items-start gap-6 md:gap-8 group">
                <div className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 bg-deep-black ${
                  isCompleted 
                    ? 'border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                    : isUnlocked 
                      ? 'border-white/50 text-white hover:border-brand-cyan hover:text-brand-cyan' 
                      : 'border-white/10 text-mid-gray'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isUnlocked ? <Play className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <GlassCard 
                  onClick={() => isUnlocked ? handleNodeClick(node.title) : null}
                  glowHover={isUnlocked && !isCompleted}
                  className={`flex-1 p-6 md:p-8 cursor-pointer transition-all duration-300 ${
                    isUnlocked 
                      ? 'hover:-translate-y-1 hover:border-brand-cyan/50 hover:bg-white/10 opacity-100' 
                      : 'opacity-50 cursor-not-allowed border-transparent bg-white/5'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-space text-xs text-brand-cyan uppercase tracking-widest">{t('module')} 0{index + 1}</span>
                        {isCompleted && <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded border border-brand-cyan/30 uppercase tracking-wider">{t('cleared')}</span>}
                      </div>
                      <h3 className={`text-xl font-sora font-semibold mb-2 ${isUnlocked ? 'text-white group-hover:text-brand-cyan transition-colors' : 'text-mid-gray'}`}>
                        {node.title}
                      </h3>
                      <p className="text-mid-gray text-sm md:text-base leading-relaxed">
                        {node.description}
                      </p>
                    </div>

                    {isUnlocked && (
                      <div className="shrink-0 mt-4 md:mt-0">
                        {isGenerating ? (
                          <div className="px-4 py-2 bg-brand-cyan/20 border border-brand-cyan/50 rounded-lg text-brand-cyan flex items-center gap-2 font-space text-sm tracking-widest uppercase animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" /> {t('deepSearch')}
                          </div>
                        ) : (
                          <div className={`px-4 py-2 rounded-lg border text-sm font-space tracking-widest uppercase transition-all ${
                            isCompleted 
                              ? 'bg-transparent border-white/20 text-white hover:bg-white/10' 
                              : 'bg-brand-cyan text-deep-black hover:bg-white border-transparent'
                          }`}>
                            {isCompleted ? commonT('review') : commonT('initialize')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            );
          })
        )}
      </div>

      {/* SKILL 4: Login Warning UI */}
      {showLoginWarning && (
        <div className="fixed inset-0 z-[110] backdrop-blur-xl bg-deep-black/60 flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-8 text-center border-brand-cyan/30 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
            <div className="w-16 h-16 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-brand-cyan" />
            </div>
            <h2 className="text-2xl font-sora font-bold mb-4">Authentication Required</h2>
            <p className="text-mid-gray mb-8 leading-relaxed">
              الرجاء تسجيل الدخول لتتمكن من إنشاء دروس مخصصة باستخدام الذكاء الاصطناعي والاستفادة من نظام التقدم في SYNAPSE.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/login')}
                className="w-full py-4 bg-brand-cyan text-deep-black rounded-xl font-sora font-bold hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" /> Go to Login
              </button>
              <button 
                onClick={() => setShowLoginWarning(false)}
                className="w-full py-3 text-mid-gray hover:text-white font-space text-[10px] tracking-widest uppercase"
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Neural Handshake Overlay */}
      {showNeuralHandshake && (
        <div className="fixed inset-0 z-[100] bg-transparent flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="relative p-12 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.15)] flex flex-col items-center">
            <div className="w-full max-w-xl pr-12">
              <NeuralLoader />
            </div>
            <div className="mt-8 space-y-2">
              <h2 className="text-2xl font-sora font-bold text-white tracking-tight uppercase">Neural Handshake Active</h2>
              <p className="text-brand-cyan font-space text-xs tracking-[0.3em] uppercase animate-pulse">Synchronizing with Synapse Network...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
