
import { createServerClient, type CookieOptions } from '@supabase/ssr'

/**
 * Browser-safe cookie helper for Vite/SPA environment.
 */
const getBrowserCookies = () => {
  return {
    getAll() {
      return document.cookie.split('; ').map((row) => {
        const [name, value] = row.split('=');
        return { name, value };
      });
    },
    setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
      cookiesToSet.forEach(({ name, value, options }) => {
        let cookieString = `${name}=${value}`;
        if (options?.path) cookieString += `; path=${options.path}`;
        if (options?.maxAge) cookieString += `; max-age=${options.maxAge}`;
        document.cookie = cookieString;
      });
    },
  };
};

/**
 * Creates a Supabase client that works in the browser but maintains 
 * the 'server-client' structure for code compatibility.
 */
export async function createClient() {
  const cookieHelper = getBrowserCookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieHelper
    }
  )
}
