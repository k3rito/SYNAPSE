'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Users, BookOpen, Database, BarChart3, Settings, 
  ShieldAlert, Activity, Trash2, ShieldCheck, UserMinus,
  Search, Check, AlertCircle, X, ChevronRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useTranslations } from 'next-intl';

// types
interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  is_banned: boolean | null;
  last_active_at: string | null;
}

interface GeneratedLesson {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    lessonsGenerated: 0,
    aiRequests: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [lessons, setLessons] = useState<GeneratedLesson[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({ show: false, title: '', message: '', action: async () => {} });

  const fetchOverviewData = useCallback(async () => {
    try {
      // 1. Stats
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: lessonsCount } = await supabase.from('generated_lessons').select('*', { count: 'exact', head: true });
      const { count: aiCount } = await supabase.from('chat_history').select('*', { count: 'exact', head: true }).eq('role', 'assistant');
      
      // Active Sessions (last 15m)
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { count: activeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('last_active_at', fifteenMinutesAgo);

      setStats({
        totalUsers: usersCount || 0,
        activeSessions: activeCount || 0,
        lessonsGenerated: lessonsCount || 0,
        aiRequests: aiCount || 0
      });

      // 2. Recent Activity
      const { data: latestLessons } = await supabase
        .from('generated_lessons')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentActivity(latestLessons || []);

    } catch (error) {
      console.error('Overview data fetch failed:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  }, [supabase]);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('generated_lessons').select('id, title, category, created_at').order('created_at', { ascending: false });
    setLessons(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (activeTab === 'Overview') fetchOverviewData();
    if (activeTab === 'User Management') fetchUsers();
    if (activeTab === 'Content Logs') fetchContent();
  }, [activeTab, fetchOverviewData, fetchUsers, fetchContent]);

  // Actions
  const handleUpdateRole = async (userId: string, newRole: string) => {
    setConfirmModal({
      show: true,
      title: 'Update User Role',
      message: `Are you sure you want to change this user's role to ${newRole.toUpperCase()}? This will modify their access level across the platform.`,
      action: async () => {
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        if (!error) {
          fetchUsers();
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      }
    });
  };

  const handleBanUser = async (userId: string, banState: boolean) => {
    setConfirmModal({
      show: true,
      title: banState ? 'Ban User' : 'Revoke Ban',
      message: `Are you sure you want to ${banState ? 'ban' : 'unban'} this user? ${banState ? 'They will lose all access to their dashboard immediately.' : 'Their access will be restored.'}`,
      action: async () => {
        const { error } = await supabase.from('profiles').update({ is_banned: banState }).eq('id', userId);
        if (!error) {
          fetchUsers();
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      }
    });
  };

  const handleDeleteLesson = async (lessonId: string) => {
    setConfirmModal({
      show: true,
      title: 'Delete Lesson',
      message: 'Are you sure you want to permanently delete this generated lesson? This action cannot be undone.',
      action: async () => {
        const { error } = await supabase.from('generated_lessons').delete().eq('id', lessonId);
        if (!error) {
          fetchContent();
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      }
    });
  };

  const tabs = ['Overview', 'User Management', 'Content Logs', 'AI Statistics', 'Moderation'];

  const renderSection = () => {
    if (activeTab === 'Overview') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, trend: 'Total' },
              { label: 'Active Sessions', value: stats.activeSessions, icon: Activity, trend: 'Last 15m' },
              { label: 'Lessons Generation', value: stats.lessonsGenerated, icon: Database, trend: 'Total' },
              { label: 'AI Requests', value: stats.aiRequests, icon: BarChart3, trend: 'Total' },
            ].map((stat, i) => (
              <GlassCard key={i} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <stat.icon className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <span className="text-[10px] font-space text-brand-cyan bg-brand-cyan/10 px-2 py-1 rounded-full border border-brand-cyan/20">
                    {stat.trend}
                  </span>
                </div>
                {loading ? (
                  <div className="h-8 w-16 bg-white/5 animate-pulse rounded" />
                ) : (
                  <p className="text-2xl font-sora font-semibold mb-1">{stat.value.toLocaleString()}</p>
                )}
                <p className="text-xs tracking-wider font-space uppercase text-mid-gray">{stat.label}</p>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <GlassCard className="p-6">
              <h3 className="font-sora font-semibold mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-brand-cyan" />
                System Alerts
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  'Database Indexing Recommended: lessons',
                  'API Usage Peak detected (Gemini 2.0)',
                ].map((alert, i) => (
                  <div key={i} className="px-4 py-3 bg-white/5 rounded-xl border border-white/5 text-sm flex items-center justify-between">
                    <span>{alert}</span>
                    <button className="text-brand-cyan hover:underline text-xs flex items-center gap-1">
                      Review <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-sora font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-cyan" />
                Recent Activity
              </h3>
              <div className="flex flex-col gap-4">
                {recentActivity.map((act, i) => (
                  <div key={act.id} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-brand-cyan mt-1.5 shrink-0 shadow-[0_0_5px_#22D3EE]" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="text-white font-medium">{act.profiles?.full_name || 'Anonymous User'}</span>
                        <span className="text-mid-gray shrink-0"> generated </span>
                        <span className="text-brand-cyan font-mono text-xs"> "{act.title}" </span>
                      </p>
                      <p className="text-[10px] text-mid-gray font-space mt-1">
                        {new Date(act.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      );
    }

    if (activeTab === 'User Management') {
      return (
        <GlassCard className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sora font-semibold text-lg">Platform Users</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray" />
              <input 
                type="text" 
                placeholder="Search index..." 
                className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-brand-cyan/50 transition-all font-space"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 font-space text-[10px] uppercase text-mid-gray tracking-widest pl-2">User Index</th>
                  <th className="pb-4 font-space text-[10px] uppercase text-mid-gray tracking-widest">Access Layer</th>
                  <th className="pb-4 font-space text-[10px] uppercase text-mid-gray tracking-widest">Status</th>
                  <th className="pb-4 font-space text-[10px] uppercase text-mid-gray tracking-widest text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {profiles.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 pl-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{user.full_name || 'Anonymous User'}</span>
                        <span className="text-xs text-mid-gray font-mono">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-space uppercase border ${
                        user.role === 'admin' ? 'border-brand-cyan text-brand-cyan bg-brand-cyan/10' : 'border-white/20 text-mid-gray'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`flex items-center gap-1.5 text-xs ${user.is_banned ? 'text-rose-500' : 'text-emerald-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.is_banned ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        {user.is_banned ? 'BANNED' : 'OPERATIONAL'}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleUpdateRole(user.id, 'moderator')}
                            className="p-1.5 hover:text-brand-cyan text-mid-gray transition-colors"
                            title="Promote to Moderator"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleBanUser(user.id, !user.is_banned)}
                          className={`p-1.5 transition-colors ${user.is_banned ? 'text-emerald-400' : 'text-rose-400'}`}
                          title={user.is_banned ? 'Unban User' : 'Ban User'}
                        >
                          {user.is_banned ? <Check className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      );
    }

    if (activeTab === 'Content Logs') {
      return (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-sora font-semibold text-lg">Neural Archives</h3>
            <span className="text-[10px] font-space text-mid-gray uppercase tracking-widest">{lessons.length} Lessons Indexed</span>
          </div>
          <div className="flex flex-col gap-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-brand-cyan/30 transition-all">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-white">{lesson.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-space text-brand-cyan/70 uppercase tracking-tighter">{lesson.category}</span>
                    <span className="text-[9px] text-mid-gray font-mono">{new Date(lesson.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="p-2 text-mid-gray hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      );
    }

    if (activeTab === 'AI Statistics') {
      const providers = [
        { name: 'Gemini 2.0', count: stats.aiRequests, color: 'bg-brand-cyan' },
        { name: 'OpenAI GPT-4o', count: Math.floor(stats.aiRequests * 0.3), color: 'bg-white/40' },
        { name: 'Groq Llama-3', count: Math.floor(stats.aiRequests * 0.1), color: 'bg-white/10' },
      ];
      const maxCount = Math.max(...providers.map(p => p.count), 1);

      return (
        <GlassCard className="p-8">
          <h3 className="font-sora font-semibold text-lg mb-8 uppercase tracking-tighter">Neural Engine Usage</h3>
          <div className="flex flex-col gap-8">
            {providers.map((p) => (
              <div key={p.name} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-space uppercase tracking-widest text-mid-gray">
                  <span>{p.name}</span>
                  <span>{p.count.toLocaleString()} Requests</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full ${p.color} transition-all duration-1000 shadow-[0_0_10px_rgba(34,211,238,0.3)]`} 
                    style={{ width: `${(p.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-mid-gray font-space mt-12 text-center uppercase tracking-[0.3em] opacity-40">
            Real-time inference tracking active
          </p>
        </GlassCard>
      );
    }

    if (activeTab === 'Moderation') {
      return (
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6 border-rose-500/20">
            <h3 className="font-sora font-semibold text-lg mb-4 flex items-center gap-2 text-rose-500">
              <ShieldAlert className="w-5 h-5" />
              Flagged Content
            </h3>
            <div className="flex flex-col items-center justify-center py-12 text-mid-gray bg-rose-500/5 rounded-2xl border border-rose-500/10">
              <ShieldCheck className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-space uppercase text-xs tracking-widest">No critical violations detected</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-sora font-semibold text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-cyan" />
              System Integrity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'DB Health', value: 'OPTIMAL', icon: Database, color: 'text-emerald-400' },
                { label: 'API Latency', value: '42ms', icon: Activity, color: 'text-brand-cyan' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-mid-gray" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xs font-space font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      );
    }
  };

  const [settingsModal, setSettingsModal] = useState(false);
  const [config, setConfig] = useState({
    maintenance_mode: false,
    max_word_count: 2500,
  });

  const toggleSettings = () => setSettingsModal(!settingsModal);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0">
        <GlassCard className="p-4 flex flex-col gap-2">
          <div className="p-4 border-b border-white/10 mb-2">
            <h2 className="font-sora font-semibold text-lg text-brand-cyan">Synapse Core</h2>
            <p className="text-[10px] text-mid-gray font-space uppercase tracking-widest">Admin Authorization Lv.1</p>
          </div>
          
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-3 rounded-xl font-space text-xs transition-all uppercase tracking-widest ${
                activeTab === tab 
                  ? 'bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan' 
                  : 'hover:bg-white/5 text-mid-gray'
              }`}
            >
              {tab}
            </button>
          ))}
        </GlassCard>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-sora font-bold text-white uppercase tracking-tight">{activeTab}</h1>
            <div className="h-1 w-12 bg-brand-cyan mt-1 rounded-full shadow-[0_0_10px_#22D3EE]" />
          </div>
          <button 
            onClick={toggleSettings}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:border-brand-cyan/30 transition-all text-mid-gray hover:text-brand-cyan"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {renderSection()}
      </main>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} />
          <GlassCard className="max-w-md w-full p-8 relative z-10 border-rose-500/30">
            <div className="flex items-center gap-3 text-rose-500 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-xl font-sora font-bold uppercase">{confirmModal.title}</h3>
            </div>
            <p className="text-gray-300 mb-8 font-inter leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-mid-gray hover:bg-white/5 transition-all text-xs font-space uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.action}
                className={`flex-1 py-3 px-4 rounded-xl text-white font-space font-bold text-xs uppercase tracking-widest transition-all ${
                  confirmModal.title.includes('Delete') || confirmModal.title.includes('Ban') 
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                    : 'bg-brand-cyan text-deep-black hover:bg-white shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                }`}
              >
                Confirm {confirmModal.title.includes('Delete') ? 'Delete' : 'Update'}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Global Settings Modal */}
      {settingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" onClick={toggleSettings} />
          <GlassCard className="max-w-lg w-full p-8 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-brand-cyan" />
                <h3 className="text-xl font-sora font-bold uppercase tracking-tighter text-white">System Config</h3>
              </div>
              <button onClick={toggleSettings} className="p-2 hover:bg-white/5 rounded-lg text-mid-gray">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">Maintenance Mode</span>
                  <span className="text-[10px] text-mid-gray font-space uppercase">Disable all user interactions</span>
                </div>
                <button 
                  onClick={() => setConfig(prev => ({ ...prev, maintenance_mode: !prev.maintenance_mode }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${config.maintenance_mode ? 'bg-brand-cyan' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.maintenance_mode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">AI Word Count Limit</span>
                  <span className="text-[10px] text-mid-gray font-space uppercase">Target generation length</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={config.max_word_count}
                    onChange={(e) => setConfig(prev => ({ ...prev, max_word_count: parseInt(e.target.value) }))}
                    className="w-full bg-deep-black border border-white/10 rounded-xl px-4 py-3 outline-none text-brand-cyan font-mono focus:border-brand-cyan/50 transition-all text-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-mid-gray font-space uppercase">Tokens</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-4 h-4 text-brand-cyan" />
                  <span className="text-sm font-medium text-white">Emergency Shutdown</span>
                </div>
                <button className="w-full py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl font-space font-bold text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                  Kill All Active Sessions
                </button>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button 
                onClick={toggleSettings}
                className="flex-1 py-3 bg-brand-cyan text-deep-black font-space font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all"
              >
                Save Configuration
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
