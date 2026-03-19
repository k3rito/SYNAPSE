import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export const maxDuration = 60;

// Initialize OpenRouter as an OpenAI-compatible provider
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Define the strict Zod schema for Synapse Lessons
const lessonSchema = z.object({
  title: z.string().describe('The title of the lesson'),
  content: z.string().describe('The full markdown content of the lesson'),
  topic: z.string().optional().describe('The main topic'),
  quiz: z.array(z.object({
    question: z.string().describe('The diagnostic question'),
    options: z.array(z.string()).describe('Four possible answers'),
    correct_answer: z.string().describe('The matching correct option'),
    explanation: z.string().optional().describe('Brief technical explanation')
  })).describe('A set of 4-5 diagnostic questions')
});

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, context, locale = 'en' } = await req.json();

    const systemPrompt = `You are a senior academic instructor for Synapse AI.
Generate a comprehensive technical lesson in ${locale === 'ar' ? 'Arabic' : 'English'}.
Focus on technical depth and defensive engineering mindsets.
Language: ${locale === 'ar' ? 'ARABIC (Saudi/Neutral)' : 'ENGLISH (Global/Technical)'}.`;

    const { object: lessonData } = await generateObject({
      model: openrouter('google/gemini-2.0-flash-001'),
      schema: lessonSchema,
      prompt: `Generate a detailed lesson about: ${topic}. \nContext: ${context || 'General technical education'}.`,
      system: systemPrompt,
    });

    // Save to Database with 100% user-isolation
    const { data: lessonRecord, error: dbError } = await supabase
      .from('generated_lessons')
      .insert({
        user_id: user.id,
        topic: topic || 'Untitled Lesson',
        content: lessonData, // Now guaranteed structured JSON
        language: locale
      })
      .select('id')
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      lessonId: lessonRecord.id,
      ...lessonData
    });

  } catch (error: any) {
    console.error('SYNAPSE VERCEL AI SDK ERROR:', error);
    return NextResponse.json(
      { error: 'Infrastructure failure during generation', details: error.message },
      { status: 500 }
    );
  }
}
