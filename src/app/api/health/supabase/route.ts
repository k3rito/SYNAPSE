import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorizedCronRequest(request: NextRequest): boolean {
  // If CRON_SECRET is configured, only Vercel Cron (or trusted callers) can hit this endpoint.
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return true;
  }

  return request.headers.get('authorization') === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized cron request' },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const startedAt = Date.now();

  // Minimal read to keep the project active: single-row select from profiles.
  const { data, error } = await supabase.from('profiles').select('id').limit(1);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        table: 'profiles',
        error: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    table: 'profiles',
    rowTouched: data?.[0]?.id ?? null,
    durationMs: Date.now() - startedAt,
    at: new Date().toISOString(),
  });
}
