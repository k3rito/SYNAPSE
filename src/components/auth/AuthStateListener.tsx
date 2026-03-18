'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export function AuthStateListener() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Only redirect if on an auth route (login/signup)
        if (pathname.includes('/login') || pathname.includes('/signup')) {
          const locale = pathname.split('/')[1] || 'ar';
          router.push(`/${locale}/dashboard`);
          router.refresh();
        }
      } else if (event === 'SIGNED_OUT') {
        const locale = pathname.split('/')[1] || 'ar';
        router.push(`/${locale}/login`);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname, supabase]);

  return null;
}
