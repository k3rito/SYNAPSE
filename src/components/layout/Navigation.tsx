'use client';

import React, { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Network, Search, Menu, X, Terminal, Languages } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/utils/supabase/client';
import { SearchModal } from '../ui/SearchModal';
import { ProfileDropdown } from '../profile/ProfileDropdown';
import { useGamificationStore } from '@/store/useGamificationStore';

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const toggleChatbot = useAppStore((state) => state.toggleChatbot);
  const supabase = createClient();

  const { level, progressPercentage, fetchUserData, rank } = useGamificationStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const initAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      
      if (authUser) {
        await fetchUserData();
        
        if (authUser.user_metadata?.role === 'admin') {
          setIsAdmin(true);
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authUser.id)
            .single();
          if (profile?.role === 'admin') {
            setIsAdmin(true);
          }
        }
      }
    };
    
    initAuth();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [supabase, fetchUserData]);

  const navLinks = [
    { name: t('dashboard'), href: '/dashboard' },
    { name: t('startLearning'), href: '/curriculum' },
  ];

  if (isAdmin) {
    navLinks.push({ name: t('admin'), href: '/admin' });
  }

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center justify-between ${
      scrolled 
        ? 'bg-deep-black/60 backdrop-blur-md border-b border-white/10 px-6 py-3' 
        : 'glass-card mx-4 mt-4 px-6 py-4'
    }`}>
      {/* Logo & Progress Section */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Network className="w-6 h-6 text-white group-hover:text-brand-cyan transition-colors" />
            <div className="absolute inset-0 bg-brand-cyan/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-sora font-semibold tracking-wider text-xl uppercase hidden sm:inline-block">Synapse</span>
        </Link>

        {user && (
          <div className="hidden lg:flex items-center gap-4 pl-8 border-l border-white/10 group">
            <div className="text-right">
              <p className="text-[10px] font-space text-mid-gray uppercase tracking-widest group-hover:text-brand-cyan transition-colors">Lv. {level} {rank}</p>
              <div className="w-32 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden border border-white/5 p-[1px]">
                <div 
                  className="h-full bg-gradient-to-r from-brand-cyan to-blue-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href}
            className={`font-space text-xs uppercase tracking-[0.15em] transition-all hover:text-brand-cyan hover:glow-accent px-3 py-1 rounded-full ${
              pathname.includes(link.href) ? 'text-brand-cyan bg-white/5' : 'text-mid-gray'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="hidden md:flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 hover:border-brand-cyan/50 hover:bg-white/5 transition-all text-[10px] font-space tracking-widest uppercase text-mid-gray hover:text-white"
        >
          <Languages className="w-3 h-3" />
          <span>{locale === 'en' ? 'العربية' : 'English'}</span>
        </button>
        
        {user ? (
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-mid-gray hover:text-white transition-colors mr-2"
            >
              <Search className="w-5 h-5" />
            </button>
            <ProfileDropdown user={user} />
          </div>
        ) : (
          <Link href="/login" className="px-6 py-2 bg-brand-cyan text-deep-black rounded-full text-[10px] font-space font-bold uppercase tracking-widest hover:bg-white transition-all">
            Authorize Node
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden p-2 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </button>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 glass-card md:hidden flex flex-col gap-4 mx-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-white/5 rounded-lg font-space text-sm uppercase tracking-wider"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-1 font-space uppercase" />
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 text-mid-gray hover:text-white font-space text-sm uppercase tracking-wider"
          >
            <Languages className="w-4 h-4" />
            <span>{locale === 'en' ? 'العربية' : 'English'}</span>
          </button>
          <button 
            onClick={() => {
              toggleChatbot();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-brand-cyan hover:bg-brand-cyan/10 rounded-lg font-space text-sm uppercase tracking-wider"
          >
            <Terminal className="w-4 h-4" />
            <span>{t('askAi')}</span>
          </button>
          
          {!user && (
            <Link 
              href="/login" 
              className="mt-2 w-full py-4 bg-brand-cyan text-deep-black text-center rounded-xl font-sora font-bold text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Authorize Node
            </Link>
          )}
        </div>
      )}

      {/* Search Overlay */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};
