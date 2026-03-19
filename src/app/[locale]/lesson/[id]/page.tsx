'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { CheckCircle2, ChevronRight, Play, Server, Terminal, Loader2, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/utils/supabase/client';
import { curriculumData, DifficultyLevel } from '@/utils/curriculumData';
import DynamicContentEngine from '@/components/DynamicContentEngine';
import { LessonSkeleton } from '@/components/LessonSkeleton';
import { useTranslations } from 'next-intl';

interface QuizItem {
  id?: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface LessonData {
  id?: string;
  topic?: string;
  title: string;
  content: string;
  quiz: QuizItem[];
}

import { useGamificationStore } from '@/store/useGamificationStore';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const { setCurrentLesson } = useAppStore();
  const awardXp = useGamificationStore((state) => state.awardXp);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Common');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLessonFromDB = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('generated_lessons')
          .select('*')
          .eq('id', params.id as string)
          .single();
        
        if (error || !data) throw new Error('Lesson not found');

        let rawContent = data.content;
        
        if (typeof rawContent === 'string') {
          try {
            rawContent = JSON.parse(rawContent);
          } catch (e) {
            console.error('Failed to parse content:', e);
          }
        }
        
        const finalizedData = { 
          id: data.id, 
          topic: data.topic, 
          title: rawContent.title || data.topic,
          content: rawContent.content || '',
          quiz: rawContent.quiz || rawContent.quiz_questions || []
        };
        
