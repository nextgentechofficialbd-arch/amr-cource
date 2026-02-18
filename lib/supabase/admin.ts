import { createClient } from '@supabase/supabase-js';

// DANGER: Only use in server-side API routes. 
// This client bypasses Row Level Security (RLS) using the service_role key.
// Never expose this key or this client to the browser.
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
