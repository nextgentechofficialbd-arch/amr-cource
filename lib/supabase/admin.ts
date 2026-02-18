import { createClient } from '@supabase/supabase-js'

/**
 * DANGER: Service role client bypasses RLS.
 * Use exclusively in server-side contexts like API routes or background jobs.
 */
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)