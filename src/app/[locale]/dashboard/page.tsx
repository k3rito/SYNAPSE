'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Activity, Book, Clock, Play, Zap, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useTranslations } from 'next-intl';

interface PastLesson {
  id: string;
  topic: string;
  created_at: string;
  status: string;
  score: number;
}

import { useGamificationStore } from '@/store/useGamificationStore';

export default function Dashboard() {
  const supabase = createClient();
  const t = useTranslations('Dashboard');
  const commonT = useTranslations('Common');
  const [pastLessons, setPastLessons] = useState<PastLesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  
  // Gamification Store
  const { level, xp, rank, totalLessons, streak, fetchUserData, isLoading: loadingStats } = useGamificationStore();

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingLessons(false);
        return;
      }

      // Fetch Gamification Stats
      await fetchUserData();

      // Fetch Past Lessons
      const { data, error } = await supabase
        .from('generated_lessons')
        .select('id, topic, created_at, status, score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setPastLessons(data);
      }
      setLoadingLessons(false);
    };

    initDashboard();
  }, [supabase, fetchUserData]);

  const activeCourses = [
    { id: 'intro', title: 'Neural Architecture 101', progress: 85, lastActive: '2 hours ago' },
    { id: 'api-design', title: 'Advanced GraphQL', progress: 30, lastActive: '1 day ago' },
    { id: 'state-management', title: 'Zustand Mastery', progress: 0, lastActive: 'Not started' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-sora font-semibold mb-2">{t('welcome')}</h1>
        <p className="text-mid-gray">{t('subtitle')}</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Activity, label: t('rank'), value: rank, color: 'text-brand-cyan' },
          { icon: Book, label: t('nodesCleared'), value: totalLessons, color: 'text-white' },
          { icon: Zap, label: "XP Points", value: xp, color: 'text-yellow-400' },
          { icon: Clock, label: "Neural Level", value: `Level ${level}`, color: 'text-blue-400' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-mid-gray font-space uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-sora font-semibold">{loadingStats ? '...' : stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Learning Nodes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-sora font-semibold">{t('activeNodes')}</h2>
            <button className="text-sm text-brand-cyan hover:glow-text font-space uppercase tracking-wider transition-all">
              {t('resume')} →
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {activeCourses.map((course) => (
              <GlassCard key={course.id} glowHover className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-mid-gray mb-4">Last active: {course.lastActive}</p>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-dark-gray rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-brand-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <Link 
                    href={`/lesson/${course.id}`}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-space tracking-wide transition-colors whitespace-nowrap text-center"
                  >
                    {course.progress > 0 ? t('resume') : t('initialize')}
                  </Link>
                </div>
              </GlassCard>
            ))}

            {/* Past Lessons from Supabase */}
            {loadingLessons ? (
              <GlassCard className="p-6 text-center text-mid-gray">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                {commonT('loading')}
              </GlassCard>
            ) : pastLessons.length > 0 && (
              <>
                <h3 className="text-lg font-sora font-semibold mt-6 mb-2">{t('recentNodes')}</h3>
                {pastLessons.map((lesson) => {
                  const isCompleted = lesson.status === 'completed';
                  return (
                    <GlassCard 
                      key={lesson.id} 
                      glowHover={!isCompleted}
                      className={`p-6 transition-all duration-300 ${
                        isCompleted 
                          ? 'border-brand-cyan/50 shadow-[0_0_15px_rgba(34,211,238,0.15)] bg-gradient-to-r from-white/5 to-brand-cyan/10' 
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{lesson.topic}</h3>
                            {isCompleted && (
                              <span className="px-2 py-0.5 bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 rounded text-xs font-space uppercase tracking-widest">
                                {t('cleared')}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-4 text-sm text-mid-gray">
                            <p>Generated: {new Date(lesson.created_at).toLocaleDateString()}</p>
                            {isCompleted && <p>Score: {lesson.score}%</p>}
                          </div>
                        </div>
                        <Link 
                          href={`/lesson/${lesson.id}`}
                          className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-space tracking-wide transition-colors whitespace-nowrap text-center flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          {isCompleted ? 'Review Node' : t('resume')}
                        </Link>
                      </div>
                    </GlassCard>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Recommended Tracks */}
        <div>
          <h2 className="text-xl font-sora font-semibold mb-6">{t('recommended')}</h2>
          <GlassCard className="p-6 flex flex-col gap-6">
            {[
              { title: 'Serverless Edge computing', duration: '4h 30m', level: 'Advanced' },
              { title: 'Web3 Architecture', duration: '6h 15m', level: 'Intermediate' },
              { title: 'AI Prompt Engineering', duration: '2h 00m', level: 'Beginner' }
            ].map((track, i) => (
              <div key={i} className="group cursor-pointer">
                <h4 className="font-semibold text-white/90 group-hover:text-brand-cyan transition-colors mb-1">{track.title}</h4>
                <div className="flex items-center gap-3 text-xs text-mid-gray font-space">
                  <span>{track.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className={
                    track.level === 'Advanced' ? 'text-red-400' : 
                    track.level === 'Intermediate' ? 'text-yellow-400' : 'text-green-400'
                  }>{track.level}</span>
                </div>
                {i < 2 && <div className="h-px w-full bg-white/5 mt-4" />}
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
