'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('synapse-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('synapse-cookie-consent', accepted ? 'accepted' : 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-8 right-8 md:left-auto md:w-[450px] z-[200] animate-slide-up">
      <GlassCard className="p-6 border-brand-cyan/20 bg-deep-black/90 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-brand-cyan" />
          </div>
          <div className="flex-1">
            <h4 className="font-sora font-bold text-white mb-2">Neural Cookie Calibration</h4>
            <p className="text-xs text-mid-gray leading-relaxed mb-6">
              We use neuro-cookies to optimize your learning synapse and provide a persistent session experience. Proceeding implies consent to our digital monitoring framework.
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleConsent(true)}
                className="flex-1 py-2.5 bg-brand-cyan text-deep-black rounded-xl font-sora font-bold text-xs hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Accept Protocol
              </button>
              <button 
                onClick={() => handleConsent(false)}
                className="px-4 py-2.5 bg-white/5 text-mid-gray rounded-xl font-sora font-semibold text-xs hover:bg-white/10 transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
