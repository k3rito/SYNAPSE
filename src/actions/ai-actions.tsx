// @ts-expect-error - Vercel AI SDK RSC types resolution fallback
import { createAI, getMutableAIState, render } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { ReactNode } from 'react';

// Skill 3: Generative UI Component
const SynapseTerminal = ({ command, output }: { command: string, output: string }) => (
  <div className="bg-deep-black border border-brand-cyan/30 rounded-xl p-4 font-mono text-xs shadow-2xl animate-pulse-slow">
    <div className="flex items-center gap-2 mb-2 text-brand-cyan/50">
      <div className="w-2 h-2 rounded-full bg-brand-cyan" />
      <span>PROMPT_INJECTION_ACTIVE</span>
    </div>
    <div className="text-brand-cyan mb-1">&gt; {command}</div>
    <div className="text-white opacity-80">{output}</div>
  </div>
);

async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();

  aiState.update([
    ...aiState.get(),
    {
      role: 'user',
      content,
    },
  ]);

  const ui = await render({
    model: openai('gpt-4o'), // Or OpenRouter equivalent
    provider: openai,
    messages: [
      { role: 'system', content: 'You are Synapse AI. You can trigger terminal commands to help the user.' },
      ...aiState.get(),
    ],
    functions: {
      showTerminal: {
        description: 'Show a terminal output to the user.',
        parameters: z.object({
          command: z.string(),
          output: z.string(),
        }),
        render: async function* ({ command, output }: { command: string, output: string }) {
          yield <div className="animate-pulse text-brand-cyan">Accessing Synapse...</div>;
          return <SynapseTerminal command={command} output={output} />;
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define the initial AI and UI state
const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: ReactNode;
}[] = [];

// Export the AI provider
export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  initialUIState,
  initialAIState,
});
