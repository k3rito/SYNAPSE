'use client';

import { useState } from 'react';
import { Link, useRouter } from '@/navigation';
import { createClient } from '@/utils/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLoading } from '@/components/ui/LoadingProgress';
import { ArrowRight, Loader2, Sparkles, Terminal, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { setIsLoading } = useLoading();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Email not confirmed")) {
          setError("Uplink failed: Email identity not verified. Please check your transmission queue.");
        } else {
          setError("Authentication failure: Invalid credentials or internal frequency mismatch.");
        }
        setLoading(false);
        setIsLoading(false);
      } else {
        // Check role and redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err) {
      setError("Unexpected frequency disruption during authentication.");
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setIsLoading(true);
    try {
      const locale = window.location.pathname.split('/')[1] || 'ar';
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/${locale}/dashboard`,
        },
      });
      if (oauthError) {
        setError(`OAuth Linkage Failure: ${oauthError.message}`);
        setLoading(false);
        setIsLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center relative overflow-hidden px-4 py-20">
      <div className="absolute inset-0 css-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-brand-cyan/5 to-transparent pointer-events-none" />
      
      <GlassCard className="w-full max-w-md p-8 relative z-10 animate-fade-in group/card">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4 text-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover/card:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-500">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-sora font-bold text-white mb-2 tracking-tight uppercase">دخول للمنصة</h1>
          <p className="text-mid-gray font-inter text-sm">قم بتأكيد هويتك للوصول إلى مختبرات سينابس.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-space flex items-center gap-3 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => handleOAuthLogin('github')}
            className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-space uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <Sparkles className="w-4 h-4 text-brand-cyan group-hover:animate-pulse" />
            GitHub
          </button>
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-space uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <div className="w-4 h-4 rounded-full bg-brand-cyan/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-brand-cyan" />
            </div>
            Google
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-space tracking-widest">
            <span className="bg-[#0a0a0a] px-4 text-mid-gray">أو الدخول المباشر</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-space text-mid-gray tracking-[0.2em] mb-2 uppercase group-focus-within:text-brand-cyan transition-colors">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-cyan transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all font-inter"
                placeholder="operator@synapse.ai"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-space text-mid-gray tracking-[0.2em] mb-2 uppercase group-focus-within:text-brand-cyan transition-colors text-right">مفتاح الأمان الخاص بك</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-cyan transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all font-inter"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-brand-cyan transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 bg-brand-cyan text-deep-black font-sora font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>دخول للمنصة</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-xs text-mid-gray font-space uppercase tracking-widest">
          مسار غير مفعّل؟{' '}
          <Link href="/signup" className="text-brand-cyan hover:text-white transition-colors duration-300 font-bold">
            تجهيز المختبر
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
