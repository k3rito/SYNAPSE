'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, ArrowRight, Loader2, BookOpen, Layers, Terminal } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useRouter } from '@/navigation';

interface SearchResult {
  type: 'track' | 'topic' | 'lesson';
  title: string;
  id: string;
  href: string;
  category: string;
  status?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-deep-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl">
        <GlassCard className="p-0 overflow-hidden border-white/20 shadow-[0_32px_128px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-white/10 gap-4">
            <Search className="w-5 h-5 text-brand-cyan" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tracks, topics, or lessons..."
              className="flex-1 bg-transparent border-none outline-none text-white font-inter text-lg placeholder-white/30"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
              }}
            />
            <div className="flex items-center gap-2 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-mid-gray font-space uppercase">
              <Command className="w-3 h-3" /> Esc
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-mid-gray" />
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
                <span className="text-mid-gray font-space text-sm tracking-widest uppercase">Scanning curriculum...</span>
              </div>
            ) : query.length < 2 ? (
              <div className="py-12 text-center">
                <p className="text-mid-gray mb-2">Initialize search vector</p>
                <p className="text-[10px] text-brand-cyan/50 font-space uppercase tracking-[0.2em]">Enter 2 or more characters</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-mid-gray">
                No matching cognitive nodes found.
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => {
                      router.push(result.href);
                      onClose();
                    }}
                    className="w-full text-left p-4 rounded-xl border border-white/5 hover:border-brand-cyan/30 hover:bg-white/5 transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-deep-black border border-white/10 flex items-center justify-center text-brand-cyan group-hover:border-brand-cyan transition-colors">
                        {result.type === 'track' && <Layers className="w-5 h-5" />}
                        {result.type === 'topic' && <BookOpen className="w-5 h-5" />}
                        {result.type === 'lesson' && <Terminal className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-space text-brand-cyan uppercase tracking-widest">{result.category}</span>
                          {result.status === 'completed' && <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded uppercase font-bold">Cleared</span>}
                        </div>
                        <h4 className="text-white font-sora font-medium leading-none group-hover:text-brand-cyan transition-colors">{result.title}</h4>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-mid-gray group-hover:text-brand-cyan group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
