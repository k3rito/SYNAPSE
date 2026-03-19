import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Initialize OpenRouter as an OpenAI-compatible provider
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
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
    const { message, lessonContext, locale = 'en' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `You are SYNAPSE AI, a senior technical instructor.
Format: technical, concise, defensive mindset.
Language: ${locale === 'ar' ? 'Arabic' : 'English'}.`;

    const { text } = await generateText({
      model: openrouter('google/gemini-2.0-flash-001'),
      system: systemPrompt,
      prompt: `Context: ${JSON.stringify(lessonContext || {})}\nQuestion: ${message}`,
    });

    // Save to History with user-isolation
    if (lessonContext?.id) {
      await supabase.from('chat_history').insert({
        user_id: user.id,
        lesson_id: lessonContext.id,
        role: 'assistant',
        content: text
      });
    }

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error('SYNAPSE CHAT VERCEL SDK ERROR:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable', details: error.message },
      { status: 500 }
    );
  }
}
