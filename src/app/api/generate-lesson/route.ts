import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

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
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Ignored in Route Handlers since proxy.ts handles the refresh
          }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error("GENERATE LESSON ERROR: No user session found", authError);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, context, locale = 'en' } = await req.json();

    const systemPrompt = `You are a senior academic instructor for Synapse AI. Your sole purpose is to generate detailed technical lessons strictly following the requested JSON schema.
### CRITICAL INSTRUCTION:
- Generate content in ${locale === 'ar' ? 'Arabic' : 'English'}.
- JSON structure ({ title, content, quiz }) MUST be closed correctly.
- Keep content concise to avoid token limits.`;

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
          { role: 'user', content: `Generate a lesson about: ${topic}. Context: ${context}` }
        ],
        temperature: 0.2,
        max_tokens: 4500,
        response_format: { type: 'json_object' }
      })
    });

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const aiData = await openRouterResponse.json();
    const output = aiData.choices[0]?.message?.content || '{}';
    
    // Simple JSON repair
    let cleanOutput = output.trim();
    if (!cleanOutput.endsWith('}')) cleanOutput += '}';

    const parsedData = JSON.parse(cleanOutput);

    // Save to Database
    const { data: lessonRecord, error: dbError } = await supabase
      .from('generated_lessons')
      .insert({
        user_id: user.id,
        topic: topic || 'Untitled Lesson',
        content: parsedData,
        language: locale
      })
      .select('id')
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      lessonId: lessonRecord.id,
      ...parsedData
    });

  } catch (error) {
    console.error('Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}
