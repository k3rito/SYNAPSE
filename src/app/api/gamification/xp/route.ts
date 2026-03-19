import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, amount, metadata } = await request.json();

    // Skill 9: Strict Server-Side Validation
    // Validate the amount based on the action to prevent cheating
    let validatedAmount = 0;
    
    switch (action) {
      case 'lesson_complete':
        validatedAmount = Math.min(amount, 50); // Max 50 XP per lesson
        break;
      case 'quiz_perfect':
        validatedAmount = Math.min(amount, 100); // Max 100 XP for perfect quiz
        break;
      case 'daily_streak':
        validatedAmount = 25; // Fixed daily bonus
        break;
      default:
        validatedAmount = Math.min(amount, 10); // Default small gain
    }

    // Atomic Update using a RPC call or a transaction
    // Assuming a function 'increment_user_xp' exists in Supabase
    const { data, error } = await supabase.rpc('increment_user_xp', {
      user_id_input: user.id,
      xp_increment: validatedAmount
    });

    if (error) {
      // Fallback if RPC doesn't exist yet - update profiles table directly
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level, referred_by, streak, last_activity')
        .eq('id', user.id)
        .single();

      const now = new Date();
      const lastActivity = profile?.last_activity ? new Date(profile.last_activity) : null;
      let newStreak = profile?.streak || 0;
      
      // Calculate Streak
      if (lastActivity) {
        const diffInHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
        if (diffInHours < 24) {
          // Already active today, maintain streak
        } else if (diffInHours < 48) {
          // New day, increment streak
          newStreak += 1;
        } else {
          // Streak broken
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newXP = (profile?.xp || 0) + validatedAmount;
      const newLevel = Math.floor(newXP / 1000) + 1;

      await supabase
        .from('profiles')
        .update({ 
          xp: newXP, 
          level: newLevel,
          streak: newStreak,
          last_activity: now.toISOString()
        })
        .eq('id', user.id);
        
      // Skill 9: 15% Referral Bonus
      if (profile?.referred_by) {
        const bonusAmount = Math.floor(validatedAmount * 0.15);
        if (bonusAmount > 0) {
          // Award bonus to the inviter
          await supabase.rpc('increment_user_xp', {
            user_id_input: profile.referred_by,
            xp_increment: bonusAmount
          });
          // Fallback if RPC fails for inviter too
          await supabase
            .from('profiles')
            .update({ xp: supabase.rpc('increment', { x: bonusAmount }) })
            .eq('id', profile.referred_by);
        }
      }

      // Log activity
      await supabase.from('user_activity_log').insert({
        user_id: user.id,
        action,
        metadata: { ...metadata, xp_gained: validatedAmount, streak: newStreak }
      });
    }

    return NextResponse.json({ 
      success: true, 
      xp_gained: validatedAmount,
      total_xp: (data?.xp || 0) + validatedAmount 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
