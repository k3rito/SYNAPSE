'use client';

import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/navigation';
import { createClient } from '@/utils/supabase/client';
import { getURL } from '@/utils/url';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLoading } from '@/components/ui/LoadingProgress';
import { 
  ArrowRight, Loader2, Sparkles, User, Mail, 
  Lock, CheckCircle2, AlertCircle, Eye, EyeOff 
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const { setIsLoading } = useLoading();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password Logic
  const [strength, setStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    // Check strength: Length + Letters + Numbers
    let score = 0;
    if (password.length > 0) score += 20;
    if (password.length >= 8) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 20;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    setStrength(score);

    // Check match
    setPasswordsMatch(password !== '' && password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError("Encryption keys do not match synchronization.");
      return;
    }
    
    setLoading(true);
    setIsLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user', // Default role
        },
        emailRedirectTo: `${getURL()}api/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setIsLoading(false);
    }
  };

  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (success && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [success, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    const { error: resendError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${getURL()}api/auth/callback`,
      },
    });
    
    setIsLoading(false);
    if (!resendError) {
      setTimer(300);
      setCanResend(false);
    } else {
      setError(resendError.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute inset-0 css-grid-bg opacity-30 pointer-events-none" />
        <GlassCard className="w-full max-w-md p-10 text-center relative z-10 border-brand-cyan/30">
          <div className="w-20 h-20 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-brand-cyan animate-pulse" />
          </div>
          <h2 className="text-2xl font-sora font-bold text-white mb-4">انتظار تفعيل المسار</h2>
          <p className="text-mid-gray font-inter leading-relaxed mb-8">
            أرسلنا مفتاح تفعيل المختبر إلى <span className="text-white font-mono">{email}</span>. 
            يرجى تأكيد هويتك لفتح مسار التعلم الخاص بك.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-space uppercase tracking-widest text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {canResend ? 'إعادة إرسال المفتاح' : `يمكنك إعادة الإرسال بعد ${formatTime(timer)}`}
            </button>

            <Link href="/login" className="block text-brand-cyan font-space text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors">
              العودة إلى بوابة الدخول
            </Link>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center relative overflow-hidden px-4 py-20">
      <div className="absolute inset-0 css-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-brand-cyan/5 to-transparent pointer-events-none" />
      
      <GlassCard className="w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-4 text-brand-cyan shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-sora font-bold text-white mb-2 tracking-tight uppercase">تجهيز المختبر</h1>
          <p className="text-mid-gray font-inter text-sm">أنشئ هويتك الجديدة للانضمام إلى شبكة سينابس.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-space flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-space text-mid-gray tracking-[0.2em] mb-2 uppercase group-focus-within:text-brand-cyan transition-colors">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-cyan transition-colors" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all font-inter"
                placeholder="اسمك كمهندس"
                required
              />
            </div>
          </div>

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
            <label className="block text-[10px] font-space text-mid-gray tracking-[0.2em] mb-2 uppercase group-focus-within:text-brand-cyan transition-colors">مفتاح الأمان الخاص بك</label>
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
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength Bar */}
            <div className="mt-3 flex gap-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${
                  strength < 40 ? 'bg-rose-500' : strength < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-space text-mid-gray tracking-[0.2em] mb-2 uppercase group-focus-within:text-brand-cyan transition-colors">تأكيد المفتاح</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-cyan transition-colors" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all font-inter"
                placeholder="••••••••"
                required
              />
              {/* Match Indicator */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  passwordsMatch ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : (confirmPassword ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-white/10')
                }`} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !passwordsMatch || strength < 60}
            className="w-full py-4 mt-4 bg-brand-cyan text-deep-black font-sora font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>تفعيل المختبر</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-xs text-mid-gray font-space uppercase tracking-widest">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-brand-cyan hover:text-white transition-colors duration-300">
            دخول للمنصة
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
