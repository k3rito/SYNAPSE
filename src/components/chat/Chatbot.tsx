'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Terminal } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ChatbotOrb } from '@/components/ui/ChatbotOrb';
import { GlassCard } from '@/components/ui/GlassCard';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';

export const Chatbot = () => {
  const t = useTranslations('Chatbot');
  const { isChatbotOpen, toggleChatbot, chatHistory, addChatMessage, currentLesson } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatbotOpen]);

  useEffect(() => {
    if (containerRef.current) {
      if (isChatbotOpen) {
        gsap.fromTo(containerRef.current, 
          { y: 50, opacity: 0, scale: 0.95 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
        );
      }
    }
  }, [isChatbotOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    addChatMessage({ role: 'user', content: input });
    const userMessage = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: userMessage,
          lessonContext: currentLesson
        })
      });

      const data = await response.json();
      
      if (data.reply) {
        addChatMessage({ role: 'assistant', content: data.reply });
      } else {
        addChatMessage({ role: 'system', content: t('connectionFailed') });
      }
    } catch (error) {
      console.error(error);
      addChatMessage({ role: 'system', content: t('networkFailure') });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Fixed Orb at bottom right */}
      <div 
        className="fixed bottom-6 right-6 z-40 w-[50px] h-[50px] flex items-center justify-center"
        onClick={toggleChatbot}
      >
        <ChatbotOrb />
      </div>

      {/* Chat Window */}
      {isChatbotOpen && (
        <div ref={containerRef} className="fixed bottom-24 right-6 w-80 sm:w-96 z-50">
          <GlassCard className="flex flex-col h-[500px] max-h-[calc(100vh-120px)] overflow-hidden border-brand-cyan/20 bg-deep-black/90">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2 text-brand-cyan">
                <Terminal className="w-5 h-5" />
                <span className="font-sora font-semibold">{t('title')}</span>
              </div>
              <button 
                onClick={toggleChatbot}
                className="text-mid-gray hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-inter text-sm">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user' 
                        ? 'bg-brand-cyan/20 border border-brand-cyan/30 text-white rounded-br-sm' 
                        : msg.role === 'system'
                        ? 'bg-white/5 border border-white/10 text-mid-gray text-center italic w-full rounded-2xl'
                        : 'bg-dark-gray/80 border border-white/10 text-light-gray rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-dark-gray/80 border border-white/10 text-light-gray rounded-bl-sm rounded-2xl px-4 py-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] text-mid-gray ml-2">{t('typing')}</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-dark-gray/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('placeholder')}
                  className="flex-1 bg-deep-black border border-white/10 focus:border-brand-cyan/50 rounded-full px-4 py-2 text-sm text-white placeholder-mid-gray outline-none transition-all focus:glow-accent"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-brand-cyan text-deep-black rounded-full hover:bg-white hover:glow-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </>
  );
};
