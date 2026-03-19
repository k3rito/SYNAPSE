'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Terminal } from 'lucide-react';

// Register essential languages for performance
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import py from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', py);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);

import { useLocale } from 'next-intl';

interface DynamicContentEngineProps {
  content: string;
}

// Memoized CodeBlock for performance and memory safety
const CodeBlock = memo(({ language, value }: { language: string; value: string }) => {
  const isRtl = useLocale() === 'ar';
  return (
    <div className={`my-8 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] group/code relative shadow-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Neural Terminal: Minimalist UI */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Terminal className="w-3.5 h-3.5 text-brand-cyan/70" />
            <span className="text-[9px] font-space text-mid-gray uppercase tracking-[0.2em]">
              {language || 'code'} // Neural Terminal
            </span>
          </div>
        </div>
      </div>
      
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          background: 'transparent',
          fontSize: '0.85rem',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
        useInlineStyles={true}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

  const safeContent = typeof content === 'string' 
    ? content 
    : typeof content === 'object' && content !== null
      ? JSON.stringify(content)
      : String(content || '');

  return (
    <div className={`space-y-8 animate-fade-in ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Header 2 - Major Sections
          h2: ({ node, ...props }) => (
            <h2 
              className="text-2xl md:text-3xl font-sora font-bold text-white border-b border-brand-cyan/30 pb-3 mt-12 mb-6 scroll-mt-24"
              {...props} 
            />
          ),
          
          // Header 3 - Subsections
          h3: ({ node, ...props }) => (
            <h3 
              className="text-xl font-sora font-semibold text-brand-cyan mt-8 mb-4 hover:glow-text transition-all duration-300"
              {...props} 
            />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p 
              className="text-lg text-gray-300 leading-relaxed mb-6 font-inter"
              {...props} 
            />
          ),

          // Bold Text
          strong: ({ node, ...props }) => (
            <strong className="text-white font-semibold glow-text-sm" {...props} />
          ),

          // Inline & Block Code
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');
            
            if (!inline && match) {
              return <CodeBlock language={match[1]} value={value} />;
            }

            return (
              <code 
                className="bg-brand-cyan/15 text-brand-cyan px-1.5 py-0.5 rounded text-[0.9em] font-mono border border-brand-cyan/20 animate-pulse-slow mx-0.5"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Tables
          table: ({ node, ...props }) => (
            <div className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <table className="w-full text-left border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="bg-white/10 text-brand-cyan font-sora p-4 border-b border-white/10 uppercase tracking-tighter" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="p-4 border-b border-white/10 text-gray-300 font-inter text-sm" {...props} />
          ),

          // Images - Intercepting Keyword placeholder
          img: ({ node, alt, src, ...props }) => {
            const [error, setError] = React.useState(false);
            const keyword = encodeURIComponent(String(src || 'tech-innovation'));
            const imageUrl = `https://loremflickr.com/1200/675/${keyword}`;
            
            return (
              <div className="w-full my-12 group">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.15)] group-hover:shadow-[0_0_50px_rgba(34,211,238,0.3)] transition-all duration-700 animate-float">
                  {!error ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={alt || 'Technical Visual'}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        onError={() => setError(true)}
                        {...props}
                      />
                      {/* SYNAPSE Cyan Tint Overlay */}
                      <div className="absolute inset-0 bg-brand-cyan/10 mix-blend-overlay pointer-events-none" />
                    </>
                  ) : (
                    /* Fallback SYNAPSE Placeholder */
                    <div className="w-full h-full bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
                      <div className="w-20 h-20 rounded-2xl border border-brand-cyan/30 bg-brand-cyan/10 flex items-center justify-center animate-pulse">
                        <Terminal className="w-10 h-10 text-brand-cyan" />
                      </div>
                      <span className="text-xs font-space text-brand-cyan/50 uppercase tracking-[0.3em]">
                        Synapse Visual Error: {alt}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_100px_#22D3EE]" />
                    <p className="text-[10px] font-space tracking-[0.2em] uppercase text-white/70">
                      Symmetrization Active: {alt}
                    </p>
                  </div>
                </div>
              </div>
            );
          },

          // Lists
          ul: ({ node, ...props }) => <ul className="list-none space-y-4 my-6 pl-4" {...props} />,
          li: ({ node, children, ...props }: any) => (
            <li className="flex gap-3 text-gray-300 font-inter" {...props}>
              <span className="text-brand-cyan mt-1.5 shrink-0">●</span>
              <span>{children}</span>
            </li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
