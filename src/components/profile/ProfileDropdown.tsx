'use client';

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Lock, 
  UserPlus, 
  LogOut, 
  ChevronDown, 
  Check, 
  Copy,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useAppStore } from '@/store/useAppStore';

interface ProfileDropdownProps {
  user: any;
}

export const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { rank, level, resetStore } = useGamificationStore();
  const clearChatHistory = useAppStore((state) => state.clearChatHistory);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetStore();
    clearChatHistory();
    router.push('/login');
    router.refresh();
  };

  const copyReferral = () => {
    const link = `${window.location.origin}/signup?ref=${user.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-cyan to-blue-600 flex items-center justify-center text-deep-black font-sora font-bold text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all">
          {user.email?.[0].toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[10px] font-space text-brand-cyan uppercase tracking-[0.2em] leading-none mb-1">{rank}</p>
          <p className="text-xs font-sora font-semibold text-white leading-none">Account</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-mid-gray transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-72 z-50 animate-fade-in">
            <GlassCard className="overflow-hidden border-brand-cyan/20 bg-deep-black/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-brand-cyan" />
                  </div>
                  <div>
                    <h4 className="font-sora font-bold text-white truncate max-w-[160px]">{user.user_metadata?.full_name || 'Synapse User'}</h4>
                    <p className="text-[10px] font-space text-mid-gray truncate max-w-[160px]">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-space tracking-widest uppercase">
                  <span className="text-mid-gray">Current Level</span>
                  <span className="text-brand-cyan">Alpha {level}</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand-cyan w-2/3 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </div>
              </div>

              {/* Menu */}
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-mid-gray hover:text-white transition-all group">
                  <User className="w-4 h-4 group-hover:text-brand-cyan" />
                  <span className="text-xs font-sora font-medium">Change Name</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-mid-gray hover:text-white transition-all group">
                  <Lock className="w-4 h-4 group-hover:text-brand-cyan" />
                  <span className="text-xs font-sora font-medium">Security Settings</span>
                </button>
                <div className="h-px bg-white/5 my-1 mx-2" />
                <button 
                  onClick={copyReferral}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-mid-gray hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="w-4 h-4 group-hover:text-brand-cyan" />
                    <span className="text-xs font-sora font-medium">Invite a Friend</span>
                  </div>
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 opacity-50" />}
                </button>
              </div>

              {/* Footer */}
              <div className="p-2 bg-white/5 border-t border-white/5">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-mid-gray hover:text-red-400 transition-all group"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-sora font-medium">Disconnect Node</span>
                </button>
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
};
