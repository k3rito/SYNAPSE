import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Initialize handle for i18n
  // Skip next-intl for API and Auth Callback routes to avoid locale redirection
  let response = (pathname.startsWith('/api') || pathname.startsWith('/auth/callback'))
    ? NextResponse.next({ request }) 
    : intlMiddleware(request);

  // Set initial CSP headers
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' *.supabase.co; frame-src 'self'; media-src 'self' data: blob:; object-src 'none';"
  );

  // 2. Setup Supabase Client with full cookie sync
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sync to Request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Sync to Response (Mandatory for Session Refresh)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. IMPORTANT: Refresh session if needed
  // This triggers setAll if the session is expired/refreshed, fixing the 401s
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Auth Redirection Logic (UI routes only)
  if (!pathname.startsWith('/api')) {
    const isAuthRoute = pathname.includes('/login') || pathname.includes('/signup');
    const isProtectedRoute = pathname.includes('/dashboard') || 
                             pathname.includes('/lesson') ||
                             pathname.includes('/admin');

    if (isAuthRoute && user) {
      const url = request.nextUrl.clone();
      const locale = pathname.split('/')[1] || 'ar';
      url.pathname = `/${locale}/dashboard`;
      const redirectResponse = NextResponse.redirect(url);
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }

    if (isProtectedRoute && !user) {
      const url = request.nextUrl.clone();
      const locale = pathname.split('/')[1] || 'ar';
      url.pathname = `/${locale}/login`;
      const redirectResponse = NextResponse.redirect(url);
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }

    // Role-based protection for admin
    if (pathname.includes('/admin') && user?.user_metadata?.role !== 'admin') {
      const url = request.nextUrl.clone();
      const locale = pathname.split('/')[1] || 'ar';
      url.pathname = `/${locale}/dashboard`;
      const redirectResponse = NextResponse.redirect(url);
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Intercept all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (Supabase PKCE flow)
     * - api routes
     * - assets folder (svg, png, etc)
     */
    '/((?!api|_next/static|_next/image|auth/callback|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
