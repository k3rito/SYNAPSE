import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { showNeuralToast } from '@/components/ui/NeuralToast';

export interface GamificationState {
  xp: number;
  level: number;
  rank: string;
  totalLessons: number;
  streak: number;
  nextLevelXp: number;
  progressPercentage: number;
  isLoading: boolean;
  isLevelingUp: boolean;
  lastXpGained: number;
  
  // Actions
  fetchUserData: () => Promise<void>;
  awardXp: (action: 'lesson' | 'quiz', refId: string) => Promise<void>;
  resetStore: () => void;
  confirmLevelUp: () => void;
}

const XP_BASE = 1000;
const XP_EXPONENT = 1.5;

export const calculateLevel = (xp: number) => {
  let level = 1;
  while (xp >= Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT))) {
    level++;
  }
  return level;
};

export const getXpForLevel = (level: number) => {
  return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT));
};

export const getRank = (level: number) => {
  if (level <= 5) return "Novice Architect";
  if (level <= 15) return "Systems Engineer";
  if (level <= 30) return "Cyber Strategist";
  return "Neural Overlord";
};

export const useGamificationStore = create<GamificationState>((set, get) => ({
  xp: 0,
  level: 1,
  rank: "Initiate",
  totalLessons: 0,
  streak: 0,
  nextLevelXp: XP_BASE,
  progressPercentage: 0,
  isLoading: true,
  isLevelingUp: false,
  lastXpGained: 0,

  fetchUserData: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      set({ isLoading: false });
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('xp, total_lessons_completed, streak_days')
      .eq('id', user.id)
      .single();

    if (!error && profile) {
      const xp = profile.xp || 0;
      const level = calculateLevel(xp);
      const currentLevelMinXp = level === 1 ? 0 : getXpForLevel(level - 1);
      const nextLevelMaxXp = getXpForLevel(level);
      const progressPercentage = Math.min(100, Math.max(0, ((xp - currentLevelMinXp) / (nextLevelMaxXp - currentLevelMinXp)) * 100));

      set({
        xp,
        level,
        rank: getRank(level),
        totalLessons: profile.total_lessons_completed || 0,
        streak: profile.streak_days || 0,
        nextLevelXp: nextLevelMaxXp,
        progressPercentage,
        isLoading: false
      });
    } else {
      set({ isLoading: false });
    }
  },

  awardXp: async (action, refId) => {
    const prevState = { ...get() };
    const supabase = createClient();
    
    // 1. Calculate pseudo-gain for Optimistic UI
    const estimatedGain = action === 'lesson' ? 50 : 100;
    const newXp = prevState.xp + estimatedGain;
    const newLevel = calculateLevel(newXp);
    
    // 2. Optimistic Update
    const currentLevelMinXp = newLevel === 1 ? 0 : getXpForLevel(newLevel - 1);
    const nextLevelMaxXp = getXpForLevel(newLevel);
    const progressPercentage = Math.min(100, Math.max(0, ((newXp - currentLevelMinXp) / (nextLevelMaxXp - currentLevelMinXp)) * 100));

    set({
      xp: newXp,
      level: newLevel,
      rank: getRank(newLevel),
      progressPercentage,
      lastXpGained: estimatedGain,
      isLevelingUp: newLevel > prevState.level
    });

    // 3. Sync with Backend
    const { data, error } = await supabase.rpc('award_xp', {
      p_action: action,
      p_ref_id: refId
    });

    if (error || data?.error) {
      console.error('XP Sync Failure:', error || data?.error);
      set(prevState);
      return;
    }

    if (data?.status === 'success') {
      const finalXp = data.total_xp;
      const finalLevel = calculateLevel(finalXp);
      const finalMin = finalLevel === 1 ? 0 : getXpForLevel(finalLevel - 1);
      const finalMax = getXpForLevel(finalLevel);
      
      showNeuralToast(
        data.new_day ? "Neural Connection Re-established" : "Neural Synapse Strengthened",
        data.xp_gained,
        data.new_day ? 'streak' : 'xp'
      );

      set({
        xp: finalXp,
        level: finalLevel,
        rank: getRank(finalLevel),
        streak: data.streak,
        progressPercentage: Math.min(100, Math.max(0, ((finalXp - finalMin) / (finalMax - finalMin)) * 100)),
        lastXpGained: data.xp_gained,
        isLevelingUp: finalLevel > prevState.level
      });
    }
  },

  confirmLevelUp: () => set({ isLevelingUp: false }),

  resetStore: () => set({
    xp: 0,
    level: 1,
    rank: "Initiate",
    totalLessons: 0,
    streak: 0,
    nextLevelXp: XP_BASE,
    progressPercentage: 0,
    isLoading: false,
    isLevelingUp: false,
    lastXpGained: 0
  })
}));
