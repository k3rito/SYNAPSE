'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { Terminal } from 'lucide-react';

interface Props {
  content: any;
  isRtl?: boolean;
}

const ImageBlock = ({ src, alt }: { src: string; alt?: string }) => (
  <div className="my-8 rounded-2xl overflow-hidden border border-brand-cyan/20 shadow-2xl group">
    <img 
      src={src} 
      alt={alt || 'Lesson visual'} 
      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 shadow-inner"
    />
  </div>
);

const DynamicContentEngine = ({ content, isRtl }: Props) => {
  let safeContent = '';
  
  if (typeof content === 'string') {
    safeContent = content;
  } else if (Array.isArray(content)) {
    safeContent = content.map(c => typeof c === 'string' ? c : JSON.stringify(c)).join('\n\n');
  } else if (typeof content === 'object' && content !== null) {
    safeContent = content.content || JSON.stringify(content, null, 2);
  }

  return (
    <div className={`space-y-6 text-light-gray leading-relaxed ${isRtl ? 'font-inter rtl text-right' : 'font-inter'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-sora font-bold text-white mb-6 border-b border-brand-cyan/20 pb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-sora font-semibold text-brand-cyan mt-12 mb-4">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-sora font-medium text-white/90 mt-8 mb-3">{children}</h3>,
          p: ({ children }) => <p className="mb-6 opacity-90 leading-loose">{children}</p>,
          ul: ({ children }) => <ul className="list-none space-y-3 mb-8 pl-4">{children}</ul>,
          li: ({ children }) => (
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0 glow-accent" />
              <span>{children}</span>
            </li>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-brand-cyan/10 text-brand-cyan border-b border-brand-cyan/20">{children}</thead>,
          th: ({ children }) => <th className="px-6 py-4 text-left font-space tracking-wider uppercase text-xs">{children}</th>,
          td: ({ children }) => <td className="px-6 py-4 border-b border-white/5 opacity-80">{children}</td>,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative my-8 rounded-xl overflow-hidden border border-white/10 group">
                <div className="flex items-center justify-between px-4 py-2 bg-deep-black/80 border-b border-white/5">
                  <div className="flex items-center gap-2 text-[10px] text-mid-gray font-space uppercase tracking-widest">
                    <Terminal className="w-3 h-3 text-brand-cyan" /> {match[1]}
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                  </div>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 !bg-deep-black/60"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand-cyan bg-brand-cyan/5 px-8 py-6 my-8 rounded-r-2xl italic opacity-90">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => <ImageBlock src={src || ''} alt={alt} />
        }}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
};

export default memo(DynamicContentEngine);
