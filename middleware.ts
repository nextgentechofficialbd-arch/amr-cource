import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Simple in-memory rate limiting for login
// Note: This resets on server restart/deployment, suitable for basic protection
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Middleware handles:
 * 1. Supabase Session refreshing
 * 2. Admin route protection (/admin/*)
 * 3. Student dashboard protection (/dashboard, /course/*)
 * 4. IP logging for security audit
 * 5. Login rate limiting
 */
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // 1. Skip checks for strictly public static routes or public admin login
  if (url.pathname === '/admin/login') {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Initialize Supabase Client for Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Get current session
  const { data: { session } } = await supabase.auth.getSession();

  // 3. ADMIN PROTECTION
  if (url.pathname.startsWith('/admin')) {
    if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // 4. STUDENT PROTECTION & IP LOGGING
  const isDashboard = url.pathname === '/dashboard';
  const isCourse = url.pathname.startsWith('/course/');
  const isLoginSubmit = url.pathname === '/login' && request.method === 'POST';

  if (isDashboard || isCourse) {
    if (!session) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Log the access to ip_logs
    try {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.ip ?? '127.0.0.1';
      const userAgent = request.headers.get('user-agent') ?? '';
      const action = isCourse ? 'video_access' : 'dashboard_access';

      // Using the service role via standard fetch/supabase approach is best in a real lib/supabase/admin.ts
      // But middleware must be self-contained. We use the service_role key to bypass RLS for logging.
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/ip_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        body: JSON.stringify({
          student_id: session.user.id,
          ip_address: ip,
          action: action,
          user_agent: userAgent
        })
      });
    } catch (e) {
      console.error("IP Logging Error:", e);
    }
  }

  // 5. LOGIN RATE LIMITING (Basic)
  if (isLoginSubmit) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.ip ?? '127.0.0.1';
    const now = Date.now();
    const attempt = loginAttempts.get(ip);

    if (attempt) {
      if (now < attempt.resetAt) {
        if (attempt.count >= 5) {
          return NextResponse.json(
            { error: "খুব বেশি চেষ্টার কারণে আপনার এক্সেস সাময়িকভাবে বন্ধ। ১ মিনিট পর চেষ্টা করুন।" },
            { status: 429 }
          );
        }
        attempt.count += 1;
      } else {
        loginAttempts.set(ip, { count: 1, resetAt: now + 60000 });
      }
    } else {
      loginAttempts.set(ip, { count: 1, resetAt: now + 60000 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/admin',
    '/admin/(.*)',
    '/dashboard',
    '/course/(.*)',
    '/login',
    '/set-password',
  ],
};