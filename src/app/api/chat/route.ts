import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Ignored in Route Handlers since middleware handles the refresh
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error("CHAT ERROR: No user session found", authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message, lessonContext, locale = 'en' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = `You are SYNAPSE AI, a senior technical instructor in {${locale}} mode.
Format: technical, concise, defensive mindset.`;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context: ${JSON.stringify(lessonContext)}\nQuestion: ${message}` }
        ]
      }),
    });

    if (!openRouterResponse.ok) throw new Error("AI API Error");

    const data = await openRouterResponse.json();
    const output = data.choices[0]?.message?.content || 'Error processing request.';

    // Save to History
    if (lessonContext?.id) {
      await supabase.from('chat_history').insert({
        user_id: user.id,
        lesson_id: lessonContext.id,
        role: 'assistant',
        content: output
      });
    }

    return NextResponse.json({ reply: output });

  } catch (error) {
    console.error('CHAT API ERROR:', error);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 500 }
    );
  }
}
