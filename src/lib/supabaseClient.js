import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks to prevent undefined errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if URL and key are available
let supabase = null;
let adminSupabase = null;

// Check if we have the required values before creating clients
if (supabaseUrl && supabaseAnonKey) {
  // Regular client with anonymous key for public operations
  supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Admin client is only created on the server side
  if (typeof window === 'undefined' && process.env.SUPABASE_SERVICE_KEY) {
    adminSupabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY, {
      auth: {
        persistSession: false
      }
    });
  }
}

export { supabase, adminSupabase };
export default supabase;