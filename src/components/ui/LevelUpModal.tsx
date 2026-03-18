'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, ArrowRight, BrainCircuit } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  rank: string;
  onClose: () => void;
}

export function LevelUpModal({ isOpen, level, rank, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-deep-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-brand-cyan/20 blur-[100px] animate-pulse" />
            
            <GlassCard className="p-8 text-center border-t-4 border-t-brand-cyan relative overflow-hidden group">
              {/* Bursts */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-24 -left-24 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  className="w-20 h-20 bg-brand-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-cyan/30 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                >
                  <Trophy className="w-10 h-10 text-brand-cyan" />
                </motion.div>

                <h2 className="text-4xl font-sora font-black text-white mb-2 tracking-tighter uppercase italic">Neural Ascension</h2>
                <p className="text-brand-cyan font-space tracking-[0.3em] uppercase text-xs mb-8">Pathway Verified • Node Connected</p>

                <div className="flex items-center justify-center gap-6 mb-10">
                  <div className="text-left">
                    <p className="text-[10px] font-space text-mid-gray uppercase tracking-widest">New Priority</p>
                    <p className="text-3xl font-sora font-bold text-white">Level {level}</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-left">
                    <p className="text-[10px] font-space text-mid-gray uppercase tracking-widest">Rank Protocol</p>
                    <p className="text-3xl font-sora font-bold text-brand-cyan">{rank}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 text-left">
                    <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
                    <p className="text-sm text-mid-gray font-inter leading-relaxed">Identity strengthened. Your neural capacity has expanded to Tier {level} security protocols.</p>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-5 mt-10 bg-brand-cyan text-deep-black font-sora font-black text-sm rounded-xl hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.4)] group/btn uppercase tracking-widest"
                >
                  Synchronize State
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
