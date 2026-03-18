'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  xp?: number;
  type: 'xp' | 'streak' | 'info';
}

export function NeuralToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // We'll expose this via window for quick access or use a small event emitter
  useEffect(() => {
    const handleAdd = (e: any) => {
      const newToast = { id: Math.random().toString(), ...e.detail };
      setToasts(prev => [...prev.slice(-2), newToast]); // Limit to 3 toasts
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('neural-toast', handleAdd);
    return () => window.removeEventListener('neural-toast', handleAdd);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[250] space-y-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0.8 }}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
              toast.type === 'xp' 
                ? 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan' 
                : toast.type === 'streak'
                  ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
                  : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              toast.type === 'xp' ? 'bg-brand-cyan/20' : 'bg-white/5'
            }`}>
              {toast.type === 'xp' ? <Zap className="w-5 h-5" /> : toast.type === 'streak' ? <Activity className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            
            <div>
              <p className="text-[10px] font-space uppercase tracking-widest opacity-60">System Notification</p>
              <p className="text-sm font-sora font-bold leading-tight">
                {toast.message} {toast.xp && <span className="ml-2 pr-1">+ {toast.xp} XP</span>}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export const showNeuralToast = (message: string, xp?: number, type: 'xp' | 'streak' | 'info' = 'xp') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('neural-toast', { detail: { message, xp, type } }));
  }
};