        setLessonData(finalizedData as LessonData); 
        setCurrentLesson(finalizedData); 
      } catch (err) {
        console.error('Failed to load lesson from DB:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLessonFromDB();
    }
    
    return () => setCurrentLesson(null); 
  }, [params.id, setCurrentLesson, supabase]);


  const handleQuizSubmit = async () => {
    if (!lessonData || Object.keys(selectedAnswers).length < (quizArray.length || 0)) return;
    
    setIsUpdating(true);
    let correctCount = 0;
    quizArray.forEach((q: any, i: number) => {
      const correctAnswer = q?.correct_answer || q?.correct || q?.answer || '';
      if (selectedAnswers[i] === correctAnswer) correctCount++;
    });
    
    setScore({ correct: correctCount, total: quizArray.length });
    setQuizSubmitted(true);
    
    const percentage = Math.round((correctCount / quizArray.length) * 100);
    const nextStatus = percentage >= 50 ? 'completed' : 'pending';
    
    if (lessonData.id) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('generated_lessons')
          .update({ status: nextStatus, score: percentage })
          .eq('id', lessonData.id)
          .eq('user_id', user.id); // Secure update

        if (nextStatus === 'completed') {
          await awardXp('lesson', lessonData.id);
        }
      }
    }
    setIsUpdating(false);
  };

  if (loading) return <LessonSkeleton />;

  if (error || !lessonData) {
    return (
      <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-sora font-bold text-white mb-4">404 - Node Offline</h1>
        <p className="text-mid-gray mb-8">The requested learning node could not be located in the database.</p>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-brand-cyan text-deep-black font-sora rounded-lg hover:bg-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
      </div>
    );
  }

  console.log("Raw Lesson Data:", lessonData);

  // Deep Array Extraction for the quiz
  let extractedQuiz: any[] = [];
  const rawQuiz = lessonData?.quiz;
  
  if (Array.isArray(rawQuiz)) {
    extractedQuiz = rawQuiz;
  } else if (rawQuiz && typeof rawQuiz === 'object') {
    if (Array.isArray((rawQuiz as any).questions)) {
      extractedQuiz = (rawQuiz as any).questions;
    } else if (Array.isArray((rawQuiz as any).items)) {
      extractedQuiz = (rawQuiz as any).items;
    } else {
      // Extract object values, filtering out non-objects to find potential question items
      extractedQuiz = Object.values(rawQuiz).filter(v => typeof v === 'object' && v !== null);
    }
  }
  const quizArray = extractedQuiz.flat();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in pb-32">
      <header className="mb-12">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-mid-gray hover:text-white transition-colors mb-6 font-space text-sm tracking-widest uppercase group/back">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:translate-x-1" /> {t('back')}
        </button>
        <div className="flex items-center gap-2 text-brand-cyan font-space text-sm tracking-widest uppercase mb-4">
          <span>Curriculum</span>
          <ChevronRight className="w-4 h-4" />
          <span>Topic: {lessonData.topic || 'Unknown'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-sora font-bold mb-4">{lessonData.title}</h1>
        <div className="h-1 w-24 bg-brand-cyan rounded-full glow-accent" />
      </header>

      <div className="space-y-12">
        <DynamicContentEngine content={lessonData.content} />

        <GlassCard className="p-8 mt-24 bg-gradient-to-br from-white/5 to-brand-cyan/5 border-t-2 border-t-brand-cyan/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-sora font-semibold flex items-center gap-3">
              <Server className="w-6 h-6 text-brand-cyan" />
              Node Diagnostics
            </h3>
            {quizSubmitted && score && (
              <div className="flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 border border-brand-cyan/30 rounded-lg">
                <span className="font-space text-sm tracking-widest text-brand-cyan uppercase">Score:</span>
                <span className="font-sora font-bold text-white">{score.correct}/{score.total}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-12">
            {(Array.isArray(quizArray) ? quizArray : []).map((q: any, qIndex: number) => {
              const questionText = q?.question || q?.q || q?.title || q?.text || 'Diagnostic query missing';
              return (
                <div key={qIndex} className="space-y-6">
                  <p className="text-xl text-white font-inter font-medium leading-relaxed">{questionText}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const options = Array.isArray(q?.options) ? q.options : Array.isArray(q?.choices) ? q.choices : Array.isArray(q?.answers) ? q.answers : [];
                    const correctAnswer = q?.correct_answer || q?.correct || q?.answer || '';
                    return options.map((option: string, i: number) => {
                      const isSelected = selectedAnswers[qIndex] === option;
                      const isCorrect = option === correctAnswer;
                      let btnStyle = "bg-white/5 border-white/10 text-mid-gray hover:bg-white/10 hover:border-white/20";
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = "bg-green-500/20 border-green-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                        else if (isSelected) btnStyle = "bg-red-500/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                        else btnStyle = "bg-white/5 border-white/10 text-mid-gray opacity-40";
                      } else if (isSelected) {
                        btnStyle = "bg-brand-cyan/10 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]";
                      }
                      return (
                        <button key={i} disabled={quizSubmitted} onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }))}
                          className={`text-left p-5 rounded-xl border transition-all duration-300 font-inter ${btnStyle}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base">{option}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                          </div>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            );
          })}

            {!quizSubmitted && (
              <button 
                onClick={handleQuizSubmit} 
                disabled={isUpdating || Object.keys(selectedAnswers).length < (quizArray.length || 0)}
                className="w-full py-5 mt-12 bg-brand-cyan text-deep-black font-sora font-bold text-lg rounded-2xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(34,211,238,0.3)]"
              >
                {isUpdating ? <span className="flex items-center justify-center gap-2 text-brand-cyan"><Loader2 className="w-6 h-6 animate-spin" /> Verifying...</span> : "Authorize Next Node Access"}
              </button>
            )}

            {quizSubmitted && score && (
              <div className={`mt-8 p-6 rounded-2xl border flex items-start gap-5 ${score.correct === score.total ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {score.correct === score.total ? <CheckCircle2 className="w-6 h-6 mt-1" /> : <Server className="w-6 h-6 mt-1" />}
                <div>
                  <h4 className="text-lg font-sora font-bold mb-2">{score.correct === score.total ? 'Node Sequence Assimilated' : 'Validation Sequence Failure'}</h4>
                  <p className="text-sm opacity-80 leading-relaxed">{score.correct === score.total ? 'Neural pathway verified. The next module is now available for initialization.' : `Scored ${score.correct}/${score.total}. Please review node data to recalibrate.`}</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {quizSubmitted && score && score.correct === score.total && (
          <div className="mt-16 text-center animate-bounce-subtle">
             <button
              onClick={() => {
                const findNext = () => {
                  const currentTopicId = lessonData.topic;
                  for (const trackId in curriculumData) {
                    const track = curriculumData[trackId];
                    for (const topic of track.topics) {
                      for (const diff in topic.difficulties) {
                        const lessons = topic.difficulties[diff as DifficultyLevel];
                        const idx = lessons.findIndex((l: { title: string }) => l.title === currentTopicId);
                        if (idx !== -1 && idx < lessons.length - 1) {
                          return { trackId, topicId: topic.id, difficulty: diff };
                        }
                      }
                    }
                  }
                  return null;
                };
                const nextInfo = findNext();
                if (nextInfo) router.push(`/curriculum/${nextInfo.trackId}/${nextInfo.difficulty}/${nextInfo.topicId}`);
                else router.push('/dashboard');
              }}
              className="px-16 py-6 bg-brand-cyan text-deep-black font-sora font-black text-xl rounded-full hover:bg-white transition-all flex items-center justify-center gap-4 group shadow-[0_0_50px_rgba(34,211,238,0.4)]"
            >
              Initialize Next Module
              <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
