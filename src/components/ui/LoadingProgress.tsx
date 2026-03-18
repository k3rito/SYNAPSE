'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { NeuralLoader } from '@/components/NeuralLoader';

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (val: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isChatbotOpen } = useAppStore();

  // Reset loading state when route changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Fail-safe: Auto-close loader if it hangs for more than 5 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Global Click Interceptor for Instant Loading
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
        anchor && 
        anchor.href && 
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target &&
        !e.ctrlKey &&
        !e.metaKey &&
        anchor.getAttribute('download') === null
      ) {
        // Internal link clicked
        const currentUrl = window.location.href;
        const targetUrl = anchor.href;

        // Only show loader if it's a different page and NOT chatting
        if (currentUrl !== targetUrl && !isChatbotOpen) {
          setIsLoading(true);
        }
      }
    };

    const handleFormSubmit = () => {
      if (!isChatbotOpen) setIsLoading(true);
    };

    document.addEventListener('click', handleAnchorClick);
    document.addEventListener('submit', handleFormSubmit);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, [isChatbotOpen]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      <div 
        className={`fixed inset-0 z-[99999] bg-deep-black/20 backdrop-blur-sm grid place-items-center transition-all duration-500 ${
          isLoading && !isChatbotOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.15)] scale-90 animate-in fade-in zoom-in duration-300">
          <NeuralLoader />
          <div className="absolute inset-x-0 -bottom-10 text-center">
            <p className="font-space text-[10px] uppercase tracking-[0.5em] text-brand-cyan animate-pulse">
              Neural Handshake...
            </p>
          </div>
        </div>
      </div>
    </LoadingContext.Provider>
  );
}
